import { editorialPage, magazineMeta } from './editorial/router.mjs';
import { decisionPaths } from './decision/playbook.mjs';
import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import { guideMeta } from './content.mjs';
import { render } from './pages.mjs';

export const guidePaths = [...guideMeta,...magazineMeta].map(([path])=>path);
const pagePaths = new Set(['/',...guidePaths,...decisionPaths]);
const files = new Set(['plan-sync.js','vendor/supabase-2.119.1.js','vendor/Supabase-LICENSE.txt','hero.webp','studio.webp','games.webp','testing.webp','editorial.css','earnings.js','brand.svg','florist.webp','pet.webp','market.webp','dm-sans.ttf','font-license.txt','studio.js','studio.css','florist-quote-brief.csv','pet-visit-handoff.csv','market-restock.csv','offer-test-log.csv',
  'skills/finder.css','skills/finder.js','skills/files/client-scope.zip','skills/files/sample-delivery.zip','skills/files/niche-product-brief.zip']);
const types = {'.zip':'application/zip','.webp':'image/webp','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8','.csv':'text/csv; charset=utf-8'};
export function serveStudio(req,res,next){
  if(!['GET','HEAD'].includes(req.method))return next();
  const raw = req.url.split('?')[0];
  const path = raw.replace(/\/+$/,'') || '/';
  const name = raw.startsWith('/studio-assets/') ? raw.slice('/studio-assets/'.length) : '';
  let body;
  if(files.has(name)){
    body = readFileSync(new URL('./assets/'+name,import.meta.url));
    res.setHeader('Content-Type',types[extname(name)]);
    res.setHeader('Cache-Control','public, max-age=300, must-revalidate');
    if(name.endsWith('.csv') || name.endsWith('.zip'))res.setHeader('Content-Disposition','attachment; filename="'+name.split('/').pop()+'"');
  } else if(pagePaths.has(path)){
    if(raw!==path && path!=='/'){
      res.writeHead(308,{Location:path+req.url.slice(raw.length)});res.end();return;
    }
    const params = new URLSearchParams(req.url.split('?').slice(1).join('?'));
    body=editorialPage(path,params) ?? render(path);
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','no-cache');
  } else return next();
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Content-Length',Buffer.byteLength(body));
  res.end(req.method==='HEAD'?undefined:body);
}
