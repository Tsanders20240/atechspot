(() => {
const status=document.getElementById('status'),started=Date.now(),stages=['new','contacted','discovery','qualified','proposal','won','lost','suppressed'];
let leads=[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function api(path,method='GET',body){
 const r=await fetch('/api/acquisition/'+path,{method,credentials:'same-origin',headers:{'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 if(r.status===401){document.getElementById('login').hidden=false;document.getElementById('desk').hidden=true;throw Error('Sign in to view your acquisition records.')}
 if(r.status===204)return {};
 const data=await r.json();if(!r.ok)throw Error(data.message||'Request failed');return data;
}
const localDate=s=>{const d=new Date(s);return new Date(d-d.getTimezoneOffset()*60000).toISOString().slice(0,16)};
async function refresh(){
 try{
 const data=await api('leads');leads=data.leads;
 document.getElementById('login').hidden=true;document.getElementById('desk').hidden=false;
 document.getElementById('leads').innerHTML=leads.map(l=>'<tr data-id="'+esc(l.id)+'"><td><b>'+esc(l.company||l.name)+'</b><p>'+esc(l.name)+'<br>'+esc(l.email)+'</p><p>'+esc(l.source)+' / '+esc(l.campaign)+'</p><small>'+esc(l.id)+'</small></td><td>'+esc(l.qualification)+'<p>'+esc(l.service_interest)+'</p><p>Budget: '+esc(l.budget||'Unconfirmed')+'</p></td><td><label>Next action<textarea data-field="next_action">'+esc(l.next_action)+'</textarea></label><label>Due<input type="datetime-local" data-field="next_action_at" value="'+localDate(l.next_action_at)+'"></label></td><td><label>Stage<select data-field="status">'+stages.map(s=>'<option '+(s===l.status?'selected':'')+'>'+s+'</option>').join('')+'</select></label><label>Estimated value ($)<input type="number" min="0" data-field="estimated_deal_value" value="'+esc(l.estimated_deal_value)+'"></label></td><td><button data-action="save">Save lead</button><button data-action="complete">Record completed project</button></td></tr>').join('');
 const proof=await api('proof');document.getElementById('proof').innerHTML=proof.proof.map(p=>'<details data-project="'+esc(p.project_id)+'"><summary>'+esc(p.project_id)+' · '+esc(p.status)+'</summary><label>Baseline<textarea data-field="baseline">'+esc(p.baseline)+'</textarea></label><label>Measured result<textarea data-field="result">'+esc(p.result)+'</textarea></label><label>Evidence location<input data-field="evidence_url" value="'+esc(p.evidence_url)+'"></label><label>Client testimonial<textarea data-field="testimonial">'+esc(p.testimonial)+'</textarea></label><label><input type="checkbox" data-field="verified" '+(p.verified?'checked':'')+'> Result checked against evidence</label><label><input type="checkbox" data-field="publication_permission" '+(p.publication_permission?'checked':'')+'> Client publication permission recorded</label><button data-action="draft">Save proof draft</button><button data-action="approve">Approve proof</button></details>').join('');
 status.textContent='Loaded '+leads.length+' lead records.';
 }catch(e){status.textContent=e.message}
}
document.getElementById('access').onsubmit=async e=>{e.preventDefault();const b=e.target.querySelector('button');b.disabled=true;try{status.textContent=(await api('access','POST',{email:document.getElementById('email').value,started})).message}catch(e){status.textContent=e.message}finally{b.disabled=false}};
document.getElementById('refresh').onclick=refresh;
document.getElementById('logout').onclick=async()=>{try{await api('logout','POST');location.reload()}catch(e){status.textContent=e.message}};
document.getElementById('leads').onclick=async e=>{
 const button=e.target.closest('button');if(!button)return;button.disabled=true;const row=button.closest('tr');
 try{
 if(button.dataset.action==='save'){
 const body={id:row.dataset.id};row.querySelectorAll('[data-field]').forEach(el=>body[el.dataset.field]=el.value);
 body.estimated_deal_value=body.estimated_deal_value===''?null:Number(body.estimated_deal_value);
 body.next_action_at=new Date(body.next_action_at).toISOString();await api('lead','PATCH',body);status.textContent='Lead updated and follow-up task scheduled.';
 }else{
 const project=prompt('Enter the unique ID for the client project that has actually been completed.');if(!project)return;
 await api('project-completed','POST',{lead_id:row.dataset.id,project_id:project});await refresh();status.textContent='Proof collection task created.';
 }
 }catch(e){status.textContent=e.message}finally{button.disabled=false}
};
document.getElementById('proof').onclick=async e=>{
 const b=e.target.closest('button');if(!b)return;b.disabled=true;
 try{const d=b.closest('details'),body={project_id:d.dataset.project,status:b.dataset.action==='approve'?'approved':'collecting'};d.querySelectorAll('[data-field]').forEach(el=>body[el.dataset.field]=el.type==='checkbox'?el.checked:el.value);await api('proof','PATCH',body);await refresh();status.textContent='Proof record saved.'}catch(e){status.textContent=e.message}finally{b.disabled=false}
};
document.getElementById('csv').onclick=()=>{
 const keys=['id','company','name','email','source','campaign','service_interest','budget','qualification','status','next_action','next_action_at','estimated_deal_value'];
 const cell=v=>{let s=String(v??'');if(/^[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'};
 const csv=keys.map(cell).join(',')+'\r\n'+leads.map(l=>keys.map(k=>cell(l[k])).join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='ATechSpot-Leads.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
if(new URLSearchParams(location.search).has('error'))status.textContent='That sign-in link expired or was already used. Request a new one.';
refresh();
})();
