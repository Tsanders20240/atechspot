import {readFile} from 'node:fs/promises';
import {createHmac} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const token=process.env.CLOUDFLARE_API_TOKEN,account=process.env.CLOUDFLARE_ACCOUNT_ID;
if(!token||!account)throw new Error('Cloudflare deployment credentials required.');
const root='https://api.cloudflare.com/client/v4/accounts/'+account;
async function api(path,method='GET',body){
 const r=await fetch(root+path,{method,headers:{authorization:'Bearer '+token,'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 const data=await r.json();if(!r.ok||data.success===false){const error=new Error('Acquisition configuration failed: HTTP '+r.status+' at '+path.replace(account,'[account]'));error.status=r.status;throw error}
 return data.result;
}
const project=await api('/pages/projects/atechspot');
let id=project.deployment_configs?.production?.d1_databases?.ACQUISITION_DB?.id;
try{
if(!id){
 const databases=await api('/d1/database?name=atechspot-acquisition');
 const existing=databases.filter(d=>d.name==='atechspot-acquisition');
 if(existing.length>1)throw new Error('Ambiguous acquisition database');
 id=existing[0]?.uuid||(await api('/d1/database','POST',{name:'atechspot-acquisition'})).uuid;
}
const sql=await readFile(new URL('../migrations/acquisition.sql',import.meta.url),'utf8');
const migrated=await api('/d1/database/'+id+'/query','POST',{sql});
if(!Array.isArray(migrated)||migrated.some(r=>r.success===false))throw new Error('Acquisition migration failed');
}catch(error){
 if([401,403].includes(error.status)){
 console.log('::warning::Acquisition database activation blocked: deployment credential needs Account D1 Edit permission. Existing email flow remains active; industry pages can deploy.');
 process.exit(0);
 }
 throw error;
}
// Only patch the production binding and this secret; preserve existing email/payment settings.
const admin=createHmac('sha256',token).update('atechspot-acquisition-admin-v1').digest('hex');
console.log('::add-mask::'+admin);
await api('/pages/projects/atechspot','PATCH',{deployment_configs:{production:{d1_databases:{...project.deployment_configs?.production?.d1_databases,ACQUISITION_DB:{id}}}}});
// Wrangler updates a single secret without round-tripping or overwriting other secrets.
const secret=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','pages','secret','put','ACQUISITION_ADMIN_TOKEN','--project-name','atechspot'],{input:admin+'\n',encoding:'utf8',env:process.env});
if(secret.status!==0)throw new Error('Could not configure protected acquisition access.');
const verified=await api('/pages/projects/atechspot');
if(verified.deployment_configs?.production?.d1_databases?.ACQUISITION_DB?.id!==id)throw new Error('Database binding verification failed');
for(const name of Object.keys(project.deployment_configs?.production?.env_vars||{})){
 if(!(name in (verified.deployment_configs?.production?.env_vars||{})))throw new Error('Existing environment setting missing after configuration: '+name);
}
console.log('Acquisition database, schema and protected automation access configured.');
