/* ============================================================
   ORBITAL // WEBGL BACKGROUND ENGINE
   Persistent starfield, nebula, drifting particles, camera drift.
   Reacts to slide changes via window.OrbitalBG API.
   ============================================================ */
(function(){
  const canvas = document.getElementById('webgl-bg');
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030407, 0.0008);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 4000);
  camera.position.set(0, 0, 300);

  // ---- Starfield (3 layers for parallax depth) ----
  function makeStarLayer(count, radius, size, colorHex, depth){
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count*3);
    const col = new Float32Array(count*3);
    const baseCol = new THREE.Color(colorHex);
    for(let i=0;i<count;i++){
      const r = radius * (0.6 + Math.random()*0.4);
      const theta = Math.random()*Math.PI*2;
      const phi = Math.acos(2*Math.random()-1);
      pos[i*3]   = r*Math.sin(phi)*Math.cos(theta);
      pos[i*3+1] = r*Math.sin(phi)*Math.sin(theta);
      pos[i*3+2] = r*Math.cos(phi) - depth;
      const c = baseCol.clone().offsetHSL(0, 0, (Math.random()-0.5)*0.3);
      col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color', new THREE.BufferAttribute(col,3));
    const mat = new THREE.PointsMaterial({
      size, sizeAttenuation:true, vertexColors:true,
      transparent:true, opacity:0.9, depthWrite:false,
      blending:THREE.AdditiveBlending
    });
    return new THREE.Points(geo, mat);
  }
  const starsFar  = makeStarLayer(2500, 1800, 1.4, 0x88aaff, 600);
  const starsMid  = makeStarLayer(1200, 1200, 2.2, 0xffffff, 200);
  const starsNear = makeStarLayer(400,  700,  3.2, 0x22d3ee, 0);
  scene.add(starsFar, starsMid, starsNear);

  // ---- Nebula clouds (sprite-based, additive) ----
  function makeNebulaTexture(){
    const c = document.createElement('canvas'); c.width=c.height=256;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(128,128,0,128,128,128);
    g.addColorStop(0,'rgba(255,255,255,0.5)');
    g.addColorStop(0.4,'rgba(255,255,255,0.15)');
    g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g; ctx.fillRect(0,0,256,256);
    return new THREE.CanvasTexture(c);
  }
  const nebTex = makeNebulaTexture();
  const nebulaColors = [0x1e3a8a, 0x6d28d9, 0x0e7490, 0x7c2d12];
  const nebulae = [];
  for(let i=0;i<8;i++){
    const mat = new THREE.SpriteMaterial({
      map:nebTex, color:nebulaColors[i%nebulaColors.length],
      transparent:true, opacity:0.12, blending:THREE.AdditiveBlending, depthWrite:false
    });
    const s = new THREE.Sprite(mat);
    const r = 600 + Math.random()*400;
    s.position.set((Math.random()-0.5)*1600,(Math.random()-0.5)*1000,-400-Math.random()*800);
    const sc = 400+Math.random()*500; s.scale.set(sc,sc,1);
    s.userData = {drift:(Math.random()-0.5)*0.05, baseOpacity:0.08+Math.random()*0.1};
    nebulae.push(s); scene.add(s);
  }

  // ---- Drifting dust particles (foreground) ----
  const dustGeo = new THREE.BufferGeometry();
  const dustCount = 300;
  const dustPos = new Float32Array(dustCount*3);
  const dustVel = new Float32Array(dustCount*3);
  for(let i=0;i<dustCount;i++){
    dustPos[i*3]=(Math.random()-0.5)*800;
    dustPos[i*3+1]=(Math.random()-0.5)*500;
    dustPos[i*3+2]=(Math.random()-0.5)*400;
    dustVel[i*3]=(Math.random()-0.5)*0.15;
    dustVel[i*3+1]=(Math.random()-0.5)*0.15;
    dustVel[i*3+2]=(Math.random()-0.5)*0.08;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos,3));
  const dustMat = new THREE.PointsMaterial({size:1.5,color:0x66ccff,transparent:true,opacity:0.4,blending:THREE.AdditiveBlending,depthWrite:false});
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // ---- Mouse parallax ----
  const mouse = {x:0,y:0,tx:0,ty:0};
  window.addEventListener('mousemove', e=>{
    mouse.tx = (e.clientX/window.innerWidth - 0.5);
    mouse.ty = (e.clientY/window.innerHeight - 0.5);
  });

  // ---- Public API: slide-driven effects ----
  let targetHue = 0; let currentHue = 0;
  let warpActive = false; let warpStrength = 0;
  let shakeStrength = 0;

  window.OrbitalBG = {
    setAccent(hex){
      const c = new THREE.Color(hex);
      targetHue = c.getHSL({}).h;
      // tint near stars
      starsNear.material.color.lerp(c, 0.3);
    },
    warp(amount=1){ warpActive=true; warpStrength=amount; setTimeout(()=>{warpActive=false;},1200); },
    shake(amount=0.8){ shakeStrength=amount; },
    pulse(){}
  };

  // ---- Resize ----
  window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ---- Animation loop ----
  const clock = new THREE.Clock();
  function animate(){
    const t = clock.getElapsedTime();
    const dt = clock.getDelta();

    // smooth mouse
    mouse.x += (mouse.tx - mouse.x)*0.04;
    mouse.y += (mouse.ty - mouse.y)*0.04;

    // camera drift + parallax + warp
    const baseZ = 300;
    let zTarget = baseZ;
    if(warpActive){
      warpStrength *= 0.94;
      zTarget = baseZ - warpStrength*250;
    }
    camera.position.x += (mouse.x*60 - camera.position.x)*0.03;
    camera.position.y += (-mouse.y*40 - camera.position.y)*0.03;
    camera.position.z += (zTarget - camera.position.z)*0.06;

    // shake
    if(shakeStrength>0.01){
      camera.position.x += (Math.random()-0.5)*shakeStrength*8;
      camera.position.y += (Math.random()-0.5)*shakeStrength*8;
      shakeStrength *= 0.9;
    }
    camera.lookAt(0,0,0);

    // star rotation
    starsFar.rotation.y = t*0.005;
    starsMid.rotation.y = t*0.01;
    starsNear.rotation.y = t*0.02;

    // nebula drift
    nebulae.forEach(n=>{
      n.position.x += n.userData.drift;
      if(n.position.x>900) n.position.x=-900;
      n.material.opacity = n.userData.baseOpacity + Math.sin(t*0.3+n.position.x)*0.03;
    });

    // dust motion
    const dp = dust.geometry.attributes.position.array;
    for(let i=0;i<dustCount;i++){
      dp[i*3]+=dustVel[i*3]; dp[i*3+1]+=dustVel[i*3+1]; dp[i*3+2]+=dustVel[i*3+2];
      if(Math.abs(dp[i*3])>400) dustVel[i*3]*=-1;
      if(Math.abs(dp[i*3+1])>250) dustVel[i*3+1]*=-1;
      if(Math.abs(dp[i*3+2])>200) dustVel[i*3+2]*=-1;
    }
    dust.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();
