import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
const root=resolve(import.meta.dirname,'..');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
export function makeServer(){return createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname==='/'){res.writeHead(302,{Location:'/arcana-site/'});res.end();return;}
  if(!url.pathname.startsWith('/arcana-site/'))throw new Error('Not found');
  let path=decodeURIComponent(url.pathname.slice('/arcana-site/'.length));
  if(path===''||path.endsWith('/'))path+='index.html';
  const full=resolve(root,path);
  const allowed=/^(?:ru\/)?(?:index|privacy|terms|account-deletion|404)\.html$|^assets\/[a-z0-9.-]+$|^(?:sitemap\.xml|robots\.txt)$/;
  if(!full.startsWith(root+sep)||!allowed.test(path))throw new Error('Not found');
  if(!(await stat(full)).isFile())throw new Error('Not a file');
  res.writeHead(200,{'Content-Type':types[extname(full)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(await readFile(full));
 }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(resolve(root,'404.html'),'utf8'));}
});}
if(import.meta.url===pathToFileURL(process.argv[1]).href){const port=Number(process.env.PORT||4173);makeServer().listen(port,'127.0.0.1',()=>console.log(`Arcana preview: http://127.0.0.1:${port}/arcana-site/\nPress Ctrl+C to stop.`));}
