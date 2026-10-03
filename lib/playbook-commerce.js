import Stripe from 'stripe';

const PRODUCTION_ORIGIN='https://www.atechspot.com';
function originFor(env){
 const value=env.PLAYBOOK_ORIGIN||PRODUCTION_ORIGIN;
 const url=new URL(value);
 if(url.protocol!=='https:'||url.origin!==value||url.username||url.password)throw Error('invalid_origin');
 if(env.PLAYBOOK_MODE==='live'&&value!==PRODUCTION_ORIGIN)throw Error('invalid_live_origin');
 if(value!==PRODUCTION_ORIGIN&&!/^(?:[a-z0-9-]+\.)?atechspot\.pages\.dev$/.test(url.hostname)&&url.hostname!=='staging.atechspot.com')throw Error('invalid_staging_origin');
 return value;
}
const SKU='reseller_playbook_v1';
const FILE='products/reseller-playbook-v1.pdf';
const TERMS='2026-10-03-v2';
const headers={'cache-control':'no-store, max-age=0','x-content-type-options':'nosniff','referrer-policy':'no-referrer','x-robots-tag':'noindex, nofollow'};
const answer=(status,body)=>new Response(JSON.stringify(body),{status,headers:{...headers,'content-type':'application/json'}});
const client=env=>new Stripe(env.STRIPE_API_KEY,{apiVersion:'2026-08-26.dahlia',httpClient:Stripe.createFetchHttpClient(),maxNetworkRetries:2});
const configured=env=>Boolean(env.STRIPE_API_KEY&&env.STRIPE_WEBHOOK_SECRET&&env.PLAYBOOK_PRICE_ID&&env.PLAYBOOK_WEBHOOK_ID&&env.ATECHSPOT_DOWNLOADS&&env.PLAYBOOK_DOWNLOAD_SECRET?.length>=32&&env.RESEND_API_KEY);
const sid=value=>/^cs_(live|test)_[A-Za-z0-9]{10,180}$/.test(value||'');
const live=env=>env.PLAYBOOK_MODE==='live';
const jsonObject=async(bucket,key)=>{const object=await bucket.get(key);return object?object.json():null;};
const store=(bucket,key,value)=>bucket.put(key,JSON.stringify(value),{httpMetadata:{contentType:'application/json'}});
function escape(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function encoded(bytes){return btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');}
function decoded(value){return Uint8Array.from(atob(value.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0));}
async function key(secret){return crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
export async function signDownload(env,sessionId,now=Date.now()){
 const payload=encoded(new TextEncoder().encode(JSON.stringify({sid:sessionId,exp:now+15*60*1000,purpose:'playbook-v1'})));
 const signature=encoded(await crypto.subtle.sign('HMAC',await key(env.PLAYBOOK_DOWNLOAD_SECRET),new TextEncoder().encode(payload)));
 return `${payload}.${signature}`;
}
export async function verifyDownload(env,token,now=Date.now()){
 try{
  if(typeof token!=='string'||token.length>1024)return null;
  const [payload,signature,extra]=token.split('.');if(!payload||!signature||extra)return null;
  if(!await crypto.subtle.verify('HMAC',await key(env.PLAYBOOK_DOWNLOAD_SECRET),decoded(signature),new TextEncoder().encode(payload)))return null;
  const value=JSON.parse(new TextDecoder().decode(decoded(payload)));
  return value.purpose==='playbook-v1'&&sid(value.sid)&&Number.isFinite(value.exp)&&value.exp>now&&value.exp<=now+15*60*1000?value:null;
 }catch{return null;}
}
async function preflight(env,stripe){
 const ORIGIN=originFor(env);
 if(!configured(env))throw Error('not_configured');
 const [price,hook,file]=await Promise.all([
  stripe.prices.retrieve(env.PLAYBOOK_PRICE_ID,{expand:['product']}),
  stripe.webhookEndpoints.retrieve(env.PLAYBOOK_WEBHOOK_ID),
  env.ATECHSPOT_DOWNLOADS.head(FILE)
 ]);
 const events=['checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.async_payment_failed','charge.refunded','charge.dispute.created'];
 if(!price.active||price.livemode!==live(env)||price.currency!=='usd'||price.unit_amount!==2900||price.recurring||!price.product?.active||price.product.metadata?.atechspot_product!==SKU)throw Error('invalid_price');
 if(!file||file.size<1000||file.size>20*1024*1024||file.httpMetadata?.contentType!=='application/pdf')throw Error('missing_file');
 if(hook.status!=='enabled'||hook.livemode!==live(env)||hook.url!==`${ORIGIN}/api/playbook/webhook`||!events.every(e=>hook.enabled_events.includes(e)||hook.enabled_events.includes('*')))throw Error('invalid_webhook');
 if(env.PLAYBOOK_TAX_MODE==='automatic'){
  const [settings,registrations]=await Promise.all([stripe.tax.settings.retrieve(),stripe.tax.registrations.list({status:'active',limit:100})]);
  if(settings.status!=='active'||!registrations.data.length||!price.product.tax_code||price.tax_behavior==='unspecified')throw Error('tax_not_ready');
 }else if(env.PLAYBOOK_TAX_MODE!=='reviewed_no_collection')throw Error('tax_not_reviewed');
 if(live(env)&&env.PLAYBOOK_LAUNCH_APPROVED!=='true')throw Error('launch_not_approved');
 return true;
}
async function checkout(request,env,stripe){
 const ORIGIN=originFor(env);
 if(request.headers.get('origin')!==ORIGIN)return answer(403,{message:'Open checkout from ATechSpot.'});
 if((request.headers.get('content-type')||'').split(';')[0]!=='application/json')return answer(415,{message:'Invalid request.'});
 const data=await request.json();
 if(data.termsVersion!==TERMS||data.acceptTerms!==true||!/^[a-f0-9-]{36}$/.test(data.requestId||''))return answer(400,{message:'Please accept the purchase terms before checkout.'});
 await preflight(env,stripe);
 const params={mode:'payment',line_items:[{price:env.PLAYBOOK_PRICE_ID,quantity:1}],success_url:`${ORIGIN}/playbook/thanks/#session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${ORIGIN}/playbook/?checkout=cancelled`,consent_collection:{terms_of_service:'required'},custom_text:{terms_of_service_acceptance:{message:`I agree to the [ATechSpot digital purchase terms](${ORIGIN}/playbook/terms/).`}},metadata:{atechspot_product:SKU,terms_version:TERMS},payment_intent_data:{metadata:{atechspot_product:SKU,terms_version:TERMS}},invoice_creation:{enabled:true},integration_identifier:'atechspot_playbook_abqmxrpt'};
 if(env.PLAYBOOK_TAX_MODE==='automatic')params.automatic_tax={enabled:true};
 const session=await stripe.checkout.sessions.create(params,{idempotencyKey:`playbook-${data.requestId}`});
 const target=new URL(session.url);if(target.protocol!=='https:'||target.hostname!=='checkout.stripe.com')throw Error('invalid_checkout_url');
 return answer(200,{url:session.url});
}
async function verifyPurchase(env,stripe,id){
 if(!sid(id))return null;
 const session=await stripe.checkout.sessions.retrieve(id,{expand:['line_items']});
 const lines=session.line_items;
 if(session.livemode!==live(env)||session.mode!=='payment'||session.status!=='complete'||session.payment_status!=='paid'||session.currency!=='usd'||session.amount_subtotal!==2900||session.metadata?.atechspot_product!==SKU||session.metadata?.terms_version!==TERMS||session.consent?.terms_of_service!=='accepted'||!lines||lines.has_more||lines.data.length!==1||lines.data[0].price?.id!==env.PLAYBOOK_PRICE_ID||lines.data[0].quantity!==1)return null;
 const pi=typeof session.payment_intent==='string'?session.payment_intent:session.payment_intent?.id;
 if(!pi||await env.ATECHSPOT_DOWNLOADS.head(`revoked/${pi}`))return null;
 const payment=await stripe.paymentIntents.retrieve(pi,{expand:['latest_charge']});
 if(payment.status!=='succeeded'||!payment.latest_charge||payment.latest_charge.refunded||payment.latest_charge.disputed)return null;
 return session;
}
async function deliverEmail(env,order){
 const ORIGIN=originFor(env);
 const dollars=(order.total/100).toFixed(2);
 const link=`${ORIGIN}/playbook/thanks/#session_id=${encodeURIComponent(order.id)}`;
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{authorization:`Bearer ${env.RESEND_API_KEY}`,'content-type':'application/json','idempotency-key':`playbook-delivery-${order.id}`},body:JSON.stringify({from:'ATechSpot <hello@atechspot.com>',to:[order.email],reply_to:'support@atechspot.com',subject:'Your ATechSpot PDF playbook is ready',html:`<h1>Your playbook is ready</h1><p>Thank you for purchasing The A to Z Reseller Operations Playbook.</p><p>Order: ${escape(order.id)}<br>Total paid: $${dollars} USD, including any tax collected.</p><p><a href="${escape(link)}">Open your private download page</a></p><p>Keep this link private. Download links expire after 15 minutes; reopen this page to get a fresh one. Personal business use only. No redistribution or resale.</p><p>Need help? Reply to this email. <a href="${ORIGIN}/playbook/terms/">Purchase terms</a></p>`})});
 if(!response.ok)throw Error('email_delivery_failed');
}
async function webhook(request,env,stripe){
 const body=await request.text();if(body.length>1024*1024)return answer(413,{message:'Request too large.'});
 let event;try{event=await stripe.webhooks.constructEventAsync(body,request.headers.get('stripe-signature'),env.STRIPE_WEBHOOK_SECRET,300,Stripe.createSubtleCryptoProvider());}catch{return answer(400,{message:'Invalid signature.'});}
 if(event.livemode!==live(env))return answer(400,{message:'Environment mismatch.'});
 const bucket=env.ATECHSPOT_DOWNLOADS;
 if(await bucket.head(`events/${event.id}`))return answer(200,{received:true});
 const object=event.data.object;
 if(['charge.refunded','charge.dispute.created'].includes(event.type)){
  if(event.type==='charge.dispute.created'||object.refunded===true){
   let pi=typeof object.payment_intent==='string'?object.payment_intent:object.payment_intent?.id;
   if(!pi&&object.charge){const charge=await stripe.charges.retrieve(typeof object.charge==='string'?object.charge:object.charge.id);pi=typeof charge.payment_intent==='string'?charge.payment_intent:charge.payment_intent?.id;}
   if(pi)await store(bucket,`revoked/${pi}`,{event:event.id,reason:event.type,at:Date.now()});
  }
 }else if(['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type)&&object.payment_status==='paid'){
  const session=await verifyPurchase(env,stripe,object.id);
  if(session){
   const email=session.customer_details?.email;
   if(!email||!/^\S+@\S+\.\S+$/.test(email))throw Error('missing_delivery_email');
   const pi=typeof session.payment_intent==='string'?session.payment_intent:session.payment_intent.id;
   // Immutable paid order; R2 is strongly consistent. Concurrent deliveries use provider idempotency.
   await bucket.put(`orders/${session.id}`,JSON.stringify({id:session.id,paymentIntent:pi,email,total:session.amount_total,terms:TERMS,created:Date.now()}),{onlyIf:{etagDoesNotMatch:'*'},httpMetadata:{contentType:'application/json'}});
   const order=await jsonObject(bucket,`orders/${session.id}`);
   await deliverEmail(env,order);
  }
 }else if(event.type==='checkout.session.async_payment_failed'&&sid(object.id)){
  await store(bucket,`failed/${object.id}`,{at:Date.now()});
 }
 await store(bucket,`events/${event.id}`,{at:Date.now()});
 return answer(200,{received:true});
}
async function access(request,env,stripe){
 const ORIGIN=originFor(env);
 if(request.headers.get('origin')!==ORIGIN)return answer(403,{message:'Open your download page on ATechSpot.'});
 const {sessionId}=await request.json();if(!sid(sessionId))return answer(400,{message:'Your order link is invalid.'});
 if(await env.ATECHSPOT_DOWNLOADS.head(`failed/${sessionId}`))return answer(402,{message:'Payment was not completed. No download access was granted. Contact support if you believe you were charged.'});
 const order=await jsonObject(env.ATECHSPOT_DOWNLOADS,`orders/${sessionId}`);
 if(!order)return answer(202,{pending:true,message:'Payment confirmation is pending. Recheck shortly or use the email we send after confirmation.'});
 if(!await verifyPurchase(env,stripe,sessionId))return answer(403,{message:'Download access is unavailable. Contact support with your order reference.'});
 return answer(200,{url:`/api/playbook/download?token=${await signDownload(env,sessionId)}`,expiresMinutes:15});
}
async function download(url,env,stripe){
 const payload=await verifyDownload(env,url.searchParams.get('token'));if(!payload)return answer(403,{message:'Download link expired or invalid. Reopen your order email for a fresh link.'});
 const order=await jsonObject(env.ATECHSPOT_DOWNLOADS,`orders/${payload.sid}`);
 if(!order||!await verifyPurchase(env,stripe,payload.sid))return answer(403,{message:'Download access is unavailable. Contact support.'});
 const file=await env.ATECHSPOT_DOWNLOADS.get(FILE);if(!file)return answer(503,{message:'File temporarily unavailable. Contact support.'});
 return new Response(file.body,{headers:{...headers,'content-type':'application/pdf','content-disposition':'attachment; filename="A-to-Z-Reseller-Operations-Playbook.pdf"','content-length':String(file.size)}});
}
export async function handlePlaybook(request,env){
 const url=new URL(request.url);if(!url.pathname.startsWith('/api/playbook/'))return null;
 const methods={'/api/playbook/status':'GET','/api/playbook/checkout':'POST','/api/playbook/access':'POST','/api/playbook/download':'GET','/api/playbook/webhook':'POST'};
 if(!methods[url.pathname])return answer(404,{message:'Not found.'});
 if(request.method!==methods[url.pathname])return answer(405,{message:'Method not allowed.'});
 try{
  if(url.pathname==='/api/playbook/status'){
   if(!configured(env))return answer(200,{available:false,price:29,currency:'USD'});
   await preflight(env,client(env));return answer(200,{available:live(env)||originFor(env)!==PRODUCTION_ORIGIN,sandbox:!live(env),price:29,currency:'USD'});
  }
  if(!configured(env))return answer(503,{message:'Purchases and downloads are not available yet. No payment was taken.'});
  const stripe=client(env);
  if(url.pathname==='/api/playbook/checkout')return await checkout(request,env,stripe);
  if(url.pathname==='/api/playbook/webhook')return await webhook(request,env,stripe);
  if(url.pathname==='/api/playbook/access')return await access(request,env,stripe);
  return await download(url,env,stripe);
 }catch{
  // Do not log session URLs, buyer data, webhook bodies, keys or provider responses.
  return answer(503,{message:'This request could not be completed. Please retry later or contact support.'});
 }
}
