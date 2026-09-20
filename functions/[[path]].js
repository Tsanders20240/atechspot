import { appFromUrl } from "./_lib/platform.js";
import { getSession } from "./_lib/auth.js";
import { rolesFor } from "./_lib/access.js";
import { opsControlCenterPage } from "./_lib/ops-page.js";
import {
  accountPage, bookingPage, intakePage, clientPage, payPage,
  supportPage, helpPage, statusPage, shopPage, partnerPage, vendorPage, publicInfoPage
} from "./_lib/pages.js";

const customerApps=new Set(["book","intake","pay","clients","support","partners","vendors"]);

function redirectToLogin(url){
  const login=new URL("https://account.atechspot.com/");
  login.searchParams.set("returnTo",url.toString());
  return Response.redirect(login.toString(),302);
}

export async function onRequest(context){
  const url=new URL(context.request.url);
  const app=appFromUrl(url);

  if(!app) return context.next();
  if(url.pathname.startsWith("/api/")) return context.next();

  let session=null;
  if(context.env.DB) session=await getSession(context);

  if(app.key==="ops"){
    if(!session) return redirectToLogin(url);
    const roles=await rolesFor(context,session.user_id);
    const allowed=new Set(["executive","system_admin","manager"]);
    if(!roles.some(r=>allowed.has(r.id))){
      return new Response("Forbidden",{status:403,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
    }
  }else if(customerApps.has(app.key) && !session){
    return redirectToLogin(url);
  }

  let html;
  switch(app.key){
    case "account": html=accountPage(); break;
    case "ops": html=opsControlCenterPage(session); break;
    case "book": html=bookingPage(); break;
    case "intake": html=intakePage(); break;
    case "pay": html=payPage(); break;
    case "clients": html=clientPage(); break;
    case "support": html=supportPage(); break;
    case "help": html=helpPage(); break;
    case "status": html=statusPage(); break;
    case "shop": html=shopPage(); break;
    case "partners": html=partnerPage(); break;
    case "vendors": html=vendorPage(); break;
    default: html=publicInfoPage(app);
  }

  return new Response(html,{
    headers:{
      "Content-Type":"text/html; charset=UTF-8",
      "Cache-Control":"no-store",
      "Content-Security-Policy":"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
      "X-Robots-Tag":app.access==="public"?"all":"noindex, nofollow"
    }
  });
}
