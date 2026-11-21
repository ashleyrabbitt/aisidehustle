import {handleMaterial} from './material-node.mjs';
import {materialRoute} from './material-access.mjs';
import { renderPocketWorksheet } from './editorial/pocket-workshop.mjs';
import { editorialPage, magazineMeta } from './editorial/router.mjs';
import { decisionPaths } from './decision/playbook.mjs';
import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import { guideMeta } from './content.mjs';
import { render } from './pages.mjs';

export const guidePaths = [...guideMeta,...magazineMeta].map(([path])=>path);
const pagePaths = new Set(['/',...guidePaths,...decisionPaths]);
const files = new Set(['bakery-preorders.webp','pocket-workshop.css','pocket-workshop.js','bakery-pickup-planner.xlsx','plan-sync.js','vendor/supabase-2.119.1.js','vendor/Supabase-LICENSE.txt','hero.webp','studio.webp','games.webp','testing.webp','editorial.css','earnings.js','brand.svg','florist.webp','pet.webp','market.webp','dm-sans.ttf','font-license.txt','studio.js','studio.css','florist-quote-brief.csv','pet-visit-handoff.csv','market-restock.csv','offer-test-log.csv',
  'skills/finder.css','skills/finder.js','skills/files/client-scope.zip','skills/files/sample-delivery.zip','skills/files/niche-product-brief.zip']);
const types = {'.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','.zip':'application/zip','.webp':'image/webp','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8','.csv':'text/csv; charset=utf-8'};
const materialFiles=new Set([...files].filter(file=>/\.(xlsx|csv|zip)$/.test(file)||file==='lovable-client-library-brief.txt')
  .concat('pocket-product-worksheet.html').map(file=>'/studio-assets/'+file));
const site={id:'aisidehustle',name:'AI Side Hustle',host:'aisidehustle.cc',accent:'#254d49',files:materialFiles};
export function serveStudio(req,res,next){
  if(materialRoute(req.url,site)){
    return handleMaterial(req,res,site).then(handled=>{if(!handled)serveContent(req,res,next);}).catch(next);
  }
  return serveContent(req,res,next);
}
function serveContent(req,res,next){
  if(!['GET','HEAD'].includes(req.method))return next();
  const raw = req.url.split('?')[0];
  const path = raw.replace(/\/+$/,'') || '/';
  const name = raw.startsWith('/studio-assets/') ? raw.slice('/studio-assets/'.length) : '';
  let body;
  if(name==='pocket-product-worksheet.html'){
    const asset = file => readFileSync(new URL('./assets/'+file,import.meta.url),'utf8');
    body=renderPocketWorksheet(asset('pocket-workshop.css'),asset('pocket-workshop.js'));
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Content-Disposition','attachment; filename="pocket-product-worksheet.html"');
    res.setHeader('Cache-Control','public, max-age=300, must-revalidate');
  } else if(files.has(name)){
    body = readFileSync(new URL('./assets/'+name,import.meta.url));
    res.setHeader('Content-Type',types[extname(name)]);
    res.setHeader('Cache-Control','public, max-age=300, must-revalidate');
    if(name.endsWith('.csv') || name.endsWith('.zip') || name.endsWith('.xlsx'))res.setHeader('Content-Disposition','attachment; filename="'+name.split('/').pop()+'"');
  } else if(pagePaths.has(path)){
    if(raw!==path && path!=='/'){
      res.writeHead(308,{Location:path+req.url.slice(raw.length)});res.end();return;
    }
    const params = new URLSearchParams(req.url.split('?').slice(1).join('?'));
    body=(editorialPage(path,params) ?? render(path)).replace(/<a\b[^>]*>/gi,tag=>{
      const href=tag.match(/\bhref=["']([^"']+)["']/i)?.[1];
      return href && materialFiles.has(href)?tag.replace(/\sdownload(?:=["'][^"']*["'])?(?=[\s>])/i,''):tag;
    });
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','no-cache');
  } else return next();
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Content-Length',Buffer.byteLength(body));
  res.end(req.method==='HEAD'?undefined:body);
}
