import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const src=path.join(root,'src');
const out=path.join(root,'public');
fs.mkdirSync(out,{recursive:true});

const readParts=(prefix)=>fs.readdirSync(src)
  .filter(name=>name.startsWith(prefix+'.')&&name.endsWith('.b64'))
  .sort()
  .map(name=>fs.readFileSync(path.join(src,name),'utf8').trim())
  .join('');

let html=fs.readFileSync(path.join(src,'index.template.html'),'utf8');
for (const n of [1,2,3]) {
  const b64=readParts('img'+n);
  if (!b64) throw new Error('Missing image data for img'+n);
  html=html.replaceAll('__IMG'+n+'__','data:image/jpeg;base64,'+b64);
}
if (/__IMG[123]__/.test(html)) throw new Error('Unresolved image placeholder');
fs.writeFileSync(path.join(out,'index.html'),html);
console.log('Built public/index.html',Buffer.byteLength(html),'bytes');