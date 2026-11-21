import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { serveStudio, guidePaths } from './handler.mjs';

test('the guide and every local download work with only Node installed', async t=>{
  const server=createServer((req,res)=>serveStudio(req,res,()=>{
    res.writeHead(404);res.end();
  }));
  server.listen(0,'127.0.0.1');
  await once(server,'listening');
  t.after(()=>server.close());
  const origin='http://127.0.0.1:'+server.address().port;
  const assets=new Set(['/studio-assets/dm-sans.ttf']);
  for(const path of ['/',...guidePaths]){
    const response=await fetch(origin+path);
    assert.equal(response.status,200,path);
    const html=await response.text();
    assert.match(html,new RegExp('href="https://aisidehustle.cc'+path+'"'));
    assert.doesNotMatch(html,/go\.waymaker\.cx|api\.waymaker\.cx|<div id="root"/);
    assert.equal((html.match(/<h1>/g)||[]).length,1);
    for(const [,url] of html.matchAll(/(?:src|href)="(\/studio-assets\/[^"]+)"/g))assets.add(url);
  }
  for(const url of assets){
    if (/\\.(csv|xlsx|zip)$/.test(url) || url.endsWith('/pocket-product-worksheet.html') || url.endsWith('/lovable-client-library-brief.txt')) {
      const gate=await fetch(origin+url,{redirect:'manual'});
      assert.equal(gate.status,303,url);
      assert.equal(new URL(gate.headers.get('location'),origin).searchParams.get('file'),url);
      assert.match(await (await fetch(new URL(gate.headers.get('location'),origin))).text(),/name="email"/);
      continue;
    }
    const response=await fetch(origin+url);
    assert.equal(response.status,200,url);
    assert.ok((await response.arrayBuffer()).byteLength>0,url);
  }
  const moved=await fetch(origin+guidePaths[1]+'/?example=market',{redirect:'manual'});
  assert.equal(moved.status,308);
  assert.equal(moved.headers.get('location'),guidePaths[1]+'?example=market');
  assert.equal((await fetch(origin+'/a-missing-path')).status,404);
  assert.equal((await fetch(origin+'/api/private')).status,404);
});
