import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {normalizeLead,recordAssessment,runTasks,handleAcquisition,nextBusinessDay} from '../lib/acquisition.js';
import worker from '../_worker.js';
function database(){
 const sqlite=new DatabaseSync(':memory:');sqlite.exec(readFileSync(new URL('../migrations/acquisition.sql',import.meta.url),'utf8'));
 return {prepare(sql){let values=[];return {bind(...args){values=args;return this},async first(){return sqlite.prepare(sql).get(...values)||null},async all(){return {results:sqlite.prepare(sql).all(...values)}},async run(){return {meta:{changes:sqlite.prepare(sql).run(...values).changes}}}}},async batch(statements){sqlite.exec('BEGIN');try{const r=[];for(const s of statements)r.push(await s.run());sqlite.exec('COMMIT');return r}catch(e){sqlite.exec('ROLLBACK');throw e}}};
}
const fields={'Submission ID':'12345678-1234-4234-8234-123456789abc','Full Name':'Test Owner',Email:'OWNER@example.com',Company:'Test Company','Investment Range':'$2,500-$4,999','Decision Authority':'Final decision-maker','Lead Source':'outreach','Campaign':'houston-2026','Service Interest':'Ecommerce Systems','Landing Page':'https://example.com/path?email=private','Primary Goal':'Improve intake','Current Challenge':'Manual follow-up','Desired Outcome':'Track requests','Assessment Type':'Company'};
const req=(path,method='GET',body,token='test-secret')=>new Request('https://www.atechspot.com/api/acquisition/'+path,{method,headers:{authorization:'Bearer '+token,'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
test('Attribution and qualification do not invent deal value or persist query-string PII',()=>{
 const l=normalizeLead(fields);assert.equal(l.email,'owner@example.com');assert.equal(l.campaign,'houston-2026');assert.equal(l.estimated_deal_value,null);assert.equal(l.qualification,'priority_review');assert.equal(l.landing_page,'/path');
 assert.equal(normalizeLead({...fields,'Investment Range':''}).qualification,'needs_review');
 assert.equal(nextBusinessDay(new Date('2026-10-09T15:00:00Z')),'2026-10-12T14:00:00.000Z');
 assert.equal(nextBusinessDay(new Date('2026-10-10T00:00:00Z')),'2026-10-12T14:00:00.000Z');
 assert.equal(nextBusinessDay(new Date('2026-11-06T15:00:00Z')),'2026-11-09T15:00:00.000Z');
});
test('Duplicate submission creates one lead and one task of each kind; conflicts cannot read prior lead',async()=>{
 const env={ACQUISITION_DB:database()};await recordAssessment(env,fields);await recordAssessment(env,fields);
 assert.equal((await env.ACQUISITION_DB.prepare('SELECT * FROM acquisition_leads').all()).results.length,1);
 assert.equal((await env.ACQUISITION_DB.prepare('SELECT * FROM acquisition_tasks').all()).results.length,3);
 await assert.rejects(recordAssessment(env,{...fields,Email:'different@example.com'}));
});
test('Outbox sends internal notification and acknowledgement once; provider failure remains queued',async()=>{
 const env={ACQUISITION_DB:database()};await recordAssessment(env,fields);const sends=[];
 await runTasks(env,async(p,k)=>sends.push({p,k}));await runTasks(env,async(p,k)=>sends.push({p,k}));
 assert.equal(sends.length,2);assert.equal(sends[0].k.startsWith('acquisition-'),true);
 const l=await env.ACQUISITION_DB.prepare('SELECT * FROM acquisition_leads').first();assert.equal(l.confirmation_sent,1);assert.equal(l.internal_sent,1);
 const env2={ACQUISITION_DB:database()};await recordAssessment(env2,fields);const r=await runTasks(env2,async()=>{throw new Error('provider outage')});assert.equal(r.failed,2);
 assert.equal((await env2.ACQUISITION_DB.prepare("SELECT * FROM acquisition_tasks WHERE status='pending'").all()).results.length,3);
});
test('Staff routes reject anonymous access; follow-up stops on suppression; proof is gated',async()=>{
 const env={ACQUISITION_DB:database(),ACQUISITION_ADMIN_TOKEN:'test-secret'};await recordAssessment(env,fields);
 assert.equal((await handleAcquisition(req('leads','GET',null,'wrong'),env,async()=>{})).status,401);
 assert.equal((await handleAcquisition(req('leads'),env,async()=>{})).status,200);
 const update={id:fields['Submission ID'],status:'suppressed',next_action:'Do not contact',next_action_at:new Date().toISOString()};
 assert.equal((await handleAcquisition(req('lead','PATCH',update),env,async()=>{})).status,200);
 assert.equal((await env.ACQUISITION_DB.prepare("SELECT * FROM acquisition_tasks WHERE status='pending'").all()).results.length,0);
 assert.equal((await handleAcquisition(req('project-completed','POST',{project_id:'project-1',lead_id:update.id}),env,async()=>{})).status,200);
 assert.equal((await handleAcquisition(req('proof','PATCH',{project_id:'project-1',status:'approved',verified:'yes',publication_permission:'yes'}),env,async()=>{})).status,400);
 assert.equal((await handleAcquisition(req('proof','PATCH',{project_id:'project-1',status:'approved',verified:true,publication_permission:true,baseline:'Old process',result:'Measured result',evidence_url:'https://example.com/evidence'}),env,async()=>{})).status,200);
});
test('Assessment integration records and acknowledges a valid form without contacting real services',async()=>{
 const env={ACQUISITION_DB:database(),RESEND_API_KEY:'test'};const previous=globalThis.fetch;const sent=[];
 globalThis.fetch=async(url,opts)=>{assert.equal(url,'https://api.resend.com/emails');sent.push(JSON.parse(opts.body));return new Response(JSON.stringify({id:'mock'}),{status:200})};
 try{
 const body={...fields,form_started_at:Date.now()-5000};
 const request=()=>new Request('https://www.atechspot.com/api/assessment',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
 const r=await worker.fetch(request(),env);assert.equal(r.status,200);assert.equal((await r.json()).trackingRecorded,true);
 assert.equal((await worker.fetch(request(),env)).status,200);assert.equal(sent.length,2);
 const bad=await worker.fetch(new Request('https://www.atechspot.com/api/assessment',{method:'POST',headers:{'content-type':'application/json'},body:'{}'}),env);assert.equal(bad.status,400);
 }finally{globalThis.fetch=previous}
});
test('Staff magic link is single-use, creates a secure cookie, and blocks cross-site writes',async()=>{
 const env={ACQUISITION_DB:database(),ACQUISITION_ADMIN_TOKEN:'test-secret'},messages=[];
 const send=async p=>messages.push(p);
 const access=req('access','POST',{email:'jason@atechspot.com',started:Date.now()-5000},'');
 assert.equal((await handleAcquisition(access,env,send)).status,200);assert.equal(messages.length,1);
 const url=messages[0].html.match(/href="([^"]+)"/)[1];
 const login=await handleAcquisition(new Request(url),env,send);
 assert.equal(login.status,302);const cookie=login.headers.get('set-cookie');assert.ok(cookie.includes('HttpOnly; Secure; SameSite=Lax'));
 const read=new Request('https://www.atechspot.com/api/acquisition/leads',{headers:{cookie}});assert.equal((await handleAcquisition(read,env,send)).status,200);
 const write=new Request('https://www.atechspot.com/api/acquisition/run',{method:'POST',headers:{cookie,origin:'https://other.example'}});assert.equal((await handleAcquisition(write,env,send)).status,401);
 const replay=await handleAcquisition(new Request(url),env,send);assert.equal(replay.headers.get('location'),'/acquisition/?error=expired');
});
