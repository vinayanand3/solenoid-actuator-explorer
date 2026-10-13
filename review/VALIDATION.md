# Local validation

Status: implementation complete; local browser and solver checks passed. No GitHub repository created, commits pushed, pull request opened, or site published.

## Automated checks

15 checks passed in `validation.json`:

- 12 V pulls in to the 4 mm inward stop: 1.00 A and 7.8957 N magnetic pull.
- Power removed: current decays to zero and spring returns to the released stop.
- 4 V gives 0.333 A and no travel because magnetic pull is below preload.
- Jam at 18 V produces 1.50 A and 1.711 N at the released gap with zero travel.
- At fixed 1 A, closing the gap increases computed pull from 0.7605 N to 7.8957 N.
- A 30 ms transient is intermediate travel (1.518 mm), not an instantaneous animation.
- Actual Energize and De-energize buttons update current, travel and the 3D mechanism.
- Explode, cutaway, x-ray, slow motion, labels and flux controls respond.
- Chromium at 390 × 844: no horizontal page overflow; power controls are 42 px high; energize and the physics disclosure work.
- No JavaScript page errors.
- Final 1440 × 1000 rendering: 37.25 fps in the interaction test; 44 fps from the upstream screenshot script. 121,672 triangles, 18 materials. Part count 629 includes 600 represented wire turns, not 629 separate components.

## Four visual rounds

Each round includes whole view, cutaway with labels, exploded, spring/collar joint, pole/gap close-up and seven film stills (1, 4, 8, 12, 17, 22, 26 seconds). Images were inspected individually through full-size selected views and contact sheets showing every frame.

1. Initial review: excessive bloom and camera crop identified. Reduced bloom, adjusted exposure and widened camera framing.
2. Assembly and magnetic-path review: checked whole/exploded geometry and film states; found the quarter-cut obscured the axial working region. Switched to a half-section and separated the winding turns. This round spans the geometry revision between interactive and film captures.
3. Revised half-section: verified coil and return mechanism; identified tight close-ups and mobile framing. Corrected camera scale, restored the mobile physics panel hidden by upstream CSS, and added a live gap bracket.
4. Solid section/joint review: added real profile-section geometry for major coaxial solids to preserve tube bores. Checked the assembled, cut and exploded views, both joints and all seven film beats. Then reduced redundant winding tessellation and AO/shadow sampling, and captured the final desktop/mobile previews.

The real profile half-section meshes switch in near completion of the cut transition; the upstream clipping/cap shader handles the animated transition and smaller details. Outer shell and coil receive a section; plunger displacement and spring length continue to follow the same solver. Exploded mode suppresses field loops because it is an assembly explanation, not a changed magnetic circuit.

The model is an illustrative actuator, so there is no claimed agreement with a commercial force/stroke curve. Assumptions, units, equations and source links appear in the page and README.

## Limits

Verified on desktop Chromium and a simulated mobile viewport. No physical phone, Safari or Firefox test was performed. FPS depends on GPU, resolution and other active renderers. Network access is needed for Three.js and optional Google Fonts. The single HTML contains all authored geometry, simulation, styles, explanations and Machine Skill runtime.

## File changes

Created an independent project directory. Added `index.html` (single-file experience), `README.md` (usage, model, sources and deployment), `skill-provenance.json` (source commit and hashes), `LICENSE` / `MACHINE-LICENSE`, `.nojekyll`, `.gitignore`, `package.json` (developer tooling only), local review and validation helpers, upstream recording/screenshot tools and review artifacts. `github-pages-ready.zip` contains the final page and deployment documentation. No changes were made outside the new project except the explicitly requested global skill installation.

## Recorded film

`solenoid.mp4`: 28.000 s, 1280 × 720, 24 fps, 672 frames. Recorded with the upstream deterministic recorder. Its final `pinkscan` completed cleanly. A six-frame contact sheet extracted from the encoded video (`film-review.jpg`) was inspected to confirm the assembled opening, energized cutaway, exploded assembly, de-energized return and reset states. Silent video, no external music dependency.

## Continuous cycling update

Continuous cycle and slow motion now start enabled on the interactive page. Automatic supply switching uses 65 ms ON and 85 ms OFF of simulation time. At 8% speed the full sequence repeats approximately every 1.88 seconds. It uses the coupled electrical/magnetic/mechanical solver; no arbitrary positional animation was added. Manual power controls disable automatic cycling, and Pause stops both physics and the cycle timer. Film mode retains its original narrated sequence of manual power events.

`tools/validate-cycle.mjs` passed: 7 observed direction reversals, full 0–4 mm travel, rendered plunger position matching the solver, pause freezing both switching and travel, manual hold and release, finite bounded state over 10 simulation seconds, and a visible 42 px mobile cycle control without horizontal overflow. No browser JavaScript errors. Desktop pull-in, spring-return and full mobile screenshots were rendered and inspected in `review/cycle-round1/`. All 15 existing regression checks also passed.
