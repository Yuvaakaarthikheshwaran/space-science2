/* ============================================================
   ORBITAL // MAIN APP CONTROLLER
   Slide manager, navigation, HUD, keyboard, autoplay,
   minimap, presenter notes, laser pointer, mission timer.
   ============================================================ */
(function(){
  const config = SLIDES_CONFIG;
  const builders = [
    SlidesPart1.cinematic, SlidesPart1.team, SlidesPart1.intro,
    SlidesPart1.satellite, SlidesPart1.agriculture, SlidesPart1.disaster,
    SlidesPart1.earthquake, SlidesPart2.weather, SlidesPart2.timedilation,
    SlidesPart2.future, SlidesPart2.facts, SlidesPart2.summary, SlidesPart2.thanks
  ];

  const root = document.getElementById('slides-root');
  const navList = document.getElementById('nav-list');
  const progressMap = document.getElementById('progress-map');
  const counter = document.getElementById('slide-counter');
  const progressFill = document.getElementById('progress-fill');
  const notesBody = document.getElementById('notes-body');
  const timerEl = document.getElementById('mission-timer');

  let current = -1;
  let slideEls = [];
  let visited = new Set();
  let autoplay = false;
  let autoplayTimer = null;
  const AUTOPLAY_MS = 12000;
  let laserOn = false;
  let notesOn = false;
  let startTime = Date.now();

  // ---- Mission Control state ----
  let order = config.map((_,i)=>i);      // current play order (indices into config)
  let skipped = new Set();                // skipped slide indices
  let transitionMode = 'auto';           // 'auto' | 'hyperdrive' | 'hud-glitch'
  let scriptOn = false;                   // script watermark visibility

  // Resolve the effective transition for a slide (respecting transitionMode override)
  function effectiveTransition(cfg){
    if(transitionMode==='auto') return cfg.transition;
    return transitionMode;
  }

  // Get the next non-skipped index in order
  function nextNonSkipped(fromIndex, dir){
    let pos = order.indexOf(fromIndex);
    if(pos===-1) pos = dir>0 ? -1 : order.length;
    for(let step=1; step<=order.length; step++){
      const np = pos + dir*step;
      if(np<0 || np>=order.length) return -1;
      const candidate = order[np];
      if(!skipped.has(candidate)) return candidate;
    }
    return -1;
  }

  function resolveTargetIndex(index, dir=1){
    if(index<0 || index>=config.length) return -1;
    if(!skipped.has(index)) return index;
    return nextNonSkipped(index, dir);
  }

  // ---- Build all slides (lazy: build on first visit) ----
  function buildSlide(i){
    if(slideEls[i]) return slideEls[i];
    const s = builders[i]();
    s.dataset.index = i;
    root.appendChild(s);
    slideEls[i] = s;
    return s;
  }

  // ---- Build sidebar nav ----
  config.forEach((c,i)=>{
    const link = el('div','nav-link');
    link.innerHTML = `<span class="nav-num">${c.num}</span><span class="nav-label">${c.title}</span><span class="nav-dot"></span>`;
    link.addEventListener('click', ()=> goTo(i));
    navList.appendChild(link);
  });

  // ---- Build minimap ----
  config.forEach((c,i)=>{
    const node = el('div','pm-node');
    node.innerHTML = `<span class="pm-label">${c.title}</span><div class="pm-bar"></div>`;
    node.addEventListener('click', ()=> goTo(i));
    progressMap.appendChild(node);
  });

  function el(tag,cls){const e=document.createElement(tag);if(cls)e.className=cls;return e;}

  // ---- Navigation ----
  function goTo(index, dir=1){
    const targetIndex = resolveTargetIndex(index, dir);
    if(targetIndex<0||targetIndex===current) return;
    const old = current>=0 ? slideEls[current] : null;
    const oldIndex = current;
    current = targetIndex;
    visited.add(targetIndex);

    const newSlide = buildSlide(targetIndex);
    const cfg = config[targetIndex];

    // update nav
    navList.querySelectorAll('.nav-link').forEach((n,i)=>{
      n.classList.toggle('active', i===targetIndex);
      if(visited.has(i)) n.classList.add('visited');
    });
    // update minimap
    progressMap.querySelectorAll('.pm-node').forEach((n,i)=>{
      n.classList.toggle('active', i===targetIndex);
      if(visited.has(i)) n.classList.add('visited');
    });
    // counter + progress
    counter.textContent = String(targetIndex+1).padStart(2,'0')+' / '+String(config.length).padStart(2,'0');
    progressFill.style.width = ((targetIndex)/(config.length-1))*100+'%';
    // notes
    notesBody.textContent = cfg.notes;
    // script watermark
    updateScriptWatermark(cfg);
    // accent
    document.documentElement.style.setProperty('--accent-current', cfg.accent);
    if(window.OrbitalBG) OrbitalBG.setAccent(cfg.accent);

    // transition (respect transitionMode override)
    const trans = effectiveTransition(cfg);
    if(old){
      old.classList.remove('active');
      Transitions.play(old, newSlide, trans, ()=>{
        if(oldIndex>=0 && slideEls[oldIndex] && oldIndex!==index){
          // cancel any RAF loops in old slide canvases
          slideEls[oldIndex].querySelectorAll('canvas').forEach(cv=>{ if(cv._raf) cancelAnimationFrame(cv._raf); });
        }
      });
    } else {
      Transitions.play(null, newSlide, trans);
    }
    newSlide.classList.add('active');
    if(newSlide.animateIn) setTimeout(()=>newSlide.animateIn(), 50);

    if(window.OrbitalAudio) OrbitalAudio.enter();
    resetAutoplay();
  }

  function next(){
    const nxt = nextNonSkipped(current, 1);
    if(nxt>=0) goTo(nxt, 1);
    else if(window.OrbitalAudio) OrbitalAudio.click();
  }
  function prev(){
    const prv = nextNonSkipped(current, -1);
    if(prv>=0) goTo(prv, -1);
    else if(window.OrbitalAudio) OrbitalAudio.click();
  }

  // ---- Controls ----
  document.getElementById('next-btn').addEventListener('click', next);
  document.getElementById('prev-btn').addEventListener('click', prev);

  // ---- Keyboard ----
  document.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowRight'||e.key===' '||e.key==='PageDown'){ e.preventDefault(); next(); }
    else if(e.key==='ArrowLeft'||e.key==='PageUp'){ e.preventDefault(); prev(); }
    else if(e.key==='Home'){ goTo(0); }
    else if(e.key==='End'){ goTo(config.length-1); }
    else if(e.key==='f'||e.key==='F'){ toggleFullscreen(); }
    else if(e.key==='a'||e.key==='A'){ toggleAutoplay(); }
    else if(e.key==='n'||e.key==='N'){ toggleNotes(); }
    else if(e.key==='l'||e.key==='L'){ toggleLaser(); }
    else if(/^[0-9]$/.test(e.key)){ const n=parseInt(e.key); if(n<config.length) goTo(n); }
  });

  // ---- Audio toggle ----
  document.getElementById('audio-toggle').addEventListener('click', function(){
    const on = OrbitalAudio.toggle();
    this.classList.toggle('active', on);
    this.querySelector('i').className = on?'fa-solid fa-volume-high':'fa-solid fa-volume-xmark';
  });

  // ---- Autoplay ----
  function toggleAutoplay(){
    autoplay = !autoplay;
    const btn = document.getElementById('autoplay-toggle');
    btn.classList.toggle('active', autoplay);
    btn.querySelector('i').className = autoplay?'fa-solid fa-pause':'fa-solid fa-play';
    if(autoplay) startAutoplay(); else stopAutoplay();
  }
  function startAutoplay(){
    stopAutoplay();
    autoplayTimer = setInterval(()=>{ if(current<config.length-1) next(); else toggleAutoplay(); }, AUTOPLAY_MS);
  }
  function stopAutoplay(){ if(autoplayTimer){ clearInterval(autoplayTimer); autoplayTimer=null; } }
  function resetAutoplay(){ if(autoplay){ startAutoplay(); } }
  document.getElementById('autoplay-toggle').addEventListener('click', toggleAutoplay);

  // ---- Fullscreen ----
  function toggleFullscreen(){
    if(!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
  document.getElementById('fullscreen-toggle').addEventListener('click', toggleFullscreen);

  // ---- Laser pointer ----
  function toggleLaser(){
    laserOn = !laserOn;
    document.getElementById('laser-toggle').classList.toggle('active', laserOn);
    document.getElementById('laser-dot').classList.toggle('show', laserOn);
    document.body.style.cursor = laserOn?'none':'default';
  }
  document.getElementById('laser-toggle').addEventListener('click', toggleLaser);
  document.addEventListener('mousemove', (e)=>{
    if(laserOn){
      const dot = document.getElementById('laser-dot');
      dot.style.left = e.clientX+'px';
      dot.style.top = e.clientY+'px';
    }
  });

  // ---- Presenter notes ----
  function toggleNotes(){
    notesOn = !notesOn;
    document.getElementById('notes-toggle').classList.toggle('active', notesOn);
    document.getElementById('notes-panel').classList.toggle('show', notesOn);
  }
  document.getElementById('notes-toggle').addEventListener('click', toggleNotes);
  document.getElementById('notes-close').addEventListener('click', ()=>{ notesOn=false; document.getElementById('notes-toggle').classList.remove('active'); document.getElementById('notes-panel').classList.remove('show'); });

  // ---- Mission timer ----
  function updateTimer(){
    const elapsed = Math.floor((Date.now()-startTime)/1000);
    const h = String(Math.floor(elapsed/3600)).padStart(2,'0');
    const m = String(Math.floor((elapsed%3600)/60)).padStart(2,'0');
    const sec = String(elapsed%60).padStart(2,'0');
    timerEl.textContent = 'T+ '+h+':'+m+':'+sec;
  }
  setInterval(updateTimer, 1000);

  // ---- Touch / swipe ----
  let touchX=0;
  document.addEventListener('touchstart', e=>{ touchX=e.touches[0].clientX; });
  document.addEventListener('touchend', e=>{
    const dx = e.changedTouches[0].clientX - touchX;
    if(Math.abs(dx)>60){ if(dx<0) next(); else prev(); }
  });

  // ---- Script watermark ----
  const scriptWatermark = document.getElementById('script-watermark');
  function updateScriptWatermark(cfg){
    if(!scriptWatermark) return;
    if(scriptOn && cfg.script){
      scriptWatermark.textContent = cfg.script;
      scriptWatermark.classList.add('show');
    } else {
      scriptWatermark.classList.remove('show');
    }
  }
  function toggleScript(){
    scriptOn = !scriptOn;
    document.getElementById('script-toggle').classList.toggle('active', scriptOn);
    if(current>=0) updateScriptWatermark(config[current]);
  }
  document.getElementById('script-toggle').addEventListener('click', toggleScript);

  // ---- Mission Control panel (reorder / skip / transition mode) ----
  const mcPanel = document.getElementById('mission-ctrl-panel');
  const mcReorderList = document.getElementById('mc-reorder-list');
  const mcSkipList = document.getElementById('mc-skip-list');
  let mcOpen = false;
  function toggleMissionCtrl(){
    mcOpen = !mcOpen;
    document.getElementById('mission-ctrl-toggle').classList.toggle('active', mcOpen);
    mcPanel.classList.toggle('show', mcOpen);
    if(mcOpen) renderMissionCtrl();
  }
  document.getElementById('mission-ctrl-toggle').addEventListener('click', toggleMissionCtrl);
  document.getElementById('mc-close').addEventListener('click', ()=>{ mcOpen=false; document.getElementById('mission-ctrl-toggle').classList.remove('active'); mcPanel.classList.remove('show'); });

  function renderMissionCtrl(){
    // Reorder list (draggable)
    mcReorderList.innerHTML = '';
    order.forEach((cfgIdx, pos)=>{
      const c = config[cfgIdx];
      const row = el('div','mc-reorder-row');
      row.draggable = true;
      row.dataset.pos = pos;
      row.innerHTML = `<span class="mc-drag"><i class="fa-solid fa-grip-vertical"></i></span><span class="mc-num">${c.num}</span><span class="mc-title">${c.title}</span>`;
      // click to jump
      row.addEventListener('click', ()=> goTo(cfgIdx));
      // drag events
      row.addEventListener('dragstart', e=>{ row.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; });
      row.addEventListener('dragend', ()=>{ row.classList.remove('dragging'); });
      row.addEventListener('dragover', e=>{ e.preventDefault(); const dragging = mcReorderList.querySelector('.dragging'); if(!dragging||dragging===row) return; const r = row.getBoundingClientRect(); const after = e.clientY > r.top+r.height/2; mcReorderList.insertBefore(dragging, after ? row.nextSibling : row); });
      mcReorderList.appendChild(row);
    });
    mcReorderList.addEventListener('dragover', e=>e.preventDefault());
    mcReorderList.addEventListener('drop', e=>{
      e.preventDefault();
      // rebuild order from DOM
      const newOrder = [];
      mcReorderList.querySelectorAll('.mc-reorder-row').forEach(r=>{ newOrder.push(order[parseInt(r.dataset.pos)]); });
      order = newOrder;
      // update dataset.pos to reflect new positions
      mcReorderList.querySelectorAll('.mc-reorder-row').forEach((r,i)=> r.dataset.pos = i);
    });

    // Skip list (checkboxes)
    mcSkipList.innerHTML = '';
    config.forEach((c,i)=>{
      const row = el('div','mc-skip-row');
      const isSkipped = skipped.has(i);
      row.innerHTML = `<label><input type="checkbox" ${isSkipped?'checked':''}><span class="mc-num">${c.num}</span><span class="mc-title">${c.title}</span></label>`;
      const cb = row.querySelector('input');
      cb.addEventListener('change', ()=>{
        if(cb.checked) skipped.add(i); else skipped.delete(i);
        // if current slide got skipped, jump to next available
        if(cb.checked && current===i){ const nxt = nextNonSkipped(i,1); if(nxt>=0) goTo(nxt); }
      });
      mcSkipList.appendChild(row);
    });
  }

  // Transition mode buttons
  document.querySelectorAll('.mc-tmode').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.mc-tmode').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      transitionMode = btn.dataset.mode;
    });
  });

  // Reset order
  document.getElementById('mc-reset-order').addEventListener('click', ()=>{
    order = config.map((_,i)=>i);
    skipped.clear();
    transitionMode = 'auto';
    document.querySelectorAll('.mc-tmode').forEach(b=>b.classList.toggle('active', b.dataset.mode==='auto'));
    renderMissionCtrl();
  });

  // ---- Boot ----
  window.addEventListener('load', ()=>{
    setTimeout(()=>{
      document.getElementById('boot-loader').classList.add('hidden');
      goTo(0);
    }, 2400);
  });
})();
