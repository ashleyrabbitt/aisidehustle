import { test } from 'node:test';
import assert from 'node:assert/strict';
import { playbooks, SIDEHUSTLE_CATALOG } from './decision/catalog.mjs';
import { decisionPage } from './decision/playbook.mjs';
import { rankHustles } from './decision/sidehustleJourney.js';

test('all source templates provide readable local guides, editable starters and the original browser storage key',()=>{
  assert.equal(new Set(playbooks.map(t=>t.id)).size,77);
  let tasks=0, scenarios=0;
  for(const t of playbooks){
    const page=decisionPage('/side-hustles/'+t.id,new URLSearchParams());
    assert.ok(page.includes('/start/'+t.id));
    assert.doesNotMatch(page,/\[object Object\]|href="https:\/\/go\.waymaker\.cx/);
    const start=decisionPage('/start/'+t.id,new URLSearchParams());
    assert.match(start,/aisidehustle-workspace-v1/);
    tasks+=t.phases.reduce((n,p)=>n+p.tasks.length,0);
    scenarios+=(t.resources.decisionTrees||[]).length;
  }
  assert.equal(tasks,1168);assert.equal(scenarios,93);
});
test('fit reasons exclude filler words and shortest paths do not imply verified income',()=>{
  const ranked=rankHustles(SIDEHUSTLE_CATALOG,{skills:'writing and editing',budget:100,hours:5,experience:'beginner'});
  assert.equal(ranked.length,3);
  assert.ok(ranked.every(row=>row.reasons.every(r=>!r.includes(', and'))));
  assert.match(decisionPage('/shortlist',new URLSearchParams('startingSkill=design&customerAccess=creators')),/Your shortlist/);
  assert.match(decisionPage('/tools/first-offer',new URLSearchParams('hustle=indie-game-dev')),/id="offer-hustle"/);
});
