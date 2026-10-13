import {launch} from './machine/lib/browser.mjs';
import {serve} from './machine/lib/serve.mjs';
import {resolve} from 'node:path';
import {mkdirSync} from 'node:fs';
const round=process.argv[2]||'1', root=resolve('.');mkdirSync(`review/round${round}`,{recursive:true});
const srv=await serve(root);const {browser,page}=await launch({width:1440,height:1000});
await page.goto(srv.url+'/index.html');await page.waitForFunction(()=>window.solenoid);await page.waitForTimeout(3500);
const views=[['whole',"solenoid.power(false);lab.toggle('cut',false);lab.toggle('labels',false);lab.toggle('explode',false);lab.setView({az:-28,el:20,dist:2.65,target:[-.012,.027,0],frameX:-.18})"],['cut-labels',"solenoid.power(true);lab.toggle('cut',true);lab.toggle('labels',true)"],['exploded',"lab.toggle('cut',false);lab.toggle('labels',false);lab.toggle('explode',true);lab.setView({az:-18,el:23,dist:3.25})"],['spring-joint',"lab.toggle('explode',false);lab.toggle('cut',false);lab.setView({az:-45,el:12,dist:1.6,target:[-.035,.030,0]})"],['pole-gap',"solenoid.power(false);lab.toggle('cut',true);lab.setView({az:20,el:18,dist:1.6,target:[.010,.030,0]})"]];
for(const [name,js] of views){await page.evaluate(code=>{const lab=window.__lab,solenoid=window.solenoid;eval(code)},js);await page.waitForTimeout(1500);await page.screenshot({path:`review/round${round}/${name}.png`});}
await page.goto(srv.url+'/index.html?film=1');await page.waitForFunction(()=>window.__film?.ready);await page.evaluate(()=>window.__film.start());for(const t of [1,4,8,12,17,22,26]){await page.evaluate(t=>window.__film.seek(t),t);await page.screenshot({path:`review/round${round}/film-${t}.png`});}
await browser.close();srv.server.close();console.log('Review round',round,'captured 12 views');
