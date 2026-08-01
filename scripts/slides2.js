/* ============================================================
   ORBITAL // SLIDES MODULE (Part 2: slides 07-12)
   Includes the Time Dilation masterpiece (slide 08).
   ============================================================ */
const SlidesPart2 = (function(){

  function el(tag, cls, html){
    const e = document.createElement(tag);
    if(cls) e.className = cls;
    if(html!==undefined) e.innerHTML = html;
    return e;
  }

  function stagger(scope, base=0.15, gap=0.08){
    const items = scope.querySelectorAll('.anim-up,.anim-fade,.anim-scale');
    items.forEach((it,i)=>{
      const isUp = it.classList.contains('anim-up');
      const isScale = it.classList.contains('anim-scale');
      const from = isUp ? {opacity:0,y:40} : isScale ? {opacity:0,scale:0.9} : {opacity:0};
      gsap.fromTo(it, from, {opacity:1,y:0,scale:1,duration:0.8,delay:base+i*gap,ease:'power3.out'});
    });
  }

  // ---------- 07. WEATHER ----------
  function weather(){
    const s = el('div','slide slide-weather');
    s.innerHTML = `
      <span class="tagline anim-fade">OPERATIONAL PILLAR 05</span>
      <h2 class="anim-up">Weather Forecasting</h2>
      <div class="weather-layout">
        <div class="weather-left">
          <div class="info-card glass anim-up">
            <h3><i class="fa-solid fa-wind" style="color:#38bdf8"></i> Atmospheric Scan</h3>
            <p>Satellites monitor global moisture and wind patterns. This raw data is fed into ground-based computers to predict tomorrow's weather.</p>
          </div>
          <div class="info-card glass anim-up">
            <h3><i class="fa-solid fa-temperature-arrow-up" style="color:#38bdf8"></i> Temperature Profiles</h3>
            <p>By measuring sea and air temperatures, space agencies forecast hurricane paths and provide early warnings for extreme heat.</p>
          </div>
          <div class="led-sync anim-up">
            <div class="led-dot" style="background:#3b82f6;box-shadow:0 0 16px #3b82f6;"></div>
            <div class="led-info"><h4 style="color:#38bdf8">MODEL LINK: WEATHER</h4><p>Activate the BLUE LED on the physical model.</p></div>
          </div>
        </div>
        <div class="weather-right anim-scale">
          <div class="weather-viz" id="weather-viz"></div>
        </div>
      </div>
    `;
    s.animateIn = ()=>{
      stagger(s,0.2,0.1);
      buildWeatherViz(s.querySelector('#weather-viz'));
    };
    return s;
  }

  function buildWeatherViz(container){
    if(!container) return;
    container.innerHTML = `<canvas class="weather-canvas"></canvas><div class="wviz-tag">FLUID DYNAMICS // LIVE WIND FIELD</div>`;
    const cv = container.querySelector('canvas');
    const ctx2 = cv.getContext('2d');
    const tagEl = container.querySelector('.wviz-tag');
    function resize(){cv.width=container.clientWidth*2;cv.height=container.clientHeight*2;cv.style.width=container.clientWidth+'px';cv.style.height=container.clientHeight+'px';}
    resize();
    let t=0;

    // ===== Value noise for flow field (curl-noise-like) =====
    const NG = 32;
    function rand(s){ const x=Math.sin(s*12.9898)*43758.5453; return x-Math.floor(x); }
    let ngrad = [];
    function regenNoise(off){
      ngrad=[];
      for(let i=0;i<=NG;i++){ ngrad[i]=[]; for(let j=0;j<=NG;j++) ngrad[i][j]=rand(i*131+j*17+off)*2-1; }
    }
    regenNoise(0);
    function smoothstep(x){ return x*x*(3-2*x); }
    function noise(u,v){
      const x=u*NG, y=v*NG;
      const x0=Math.floor(x), y0=Math.floor(y);
      const x1=Math.min(x0+1,NG), y1=Math.min(y0+1,NG);
      const fx=smoothstep(x-x0), fy=smoothstep(y-y0);
      const a=ngrad[x0][y0], b=ngrad[x1][y0], c=ngrad[x0][y1], d=ngrad[x1][y1];
      return (a*(1-fx)+b*fx)*(1-fy)+(c*(1-fx)+d*fx)*fy;
    }
    // Flow field: angle derived from noise (curl-noise approximation)
    // Wind speed varies spatially; we also add a global prevailing drift.
    function flowAngle(nx, ny, time){
      const n1 = noise(nx, ny);
      const n2 = noise(nx+0.5+time*0.0003, ny+0.5+time*0.0002);
      // curl: angle = atan2(dN/dy, -dN/dx) approximated by offset noise samples
      const eps = 0.02;
      const dndx = noise(nx+eps, ny) - noise(nx-eps, ny);
      const dndy = noise(nx, ny+eps) - noise(nx, ny-eps);
      return Math.atan2(dndy, -dndx) + n2*0.5; // add turbulence
    }
    function flowSpeed(nx, ny, time){
      // speed in px/frame, varies 1.5 to 5
      return 1.5 + (noise(nx+time*0.0001, ny-time*0.0001)+1)*1.75;
    }

    // ===== Particle system (wind tracers) =====
    const NUM = 600;
    const parts = [];
    function spawn(p){
      p.x = Math.random()*cv.width;
      p.y = Math.random()*cv.height;
      p.px = p.x; p.py = p.y;
      p.life = 0;
      p.maxLife = 60 + Math.random()*120;
      p.speedMul = 0.7 + Math.random()*0.6;
    }
    for(let i=0;i<NUM;i++){ const p={}; spawn(p); parts.push(p); }

    // Wind speed color ramp (Windy.com style): blue=calm, green=light, yellow=moderate, red=strong
    function speedColor(s){
      // s in px/frame ~ 1.5..5
      const n = Math.max(0, Math.min(1, (s-1.5)/3.5));
      if(n<0.25){ // blue -> cyan
        const t=n/0.25; return `rgba(${Math.round(30+t*0)},${Math.round(80+t*120)},${Math.round(200+t*55)},0.7)`;
      } else if(n<0.5){ // cyan -> green
        const t=(n-0.25)/0.25; return `rgba(${Math.round(30+t*0)},${Math.round(200+t*20)},${Math.round(255-t*155)},0.7)`;
      } else if(n<0.75){ // green -> yellow
        const t=(n-0.5)/0.25; return `rgba(${Math.round(30+t*220)},${Math.round(220-t*20)},${Math.round(100-t*60)},0.75)`;
      } else { // yellow -> red
        const t=(n-0.75)/0.25; return `rgba(${Math.round(250+t*5)},${Math.round(200-t*130)},${Math.round(40-t*20)},0.8)`;
      }
    }

    let frameCount = 0;
    function draw(){
      const w=cv.width,h=cv.height;
      // Fade trails (low alpha = long streamlines)
      ctx2.fillStyle='rgba(3,4,7,0.05)'; ctx2.fillRect(0,0,w,h);
      // Evolve noise field slowly
      if(frameCount % 120 === 0){ regenNoise(frameCount*0.7); }
      ctx2.lineWidth = 1.2;
      ctx2.lineCap = 'round';
      parts.forEach(p=>{
        const nx = p.x/w, ny = p.y/h;
        const ang = flowAngle(nx, ny, t);
        const spd = flowSpeed(nx, ny, t) * p.speedMul;
        p.px = p.x; p.py = p.y;
        p.x += Math.cos(ang)*spd;
        p.y += Math.sin(ang)*spd;
        p.life++;
        // Respawn if out of bounds or expired
        if(p.x<0||p.x>w||p.y<0||p.y>h||p.life>p.maxLife){ spawn(p); return; }
        // Draw streamline segment colored by speed
        ctx2.strokeStyle = speedColor(spd);
        ctx2.beginPath(); ctx2.moveTo(p.px, p.py); ctx2.lineTo(p.x, p.y); ctx2.stroke();
      });
      // Update HUD with dominant wind info
      if(tagEl && frameCount % 30 === 0){
        const avgSpd = (2.5 + Math.sin(t*0.005)*1.2).toFixed(1);
        tagEl.textContent = `FLUID DYNAMICS // WIND ${avgSpd} m/s // ${NUM} TRACERS`;
      }
      frameCount++;
      t+=1;
      container._raf=requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize',resize);
  }

  // ---------- 08. TIME DILATION (MASTERPIECE) ----------
  function timedilation(){
    const s = el('div','slide slide-timedilation');
    s.innerHTML = `
      <span class="tagline anim-fade">OPERATIONAL PILLAR 06 // MASTERPIECE</span>
      <h2 class="anim-up">Relativistic Time Dilation</h2>
      <div class="td-layout">
        <div class="td-viz-wrap anim-scale">
          <canvas class="td-canvas" id="td-canvas"></canvas>
          <div class="td-overlay">
            <div class="td-readout" id="td-readout">
              <div class="td-row"><span class="td-label">EARTH CLOCK</span><span class="td-val" id="td-earth">00:00.00</span></div>
              <div class="td-row"><span class="td-label">SATELLITE CLOCK</span><span class="td-val" id="td-sat">00:00.00</span></div>
              <div class="td-row"><span class="td-label">DRIFT (μs/day)</span><span class="td-val" id="td-drift">+38.6</span></div>
            </div>
            <div class="td-eq" id="td-eq">Δt' = Δt / √(1 − v²/c²)</div>
          </div>
        </div>
        <div class="td-info">
          <div class="info-card glass anim-up">
            <h3><i class="fa-solid fa-clock-rotate-left" style="color:#a855f7"></i> The Physics of Time</h3>
            <p>Satellites experience two competing relativistic forces. Because they move incredibly fast, their time <b style="color:#22d3ee">slows down</b> (Special Relativity). Because they are further from Earth's gravity, their time <b style="color:#f59e0b">speeds up</b> (General Relativity).</p>
          </div>
          <div class="info-card glass anim-up">
            <h3><i class="fa-solid fa-location-crosshairs" style="color:#a855f7"></i> Real-World Impact</h3>
            <p>These forces cause satellite clocks to tick at different rates than clocks on Earth. Systems like GPS must constantly correct for these microsecond shifts; without this math, global navigation would fail within minutes.</p>
          </div>
          <div class="led-sync anim-up">
            <div class="led-dot" style="background:#a855f7;box-shadow:0 0 16px #a855f7;"></div>
            <div class="led-info"><h4 style="color:#a855f7">MODEL LINK: TIME DILATION</h4><p>Activate the PURPLE LED on the physical model.</p></div>
          </div>
        </div>
      </div>
    `;
    s.animateIn = ()=>{
      stagger(s,0.2,0.1);
      buildTimeDilation(s.querySelector('#td-canvas'), s);
    };
    return s;
  }

  function buildTimeDilation(canvas, slide){
    if(!canvas) return;
    const ctx2 = canvas.getContext('2d');
    function resize(){
      const p = canvas.parentElement;
      canvas.width = p.clientWidth*2; canvas.height = p.clientHeight*2;
      canvas.style.width=p.clientWidth+'px'; canvas.style.height=p.clientHeight+'px';
    }
    resize();
    window.addEventListener('resize',resize);

    // ===== PHYSICS CONSTANTS (SI units) =====
    const c = 299792458;            // speed of light m/s
    const G = 6.674e-11;            // gravitational constant
    const M = 5.972e24;             // Earth mass kg
    const R_earth = 6.371e6;        // Earth radius m
    const R_sat = 26560e3;          // GPS orbital radius m (~20,200 km altitude)
    const v_sat = 3874;             // GPS orbital velocity m/s
    // Gravitational potential at surface and at satellite
    const phi_earth = -G*M/R_earth; // gravitational potential at surface
    const phi_sat = -G*M/R_sat;     // gravitational potential at orbit
    // Gravitational time dilation factor (GR): dτ/dt = sqrt(1 + 2Φ/c²)
    const gr_earth = Math.sqrt(1 + 2*phi_earth/(c*c)); // ~0.999999999305
    const gr_sat = Math.sqrt(1 + 2*phi_sat/(c*c));     // ~0.999999999674
    // Kinematic time dilation factor (SR): dτ/dt = sqrt(1 - v²/c²)
    const sr_sat = Math.sqrt(1 - (v_sat*v_sat)/(c*c)); // ~0.999999999916
    // Net rate for satellite relative to coordinate (far) time:
    //   sat proper time = coordinate * gr_sat * sr_sat
    //   earth proper time = coordinate * gr_earth
    // Net satellite vs earth: sat runs FASTER (weaker gravity dominates over velocity slowdown)
    const rate_earth = gr_earth;
    const rate_sat = gr_sat * sr_sat;
    // Per-day drift in microseconds (should be ~+38 μs/day for GPS)
    const driftPerDay_us = (rate_sat - rate_earth) * 86400 * 1e6;
    // For visualization we exaggerate the rate difference so clocks visibly diverge
    const VIS_SCALE = 4000; // exaggeration factor for visible divergence

    let t=0;
    let earthTime=0, satTime=0;
    const earthEl = slide.querySelector('#td-earth');
    const satEl = slide.querySelector('#td-sat');
    const driftEl = slide.querySelector('#td-drift');
    const eqEl = slide.querySelector('#td-eq');

    const equations = [
      'SR:  Δτ = Δt·√(1 − v²/c²)   // kinematic slowdown',
      'GR:  Δτ = Δt·√(1 + 2Φ/c²)   // gravitational slowdown',
      'v_sat = 3,874 m/s   // GPS orbital velocity',
      'Φ_earth = −6.25e7 J/kg   // surface potential',
      'Φ_sat = −1.50e7 J/kg   // orbital potential (weaker)',
      'Net: sat FASTER by ≈ 38 μs/day   // GR > SR',
      'GPS must correct 38 μs/day or drift 11 km/day'
    ];
    let eqIdx=0;
    setInterval(()=>{
      eqIdx=(eqIdx+1)%equations.length;
      if(eqEl) gsap.fromTo(eqEl,{opacity:0,y:8},{opacity:1,y:0,duration:0.5,ease:'power2.out',onStart:()=>{eqEl.textContent=equations[eqIdx];}});
    },2800);

    function fmt(v){
      const m=Math.floor(v/60); const sec=(v%60).toFixed(2);
      return String(m).padStart(2,'0')+':'+String(sec).padStart(5,'0');
    }

    function draw(){
      const w=canvas.width,h=canvas.height;
      ctx2.clearRect(0,0,w,h);
      const cx=w*0.42, cy=h/2;

      // ---- Spacetime grid (gravity well) ----
      ctx2.strokeStyle='rgba(168,85,247,0.18)'; ctx2.lineWidth=1;
      const gridStep=40;
      for(let gx=-6;gx<=6;gx++){
        ctx2.beginPath();
        for(let gy=-6;gy<=6;gy++){
          const x=cx+gx*gridStep, y=cy+gy*gridStep;
          const dx=gx*gridStep, dy=gy*gridStep;
          const d=Math.sqrt(dx*dx+dy*dy);
          const well=Math.min(120, 6000/(d+40));
          const py=y+well;
          if(gy===-6) ctx2.moveTo(x,py); else ctx2.lineTo(x,py);
        }
        ctx2.stroke();
      }
      for(let gy=-6;gy<=6;gy++){
        ctx2.beginPath();
        for(let gx=-6;gx<=6;gx++){
          const x=cx+gx*gridStep, y=cy+gy*gridStep;
          const dx=gx*gridStep, dy=gy*gridStep;
          const d=Math.sqrt(dx*dx+dy*dy);
          const well=Math.min(120, 6000/(d+40));
          const py=y+well;
          if(gx===-6) ctx2.moveTo(x,py); else ctx2.lineTo(x,py);
        }
        ctx2.stroke();
      }

      // ---- Earth (at gravity well center) ----
      const earthR=55;
      const eg=ctx2.createRadialGradient(cx-15,cy-15,5,cx,cy,earthR);
      eg.addColorStop(0,'#3b82f6'); eg.addColorStop(0.6,'#1e3a8a'); eg.addColorStop(1,'#0b1220');
      ctx2.fillStyle=eg; ctx2.beginPath(); ctx2.arc(cx,cy,earthR,0,Math.PI*2); ctx2.fill();
      ctx2.strokeStyle='rgba(34,211,238,0.6)'; ctx2.lineWidth=2;
      ctx2.beginPath(); ctx2.arc(cx,cy,earthR+6,t*0.02,t*0.02+Math.PI*1.4); ctx2.stroke();
      ctx2.strokeStyle='rgba(245,158,11,0.5)'; ctx2.lineWidth=2;
      ctx2.beginPath();
      for(let i=0;i<60;i++){
        const a=-Math.PI/2; const r=earthR+i*4;
        const x=cx+Math.cos(a)*r; const y=cy+Math.sin(a)*r - Math.min(120,6000/(r+40));
        if(i===0) ctx2.moveTo(x,y); else ctx2.lineTo(x,y);
      }
      ctx2.stroke();

      // ---- Satellite orbiting ----
      const orbitR=200;
      const satAng=t*0.015;
      const sx=cx+Math.cos(satAng)*orbitR;
      const sy=cy+Math.sin(satAng)*orbitR*0.5 - Math.min(120,6000/(orbitR+40));
      ctx2.strokeStyle='rgba(168,85,247,0.3)'; ctx2.setLineDash([4,6]); ctx2.lineWidth=1;
      ctx2.beginPath();
      for(let a=0;a<=Math.PI*2+0.1;a+=0.1){
        const x=cx+Math.cos(a)*orbitR; const y=cy+Math.sin(a)*orbitR*0.5 - Math.min(120,6000/(orbitR+40));
        if(a===0) ctx2.moveTo(x,y); else ctx2.lineTo(x,y);
      }
      ctx2.stroke(); ctx2.setLineDash([]);
      ctx2.fillStyle='#a855f7'; ctx2.shadowColor='#a855f7'; ctx2.shadowBlur=20;
      ctx2.beginPath(); ctx2.arc(sx,sy,7,0,Math.PI*2); ctx2.fill();
      ctx2.shadowBlur=0;
      ctx2.strokeStyle='rgba(34,211,238,0.6)'; ctx2.lineWidth=2;
      ctx2.beginPath();
      const beamAng=satAng+Math.PI/2;
      for(let i=0;i<40;i++){
        const r=i*5; const x=sx+Math.cos(beamAng)*r; const y=sy+Math.sin(beamAng)*r;
        if(i===0) ctx2.moveTo(x,y); else ctx2.lineTo(x,y);
      }
      ctx2.stroke();

      // ---- Clocks (two ticking clocks) ----
      drawClock(ctx2, w*0.15, h*0.85, 40, earthTime, '#22d3ee', 'EARTH');
      drawClock(ctx2, w*0.85, h*0.85, 40, satTime, '#a855f7', 'SAT');

      // ---- Time update using REAL physics rates (exaggerated for visibility) ----
      const dt = 1/60;
      earthTime += dt * rate_earth * VIS_SCALE; // earth proper time (scaled)
      satTime += dt * rate_sat * VIS_SCALE;     // sat proper time (scaled)
      if(earthEl) earthEl.textContent = fmt(earthTime);
      if(satEl) satEl.textContent = fmt(satTime);
      // Drift shown in microseconds, scaled to represent real per-day discrepancy
      const drift = ((satTime-earthTime) * (driftPerDay_us / (86400 * (rate_sat-rate_earth) * VIS_SCALE)));
      if(driftEl) driftEl.textContent = '+'+drift.toFixed(1)+' μs';

      t+=1;
      canvas._raf = requestAnimationFrame(draw);
    }

    function drawClock(c,x,y,r,time,color,label){
      c.save();
      c.translate(x,y);
      c.strokeStyle=color; c.lineWidth=2;
      c.beginPath(); c.arc(0,0,r,0,Math.PI*2); c.stroke();
      c.fillStyle='rgba(3,4,7,0.6)'; c.beginPath(); c.arc(0,0,r-2,0,Math.PI*2); c.fill();
      for(let i=0;i<12;i++){
        const a=i/12*Math.PI*2;
        c.beginPath(); c.moveTo(Math.cos(a)*(r-6),Math.sin(a)*(r-6)); c.lineTo(Math.cos(a)*(r-2),Math.sin(a)*(r-2)); c.stroke();
      }
      const sec = (time%60)/60*Math.PI*2;
      c.strokeStyle=color; c.lineWidth=2;
      c.beginPath(); c.moveTo(0,0); c.lineTo(Math.cos(sec-Math.PI/2)*(r-8),Math.sin(sec-Math.PI/2)*(r-8)); c.stroke();
      c.fillStyle=color; c.font='12px JetBrains Mono'; c.textAlign='center';
      c.fillText(label,0,r+18);
      c.restore();
    }

    draw();
  }

  // ---------- 09. FUTURE TECH ----------
  function future(){
    const techs = [
      {t:'Quantum Satellites',d:'Unbreakable encryption via entanglement across continents.',i:'fa-atom',c:'#a855f7'},
      {t:'Swarm Constellations',d:'Thousands of micro-sats forming a planetary mesh network.',i:'fa-network-wired',c:'#22d3ee'},
      {t:'AI Earth Observation',d:'Onboard neural nets analyzing imagery before downlink.',i:'fa-brain',c:'#3b82f6'},
      {t:'Lunar Relay Network',d:'Communication bridges extending to the Moon and beyond.',i:'fa-moon',c:'#f59e0b'}
    ];
    const s = el('div','slide slide-future');
    s.innerHTML = `
      <span class="tagline anim-fade">NEXT-GENERATION SYSTEMS</span>
      <h2 class="anim-up">Future Space Technologies</h2>
      <p class="lead anim-up" style="margin-bottom:36px;">The next decade of orbital science — where physics, AI, and engineering converge above our atmosphere.</p>
      <div class="future-grid"></div>
    `;
    const grid = s.querySelector('.future-grid');
    techs.forEach((t,idx)=>{
      const card = el('div','future-card anim-scale');
      card.innerHTML = `
        <div class="future-num">0${idx+1}</div>
        <div class="icon-orb" style="color:${t.c};border-color:${t.c}55;background:radial-gradient(circle at 30% 30%,${t.c}33,${t.c}08)"><i class="fa-solid ${t.i}"></i></div>
        <h3>${t.t}</h3>
        <p>${t.d}</p>
        <div class="future-bar"><span style="width:${30+idx*20}%"></span></div>
      `;
      grid.appendChild(card);
    });
    s.animateIn = ()=>{ stagger(s,0.2,0.1); };
    return s;
  }

  // ---------- 10. INTERESTING FACTS ----------
  function facts(){
    const factsData = [
      {v:'7,000+',l:'Active satellites orbiting Earth',c:'#22d3ee'},
      {v:'3 mm',l:'Smallest ground shift InSAR can detect',c:'#f59e0b'},
      {v:'38 μs',l:'Daily GPS relativistic clock correction',c:'#a855f7'},
      {v:'27,000 km/h',l:'Speed of a LEO satellite',c:'#22c55e'},
      {v:'500 km',l:'Typical altitude of Earth observation sats',c:'#3b82f6'},
      {v:'90 min',l:'Time for one full orbit of Earth',c:'#ef4444'}
    ];
    const s = el('div','slide slide-facts');
    s.innerHTML = `
      <span class="tagline anim-fade">MISSION DATA</span>
      <h2 class="anim-up">Interesting Facts</h2>
      <div class="facts-grid"></div>
    `;
    const grid = s.querySelector('.facts-grid');
    factsData.forEach(f=>{
      const card = el('div','fact-card anim-scale');
      card.innerHTML = `
        <div class="fact-value" style="background:linear-gradient(180deg,#fff,${f.c});-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">${f.v}</div>
        <div class="fact-label">${f.l}</div>
      `;
      grid.appendChild(card);
    });
    s.animateIn = ()=>{
      stagger(s,0.2,0.08);
      // count-up effect on values
      grid.querySelectorAll('.fact-card').forEach((c,i)=>{
        gsap.from(c.querySelector('.fact-value'),{y:20,opacity:0,duration:0.6,delay:0.3+i*0.08,ease:'power3.out'});
      });
    };
    return s;
  }

  // ---------- 11. SUMMARY ----------
  function summary(){
    const items = [
      {n:'01',t:'Satellite',d:'Orbital observation platform',c:'#60a5fa'},
      {n:'02',t:'Agriculture',d:'NDVI crop & water management',c:'#22c55e'},
      {n:'03',t:'Disaster',d:'SAR storm & wildfire response',c:'#ef4444'},
      {n:'04',t:'Seismic',d:'InSAR 3mm deformation tracking',c:'#f59e0b'},
      {n:'05',t:'Weather',d:'Atmospheric predictive modeling',c:'#38bdf8'},
      {n:'06',t:'Relativity',d:'GPS time-dilation corrections',c:'#a855f7'}
    ];
    const s = el('div','slide slide-summary');
    s.innerHTML = `
      <span class="tagline anim-fade">MISSION RECAP</span>
      <h2 class="anim-up">Summary</h2>
      <p class="lead anim-up" style="margin-bottom:32px;">Six pillars of orbital science — from crop health to the curvature of spacetime — working together to understand and protect our planet.</p>
      <div class="summary-list"></div>
    `;
    const list = s.querySelector('.summary-list');
    items.forEach(it=>{
      const row = el('div','summary-row anim-up');
      row.innerHTML = `
        <div class="summary-num" style="color:${it.c}">${it.n}</div>
        <div class="summary-bar" style="background:linear-gradient(90deg,${it.c},transparent)"></div>
        <div class="summary-content"><h3>${it.t}</h3><p>${it.d}</p></div>
      `;
      list.appendChild(row);
    });
    s.animateIn = ()=>{ stagger(s,0.2,0.08); };
    return s;
  }

  // ---------- 12. THANK YOU ----------
  function thanks(){
    const s = el('div','slide slide-thanks');
    s.innerHTML = `
      <div class="thanks-center">
        <div class="thanks-orb anim-scale"><i class="fa-solid fa-globe"></i></div>
        <h1 class="anim-up">Transmission Complete</h1>
        <p class="thanks-quote anim-up">"From Space, we gain the perspective to protect our only home."</p>
        <div class="thanks-line anim-fade"></div>
        <div class="thanks-cta anim-fade">ANY QUESTIONS?</div>
        <div class="thanks-sig anim-fade">ORBITAL // EARTH-SHIELD PROTOCOL // LEO-SYNC</div>
      </div>
    `;
    s.animateIn = ()=>{
      stagger(s,0.3,0.12);
      const orb = s.querySelector('.thanks-orb');
      gsap.to(orb,{rotation:360,duration:40,ease:'none',repeat:-1});
    };
    return s;
  }

  return { weather, timedilation, future, facts, summary, thanks };
})();
