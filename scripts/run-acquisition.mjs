import {createHmac} from 'node:crypto';
const token=process.env.CLOUDFLARE_API_TOKEN;if(!token)throw new Error('Cloudflare credential required.');
const admin=createHmac('sha256',token).update('atechspot-acquisition-admin-v1').digest('hex');
const r=await fetch('https://www.atechspot.com/api/acquisition/run',{method:'POST',headers:{authorization:'Bearer '+admin}});
if(!r.ok)throw new Error('Acquisition task runner returned HTTP '+r.status);
const result=await r.json();console.log(JSON.stringify(result));
if(result.failed)throw new Error('Some tasks failed; automatic retries are queued. Inspect the task table.');
