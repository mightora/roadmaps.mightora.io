import test from 'node:test';
import assert from 'node:assert/strict';
import { seedRoadmap, validateRoadmap, validateReadiness, updateActivity, deleteActivity, blockers, scheduleConflicts, downstream, hasCycle, addMonths, quarterOf } from '../dist/model.mjs';

test('Example plan has multiple activities per cell, valid readiness and no date conflicts',()=>{
  const r=seedRoadmap();assert.equal(r.activities.length,32);assert.equal(r.tracks.length,8);
  assert.equal(r.activities.filter(a=>a.trackId==='t1'&&quarterOf(a.start,r)===0).length,2);
  assert.equal(hasCycle(r.activities),false);assert.doesNotThrow(()=>validateReadiness(r));
  assert.equal(r.activities.reduce((n,a)=>n+scheduleConflicts(a,r).length,0),0);
});
test('Cross-workstream links report blockers and transitive downstream impact',()=>{
  const r=seedRoadmap(),pilot=r.activities.find(a=>a.id==='a21');
  assert.equal(blockers(pilot,r).length,3);
  assert.ok(downstream('a5',r).includes('a32'));
  assert.ok(pilot.dependencies.some(id=>r.activities.find(a=>a.id===id).trackId!==pilot.trackId));
});
test('Circular dependencies and self-links are rejected',()=>{
  const r=seedRoadmap(),a=r.activities.find(a=>a.id==='a5');
  assert.throws(()=>updateActivity(r,{...a,dependencies:['a32']}),/circular/);
  assert.throws(()=>updateActivity(r,{...a,dependencies:['a5']}),/distinct existing/);
});
test('Unfinished prerequisites prevent start and completion',()=>{
  const r=seedRoadmap(),a=r.activities.find(a=>a.id==='a21');
  for(const status of ['In progress','Done'])assert.throws(()=>updateActivity(r,{...a,status}),/Complete the predecessor/);
  const next=structuredClone(r);for(const id of a.dependencies)next.activities.find(a=>a.id===id).status='Done';
  assert.equal(updateActivity(next,{...a,status:'In progress'}).activities.find(b=>b.id===a.id).status,'In progress');
});
test('Reopening a completed predecessor cannot invalidate an active successor',()=>{
  const r=seedRoadmap(),a=r.activities.find(a=>a.id==='a1');
  assert.throws(()=>updateActivity(r,{...a,status:'Planned'}),/Move active or completed successors/);
});
test('Moving a prerequisite flags overlaps on its successors without changing them',()=>{
  const r=seedRoadmap(),a=r.activities.find(a=>a.id==='a13');
  const moved=updateActivity(r,{...a,start:'2027-09-01',end:'2027-09-24'});
  const next=moved.activities.find(a=>a.id==='a21');assert.equal(next.start,'2027-07-01');
  assert.ok(scheduleConflicts(next,moved).some(b=>b.id==='a13'));
});
test('Deleting an activity removes incoming and outgoing references',()=>{
  const r=deleteActivity(seedRoadmap(),'a13');assert.ok(!r.activities.some(a=>a.id==='a13'||a.dependencies.includes('a13')));assert.doesNotThrow(()=>validateRoadmap(r));
});
test('Import rejects dangling links, duplicates, invalid dates, unknown tracks and blocked active states',()=>{
  for(const change of [r=>r.activities[0].dependencies=['missing'],r=>r.activities[1].id=r.activities[0].id,r=>r.activities[0].end='2027-02-30',r=>r.activities[0].trackId='missing',r=>r.activities[0].start='2026-01-01']){
    const r=seedRoadmap();change(r);assert.throws(()=>validateRoadmap(r));
  }
  const r=seedRoadmap();r.activities.find(a=>a.id==='a21').status='Done';assert.throws(()=>validateReadiness(r),/unfinished prerequisites/);
});
test('Month moves are deterministic around month ends and leap years',()=>{
  assert.equal(addMonths('2027-01-31',1),'2027-02-28');assert.equal(addMonths('2028-01-31',1),'2028-02-29');
  const r=seedRoadmap();assert.equal(quarterOf('2027-03-31',r),0);assert.equal(quarterOf('2027-04-01',r),1);assert.equal(quarterOf('2029-01-01',r),-1);
});
