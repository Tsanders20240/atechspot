import h1 from './.image-parts/hero-01.b64';
import h2 from './.image-parts/hero-full-02.b64';
import h3 from './.image-parts/hero-full-03.b64';
import h4 from './.image-parts/hero-full-04.b64';
import h5 from './.image-parts/hero-full-05.b64';
import h6 from './.image-parts/hero-full-06.b64';
import c1 from './.image-parts/cards-01.b64';
import c2 from './.image-parts/cards-02.b64';
import c3 from './.image-parts/cards-03.b64';
import c4 from './.image-parts/cards-04.b64';
import c5 from './.image-parts/cards-05.b64';
import c6 from './.image-parts/cards-06.b64';
import c7 from './.image-parts/cards-07.b64';
import c8 from './.image-parts/cards-08.b64';

const HERO=h1+h2+h3+h4+h5+h6;
const CARDS=c1+c2+c3+c4+c5+c6+c7+c8;
let heroBytes,cardBytes;
function decode64(value){
  const binary=atob(value.replace(/\s+/g,''));
  const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
  return bytes;
}
export function mediaResponse(path){
  let bytes;
  if(path==='/media/hero.webp') bytes=heroBytes||(heroBytes=decode64(HERO));
  else if(path==='/media/cards.webp') bytes=cardBytes||(cardBytes=decode64(CARDS));
  else return null;
  return new Response(bytes,{headers:{
    'content-type':'image/webp',
    'cache-control':'public,max-age=31536000,immutable',
    'x-content-type-options':'nosniff'
  }});
}
