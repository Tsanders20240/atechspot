const status=document.querySelector('#download-status');
const link=document.querySelector('#download-link');
const retry=document.querySelector('#retry');
const params=new URLSearchParams(location.hash.slice(1));
let sessionId=params.get('session_id');
// Remove the bearer order reference from the visible URL. Keep it only for this tab's session.
if(sessionId){sessionStorage.setItem('atechspot_playbook_order',sessionId);history.replaceState(null,'',location.pathname);}
else sessionId=sessionStorage.getItem('atechspot_playbook_order');
async function check(){
 link.hidden=true;retry.disabled=true;
 if(!sessionId){status.textContent='Open the private link in your purchase email. Need help? Contact support.';retry.hidden=true;return;}
 status.textContent='Checking your order securely…';
 try{
  const r=await fetch('/api/playbook/access',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sessionId})});
  const data=await r.json();status.textContent=data.message||'Your PDF is ready. This download link is valid for 15 minutes.';
  if(r.ok&&!data.pending&&data.url?.startsWith('/api/playbook/download?token=')){link.href=data.url;link.hidden=false;}
 }catch{status.textContent='We could not check your order. Retry or contact support; do not purchase again.';}
 finally{retry.disabled=false;}
}
retry.addEventListener('click',check);check();
