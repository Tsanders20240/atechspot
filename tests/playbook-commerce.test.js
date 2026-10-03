import test from 'node:test';
import assert from 'node:assert/strict';
import {handlePlaybook,signDownload,verifyDownload} from '../lib/playbook-commerce.js';

const sessionId='cs_test_abcdefghijklmnopqrstuv';
const origin='https://www.atechspot.com';
class Bucket{
 constructor(){this.items=new Map([['products/reseller-playbook-v1.pdf',{body:'%PDF-fixture',size:1500,httpMetadata:{contentType:'application/pdf'}}]]);}
 async head(k){const v=this.items.get(k);return v?{size:v.size||v.body.length,httpMetadata:v.httpMetadata}:null;}
 async get(k){const v=this.items.get(k);return v?{size:v.size||v.body.length,body:v.body,json:async()=>JSON.parse(v.body)}:null;}
 async put(k,body,options={}){if(options.onlyIf?.etagDoesNotMatch==='*'&&this.items.has(k))return null;this.items.set(k,{body,httpMetadata:options.httpMetadata});return {};}
}
const makeEnv=()=>({STRIPE_API_KEY:'fixture-only',STRIPE_WEBHOOK_SECRET:'fixture-webhook-secret',PLAYBOOK_PRICE_ID:'price_fixture',PLAYBOOK_WEBHOOK_ID:'we_fixture',PLAYBOOK_DOWNLOAD_SECRET:'fixture-signing-secret-longer-than-32-characters',ATECHSPOT_DOWNLOADS:new Bucket(),RESEND_API_KEY:'fixture-email',PLAYBOOK_MODE:'sandbox',PLAYBOOK_TAX_MODE:'reviewed_no_collection'});
function fixture(){return{id:sessionId,object:'checkout.session',livemode:false,mode:'payment',status:'complete',payment_status:'paid',currency:'usd',amount_subtotal:2900,amount_total:2900,payment_intent:'pi_fixture',metadata:{atechspot_product:'reseller_playbook_v1',terms_version:'2026-10-03-v2'},consent:{terms_of_service:'accepted'},customer_details:{email:'buyer@example.test'},line_items:{has_more:false,data:[{price:{id:'price_fixture'},quantity:1}]}};}
let session,payment,emails,emailFail,creates,price,hook;
function reset(){session=fixture();payment={status:'succeeded',latest_charge:{refunded:false,disputed:false}};emails=0;emailFail=false;creates=[];price={active:true,livemode:false,currency:'usd',unit_amount:2900,recurring:null,product:{active:true,metadata:{atechspot_product:'reseller_playbook_v1'}}};hook={status:'enabled',livemode:false,url:origin+'/api/playbook/webhook',enabled_events:['checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.async_payment_failed','charge.refunded','charge.dispute.created']};}
const originalFetch=globalThis.fetch;
globalThis.fetch=async(input,init={})=>{
 const url=new URL(typeof input==='string'?input:input.url||String(input));
 let body;
 if(url.hostname==='api.resend.com'){emails++;return new Response(JSON.stringify({id:'mail_fixture'}),{status:emailFail?500:200,headers:{'content-type':'application/json'}});}
 if(url.pathname==='/v1/prices/price_fixture')body=price;
 else if(url.pathname==='/v1/webhook_endpoints/we_fixture')body=hook;
 else if(url.pathname==='/v1/checkout/sessions'&&init.method==='POST'){creates.push({body:new URLSearchParams(init.body),headers:new Headers(init.headers)});body={id:sessionId,url:'https://checkout.stripe.com/c/pay/fixture'};}
 else if(url.pathname.startsWith('/v1/checkout/sessions/'))body=session;
 else if(url.pathname.startsWith('/v1/payment_intents/'))body=payment;
 else if(url.pathname==='/v1/tax/settings')body={status:'pending'};
 else if(url.pathname==='/v1/tax/registrations')body={data:[]};
 else throw Error('Unexpected fixture endpoint '+url.pathname);
 return new Response(JSON.stringify(body),{headers:{'content-type':'application/json'}});
};
process.on('exit',()=>{globalThis.fetch=originalFetch;});
function request(path,body,method='POST',requestOrigin=origin){return new Request(origin+'/api/playbook/'+path,{method,headers:{'content-type':'application/json',origin:requestOrigin},...(method==='POST'?{body:JSON.stringify(body)}:{})});}
async function event(env,type,object,options={}){
 const body=JSON.stringify({id:options.id||'evt_fixture',object:'event',type,livemode:false,data:{object}});const t=Math.floor(Date.now()/1000);
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.STRIPE_WEBHOOK_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const bytes=new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`${t}.${body}`)));const sig=[...bytes].map(x=>x.toString(16).padStart(2,'0')).join('');
 return handlePlaybook(new Request(origin+'/api/playbook/webhook',{method:'POST',headers:{'stripe-signature':`t=${t},v1=${sig}`},body}),env);
}
async function fulfill(env){return event(env,'checkout.session.completed',session);}
const checkoutBody={acceptTerms:true,termsVersion:'2026-10-03-v2',requestId:'12345678-1234-1234-1234-123456789012'};
test('Missing configuration closes checkout and status',async()=>{const r=await handlePlaybook(request('status',null,'GET'),{});assert.equal((await r.json()).available,false);assert.equal((await handlePlaybook(request('checkout',checkoutBody),{})).status,503);});
test('Forged and expired signed downloads are rejected',async()=>{const env=makeEnv();const token=await signDownload(env,sessionId,1000);assert.equal((await verifyDownload(env,token,2000)).sid,sessionId);assert.equal(await verifyDownload(env,token,901001),null);assert.equal(await verifyDownload(env,token+'x',2000),null);});
test('Cross-origin checkout rejected',async()=>{reset();assert.equal((await handlePlaybook(request('checkout',checkoutBody,'POST','https://other.example'),makeEnv())).status,403);assert.equal(creates.length,0);});
test('Terms consent required',async()=>{reset();assert.equal((await handlePlaybook(request('checkout',{...checkoutBody,acceptTerms:false}),makeEnv())).status,400);});
test('Creates fixed one-time checkout with idempotency',async()=>{reset();assert.equal((await handlePlaybook(request('checkout',checkoutBody),makeEnv())).status,200);const p=creates[0].body;assert.equal(p.get('line_items[0][price]'),'price_fixture');assert.equal(p.get('line_items[0][quantity]'),'1');assert.equal(p.get('mode'),'payment');assert.equal(p.get('payment_method_types[0]'),null);assert.ok(creates[0].headers.get('idempotency-key'));});
test('Wrong amount prevents checkout',async()=>{reset();price.unit_amount=1;assert.equal((await handlePlaybook(request('checkout',checkoutBody),makeEnv())).status,503);assert.equal(creates.length,0);});
test('Missing private file prevents checkout',async()=>{reset();const env=makeEnv();env.ATECHSPOT_DOWNLOADS.items.clear();assert.equal((await handlePlaybook(request('checkout',checkoutBody),env)).status,503);});
test('Incomplete webhook prevents checkout',async()=>{reset();hook.enabled_events=[];assert.equal((await handlePlaybook(request('checkout',checkoutBody),makeEnv())).status,503);});
test('Live launch requires explicit completed-QA flag',async()=>{reset();const env=makeEnv();env.PLAYBOOK_MODE='live';price.livemode=true;hook.livemode=true;assert.equal((await handlePlaybook(request('checkout',checkoutBody),env)).status,503);});
test('Automatic tax without active setup fails closed',async()=>{reset();const env=makeEnv();env.PLAYBOOK_TAX_MODE='automatic';assert.equal((await handlePlaybook(request('checkout',checkoutBody),env)).status,503);});
test('Invalid webhook signatures rejected',async()=>{reset();const r=await handlePlaybook(new Request(origin+'/api/playbook/webhook',{method:'POST',body:'{}',headers:{'stripe-signature':'bad'}}),makeEnv());assert.equal(r.status,400);assert.equal(emails,0);});
test('Unpaid completion does not fulfill',async()=>{reset();session.payment_status='unpaid';const env=makeEnv();assert.equal((await fulfill(env)).status,200);assert.equal(await env.ATECHSPOT_DOWNLOADS.head('orders/'+sessionId),null);assert.equal(emails,0);});
test('Delayed payment success fulfills and mails once',async()=>{reset();const env=makeEnv();assert.equal((await event(env,'checkout.session.async_payment_succeeded',session)).status,200);assert.ok(await env.ATECHSPOT_DOWNLOADS.head('orders/'+sessionId));assert.equal(emails,1);await event(env,'checkout.session.async_payment_succeeded',session);assert.equal(emails,1);});
test('Different product cannot obtain this PDF',async()=>{reset();session.line_items.data[0].price.id='price_other';const env=makeEnv();await fulfill(env);assert.equal(await env.ATECHSPOT_DOWNLOADS.head('orders/'+sessionId),null);});
test('Provider email failure returns retriable error and retains order',async()=>{reset();const env=makeEnv();emailFail=true;assert.equal((await fulfill(env)).status,503);assert.ok(await env.ATECHSPOT_DOWNLOADS.head('orders/'+sessionId));assert.equal(await env.ATECHSPOT_DOWNLOADS.head('events/evt_fixture'),null);emailFail=false;assert.equal((await fulfill(env)).status,200);});
test('Visiting success page before webhook grants nothing',async()=>{reset();const r=await handlePlaybook(request('access',{sessionId}),makeEnv());assert.equal(r.status,202);assert.equal((await r.json()).url,undefined);});
test('Paid webhook enables signed download',async()=>{reset();const env=makeEnv();await fulfill(env);const access=await handlePlaybook(request('access',{sessionId}),env);const data=await access.json();assert.equal(access.status,200);const r=await handlePlaybook(new Request(origin+data.url),env);assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'application/pdf');assert.equal(r.headers.get('cache-control'),'no-store, max-age=0');assert.equal(await r.text(),'%PDF-fixture');});
test('Full refund revokes existing download and receipt access',async()=>{reset();const env=makeEnv();await fulfill(env);const token=await signDownload(env,sessionId);await event(env,'charge.refunded',{payment_intent:'pi_fixture',refunded:true},{id:'evt_refund'});assert.equal((await handlePlaybook(new Request(origin+'/api/playbook/download?token='+token),env)).status,403);assert.equal((await handlePlaybook(request('access',{sessionId}),env)).status,403);});
test('Live payment recheck denies refund even before webhook',async()=>{reset();const env=makeEnv();await fulfill(env);payment.latest_charge.refunded=true;assert.equal((await handlePlaybook(request('access',{sessionId}),env)).status,403);});
test('Dispute suspends download access',async()=>{reset();const env=makeEnv();await fulfill(env);await event(env,'charge.dispute.created',{payment_intent:'pi_fixture'},{id:'evt_dispute'});assert.equal((await handlePlaybook(request('access',{sessionId}),env)).status,403);});
test('Failed delayed payment never grants access',async()=>{reset();const env=makeEnv();await event(env,'checkout.session.async_payment_failed',{id:sessionId});assert.equal((await handlePlaybook(request('access',{sessionId}),env)).status,402);assert.equal(emails,0);});
