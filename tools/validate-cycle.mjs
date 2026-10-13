import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {launch} from './machine/lib/browser.mjs';
import {serve} from './machine/lib/serve.mjs';
const round=process.argv[2]||'1';mkdirSync(`review/cycle-round${round}`,{recursive:true});
const srv=await serve(process.cwd());const {browser,page}=await launch({width:1440,height:1000});const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
await page.goto(srv.url+'/index.html');await page.waitForFunction(()=>window.solenoid);await page.waitForTimeout(3500);
assert.equal(await page.locator('#cycle').getAttribute('aria-pressed'),'true');
const samples=[];for(let j=0;j<80;j++){samples.push(await page.evaluate(()=>({x:solenoid.sim.x,on:solenoid.sim.on,t:solenoid.sim.t,position:solenoid.moving.position.x,phase:solenoid.cycle.phase})));await page.waitForTimeout(80);}
const xs=samples.map(s=>s.x);assert(Math.min(...xs)<.0001&&Math.max(...xs)>.0039);
let reversals=0,last=0;for(let j=1;j<xs.length;j++){const dir=Math.sign(xs[j]-xs[j-1]);if(dir&&dir!==last){if(last)reversals++;last=dir;}}
assert(reversals>=6);samples.forEach(s=>assert(Math.abs(s.position-(-.0043+s.x))<1e-8));
await page.locator('[data-k="run"]').click();const frozen=await page.evaluate(()=>({t:solenoid.sim.t,phase:solenoid.cycle.phase,x:solenoid.sim.x}));await page.waitForTimeout(400);assert.deepEqual(await page.evaluate(()=>({t:solenoid.sim.t,phase:solenoid.cycle.phase,x:solenoid.sim.x})),frozen);
await page.locator('[data-k="run"]').click();await page.locator('#energize').click();await page.waitForTimeout(1200);assert.equal(await page.locator('#cycle').getAttribute('aria-pressed'),'false');assert.equal(await page.locator('#travel').innerText(),'4.00 mm');
await page.locator('#deenergize').click();await page.waitForTimeout(1400);assert.equal(await page.locator('#travel').innerText(),'0.00 mm');
await page.locator('#cycle').click();assert.equal(await page.locator('#cycle').getAttribute('aria-pressed'),'true');
// Deterministic rendered snapshots of both phases, using the same coupled solver.
await page.evaluate(()=>{__lab.toggle('run',true);solenoid.reset();solenoid.setCycle(true);__lab.toggle('labels',true);__lab.state.labels=1;__lab.state.cut=1;__lab.render(0);});
await page.evaluate(()=>{solenoid.advance(.064,12);__lab.render(0)});await page.screenshot({path:`review/cycle-round${round}/pull-in.png`});
await page.evaluate(()=>{solenoid.advance(.085,12);__lab.render(0)});await page.screenshot({path:`review/cycle-round${round}/spring-return.png`});
const bounded=await page.evaluate(()=>{solenoid.reset();solenoid.setCycle(true);let min=1,max=-1;for(let k=0;k<5000;k++){solenoid.advance(.002,12);min=Math.min(min,solenoid.sim.x);max=Math.max(max,solenoid.sim.x);if(![solenoid.sim.x,solenoid.sim.lambda,solenoid.sim.v].every(Number.isFinite))throw Error('nonfinite');}return {min,max,t:solenoid.sim.t};});assert.equal(bounded.min,0);assert.equal(bounded.max,.004);
await page.setViewportSize({width:390,height:844});await page.evaluate(()=>{solenoid.reset();solenoid.setCycle(true);__lab.toggle('run',false);__lab.toggle('labels',false)});await page.waitForTimeout(600);assert(await page.locator('#cycle').isVisible());assert(await page.locator('#cycle').evaluate(b=>b.getBoundingClientRect().height>=40));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`review/cycle-round${round}/mobile.png`,fullPage:true});
assert.equal(errors.length,0);const result={status:'passed',reversals,range:[Math.min(...xs),Math.max(...xs)],physicalMeshFollowsState:true,pauseFreezesSwitching:true,manualControlsStopCycling:true,longRun:bounded,mobile:'visible 42 px control, no horizontal overflow',errors,samples};writeFileSync(`review/cycle-round${round}/validation.json`,JSON.stringify(result,null,2));console.log(JSON.stringify({...result,samples:undefined},null,2));
}finally{await browser.close();srv.server.close();}
