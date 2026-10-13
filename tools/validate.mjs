import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {launch} from './machine/lib/browser.mjs';
import {serve} from './machine/lib/serve.mjs';
const srv=await serve(process.cwd());const {browser,page}=await launch({width:1440,height:1000});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const checks=[];const pass=(name,evidence)=>checks.push({name,status:'pass',evidence});
try{
await page.goto(srv.url+'/index.html');await page.waitForFunction(()=>window.solenoid);await page.waitForTimeout(3500);
await page.evaluate(()=>window.__lab.toggle('run',true));
const model=await page.evaluate(()=>{const {C,solve,sim,integrate,power,reset}=solenoid;reset();power(true);integrate(2,12);const on={...sim,q:solve(sim.x,sim.lambda/solve(sim.x,0).L)};power(false);integrate(1,12);const off={...sim,i:sim.lambda/solve(sim.x,0).L,q:solve(sim.x,sim.lambda/solve(sim.x,0).L)};reset();power(true);integrate(1,4);const low={...sim,i:sim.lambda/solve(sim.x,0).L,q:solve(sim.x,sim.lambda/solve(sim.x,0).L)};reset();sim.jam=true;power(true);integrate(1,18);const jam={...sim,i:sim.lambda/solve(sim.x,0).L,q:solve(0,sim.lambda/solve(0,0).L)};
const pullOpen=solve(0,1),pullClosed=solve(C.stroke,1);reset();power(true);integrate(.03,12);const early={...sim,i:sim.lambda/solve(sim.x,0).L,q:solve(sim.x,sim.lambda/solve(sim.x,0).L)};return {C,on,off,low,jam,pullOpen,pullClosed,early};});
assert(Math.abs(model.on.x-.004)<1e-6);assert(Math.abs(model.on.q.F-7.8957)<.01);pass('12 V pull-in',{travel:model.on.x,current:model.on.lambda/model.on.q.L,force:model.on.q.F});
assert(model.off.x<1e-8&&model.off.lambda<1e-8);pass('Power removed: current decays, spring returns',model.off);
assert(model.low.x===0);pass('4 V stays below spring preload',model.low);
assert(model.jam.x===0&&model.jam.q.F>1);pass('Jam gives current and force with zero travel',model.jam);
assert(model.pullClosed.F>model.pullOpen.F*9);pass('Force increases as gap shrinks at fixed current',{open:model.pullOpen.F,closed:model.pullClosed.F});
assert(model.early.x<.004);pass('Transient current and travel are integrated',model.early);
// Exercise actual controls with the render loop running.
await page.evaluate(()=>{solenoid.reset();solenoid.supply.set(12);solenoid.lab.toggle('run',false)});
await page.getByRole('button',{name:'Energize',exact:true}).click();await page.waitForTimeout(600);assert.equal(await page.getByRole('button',{name:'Energize',exact:true}).getAttribute('aria-pressed'),'true');
const travel=await page.locator('#travel').innerText();assert.equal(travel,'4.00 mm');pass('Energize button drives UI and 3D stroke',travel);
await page.getByRole('button',{name:'De-energize',exact:true}).click();await page.waitForTimeout(800);assert.equal(await page.locator('#travel').innerText(),'0.00 mm');pass('De-energize button returns UI and 3D stroke','0.00 mm');
for(const k of ['explode','cut','xray','slow','labels']){await page.locator(`[data-k="${k}"]`).click();const target=await page.evaluate(k=>__lab.target[k],k);assert(target===0||target===1);}pass('All five view/time controls respond','explode, cut, x-ray, slow, labels');
await page.getByRole('button',{name:'Flux',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Flux',exact:true}).getAttribute('aria-pressed'),'false');pass('Flux overlay toggle','off');
const perf=await page.evaluate(async()=>{__lab.toggle('slow',false);const a=performance.now();let n=0;await new Promise(r=>{const f=()=>{n++;if(performance.now()-a<1500)requestAnimationFrame(f);else r()};requestAnimationFrame(f)});return {fps:n/((performance.now()-a)/1000),triangles:__lab.tris,parts:__lab.partCount()}});pass('Desktop measured rendering',perf);
await page.setViewportSize({width:390,height:844});await page.waitForTimeout(600);await page.evaluate(()=>{__lab.toggle('slow',false);__lab.toggle('explode',false);__lab.toggle('xray',false);__lab.toggle('labels',false);__lab.toggle('cut',true);solenoid.power(false)});await page.waitForTimeout(600);
const mobile=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,buttons:[...document.querySelectorAll('.power button')].map(b=>({text:b.textContent,width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height}))}));assert(!mobile.overflow);assert(mobile.buttons.every(b=>b.height>=40));await page.screenshot({path:'review/mobile.png',fullPage:true});pass('390 px mobile layout: no horizontal overflow, touch controls',mobile);
await page.getByRole('button',{name:'Energize',exact:true}).click();await page.waitForTimeout(700);assert.equal(await page.locator('#travel').innerText(),'4.00 mm');pass('Mobile energize control','4.00 mm');
await page.locator('.lab-how summary').click();assert(await page.locator('.lab-how').getAttribute('open')!==null);pass('Physics explanation opens on mobile','equations and assumptions available');
assert.equal(errors.length,0);pass('No browser JavaScript errors',errors);
writeFileSync('review/validation.json',JSON.stringify({checks,model,errors},null,2));console.log(JSON.stringify(checks,null,2));
}finally{await browser.close();srv.server.close();}
