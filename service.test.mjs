import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { serveSite } from './server.mjs';

test('the independent domain owns the field guide and preserves existing deep links',async t=>{
  const server=createServer(serveSite).listen(0,'127.0.0.1');
  await once(server,'listening');t.after(()=>server.close());
  const url='http://127.0.0.1:'+server.address().port;
  for(const path of ['/','/field-guide/find-a-niche','/studio-assets/pet.webp','/healthz']){
    assert.equal((await fetch(url+path,{redirect:'manual'})).status,200,path);
  }
  const legacy=await fetch(url+'/tools/first-offer?utm_source=news',{redirect:'manual'});
  assert.equal(legacy.status,301);
  assert.equal(legacy.headers.get('location'),'https://aisidehustle.cc/tools/first-offer?utm_source=news');
  assert.equal((await fetch(url+'/blog',{method:'POST'})).status,405);
});
