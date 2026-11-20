import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..');
const pages=['index.html','privacy.html','terms.html','account-deletion.html'].flatMap(p=>[p,`ru/${p}`]);
const ids=new Map();let links=0;
for(const p of pages){
 const html=await readFile(resolve(root,p),'utf8');
 const set=new Set();for(const [,id] of html.matchAll(/\bid="([^"]+)"/g)){assert(!set.has(id),`${p}: duplicate id ${id}`);set.add(id);}ids.set(p,set);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`${p}: one h1`);
 assert(html.includes(`<html lang="${p.startsWith('ru/')?'ru':'en'}">`));
 assert(!html.includes('undefined')&&!html.includes('{{'),`${p}: unresolved content`);
 for(const tag of ['description','og:title','og:description','og:image','og:url'])assert(html.includes(`="${tag}"`),`${p}: ${tag}`);
 assert(/rel="canonical" href="https:\/\/wizzxxrd.github.io\/arcana-site\//.test(html));
 assert.equal((html.match(/rel="alternate"/g)||[]).length,3);
 assert(!/<form\b|<iframe\b|src="https?:/i.test(html),`${p}: no remote embeds or forms`);
}
for(const p of pages){const html=await readFile(resolve(root,p),'utf8');for(const [,attr,value] of html.matchAll(/\b(href|src)="([^"]+)"/g)){
 if(/^https?:/.test(value))continue;
 assert(!value.startsWith('/'),`${p}: relative ${attr} required: ${value}`);
 const [path,fragment]=value.split('#');
 const target=path?resolve(root,dirname(p),path):resolve(root,p);
 assert((await stat(target)).isFile(),`${p}: missing ${value}`);
 if(fragment){const key=target.slice(root.length+1).replaceAll('\\','/');assert(ids.get(key)?.has(fragment),`${p}: broken anchor ${value}`);}links++;
}}
const {copy}=await import('./content.mjs');const {legalEn}=await import('./legal-en.mjs');const {legalRu}=await import('./legal-ru.mjs');
assert.deepEqual(Object.keys(copy.en).sort(),Object.keys(copy.ru).sort(),'Home translation key parity');
for(const key of ['privacySections','termsSections','deletionSections'])assert.deepEqual(legalEn[key].map(s=>s[0]),legalRu[key].map(s=>s[0]),`Section parity: ${key}`);
for(const l of ['en','ru'])for(const key of ['features','exploreGroups','faq','premiumBenefits','themes'])assert.equal(copy[l][key].length,copy.en[key].length,`${key}: item parity`);
const files=[];async function walk(dir){for(const f of await readdir(dir,{withFileTypes:true})){if(['.git','.vs','.qa','node_modules'].includes(f.name))continue;const p=resolve(dir,f.name);if(f.isDirectory())await walk(p);else files.push(p);}}await walk(root);
const secretPattern=/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|AIza[0-9A-Za-z_-]{35}|GOCSPX-[0-9A-Za-z_-]+|gh[pousr]_[A-Za-z0-9]{30,}|\b\d{8,}-[a-z0-9]{20,}\.apps\.googleusercontent\.com/;
for(const p of files){if(p.endsWith('check.mjs'))continue;assert(!/\.(?:jks|keystore|p12|pem|env)$/.test(p),`Sensitive file: ${p}`);if(!p.endsWith('.png'))assert(!secretPattern.test(await readFile(p,'utf8')),`Credential candidate: ${p}`);}
const png=await readFile(resolve(root,'assets/social.png'));assert.equal(png.subarray(1,4).toString(),'PNG');assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
console.log(`PASS: ${pages.length} pages, ${links} local links/assets/anchors, metadata, localization parity and credential-pattern scan (${files.length} files).`);
