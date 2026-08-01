# ORBITAL // Space Science Mission Presentation

An interactive, cinematic space science presentation built with Three.js, GSAP, and the Web Audio API. Designed to feel like NASA Mission Control meets an Apple Keynote.

## Run

```bash
cd space-science-presentation
python3 -m http.server 8765
# open http://localhost:8765
```

## Architecture

```
space-science-presentation/
├── index.html                  # Shell: HUD, sidebar, stage, controls
├── config/
│   └── slides.config.js        # Master data for all 13 slides
├── scripts/
│   ├── webgl-background.js     # Three.js starfield, nebula, dust, camera
│   ├── audio-manager.js        # Procedural ambient + UI sounds (Web Audio)
│   ├── transitions.js          # 11 cinematic transition types (GSAP)
│   ├── slides.js               # Slide builders 00–06
│   ├── slides2.js              # Slide builders 07–12 (incl. Time Dilation)
│   └── app.js                  # Controller: nav, keyboard, autoplay, HUD
└── styles/
    ├── main.css                # Design system, HUD, controls
    └── slides.css              # Per-slide unique layouts
```

## Slides

| # | Slide | Layout |
|---|-------|--------|
| 00 | Opening Cinematic | Centered title, gradient, boot sequence |
| 01 | Team Members | 5-card crew grid with glowing avatars |
| 02 | Introduction | 5-pillar overview grid |
| 03 | Satellite | Split + live canvas orbit visualization |
| 04 | Agriculture | Split + live NDVI heatmap canvas |
| 05 | Disaster | Split + live SAR radar sweep canvas |
| 06 | Earthquake | Split + live InSAR gravity-well grid canvas |
| 07 | Weather | Split + live flow-field particle canvas |
| 08 | Time Dilation | **Masterpiece** — gravity well, orbiting satellite, dual ticking clocks, animated equations, spacetime grid |
| 09 | Future Tech | 4-card tech grid with progress bars |
| 10 | Interesting Facts | 6 animated stat cards |
| 11 | Summary | Numbered recap list |
| 12 | Thank You | Centered closing with rotating globe |

## Features

- **WebGL background**: 3-layer parallax starfield, nebula clouds, drifting dust, mouse-reactive camera
- **11 cinematic transitions**: warp, hologram, datastream, flythrough, particle-dissolve, light-sweep, shake, cloud, spacetime, hud-transform, flip
- **Procedural audio**: ambient drone + UI blips (no external files), toggle on/off
- **Mission timer**: live T+ counter in the HUD
- **Navigation**: sidebar, minimap/progress-map, bottom controls, keyboard (arrows/space/numbers/F/A/N/L/Home/End), touch swipe
- **Autoplay**: 12s per slide, toggle in HUD
- **Fullscreen**, **Laser pointer**, **Presenter notes** per slide
- **Lazy slide building**: slides constructed on first visit for fast boot
- **Responsive**: adapts to tablet/mobile

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| → / Space / PgDn | Next slide |
| ← / PgUp | Previous slide |
| 0–9 | Jump to slide |
| Home / End | First / Last |
| F | Fullscreen |
| A | Autoplay |
| N | Presenter notes |
| L | Laser pointer |
