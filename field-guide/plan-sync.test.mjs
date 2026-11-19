import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { decisionPage } from './decision/playbook.mjs';
import { planCloudConfig } from './decision/cloudConfig.mjs';
import { syncAction } from './assets/plan-sync.js';

test('a new account can import a local plan and another device can restore it', () => {
  const first = { fields: {offer:'one hour review'}, done:[0], prospects:[] };
  const row = { revision:'first', content:first };
  assert.equal(syncAction(first,undefined,undefined),'insert');
  assert.equal(syncAction(undefined,row,undefined),'pull');
  assert.equal(syncAction(first,row,undefined),'ack');
  const edited = {...first,done:[0,1]};
  assert.equal(syncAction(edited,row,row),'update');
  assert.equal(syncAction(first,{content:edited,revision:'second'},row),'pull');
});

test('simultaneous edits and overlapping guest imports preserve both versions for review', () => {
  const base = {content:{message:'first'},revision:'first'};
  const cloud = {content:{message:'device A'},revision:'second'};
  const local = {message:'device B'};
  assert.equal(syncAction(local,cloud,base),'conflict');
  assert.equal(syncAction(local,cloud,undefined),'conflict');
  assert.equal(syncAction(local,undefined,base),'conflict');
  assert.equal(syncAction(cloud.content,cloud,base),'ack');
  assert.equal(syncAction(undefined,undefined,undefined),'skip');
});

test('cloud controls render only on private pages with dedicated public configuration', () => {
  const names = ['AISIDEHUSTLE_SUPABASE_URL','AISIDEHUSTLE_SUPABASE_PUBLISHABLE_KEY'];
  const original = names.map(name=>process.env[name]);
  const paths = ['/my-side-hustles','/start/indie-game-dev'];
  const render = path => decisionPage(path,new URLSearchParams());
  try {
    delete process.env[names[0]]; delete process.env[names[1]];
    for (const path of paths) assert.doesNotMatch(render(path),/id="cloud-plans"/);
    process.env[names[0]] = 'https://abcdefghijklmnopqrst.supabase.co';
    process.env[names[1]] = 'sb_secret_test';
    assert.equal(planCloudConfig(),null);
    process.env[names[1]] = 'sb_publishable_test';
    for (const path of paths) {
      const page = render(path);
      assert.match(page,/id="cloud-plans"/);
      assert.match(page,/noindex, follow/);
      assert.doesNotMatch(page,/src="\/studio-assets\/studio.js"/);
      const [module] = [...page.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)];
      assert.ok(module);
      new vm.Script('(async()=>{'+module[1]+'})');
    }
    assert.doesNotMatch(render('/side-hustles'),/id="cloud-plans"|sb_publishable_test/);
  } finally {
    names.forEach((name,i)=>original[i] === undefined ? delete process.env[name] : process.env[name] = original[i]);
  }
});
