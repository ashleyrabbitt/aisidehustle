import { serveStudio } from './field-guide/handler.mjs';
import { origin } from './field-guide/content.mjs';

export function serveSite(req,res){
  const path=req.url.split('?')[0];
  if(path==='/healthz'){
    res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
    return res.end(req.method==='HEAD'?undefined:'ok');
  }
  if(req.method!=='GET' && req.method!=='HEAD'){
    res.writeHead(405,{Allow:'GET, HEAD'});
    return res.end();
  }
  // The .cc site remains the canonical edition. The .live field guide has its own runtime.
  res.setHeader('X-Robots-Tag','noindex, follow');
  serveStudio(req,res,()=>{
    const destination=new URL(origin);
    const i=req.url.indexOf('?');
    destination.pathname=path;
    destination.search=i<0?'':req.url.slice(i);
    res.writeHead(301,{Location:destination.href,'Cache-Control':'public, max-age=300'});
    res.end();
  });
}
