# solenoid-actuator-explorer

**DC Solenoid Actuator: From Current to Motion**

Author: **vinayanand3**

**[Open the live interactive simulation](https://vinayanand3.github.io/solenoid-actuator-explorer/)**

Interactive cutaway visualization of a DC solenoid demonstrating electrical current, magnetic flux, plunger motion, spring return, and the relationship between air gap and electromagnetic force.

## Run locally

Open `index.html` in a modern WebGL-capable browser, or serve this directory:

```sh
python3 -m http.server 8080
```

Visit `http://localhost:8080`. No build step or npm runtime dependencies. Everything authored for the experience, including Machine Skill's rendering kit, is inline in `index.html`.

Internet access is required for pinned **Three.js 0.170.0** and its addon ES modules from `cdn.jsdelivr.net`, plus optional typefaces from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`). System fonts provide a fallback. No external models, images, HDRIs, backend, analytics, account, or credentials. A visible loading/help screen remains if the CDN or WebGL fails. This is single-file delivery, not an offline bundle.

## Controls

**Continuous cycle is on by default**, together with slow motion. The supply repeatedly switches ON for 65 ms and OFF for 85 ms of simulation time. At 8% speed, each full pull-in/return cycle takes about 1.88 seconds. Current, flux, magnetic pull, plunger travel and spring compression all follow the existing solver. A DC solenoid under steady power pulls in once and holds; the automatic switching creates the repeated strokes.

- **Continuous cycle**: start or stop repeated power switching. Stopping it removes power and lets the spring return the rod.

- **Energize / De-energize**: stop continuous cycling and select manual steady power or power off, with a simulated flyback diode.
- **DC supply**: 0 to 18 V. Begin at 12 V; try 4 V to see insufficient pull-in force.
- **Cut away (C)**: half-section through closed solids with material section faces.
- **Explode (E)**: separate assemblies; field visualization hides while separated.
- **X-ray (X)**: make outer housing, sleeve and bobbin transparent.
- **Slow (S)**: advance simulation time at 8% speed. All readings use that same time.
- **Labels (L)**: part names and live measurements.
- **Flux**: symbolic closed field loops with directional arrows. These arrows do not represent particles or propagating magnetic material.
- **Pause / Run (Space)**: stop or resume both the motion and automatic power-switching clock.
- **Jam plunger (B)**: mechanically block the rod at zero travel. Click again to reset. Current and force still follow the solver.
- **Reset view**: restore the camera. Drag to orbit; scroll/pinch to zoom.
- **How it is computed**: equations, definitions, assumptions and linked sources.

On a phone the model occupies the upper view and the instruments and controls scroll below it. Mobile validation uses a Chromium viewport, not physical-device testing.

## Geometry and simplified physics

These dimensions and parameters are **illustrative teaching choices**, not dimensions of a commercial solenoid. Geometry is authored in metres.

| Component | Illustrative dimensions/material |
| --- | --- |
| Magnetic housing | Steel, 36 mm OD, 48 mm overall length |
| Winding | 600 copper turns in ten layers of 60, 30 mm active region; visible wire diameter 0.30 mm |
| Bobbin | Insulating polymer, 12.8 mm nominal bore |
| Guide sleeve | Nonmagnetic brass |
| Plunger | Steel, 12 mm diameter, 26 mm length |
| Output rod | Steel, 4 mm diameter, 31 mm length |
| Axial working gap | 4.3 mm released; 0.3 mm pulled in |
| Stroke | 4 mm, dissipative hard stops |
| Return spring | Steel wire; six visible turns; installed length 18 mm, compressed length 14 mm |

The external spring lies between a fixed front seat and a collar on the moving rod. Pulling the rod inward compresses it. Internal magnetic force draws the plunger toward the fixed pole, closing the axial gap. A return path runs through the fixed pole, rear plate, housing, front plate and plunger. The small radial clearance and other magnetic reluctances are lumped into the equivalent gap below.

Constants: N = 600 turns; R = 12 Ω (an assumed effective winding resistance, not derived from the rendered wire); μ₀ = 4π × 10⁻⁷ H/m; A = π(0.006 m)²; equivalent magnetic gap = 1.5 mm; leakage inductance = 4 mH; spring preload = 0.6 N; spring stiffness = 250 N/m; damping = 1.6 N·s/m. Moving mass is computed from plunger and rod mesh volumes at 7850 kg/m³; the small collar and eye are neglected.

For inward travel x, current i, inductance L, flux linkage λ, gap density B and magnetic force F:

```text
g = 0.0043 − x                        0 ≤ x ≤ 0.004 m
L(x) = 0.004 + μ₀ N² A / (g + 0.0015)
i = λ / L(x)
dλ/dt = V − R i
B = μ₀ N i / (g + 0.0015)
F = ½ i² dL/dx = B² A / (2 μ₀)
m ẍ = F − (0.6 + 250 x) − 1.6 ẋ
```

V is the selected supply when ON. When OFF and current remains, V = −0.7 V models a flyback diode; current is constrained to be nonnegative. Integrating flux linkage automatically includes the voltage associated with changing inductance as the plunger moves. A maximum 0.2 ms integration substep drives all instrument readings and motion. Spring preload acts against the released stop at zero travel. The spring wire geometry is illustrative; its stiffness is specified independently.

This is a linear, lumped, one-dimensional model. It omits saturation, hysteresis, eddy currents, temperature-dependent resistance, detailed fringing/leakage distribution, dry friction, contact rebound and external load. Uniform pole-area flux is an approximation, especially at the large released gap. The added equivalent gap regularizes the force and lumps reluctance, rather than fitting a specific measured device. Field loops are symbolic, not finite-element field results. Exploded positions are presentation offsets and never change the solver geometry.

At 12 V, the model approaches **1.00 A**, **4.00 mm travel**, **0.30 mm physical gap**, **0.419 T**, **7.90 N magnetic pull**, **1.60 N spring force**, and **12.0 W copper loss**. At a fixed 1 A, released-gap pull is about **0.76 N**. These are computed operating points, not claims against a product datasheet. The inward stop reacts the excess holding force. Magnetic pull is distinct from usable external output force. A real force/stroke curve would be needed for engineering selection.

## Machine Skill and sources

Installed using the requested Codex command:

```sh
npx skills add AirsupHQ/machine-skill -g -a codex -y
```

The installer placed the skill at `~/.agents/skills/machine`. Source commit used: **537bb665ab03f29ad4f4124b8af76cbfda47a6c9**. The complete SKILL.md, turbofan example, template, geometry/material/runtime APIs, solver guidance, screenshot/recording scripts and relevant rocket example were read. The live rocket-engine reference was inspected before implementation.

- [Machine Skill source](https://github.com/AirsupHQ/machine-skill/tree/537bb665ab03f29ad4f4124b8af76cbfda47a6c9): inlined studio rendering, PBR materials, cap shaders, modes, geometry and deterministic film runtime. MIT license retained in `MACHINE-LICENSE`.
- [Rocket-engine visual reference](https://www.airsup.ai/lab/skill/rocket-engine): studio presentation and procedural detail.
- [Texas Instruments TIDUDF9](https://www.ti.com/lit/pdf/TIDUDF9), §2.3: solenoid current, armature and inductive behavior.
- [MIT 6.013, §9.7 Magnetic Circuits](https://web.mit.edu/6.013_book/www/chapter9/9.7.html): reluctance and air-gap approximation.
- [MIT 6.013, §11.7 Macroscopic Magnetic Forces](https://web.mit.edu/6.013_book/www/chapter11/11.7.html): coenergy force and spring-return transducer.

## Verification and film

`review/` contains whole, cutaway/labels, exploded, two joint close-ups, seven film stills per review round, desktop/mobile screenshots, machine-readable validation and a validation report. Four visual review rounds followed the skill workflow. The retained local tools use the upstream screenshot guard to avoid magenta GPU frames.

For reproducible developer validation only:

```sh
npm install
npx playwright install chromium
npm run validate
node tools/review.mjs 4
```

The local tooling may use a symlink to the Codex bundled packages while developing. `node_modules` is ignored and is never a deployment dependency. For contact sheets, install Pillow and run `python3 tools/contact-sheet.py review/round4`.

The page contains a deterministic 28-second film (`?film=1`). Record it with:

```sh
node tools/machine/record.mjs index.html review/solenoid.mp4 --w 1280 --h 720 --ss 1 --fps 24
```

Requires Node, Playwright/Chromium and ffmpeg. The film is silent; no music is downloaded or licensed. The recorder performs its magenta-frame scan.

## GitHub Pages deployment

The live site is available at [vinayanand3.github.io/solenoid-actuator-explorer](https://vinayanand3.github.io/solenoid-actuator-explorer/).

This project is independent of any steering-system repository. GitHub Pages deploys from the `main` branch at `/ (root)`. Push updates to `main` to redeploy. No build workflow is required.

The authored page has no absolute local paths or dependency on a sibling repository. CDN imports are HTTPS and pinned; the project works beneath the GitHub Pages repository prefix. It needs WebGL and internet access to the documented CDN.
