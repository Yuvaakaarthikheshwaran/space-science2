/* ============================================================
   ORBITAL // AUDIO MANAGER
   Procedurally generated ambient + UI sounds via Web Audio API.
   No external audio files needed. Toggle on/off.
   ============================================================ */
(function(){
  let ctx = null;
  let masterGain = null;
  let enabled = false;
  let ambientNodes = [];

  function init(){
    if(ctx) return;
    ctx = new (window.AudioContext||window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
  }

  function startAmbient(){
    if(!ctx) init();
    if(ctx.state==='suspended') ctx.resume();
    // Deep drone (two detuned oscillators)
    const drone1 = ctx.createOscillator(); drone1.type='sine'; drone1.frequency.value=55;
    const drone2 = ctx.createOscillator(); drone2.type='sine'; drone2.frequency.value=55.4;
    const droneGain = ctx.createGain(); droneGain.gain.value=0.08;
    const droneFilter = ctx.createBiquadFilter(); droneFilter.type='lowpass'; droneFilter.frequency.value=200;
    drone1.connect(droneFilter); drone2.connect(droneFilter);
    droneFilter.connect(droneGain); droneGain.connect(masterGain);
    drone1.start(); drone2.start();

    // Slow LFO on drone filter
    const lfo = ctx.createOscillator(); lfo.frequency.value=0.05;
    const lfoGain = ctx.createGain(); lfoGain.gain.value=80;
    lfo.connect(lfoGain); lfoGain.connect(droneFilter.frequency); lfo.start();

    // High shimmer pad
    const pad = ctx.createOscillator(); pad.type='triangle'; pad.frequency.value=440;
    const padGain = ctx.createGain(); padGain.gain.value=0.012;
    const padFilter = ctx.createBiquadFilter(); padFilter.type='bandpass'; padFilter.frequency.value=1200; padFilter.Q.value=2;
    pad.connect(padFilter); padFilter.connect(padGain); padGain.connect(masterGain); pad.start();

    // Noise wash (filtered white noise)
    const bufferSize = 2*ctx.sampleRate;
    const noiseBuf = ctx.createBuffer(1,bufferSize,ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for(let i=0;i<bufferSize;i++) data[i]=Math.random()*2-1;
    const noise = ctx.createBufferSource(); noise.buffer=noiseBuf; noise.loop=true;
    const noiseFilter = ctx.createBiquadFilter(); noiseFilter.type='lowpass'; noiseFilter.frequency.value=600;
    const noiseGain = ctx.createGain(); noiseGain.gain.value=0.015;
    noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(masterGain); noise.start();

    ambientNodes = [drone1,drone2,lfo,pad,noise];
  }

  // UI sound effects
  function blip(freq=880, dur=0.08, type='sine', vol=0.06){
    if(!enabled||!ctx) return;
    const o = ctx.createOscillator(); o.type=type; o.frequency.value=freq;
    const g = ctx.createGain(); g.gain.setValueAtTime(vol,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur);
    o.connect(g); g.connect(masterGain); o.start(); o.stop(ctx.currentTime+dur);
  }

  window.OrbitalAudio = {
    toggle(){
      init();
      enabled = !enabled;
      if(enabled){
        if(ambientNodes.length===0) startAmbient();
        if(ctx.state==='suspended') ctx.resume();
        gsap.to(masterGain.gain,{value:0.5,duration:1.5});
      } else {
        gsap.to(masterGain.gain,{value:0,duration:0.8});
      }
      return enabled;
    },
    isEnabled(){return enabled;},
    next(){ blip(660,0.06,'sine',0.05); setTimeout(()=>blip(990,0.08,'sine',0.04),60); },
    prev(){ blip(990,0.06,'sine',0.05); setTimeout(()=>blip(660,0.08,'sine',0.04),60); },
    enter(){ blip(523,0.1,'triangle',0.05); setTimeout(()=>blip(784,0.12,'triangle',0.04),80); },
    warp(){ blip(120,0.6,'sawtooth',0.04); },
    click(){ blip(440,0.04,'square',0.03); }
  };
})();
