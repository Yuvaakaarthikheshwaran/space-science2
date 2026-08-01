/* ============================================================
   ORBITAL // SLIDE CONFIGURATION
   Master data for all 13 slides. Each slide has:
   id, num, title, icon, accent color, transition type, notes
   ============================================================ */
const SLIDES_CONFIG = [
  {
    id:'cinematic', num:'00', title:'Opening Cinematic', icon:'fa-rocket',
    accent:'#22d3ee', transition:'warp',
    notes:'Hold for 3 seconds on the title. Let the music swell. Then advance to introduce the mission.',
    script:'"Ladies and gentlemen, welcome aboard ORBITAL — Earth-Shield Mission. We are about to take you on a journey through space science and satellite technology. Sit back. The countdown begins now."'
  },
  {
    id:'team', num:'01', title:'Team Members', icon:'fa-users',
    accent:'#3b82f6', transition:'hologram',
    notes:'Introduce each team member and their role in the mission. Click avatars to highlight.',
    script:'"Behind every mission is a crew. Meet our six specialists — Durgasri, our Mission Lead; Harini, Systems Engineer; Vishnu, Data Analyst; Yudith, Comms Specialist; Yuvaakaarthikheshwaran, Payload Officer; and Yuvan Prabhu, Flight Director. Each one a critical node in the chain."'
  },
  {
    id:'intro', num:'02', title:'Introduction', icon:'fa-server',
    accent:'#22d3ee', transition:'datastream',
    notes:'Explain the five operational pillars. This is the mission overview before diving deep.',
    script:'"Our satellite serves five operational pillars: Agriculture, Disaster Management, Earthquake Detection, Weather Forecasting, and a relativistic experiment — Time Dilation. Each pillar is a lens on our planet. Let us walk through them one by one."'
  },
  {
    id:'satellite', num:'03', title:'The Satellite', icon:'fa-satellite',
    accent:'#60a5fa', transition:'flythrough',
    notes:'Describe LEO orbit, sensors (visible/IR/radar), and the data downlink. Activate RED LED on model.',
    script:'"This is our eye in the sky — a Low Earth Orbit platform at 550 kilometres. It carries three sensor arrays: visible spectrum imaging, infrared thermal detection, and synthetic aperture radar. It completes one orbit every 95 minutes, downlinking 1.2 terabytes per pass."'
  },
  {
    id:'agriculture', num:'04', title:'Agriculture', icon:'fa-seedling',
    accent:'#22c55e', transition:'particle-dissolve',
    notes:'Explain NDVI crop health and soil moisture mapping. Activate GREEN LED on model.',
    script:'"Watch the NDVI feed come alive. Green means healthy canopy — high near-infrared reflectance from plant cell structure. Red and brown reveal stress: drought, disease, or pest damage. This is real-time crop intelligence for farmers across the subcontinent."'
  },
  {
    id:'disaster', num:'05', title:'Disaster Management', icon:'fa-burst',
    accent:'#ef4444', transition:'light-sweep',
    notes:'SAR storm penetration and wildfire heat detection. Activate RED LED on model.',
    script:'"When disaster strikes, clouds do not stop us. Synthetic aperture radar sees through storms, smoke, and darkness. The sweep reveals threats — fire hotspots in red, flood zones in blue — only when the radar beam passes over them. Persistence of vision keeps them on screen."'
  },
  {
    id:'earthquake', num:'06', title:'Earthquake Detection', icon:'fa-wave-square',
    accent:'#f59e0b', transition:'shake',
    notes:'InSAR measures 3mm ground shifts. Tectonic tension mapping. Activate AMBER LED on model.',
    script:'"The ground moves in waves. P-waves race out first — fast, low amplitude. S-waves follow — slower, but far more destructive. Watch the magnitude scale: anything above M 6.0 turns red. InSAR lets us measure ground deformation down to three millimetres from orbit."'
  },
  {
    id:'weather', num:'07', title:'Weather Forecast', icon:'fa-cloud-bolt',
    accent:'#38bdf8', transition:'cloud',
    notes:'Atmospheric moisture, wind, temperature profiles. Activate BLUE LED on model.',
    script:'"This is fluid dynamics in motion — six hundred tracers riding a curl-noise wind field. Blue is calm air, green is a gentle breeze, yellow is moderate, red is a storm. We model atmospheric flow the way Windy.com does, but in real time, right here."'
  },
  {
    id:'timedilation', num:'08', title:'Time Dilation', icon:'fa-clock',
    accent:'#a855f7', transition:'spacetime',
    notes:'THE MASTERPIECE. Walk through Special + General Relativity, GPS corrections. Activate PURPLE LED. Take your time here.',
    script:'"This is the masterpiece. Two clocks — one on Earth, one on our satellite. Special Relativity says the moving satellite clock runs slower. General Relativity says the weaker gravity at altitude makes it run faster. The net result? The satellite clock gains 38 microseconds per day. Without correction, GPS would drift 11 kilometres every single day. Einstein was right."'
  },
  {
    id:'future', num:'09', title:'Future Tech', icon:'fa-microchip',
    accent:'#22d3ee', transition:'hud-transform',
    notes:'Quantum satellites, swarm constellations, AI Earth observation, lunar relay networks.',
    script:'"The horizon: quantum-encrypted satellite links, swarm constellations of a thousand micro-sats, AI that classifies imagery on-orbit, and a lunar relay network for deep-space communication. The next decade will redefine what a satellite can be."'
  },
  {
    id:'facts', num:'10', title:'Interesting Facts', icon:'fa-lightbulb',
    accent:'#f59e0b', transition:'flip',
    notes:'Surprising statistics about satellites. Let the numbers land.',
    script:'"Some numbers to consider: over 8,000 active satellites orbit Earth today. The ISS travels at 28,000 kilometres per hour. A GPS satellite circles the globe twice a day. And every single one of them owes its accuracy to a man who imagined riding a beam of light."'
  },
  {
    id:'summary', num:'11', title:'Summary', icon:'fa-clipboard-list',
    accent:'#3b82f6', transition:'datastream',
    notes:'Recap all five pillars and the relativistic insight. Quick run-through.',
    script:'"To summarise: five pillars — agriculture, disaster, seismic, weather, and relativity. One satellite. One planet. One mission to understand it all from above. The data is only as powerful as the questions we ask of it."'
  },
  {
    id:'thanks', num:'12', title:'Thank You', icon:'fa-globe',
    accent:'#22d3ee', transition:'warp',
    notes:'Final quote. Open the floor for questions. Hold the closing shot.',
    script:'"Thank you for flying with ORBITAL. From 550 kilometres up, Earth has no borders — only connections. We now open the floor for your questions. Over and out."'
  }
];
