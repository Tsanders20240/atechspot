const form=document.querySelector('#purchase-form');
const status=document.querySelector('#purchase-status');
const button=document.querySelector('#purchase-button');
const terms=document.querySelector('#accept-terms');
let requestId=crypto.randomUUID();
async function availability(){
 try{const r=await fetch('/api/playbook/status',{cache:'no-store'});const data=await r.json();
  if(!data.available)return;
  form.hidden=false;if(data.sandbox)button.textContent='Test checkout · $29 (no real charge)';document.querySelector('#availability-inquiry').hidden=true;
  status.textContent='$29 USD, one-time. Any applicable tax is shown at checkout. Your private PDF access is sent after confirmed payment.';
 }catch{/* Keep the existing availability inquiry visible. */}
}
terms?.addEventListener('change',()=>{button.disabled=!terms.checked;});
form?.addEventListener('submit',async event=>{
 event.preventDefault();if(!terms.checked)return;button.disabled=true;status.textContent='Opening secure checkout…';
 try{
  const r=await fetch('/api/playbook/checkout',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({acceptTerms:true,termsVersion:'2026-10-03-v2',requestId})});
  const data=await r.json();if(!r.ok||!data.url)throw Error(data.message||'Checkout is temporarily unavailable.');
  const url=new URL(data.url);if(url.protocol!=='https:'||url.hostname!=='checkout.stripe.com')throw Error('Checkout is temporarily unavailable.');
  window.location.assign(url.toString());
 }catch(error){status.textContent=error.message;button.disabled=!terms.checked;}
});
if(new URLSearchParams(location.search).get('checkout')==='cancelled')status.textContent='Checkout was cancelled. No new purchase was confirmed. You can return when ready.';
availability();
