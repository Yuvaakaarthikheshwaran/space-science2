/* ============================================================
   ORBITAL // SLIDES MODULE (Part 1: slides 00-06)
   Each function returns an HTMLElement (the slide root).
   Unique layout per slide. GSAP-driven internal animations
   triggered via the returned `animateIn()` method.
   ============================================================ */
const SlidesPart1 = (function(){

  function el(tag, cls, html){
    const e = document.createElement(tag);
    if(cls) e.className = cls;
    if(html!==undefined) e.innerHTML = html;
    return e;
  }

  // Helper: stagger animate children with class .anim-up/.anim-fade/.anim-scale
  function stagger(scope, base=0.15, gap=0.08){
    const items = scope.querySelectorAll('.anim-up,.anim-fade,.anim-scale');
    items.forEach((it,i)=>{
      const isUp = it.classList.contains('anim-up');
      const isScale = it.classList.contains('anim-scale');
      const from = isUp ? {opacity:0,y:40} : isScale ? {opacity:0,scale:0.9} : {opacity:0};
      gsap.fromTo(it, from, {opacity:1,y:0,scale:1,duration:0.8,delay:base+i*gap,ease:'power3.out'});
    });
  }

  // ---------- 00. OPENING CINEMATIC ----------
  function cinematic(){
    const s = el('div','slide slide-cinematic');
    s.innerHTML = `
      <div class="cin-center">
        <div class="cin-pre anim-fade">DEEP SPACE TELEMETRY // INITIALIZING</div>
        <div class="cin-title-wrap">
          <h1 class="cin-title anim-up">ORBITAL</h1>
          <div class="cin-sub anim-up">A Space Science Mission Presentation</div>
        </div>
        <div class="cin-line anim-fade"></div>
        <div class="cin-meta anim-fade">
          <span><i class="fa-solid fa-satellite-dish"></i> EARTH-SHIELD PROTOCOL</span>
          <span><i class="fa-solid fa-rocket"></i> LEO-SYNC</span>
          <span><i class="fa-solid fa-shield-halved"></i> EXHIBITION READY</span>
        </div>
        <div class="cin-hint anim-fade">PRESS <b>→</b> OR <b>SPACE</b> TO BEGIN</div>
      </div>
    `;
    s.animateIn = ()=>{ stagger(s,0.3,0.12); };
    return s;
  }

  // ---------- 01. TEAM MEMBERS (TASK 1: alphabetical roster) ----------
  function team(){
    // Raw names — sorted strictly alphabetically at runtime
    const rawNames = ['Durgasri','Harini','Vishnu','Yudith','Yuvaakaarthikheshwaran','Yuvan Prabhu'];
    const sorted = [...rawNames].sort((a,b)=>a.localeCompare(b));
    const roles = ['Mission Lead','Systems Engineer','Data Analyst','Comms Specialist','Payload Officer','Flight Director'];
    const icons = ['fa-user-astronaut','fa-gears','fa-chart-line','fa-tower-broadcast','fa-satellite-dish','fa-rocket'];
    const colors = ['#3b82f6','#22d3ee','#22c55e','#f59e0b','#a855f7','#ef4444'];
    const members = sorted.map((n,i)=>({n, r:roles[i%roles.length], i:icons[i%icons.length], c:colors[i%colors.length]}));
    const s = el('div','slide slide-team');
    s.innerHTML = `
      <span class="tagline anim-fade">CREW MANIFEST</span>
      <h2 class="anim-up">Mission Crew</h2>
      <p class="lead anim-up" style="margin-bottom:36px;">The specialists behind the Earth-Shield protocol — each operating a critical system of the orbital presentation.</p>
      <div class="team-grid"></div>
    `;
    const grid = s.querySelector('.team-grid');
    members.forEach((m,idx)=>{
      const card = el('div','team-card anim-scale');
      card.innerHTML = `
        <div class="team-avatar" style="--tc:${m.c}"><i class="fa-solid ${m.i}"></i></div>
        <div class="team-name">${m.n}</div>
        <div class="team-role">${m.r}</div>
        <div class="team-id">CREW-0${idx+1}</div>
      `;
      grid.appendChild(card);
    });
    s.animateIn = ()=>{ stagger(s,0.2,0.1); };
    return s;
  }

  // ---------- 02. INTRODUCTION ----------
  function intro(){
    const pillars = [
      {t:'The Platform',d:'The orbital eye collecting structural data.',i:'fa-satellite',c:'#60a5fa'},
      {t:'Agriculture',d:'Managing global resources & plant health.',i:'fa-seedling',c:'#22c55e'},
      {t:'Disaster',d:'Rapid response during environmental crisis.',i:'fa-triangle-exclamation',c:'#ef4444'},
      {t:'Seismic',d:'Monitoring ground deformation & tension.',i:'fa-earth-africa',c:'#f59e0b'},
      {t:'Weather',d:'Predictive modeling of the atmosphere.',i:'fa-cloud-sun-rain',c:'#38bdf8'}
    ];
    const s = el('div','slide slide-intro');
    s.innerHTML = `
      <span class="tagline anim-fade">MISSION BRIEFING</span>
      <h1 class="anim-up">Comprehensive Briefing</h1>
      <p class="lead anim-up">To understand and protect Earth, we utilize orbital data across five critical pillars. Our working hardware model demonstrates the flow of information from space to ground.</p>
      <div class="pillar-grid"></div>
      <div class="intro-foot anim-fade">PRESENTATION COMMENCING // PROCEED TO DATA SECTORS</div>
    `;
    const grid = s.querySelector('.pillar-grid');
    pillars.forEach(p=>{
      const card = el('div','pillar-card anim-scale');
      card.innerHTML = `
        <div class="icon-orb" style="color:${p.c};border-color:${p.c}55;background:radial-gradient(circle at 30% 30%,${p.c}33,${p.c}08)"><i class="fa-solid ${p.i}"></i></div>
        <h3>${p.t}</h3>
        <p>${p.d}</p>
      `;
      grid.appendChild(card);
    });
    s.animateIn = ()=>{ stagger(s,0.25,0.1); };
    return s;
  }

  // ---------- 03. SATELLITE ----------
  function satellite(){
    const s = el('div','slide slide-satellite');
    s.innerHTML = `
      <span class="tagline anim-fade">OPERATIONAL PILLAR 01</span>
      <h2 class="anim-up">The Satellite Platform</h2>
      <div class="split-layout">
        <div class="split-left">
          <div class="info-card glass anim-up">
            <h3><i class="fa-solid fa-compass" style="color:#60a5fa"></i> Remote Observation</h3>
            <p>Satellites act as our eyes in space. Operating in Low Earth Orbit (LEO), they scan the planet using visible, infrared, and radar sensors to provide the "Big Picture" intelligence needed for protection.</p>
          </div>
          <div class="info-card glass anim-up">
            <h3><i class="fa-solid fa-tower-broadcast" style="color:#60a5fa"></i> Data Link</h3>
            <p>Information captured from 500 km above is beamed down to ground stations, allowing us to monitor global changes in real-time, 24 hours a day.</p>
          </div>
          <div class="led-sync anim-up">
            <div class="led-dot" style="background:#ef4444;box-shadow:0 0 16px #ef4444;"></div>
            <div class="led-info"><h4 style="color:#ef4444">MODEL LINK: SATELLITE</h4><p>Activate the RED LED on the physical model.</p></div>
          </div>
        </div>
        <div class="split-right anim-scale">
          <div class="orbit-viz" id="orbit-viz"></div>
        </div>
      </div>
    `;
    s.animateIn = ()=>{
      stagger(s,0.2,0.1);
      buildOrbitViz(s.querySelector('#orbit-viz'));
    };
    return s;
  }

  // Mini canvas orbit visualization for satellite slide
  function buildOrbitViz(container){
    if(!container) return;
    container.innerHTML = `
      <canvas class="orbit-canvas"></canvas>
      <div class="orbit-label">LEO // 500 KM</div>
    `;
    const cv = container.querySelector('canvas');
    const ctx2 = cv.getContext('2d');
    function resize(){
      cv.width = container.clientWidth*2; cv.height = container.clientHeight*2;
      cv.style.width=container.clientWidth+'px'; cv.style.height=container.clientHeight+'px';
    }
    resize();
    let ang=0;
    function draw(){
      ctx2.clearRect(0,0,cv.width,cv.height);
      const cx=cv.width/2, cy=cv.height/2;
      // earth
      const g = ctx2.createRadialGradient(cx-20,cy-20,10,cx,cy,90);
      g.addColorStop(0,'#1e40af'); g.addColorStop(1,'#0b1220');
      ctx2.fillStyle=g; ctx2.beginPath(); ctx2.arc(cx,cy,80,0,Math.PI*2); ctx2.fill();
      // orbit ring
      ctx2.strokeStyle='rgba(96,165,250,0.3)'; ctx2.lineWidth=1.5;
      ctx2.beginPath(); ctx2.ellipse(cx,cy,180,90,0,0,Math.PI*2); ctx2.stroke();
      // satellite
      const sx=cx+Math.cos(ang)*180, sy=cy+Math.sin(ang)*90;
      ctx2.fillStyle='#22d3ee'; ctx2.shadowColor='#22d3ee'; ctx2.shadowBlur=20;
      ctx2.beginPath(); ctx2.arc(sx,sy,6,0,Math.PI*2); ctx2.fill();
      ctx2.shadowBlur=0;
      // trail
      ctx2.strokeStyle='rgba(34,211,238,0.4)'; ctx2.lineWidth=2;
      ctx2.beginPath();
      for(let i=0;i<20;i++){
        const a=ang-i*0.05; const x=cx+Math.cos(a)*180, y=cy+Math.sin(a)*90;
        if(i===0) ctx2.moveTo(x,y); else ctx2.lineTo(x,y);
      }
      ctx2.stroke();
      ang+=0.012;
      container._raf = requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', resize);
  }

  // ---------- 04. AGRICULTURE ----------
  function agriculture(){
    const s = el('div','slide slide-agri');
    s.innerHTML = `
      <span class="tagline anim-fade">OPERATIONAL PILLAR 02</span>
      <h2 class="anim-up">Agriculture Management</h2>
      <div class="split-layout">
        <div class="split-left anim-scale">
          <div class="ndvi-viz" id="ndvi-viz"></div>
        </div>
        <div class="split-right">
          <div class="info-card glass anim-up">
            <h3><i class="fa-solid fa-leaf" style="color:#22c55e"></i> Crop Health (NDVI)</h3>
            <p>By measuring invisible infrared light, satellites detect if plants are stressed by thirst or disease long before it's visible to the human eye.</p>
          </div>
          <div class="info-card glass anim-up">
            <h3><i class="fa-solid fa-droplet" style="color:#22c55e"></i> Water Conservation</h3>
            <p>Mapping soil moisture topology allows farmers to use water only where it's needed, securing our global food supply.</p>
          </div>
          <div class="led-sync anim-up">
            <div class="led-dot" style="background:#22c55e;box-shadow:0 0 16px #22c55e;"></div>
            <div class="led-info"><h4 style="color:#22c55e">MODEL LINK: AGRICULTURE</h4><p>Activate the GREEN LED on the physical model.</p></div>
          </div>
        </div>
      </div>
    `;
    s.animateIn = ()=>{
      stagger(s,0.2,0.1);
      buildNDVI(s.querySelector('#ndvi-viz'));
    };
    return s;
  }

  function buildNDVI(container){
    if(!container) return;
    container.innerHTML = `<canvas class="ndvi-canvas"></canvas><div class="ndvi-legend"><span>-1.0</span><div class="ndvi-bar"></div><span>+1.0</span></div><div class="ndvi-hud">LIVE NDVI FEED // SAT-LINK</div>`;
    const cv = container.querySelector('canvas');
    const ctx2 = cv.getContext('2d');
    const hudEl = container.querySelector('.ndvi-hud');
    function resize(){
      const cssW = Math.max(320, Math.floor(container.clientWidth || 480));
      const cssH = Math.max(220, Math.floor(container.clientHeight || 320));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(cssW * dpr);
      cv.height = Math.round(cssH * dpr);
      cv.style.width = cssW + 'px';
      cv.style.height = cssH + 'px';
      ctx2.setTransform(1, 0, 0, 1, 0, 0);
      ctx2.imageSmoothingEnabled = false;
      return {w: cv.width, h: cv.height};
    }
    let size = resize();
    // --- Value noise (Perlin-like) implementation ---
    // Grid of random gradients interpolated smoothly for organic terrain-like fields.
    const GRID = 64; // noise grid resolution
    function rand(seed){ // deterministic pseudo-random
      const x = Math.sin(seed*12.9898)*43758.5453;
      return x - Math.floor(x);
    }
    // Pre-generate gradient lattice; we'll evolve it slowly over time for "shifting" effect.
    let grad = [];
    function regenGrad(offset){
      grad = [];
      for(let i=0;i<=GRID;i++){
        grad[i]=[];
        for(let j=0;j<=GRID;j++){
          grad[i][j] = rand(i*131+j*17+offset) * 2 - 1;
        }
      }
    }
    regenGrad(0);
    function smoothstep(t){ return t*t*(3-2*t); }
    function valueNoise(u, v){
      // u,v in [0,1]
      const x = u*GRID, y = v*GRID;
      const x0 = Math.max(0, Math.min(GRID, Math.floor(x)));
      const y0 = Math.max(0, Math.min(GRID, Math.floor(y)));
      const x1 = Math.max(0, Math.min(GRID, x0+1));
      const y1 = Math.max(0, Math.min(GRID, y0+1));
      const fx = smoothstep(x - x0), fy = smoothstep(y - y0);
      const v00 = grad[x0][y0], v10 = grad[x1][y0], v01 = grad[x0][y1], v11 = grad[x1][y1];
      const top = v00*(1-fx) + v10*fx;
      const bot = v01*(1-fx) + v11*fx;
      return top*(1-fy) + bot*fy;
    }
    // Fractal Brownian Motion: sum octaves for richer detail
    function fbm(u, v){
      let val=0, amp=0.5, freq=1, max=0;
      for(let o=0;o<4;o++){
        val += amp * valueNoise(u*freq, v*freq);
        max += amp;
        amp *= 0.5;
        freq *= 2;
      }
      return val / max;
    }
    // --- Low-framerate "video feed" effect ---
    // Render at ~12fps instead of 60fps to simulate satellite downlink.
    let lastRender = 0;
    const FRAME_INTERVAL = 1000/12; // ~12 fps
    let frameCount = 0;
    let gradOffset = 0;
    // Damage zones: slowly drifting circular regions of low NDVI (drought / pest / fire scar)
    const damageZones = [];
    for(let i=0;i<4;i++){
      damageZones.push({ x: Math.random(), y: Math.random(), r: 0.08+Math.random()*0.12, dx: (Math.random()-0.5)*0.0008, dy: (Math.random()-0.5)*0.0008, strength: 0.5+Math.random()*0.4 });
    }
    // Healthy zones: drifting regions of high NDVI (irrigated / healthy canopy)
    const healthyZones = [];
    for(let i=0;i<3;i++){
      healthyZones.push({ x: Math.random(), y: Math.random(), r: 0.1+Math.random()*0.1, dx: (Math.random()-0.5)*0.0006, dy: (Math.random()-0.5)*0.0006, strength: 0.4+Math.random()*0.3 });
    }
    function draw(ts){
      container._raf = requestAnimationFrame(draw);
      if(ts - lastRender < FRAME_INTERVAL) return;
      lastRender = ts;
      size = resize();
      const w=size.w,h=size.h;
      // Slowly evolve the noise field by regenerating gradient lattice every ~90 frames
      frameCount++;
      if(frameCount % 90 === 0){ gradOffset += 7; regenGrad(gradOffset); }
      // Drift damage/healthy zones
      damageZones.forEach(z=>{ z.x+=z.dx; z.y+=z.dy; if(z.x<0||z.x>1)z.dx*=-1; if(z.y<0||z.y>1)z.dy*=-1; });
      healthyZones.forEach(z=>{ z.x+=z.dx; z.y+=z.dy; if(z.x<0||z.x>1)z.dx*=-1; if(z.y<0||z.y>1)z.dy*=-1; });
      const img = ctx2.createImageData(w,h);
      // Downscale render: compute at lower res then nearest-neighbor upscale for "pixelated feed" look
      const SS = 4; // supersample divisor for pixelated satellite look
      const rw = Math.floor(w/SS), rh = Math.floor(h/SS);
      for(let sy=0;sy<rh;sy++){
        for(let sx=0;sx<rw;sx++){
          const u = sx/rw, v = sy/rh;
          // Base NDVI from fbm noise in [-1,1] range mapped to [0,1]
          let ndvi = fbm(u, v); // ~[0,1]
          ndvi = ndvi*2 - 1; // -> [-1,1] (NDVI range)
          // Apply damage zones (reduce NDVI)
          damageZones.forEach(z=>{
            const dx = u-z.x, dy = v-z.y;
            const d = Math.sqrt(dx*dx+dy*dy);
            if(d < z.r){ ndvi -= z.strength * (1 - d/z.r); }
          });
          // Apply healthy zones (boost NDVI)
          healthyZones.forEach(z=>{
            const dx = u-z.x, dy = v-z.y;
            const d = Math.sqrt(dx*dx+dy*dy);
            if(d < z.r){ ndvi += z.strength * (1 - d/z.r); }
          });
          ndvi = Math.max(-1, Math.min(1, ndvi));
          // NDVI color ramp: brown/red (low) -> yellow -> green (high)
          let r,g,b;
          if(ndvi < 0){
            // water / barren: blue-grey to brown
            const t = (ndvi+1); // 0..1
            r = 100*(1-t)+160*t; g = 80*(1-t)+120*t; b = 140*(1-t)+40*t;
          } else if(ndvi < 0.3){
            // barren to sparse: brown to yellow
            const t = ndvi/0.3;
            r = 160*(1-t)+220*t; g = 120*(1-t)+200*t; b = 40*(1-t)+40*t;
          } else {
            // sparse to dense vegetation: yellow-green to deep green
            const t = (ndvi-0.3)/0.7;
            r = 220*(1-t)+30*t; g = 200*(1-t)+160*t; b = 40*(1-t)+30*t;
          }
          // Write to SSxSS block (nearest-neighbor upscale)
          for(let dy=0;dy<SS;dy++){
            for(let dx=0;dx<SS;dx++){
              const px = sx*SS+dx, py = sy*SS+dy;
              if(px<w && py<h){
                const idx=(py*w+px)*4;
                img.data[idx]=r; img.data[idx+1]=g; img.data[idx+2]=b; img.data[idx+3]=255;
              }
            }
          }
        }
      }
      ctx2.putImageData(img,0,0);
      // Scanline overlay for "video feed" aesthetic
      ctx2.fillStyle='rgba(0,0,0,0.08)';
      for(let y=0;y<h;y+=4){ ctx2.fillRect(0,y,w,1); }
      // Update HUD with live stats
      if(hudEl && frameCount % 6 === 0){
        const avg = (0.3 + Math.sin(frameCount*0.02)*0.15).toFixed(2);
        hudEl.textContent = `LIVE NDVI FEED // MEAN: ${avg} // FRAME ${frameCount.toString().padStart(5,'0')}`;
      }
    }
    draw(0);
    window.addEventListener('resize', ()=> resize());
  }

  // ---------- 05. DISASTER ----------
  function disaster(){
    const s = el('div','slide slide-disaster');
    s.innerHTML = `
      <span class="tagline anim-fade">OPERATIONAL PILLAR 03</span>
      <h2 class="anim-up">Disaster Mitigation</h2>
      <div class="split-layout">
        <div class="split-left">
          <div class="info-card glass anim-up">
            <h3><i class="fa-solid fa-cloud-showers-heavy" style="color:#ef4444"></i> Storm Penetration</h3>
            <p>When hurricanes strike, standard cameras can't see through clouds. Radar (SAR) shoots through the storm to map flood zones in total darkness.</p>
          </div>
          <div class="info-card glass anim-up">
            <h3><i class="fa-solid fa-fire" style="color:#ef4444"></i> Heat Detection</h3>
            <p>Short-wave sensors scan for intense heat to pinpoint wildfire boundaries, helping map safe routes for emergency rescue.</p>
          </div>
          <div class="led-sync anim-up">
            <div class="led-dot" style="background:#ef4444;box-shadow:0 0 16px #ef4444;"></div>
            <div class="led-info"><h4 style="color:#ef4444">MODEL LINK: DISASTER</h4><p>Activate the RED LED on the physical model.</p></div>
          </div>
        </div>
        <div class="split-right anim-scale">
          <div class="disaster-viz" id="disaster-viz"></div>
        </div>
      </div>
    `;
    s.animateIn = ()=>{
      stagger(s,0.2,0.1);
      buildDisasterViz(s.querySelector('#disaster-viz'));
    };
    return s;
  }

  function buildDisasterViz(container){
    if(!container) return;
    container.innerHTML = `<canvas class="disaster-canvas"></canvas><div class="dviz-tag">SAR // STORM PENETRATION</div>`;
    const cv = container.querySelector('canvas');
    const ctx2 = cv.getContext('2d');
    function resize(){cv.width=container.clientWidth*2;cv.height=container.clientHeight*2;cv.style.width=container.clientWidth+'px';cv.style.height=container.clientHeight+'px';}
    resize();
    const cx=()=>cv.width/2, cy=()=>cv.height/2;
    const maxR=()=>Math.min(cv.width,cv.height)*0.42;

    // Threats at fixed polar coordinates (angle, radius fraction)
    const threats = [];
    for(let i=0;i<7;i++){
      threats.push({
        angle: Math.random()*Math.PI*2,
        radius: 0.25 + Math.random()*0.7,
        brightness: 0,
        type: Math.random()<0.5?'fire':'flood'
      });
    }

    let sweepAngle = 0;
    const sweepSpeed = 0.018;
    const fadeRate = 0.012;

    function norm(a){ return ((a%(Math.PI*2))+Math.PI*2)%(Math.PI*2); }

    function draw(){
      const w=cv.width,h=cv.height;
      const ccx=cx(), ccy=cy();
      const R = maxR();

      // fade trail (persistence of vision)
      ctx2.fillStyle='rgba(3,4,7,0.22)';
      ctx2.fillRect(0,0,w,h);

      // range rings + crosshair
      ctx2.strokeStyle='rgba(239,68,68,0.15)'; ctx2.lineWidth=1;
      for(let r=R*0.25;r<R;r+=R*0.25){
        ctx2.beginPath(); ctx2.arc(ccx,ccy,r,0,Math.PI*2); ctx2.stroke();
      }
      ctx2.beginPath();
      ctx2.moveTo(ccx-R,ccy); ctx2.lineTo(ccx+R,ccy);
      ctx2.moveTo(ccx,ccy-R); ctx2.lineTo(ccx,ccy+R);
      ctx2.stroke();

      // ---- Reveal logic: blip visible only when sweep passes its angle ----
      const swA = norm(sweepAngle);
      threats.forEach(th=>{
        const thA = norm(th.angle);
        let diff = Math.abs(thA - swA);
        if(diff>Math.PI) diff = Math.PI*2 - diff;
        if(diff < 0.06){ th.brightness = 1; }
        else { th.brightness = Math.max(0, th.brightness - fadeRate); }
      });

      // ---- Sweep arm (conic gradient) ----
      const grad = ctx2.createConicGradient(sweepAngle, ccx, ccy);
      grad.addColorStop(0, 'rgba(239,68,68,0.55)');
      grad.addColorStop(0.04, 'rgba(239,68,68,0.15)');
      grad.addColorStop(0.08, 'rgba(239,68,68,0)');
      grad.addColorStop(1, 'rgba(239,68,68,0)');
      ctx2.fillStyle=grad;
      ctx2.beginPath(); ctx2.arc(ccx,ccy,R,0,Math.PI*2); ctx2.fill();
      // bright leading edge
      ctx2.strokeStyle='rgba(239,68,68,0.9)'; ctx2.lineWidth=2;
      ctx2.beginPath();
      ctx2.moveTo(ccx,ccy);
      ctx2.lineTo(ccx+Math.cos(sweepAngle)*R, ccy+Math.sin(sweepAngle)*R);
      ctx2.stroke();

      // ---- Draw threats (opacity = brightness) ----
      threats.forEach(th=>{
        if(th.brightness<=0.01) return;
        const tx = ccx + Math.cos(th.angle)*th.radius*R;
        const ty = ccy + Math.sin(th.angle)*th.radius*R;
        const col = th.type==='fire' ? '245,158,11' : '239,68,68';
        ctx2.fillStyle=`rgba(${col},${th.brightness})`;
        ctx2.shadowColor = th.type==='fire' ? '#f59e0b' : '#ef4444';
        ctx2.shadowBlur = 15*th.brightness;
        ctx2.beginPath(); ctx2.arc(tx,ty,5,0,Math.PI*2); ctx2.fill();
        if(th.brightness>0.5){
          ctx2.shadowBlur=0;
          ctx2.fillStyle=`rgba(255,255,255,${th.brightness*0.8})`;
          ctx2.font='10px JetBrains Mono';
          ctx2.fillText(th.type==='fire'?'FIRE':'FLOOD', tx+8, ty+3);
        }
      });
      ctx2.shadowBlur=0;

      // center hub
      ctx2.fillStyle='rgba(239,68,68,0.8)';
      ctx2.beginPath(); ctx2.arc(ccx,ccy,4,0,Math.PI*2); ctx2.fill();

      sweepAngle += sweepSpeed;
      container._raf=requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize',resize);
  }

  // ---------- 06. EARTHQUAKE ----------
  function earthquake(){
    const s = el('div','slide slide-quake');
    s.innerHTML = `
      <span class="tagline anim-fade">OPERATIONAL PILLAR 04</span>
      <h2 class="anim-up">Seismic Deformation</h2>
      <div class="split-layout">
        <div class="split-left anim-scale">
          <div class="quake-viz" id="quake-viz"></div>
        </div>
        <div class="split-right">
          <div class="info-card glass anim-up">
            <h3><i class="fa-solid fa-satellite-dish" style="color:#f59e0b"></i> Tectonic Mapping</h3>
            <p>Satellites use Radar (InSAR) to measure ground shifts of just 3 mm. This tracks how fault lines warp and where tectonic tension is building up.</p>
          </div>
          <div class="info-card glass anim-up">
            <h3><i class="fa-solid fa-city" style="color:#f59e0b"></i> Damage Assessment</h3>
            <p>After a quake, satellites instantly map blocked roads and destroyed structures to help rescuers reach those in need.</p>
          </div>
          <div class="led-sync anim-up">
            <div class="led-dot" style="background:#f59e0b;box-shadow:0 0 16px #f59e0b;"></div>
            <div class="led-info"><h4 style="color:#f59e0b">MODEL LINK: EARTHQUAKE</h4><p>Activate the AMBER LED on the physical model.</p></div>
          </div>
        </div>
      </div>
    `;
    s.animateIn = ()=>{
      stagger(s,0.2,0.1);
      buildQuakeViz(s.querySelector('#quake-viz'));
    };
    return s;
  }

  function buildQuakeViz(container){
    if(!container) return;
    container.innerHTML = `<canvas class="quake-canvas"></canvas><div class="qviz-tag">SEISMIC NET // STANDBY</div>`;
    const cv = container.querySelector('canvas');
    const ctx2 = cv.getContext('2d');
    const tagEl = container.querySelector('.qviz-tag');
    function resize(){cv.width=container.clientWidth*2;cv.height=container.clientHeight*2;cv.style.width=container.clientWidth+'px';cv.style.height=container.clientHeight+'px';}
    resize();
    let t=0;
    // Wave system: P-waves (primary, fast, low amplitude) and S-waves (secondary, slow, high amplitude)
    // Magnitude scales amplitude and frequency. Randomized M 2.0 - M 8.0.
    const waves = [];
    let spawnTimer = 0;
    const epicenter = { x: 0.5, y: 0.5 }; // normalized; will jitter slightly per event
    function spawnWave(){
      const mag = 2.0 + Math.random()*6.0; // M 2.0 - M 8.0
      const isP = Math.random() < 0.5;
      // P-wave: faster (6 km/s), lower amplitude. S-wave: slower (3.5 km/s), higher amplitude.
      // Amplitude scales exponentially with magnitude (Richter-like).
      const ampBase = isP ? mag*1.5 : mag*4.0;
      const amp = ampBase * Math.pow(1.35, mag-2); // exponential growth w/ magnitude
      const freq = isP ? 0.06 : 0.04;
      const speed = isP ? 3.2 : 1.8; // px/frame at 2x scale
      // jitter epicenter slightly per event for realism
      epicenter.x = 0.35 + Math.random()*0.3;
      epicenter.y = 0.35 + Math.random()*0.3;
      waves.push({ type: isP?'P':'S', radius: 0, magnitude: mag, speed, amp, freq, life: 1.0, phase: Math.random()*Math.PI*2 });
      if(tagEl){
        const m = mag.toFixed(1);
        tagEl.textContent = `M ${m} // ${isP?'P-WAVE':'S-WAVE'} DETECTED`;
        tagEl.style.color = mag>=6 ? '#ef4444' : (mag>=4 ? '#f59e0b' : '#22d3ee');
      }
    }
    function draw(){
      const w=cv.width,h=cv.height;
      ctx2.clearRect(0,0,w,h);
      const cx=epicenter.x*w, cy=epicenter.y*h;
      // background fault grid (subtle, always present)
      ctx2.strokeStyle='rgba(245,158,11,0.12)'; ctx2.lineWidth=1;
      const cols=20, rows=12;
      for(let i=0;i<=cols;i++){
        ctx2.beginPath();
        for(let j=0;j<=rows;j++){
          const x=(i/cols)*w, y=(j/rows)*h;
          const dx=x-cx, dy=y-cy;
          const d=Math.sqrt(dx*dx+dy*dy);
          // grid warps based on active waves' displacement field
          let disp=0;
          waves.forEach(wv=>{
            const ringR=wv.radius;
            const diff=Math.abs(d-ringR);
            const env=Math.exp(-diff*diff/(2*40*40)); // gaussian envelope around wavefront
            disp += wv.amp * env * Math.sin(d*wv.freq - t*0.08 + wv.phase) * wv.life;
          });
          const px=x+disp, py=y;
          if(j===0) ctx2.moveTo(px,py); else ctx2.lineTo(px,py);
        }
        ctx2.stroke();
      }
      for(let j=0;j<=rows;j++){
        ctx2.beginPath();
        for(let i=0;i<=cols;i++){
          const x=(i/cols)*w, y=(j/rows)*h;
          const dx=x-cx, dy=y-cy;
          const d=Math.sqrt(dx*dx+dy*dy);
          let disp=0;
          waves.forEach(wv=>{
            const ringR=wv.radius;
            const diff=Math.abs(d-ringR);
            const env=Math.exp(-diff*diff/(2*40*40));
            disp += wv.amp * env * Math.sin(d*wv.freq - t*0.08 + wv.phase) * wv.life;
          });
          const px=x+disp, py=y;
          if(i===0) ctx2.moveTo(px,py); else ctx2.lineTo(px,py);
        }
        ctx2.stroke();
      }
      // draw expanding wave rings (P = cyan, S = amber/red by magnitude)
      waves.forEach(wv=>{
        const r=wv.radius;
        if(r<2) return;
        const isP = wv.type==='P';
        const baseColor = isP ? '34,211,238' : (wv.magnitude>=6 ? '239,68,68' : '245,158,11');
        const alpha = wv.life * (isP ? 0.55 : 0.75);
        // outer ring
        ctx2.strokeStyle=`rgba(${baseColor},${alpha})`;
        ctx2.lineWidth = isP ? 1.5 : 2.5;
        ctx2.beginPath(); ctx2.arc(cx,cy,r,0,Math.PI*2); ctx2.stroke();
        // oscillating inner rings (wave packet)
        for(let k=1;k<=3;k++){
          const rr = r - k*8;
          if(rr<2) continue;
          const a = alpha * (1 - k*0.25);
          ctx2.strokeStyle=`rgba(${baseColor},${a})`;
          ctx2.lineWidth = isP ? 1 : 1.8;
          ctx2.beginPath(); ctx2.arc(cx,cy,rr,0,Math.PI*2); ctx2.stroke();
        }
      });
      // epicenter marker (pulses with latest wave)
      const pulse = 5 + Math.sin(t*0.15)*2;
      ctx2.fillStyle='rgba(239,68,68,0.95)'; ctx2.shadowColor='#ef4444'; ctx2.shadowBlur=20;
      ctx2.beginPath(); ctx2.arc(cx,cy,pulse,0,Math.PI*2); ctx2.fill();
      ctx2.shadowBlur=0;
      // crosshair
      ctx2.strokeStyle='rgba(239,68,68,0.4)'; ctx2.lineWidth=1;
      ctx2.beginPath(); ctx2.moveTo(cx-20,cy); ctx2.lineTo(cx+20,cy); ctx2.moveTo(cx,cy-20); ctx2.lineTo(cx,cy+20); ctx2.stroke();
      // update waves
      waves.forEach(wv=>{
        wv.radius += wv.speed;
        wv.life -= 0.004; // fade out as they propagate
      });
      // remove dead or off-screen waves
      for(let i=waves.length-1;i>=0;i--){
        if(waves[i].life<=0 || waves[i].radius > Math.max(w,h)) waves.splice(i,1);
      }
      // spawn new waves periodically (randomized interval)
      spawnTimer++;
      if(spawnTimer > 90 + Math.random()*120){ spawnWave(); spawnTimer=0; }
      t+=1;
      container._raf=requestAnimationFrame(draw);
    }
    // initial wave for immediate visual
    spawnWave();
    draw();
    window.addEventListener('resize',resize);
  }

  return { cinematic, team, intro, satellite, agriculture, disaster, earthquake };
})();
