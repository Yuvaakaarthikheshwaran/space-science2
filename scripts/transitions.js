/* ============================================================
   ORBITAL // CINEMATIC TRANSITIONS
   Each transition type: out-going slide exit + in-coming slide enter.
   Driven by GSAP. Calls OrbitalBG warp/shake where relevant.
   ============================================================ */
const Transitions = (function(){

  function clearTweens(el){
    gsap.killTweensOf(el);
    gsap.set(el, {clearProps:'transform,opacity,filter,clipPath'});
  }

  // Exit animations (old slide leaving)
  const exits = {
    warp(el, cb){
      gsap.to(el, {scale:1.4, opacity:0, filter:'blur(20px)', duration:0.6, ease:'power2.in', onComplete:cb});
    },
    hologram(el, cb){
      gsap.to(el, {opacity:0, scaleY:0.3, scaleX:1.1, filter:'blur(8px) hue-rotate(90deg)', duration:0.5, ease:'power2.in', onComplete:cb});
    },
    datastream(el, cb){
      gsap.to(el, {xPercent:100, opacity:0, filter:'blur(6px)', duration:0.5, ease:'power2.in', onComplete:cb});
    },
    flythrough(el, cb){
      gsap.to(el, {scale:3, opacity:0, filter:'blur(16px)', duration:0.6, ease:'power2.in', onComplete:cb});
    },
    'particle-dissolve'(el, cb){
      gsap.to(el, {opacity:0, scale:1.1, filter:'blur(14px)', duration:0.5, ease:'power2.in', onComplete:cb});
    },
    'light-sweep'(el, cb){
      gsap.to(el, {opacity:0, xPercent:-100, filter:'blur(4px)', duration:0.5, ease:'power2.in', onComplete:cb});
    },
    shake(el, cb){
      gsap.to(el, {opacity:0, y:30, filter:'blur(8px)', duration:0.45, ease:'power2.in', onComplete:cb});
    },
    cloud(el, cb){
      gsap.to(el, {opacity:0, scale:1.15, filter:'blur(18px)', duration:0.55, ease:'power2.in', onComplete:cb});
    },
    spacetime(el, cb){
      gsap.to(el, {opacity:0, scale:0.85, rotation:0.02, filter:'blur(12px) hue-rotate(60deg)', duration:0.6, ease:'power2.in', onComplete:cb});
    },
    'hud-transform'(el, cb){
      gsap.to(el, {opacity:0, scaleY:0.05, scaleX:1.2, filter:'blur(6px)', duration:0.5, ease:'power2.in', onComplete:cb});
    },
    flip(el, cb){
      gsap.to(el, {opacity:0, rotationY:90, duration:0.5, ease:'power2.in', onComplete:cb});
    },
    hyperdrive(el, cb){
      // Streak-out: scale up massively with horizontal stretch + chromatic blur
      gsap.to(el, {scale:6, opacity:0, filter:'blur(24px) brightness(2)', duration:0.5, ease:'power3.in', onComplete:cb});
    },
    'hud-glitch'(el, cb){
      // Glitch: rapid x-jitter + RGB split + scanline tear
      const tl = gsap.timeline({onComplete:cb});
      tl.to(el, {opacity:0.8, x:-12, filter:'hue-rotate(90deg) saturate(3)', duration:0.06})
        .to(el, {x:14, filter:'hue-rotate(-60deg) saturate(2)', duration:0.06})
        .to(el, {x:-8, scaleY:0.96, scaleX:1.04, filter:'blur(4px) hue-rotate(180deg)', duration:0.06})
        .to(el, {opacity:0, x:0, scale:1, filter:'blur(10px)', duration:0.3, ease:'power2.in'});
    }
  };

  // Enter animations (new slide arriving)
  const enters = {
    warp(el){
      gsap.fromTo(el, {scale:1.4, opacity:0, filter:'blur(20px)'},
        {scale:1, opacity:1, filter:'blur(0px)', duration:0.9, ease:'power3.out'});
      if(window.OrbitalBG) OrbitalBG.warp(1);
      if(window.OrbitalAudio) OrbitalAudio.warp();
    },
    hologram(el){
      gsap.fromTo(el, {opacity:0, scaleY:0.3, scaleX:1.1, filter:'blur(8px) hue-rotate(90deg)'},
        {opacity:1, scaleY:1, scaleX:1, filter:'blur(0px) hue-rotate(0deg)', duration:0.8, ease:'power3.out'});
    },
    datastream(el){
      gsap.fromTo(el, {xPercent:-100, opacity:0, filter:'blur(6px)'},
        {xPercent:0, opacity:1, filter:'blur(0px)', duration:0.8, ease:'power3.out'});
    },
    flythrough(el){
      gsap.fromTo(el, {scale:3, opacity:0, filter:'blur(16px)'},
        {scale:1, opacity:1, filter:'blur(0px)', duration:1.0, ease:'power3.out'});
      if(window.OrbitalBG) OrbitalBG.warp(0.6);
    },
    'particle-dissolve'(el){
      gsap.fromTo(el, {opacity:0, scale:1.1, filter:'blur(14px)'},
        {opacity:1, scale:1, filter:'blur(0px)', duration:0.9, ease:'power3.out'});
    },
    'light-sweep'(el){
      gsap.fromTo(el, {opacity:0, xPercent:100, filter:'blur(4px)'},
        {opacity:1, xPercent:0, filter:'blur(0px)', duration:0.8, ease:'power3.out'});
    },
    shake(el){
      gsap.fromTo(el, {opacity:0, y:30, filter:'blur(8px)'},
        {opacity:1, y:0, filter:'blur(0px)', duration:0.7, ease:'power3.out'});
      if(window.OrbitalBG) OrbitalBG.shake(1);
    },
    cloud(el){
      gsap.fromTo(el, {opacity:0, scale:1.15, filter:'blur(18px)'},
        {opacity:1, scale:1, filter:'blur(0px)', duration:0.9, ease:'power3.out'});
    },
    spacetime(el){
      gsap.fromTo(el, {opacity:0, scale:0.85, rotation:0.02, filter:'blur(12px) hue-rotate(60deg)'},
        {opacity:1, scale:1, rotation:0, filter:'blur(0px) hue-rotate(0deg)', duration:1.0, ease:'power3.out'});
      if(window.OrbitalBG) OrbitalBG.warp(0.8);
    },
    'hud-transform'(el){
      gsap.fromTo(el, {opacity:0, scaleY:0.05, scaleX:1.2, filter:'blur(6px)'},
        {opacity:1, scaleY:1, scaleX:1, filter:'blur(0px)', duration:0.8, ease:'power3.out'});
    },
    flip(el){
      gsap.fromTo(el, {opacity:0, rotationY:-90},
        {opacity:1, rotationY:0, duration:0.8, ease:'power3.out'});
    },
    hyperdrive(el){
      // Streak-in from deep space: massive scale-down with starburst blur
      gsap.fromTo(el, {scale:6, opacity:0, filter:'blur(24px) brightness(2)'},
        {scale:1, opacity:1, filter:'blur(0px) brightness(1)', duration:0.8, ease:'power3.out'});
      if(window.OrbitalBG) OrbitalBG.warp(1.5);
      if(window.OrbitalAudio) OrbitalAudio.warp();
    },
    'hud-glitch'(el){
      // Glitch-in: RGB split reassemble
      const tl = gsap.timeline();
      tl.fromTo(el, {opacity:0, x:-20, filter:'blur(8px) hue-rotate(180deg) saturate(3)'},
        {opacity:0.6, x:12, filter:'blur(4px) hue-rotate(-90deg) saturate(2)', duration:0.08})
        .to(el, {x:-6, filter:'blur(2px) hue-rotate(60deg)', duration:0.08})
        .to(el, {opacity:1, x:0, filter:'blur(0px) hue-rotate(0deg) saturate(1)', duration:0.4, ease:'power3.out'});
      if(window.OrbitalBG) OrbitalBG.shake(0.5);
    }
  };

  return {
    play(oldEl, newEl, type, done){
      const exitFn = exits[type] || exits.warp;
      const enterFn = enters[type] || enters.warp;
      if(oldEl){
        exitFn(oldEl, ()=>{
          clearTweens(oldEl);
          if(newEl){ enterFn(newEl); }
          if(done) done();
        });
      } else if(newEl){
        enterFn(newEl);
        if(done) done();
      }
    },
    reset(el){ clearTweens(el); }
  };
})();
