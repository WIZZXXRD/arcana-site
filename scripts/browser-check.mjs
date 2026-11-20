// Optional real-browser QA. Uses an installed Chromium browser, no npm packages.
import {spawn} from 'node:child_process';
import {mkdtemp,readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import assert from 'node:assert/strict';
import {makeServer} from './preview.mjs';
const root=resolve(import.meta.dirname,'..');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
let browserPath=process.env.ARCANA_BROWSER;
if(!browserPath){for(const candidate of ['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe']){try{await access(candidate);browserPath=candidate;break;}catch{}}}
if(!browserPath)throw new Error('Set ARCANA_BROWSER to an installed Chromium browser executable.');
const profile=await mkdtemp(join(tmpdir(),'arcana-site-qa-'));
await mkdir(join(root,'.qa'),{recursive:true});
const server=makeServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}/arcana-site/`;
const browser=spawn(browserPath,['--headless=new','--disable-gpu','--no-sandbox','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
browser.on('error',e=>console.error(e.message));
console.log('Browser launched for local QA.');
let socket;let seq=0;const pending=new Map(),events=[];const failures=[];
try{
 let port;for(let i=0;i<100;i++){try{port=(await readFile(join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];break;}catch{await delay(150);}}
 assert(port,'Browser did not expose DevTools endpoint.');
 const tabs=await(await fetch(`http://127.0.0.1:${port}/json/list`,{signal:AbortSignal.timeout(5000)})).json();
 socket=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j;});
 socket.onmessage=({data})=>{const message=JSON.parse(data);if(message.id){const p=pending.get(message.id);pending.delete(message.id);if(message.error)p.reject(new Error(JSON.stringify(message.error)));else p.resolve(message.result);}else{events.push(message);if(message.method==='Runtime.exceptionThrown')failures.push(message.params.exceptionDetails.text);if(message.method==='Log.entryAdded'&&message.params.entry.level==='error')failures.push(message.params.entry.text);}};
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;const timer=setTimeout(()=>{pending.delete(id);reject(new Error(`CDP timeout: ${method}`));},10000);pending.set(id,{resolve:v=>{clearTimeout(timer);resolve(v);},reject:e=>{clearTimeout(timer);reject(e);}});socket.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 console.log((await send('Browser.getVersion')).product);await send('Page.enable');await send('Runtime.enable');
 async function navigate(path){await send('Page.navigate',{url:new URL(path,base).href});for(let i=0;i<100;i++){await delay(50);if(await evaluate(`document.readyState==='complete' && location.href===${JSON.stringify(new URL(path,base).href)}`))return;}throw new Error(`Navigation timeout: ${path}`);}
 async function size(width,height){await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});}
 async function screenshot(name){const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(join(root,name),Buffer.from(r.data,'base64'));}
 // Render the original vector as a widely supported social image.
 console.log('Connected to browser.');await size(1200,630);await navigate('assets/social.svg');await screenshot('assets/social.png');await evaluate("localStorage.setItem('arcana-site-language','en')");
 await send('Log.clear');await send('Log.enable');await send('Network.enable');
 const pages=['index.html','privacy.html','terms.html','account-deletion.html'].flatMap(p=>[p,`ru/${p}`]);
 for(const width of [320,360,768,1440]){
  await size(width,1000);
  for(const page of pages){
   await navigate(page);await evaluate(`Promise.all([...document.images].map(i=>{i.loading="eager";return i.decode().catch(()=>{});})).then(()=>true)`);
   const state=await evaluate(`({lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).length,h1:document.querySelectorAll('h1').length,main:!!document.querySelector('main'),badButtons:[...document.querySelectorAll('button')].filter(b=>!b.textContent.trim()&&!b.getAttribute('aria-label')).length})`);
   if(state.overflow)console.log(await evaluate(`JSON.stringify([...document.querySelectorAll("body *")].map(e=>({tag:e.tagName,cls:e.className,width:e.getBoundingClientRect().width,right:e.getBoundingClientRect().right})).filter(e=>e.right>innerWidth+1))`));assert.equal(state.lang,page.startsWith('ru/')?'ru':'en');assert.equal(state.h1,1);assert(state.main);assert(!state.overflow,`${page}: horizontal overflow at ${width}`);assert.equal(state.broken,0);assert.equal(state.badButtons,0);
  }
 }
 console.log('PASS: 8 pages at 320, 360, 768 and 1440 CSS px; no overflow or broken images.');
 await size(1440,1050);await navigate('index.html');await screenshot('.qa/home-desktop.png');
 await evaluate(`document.querySelector('[data-theme="vintage"]').click()`);
 assert.equal(await evaluate(`document.querySelector('[data-theme-preview]').dataset.themePreview`),'vintage');
 assert.equal(await evaluate(`document.querySelectorAll('[data-theme][aria-pressed="true"]').length`),1);
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 assert.equal(await evaluate(`getComputedStyle(document.documentElement).scrollBehavior`),'auto');
 await evaluate(`document.querySelector('details summary').focus()`);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});assert(await evaluate(`document.querySelector('details').open`));
 await navigate('index.html');await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});assert.equal(await evaluate(`document.activeElement.className`),'skip-link');
 assert.notEqual(await evaluate(`getComputedStyle(document.activeElement).outlineStyle`),'none');
 await navigate('privacy.html');await evaluate(`document.querySelector('[data-language="ru"]').click()`);await delay(200);assert(await evaluate(`location.pathname.endsWith('/ru/privacy.html') && localStorage.getItem('arcana-site-language')==='ru'`));
 const history=await send('Page.getNavigationHistory');await send('Page.navigateToHistoryEntry',{entryId:history.entries[history.currentIndex-1].id});await delay(200);assert(await evaluate(`location.pathname.endsWith('/privacy.html') && document.documentElement.lang==='en'`));await send('Page.navigateToHistoryEntry',{entryId:history.entries[history.currentIndex].id});await delay(200);assert(await evaluate(`document.documentElement.lang==='ru'`));
 // Browser-language negotiation at the neutral root; explicit pages retain locale.
 await evaluate(`localStorage.clear()`);const injected=await send('Page.addScriptToEvaluateOnNewDocument',{source:`Object.defineProperty(navigator,'language',{get:()=> 'ru-RU'});`});
 await send('Page.navigate',{url:'about:blank'});await delay(50);await send('Page.navigate',{url:base});await delay(300);assert(await evaluate(`document.documentElement.lang==='ru'`));
 await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:injected.identifier});
 await evaluate(`document.querySelector('[data-language="en"]').click()`);await delay(200);assert(await evaluate(`document.documentElement.lang==='en' && localStorage.getItem('arcana-site-language')==='en'`));
 // Denied local storage must never break static content or navigation.
 const storage=await send('Page.addScriptToEvaluateOnNewDocument',{source:`Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError')}});`});await navigate('privacy.html');assert(await evaluate(`document.querySelector('h1').textContent.length>0`));await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:storage.identifier});
 await size(390,920);await navigate('ru/index.html');await screenshot('.qa/home-mobile-ru.png');
 await evaluate(`document.documentElement.style.fontSize='200%'`);assert(!await evaluate(`document.documentElement.scrollWidth>innerWidth`),'200% text scaling overflow');
 for(const page of pages){await navigate(page);await evaluate("document.documentElement.style.fontSize='200%'");assert(!await evaluate('document.documentElement.scrollWidth>innerWidth'),page+': 200% text overflow');}
 await navigate('ru/account-deletion.html');await screenshot('.qa/deletion-mobile-ru.png');
 await size(1440,1000);await navigate('privacy.html');await screenshot('.qa/privacy-desktop.png');
 await navigate('index.html');await evaluate("document.getElementById('ritual').scrollIntoView()");await delay(50);await screenshot('.qa/ritual-desktop.png');
 await evaluate("document.querySelector('.journal').scrollIntoView()");await delay(50);await screenshot('.qa/journal-desktop.png');
 await evaluate("document.querySelector('.themes').scrollIntoView()");await delay(50);await screenshot('.qa/themes-desktop.png');
 await send('Emulation.setScriptExecutionDisabled',{value:true});for(const page of pages){await navigate(page);assert(await evaluate('!!document.querySelector("h1") && document.querySelectorAll("a").length>8'),page+': static content');}await send('Emulation.setScriptExecutionDisabled',{value:false});
 for(const page of pages){const response=await fetch(new URL(page,base));assert.equal(response.status,200,page+': HTTP');}
 const missing=await fetch(new URL('missing-page',base));assert.equal(missing.status,404);assert((await missing.text()).includes('lang="ru"'));
 assert.deepEqual(failures,[],'Browser console/runtime errors');
 const network=events.filter(e=>e.method==='Network.requestWillBeSent').map(e=>e.params.request.url).filter(u=>/^https?:/.test(u));assert(network.every(u=>u.startsWith(base)),'Unexpected external request');
 console.log('PASS: keyboard skip link/focus/FAQ, theme controls, reduced motion, language persistence/default, back/forward, blocked storage, 200% text and zero console errors/external requests.');
 console.log('Screenshots: .qa/; social PNG: assets/social.png');
}finally{socket?.close();browser.kill();server.closeAllConnections();await new Promise(r=>server.close(r));}
