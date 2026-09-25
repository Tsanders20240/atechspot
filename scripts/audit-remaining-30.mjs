const targets = [
  [1,"ATechSpot","https://www.atechspot.com/","public"],
  [2,"A+ Techucation Academy","https://atechucation.atechspot.com/","public"],
  [3,"ATechSpot Creator","https://creator.atechspot.com/","public"],
  [4,"ABC of Technology","https://www.abcoftech.atechspot.com/","public"],
  [5,"ABC Tech Products","https://abctechproducts.atechspot.com/","public"],
  [6,"ATechSpot DJI","https://www.atechspot.com/dji/","public"],
  [7,"A+ Automotive Technology","https://auto.atechspot.com/","public"],
  [8,"A+ Credit Education","https://credit.atechspot.com/","public"],
  [9,"ASCR Financial","https://ascrfinancial.atechspot.com/","public"],
  [10,"A Clean Sweep","https://acleansweep.atechspot.com/","public"],
  [11,"Vision of Sanders","https://visionofsanders.atechspot.com/","public"],
  [12,"A Studio MX","https://astudiomx.atechspot.com/","public"],
  [13,"I Am Modeling","https://iammodeling.atechspot.com/","public"],
  [14,"HÄZIL","https://hazil.atechspot.com/","public"],
  [15,"HazilFlix","https://hazilflix.atechspot.com/","public"],
  [16,"ATech Network","https://atechnetwork.atechspot.com/","public"],
  [17,"A+ Techucation Figures","https://atechucationfigures.atechspot.com/","public"],
  [18,"Royal Up With The Hughes","https://royalupwiththehughes.atechspot.com/","public"],
  [19,"Mr. A Plus Portfolio","https://mraplusportfolio.atechspot.com/","public"],
  [20,"WarriorJ","https://warriorj.atechspot.com/","public"],
  [21,"ATechSpot RemoteCare","https://remotecare.atechspot.com/","public"],
  [22,"ATechSpot Tech Guru","https://techguru.atechspot.com/","public"],
  [23,"Start","https://start.atechspot.com/","router"],
  [32,"Partners","https://partners.atechspot.com/","operations"],
  [33,"Vendor Portal","https://vendors.atechspot.com/","operations"],
  [34,"Shop","https://shop.atechspot.com/","operations"],
  [35,"Press / Media Center","https://press.atechspot.com/","operations"],
  [36,"Developer Portal","https://developers.atechspot.com/","operations"],
  [37,"Internal Operations","https://ops.atechspot.com/","private"],
  [38,"ATechSpot Reseller","https://reseller.atechspot.com/","public"]
];

const textFrom = (html, regex) => (html.match(regex)?.[1] || "").trim().replace(/\s+/g," ");
const attrTag = (html,name) => {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  return tags.find(t => new RegExp(`name=["']${name}["']`,"i").test(t)) || "";
};
const canonicalTag = html => (html.match(/<link\b[^>]*rel=["'][^"']*canonical[^"']*["'][^>]*>/i)||[])[0]||"";
const hasErrorPage = html => /(404 not found|page not found|domain not configured|application error|site not found)/i.test(html);

async function check([id,name,url,kind]) {
  const out={id,name,url,kind,reasons:[],warnings:[]};
  try {
    const res = await fetch(url,{redirect:"follow",headers:{"user-agent":"ATechSpot-Certification/2026"}});
    out.status=res.status;
    out.finalUrl=res.url;
    out.headers=Object.fromEntries(res.headers.entries());
    const ct=res.headers.get("content-type")||"";
    const html = ct.includes("text/html") ? await res.text() : "";
    out.title=textFrom(html,/<title[^>]*>([\s\S]*?)<\/title>/i);
    out.hasViewport=!!attrTag(html,"viewport");
    out.hasDescription=!!attrTag(html,"description");
    out.hasCanonical=!!canonicalTag(html);
    out.hasCsp=!!res.headers.get("content-security-policy");
    out.hasNosniff=(res.headers.get("x-content-type-options")||"").toLowerCase().includes("nosniff");
    out.hasHsts=!!res.headers.get("strict-transport-security");

    if(kind==="private"){
      if(![200,401,403].includes(res.status)) out.reasons.push("private_ops_unreachable");
    } else if(!res.ok){
      out.reasons.push("bad_http_"+res.status);
    }

    if(html && hasErrorPage(html)) out.reasons.push("error_page_content");

    if(kind!=="router" && res.ok && html){
      if(!out.title) out.reasons.push("missing_title");
      if(!out.hasViewport) out.reasons.push("missing_viewport");
    }

    if(kind==="public" && res.ok && html){
      if(!out.hasDescription) out.reasons.push("missing_meta_description");
      if(!out.hasCanonical) out.warnings.push("missing_canonical");
    }

    if(kind==="router"){
      if(res.url===url) out.reasons.push("router_did_not_redirect");
    }

    if(!out.hasNosniff) out.warnings.push("missing_nosniff");
    if(!out.hasHsts) out.warnings.push("missing_hsts");
    if(!out.hasCsp) out.warnings.push("missing_csp");

    if(id===1 && !/Start My Project/i.test(html)) out.reasons.push("primary_cta_missing");
    if(id===21 && !/support/i.test(html)) out.reasons.push("remotecare_support_copy_missing");
    if(id===38 && !/resell|reseller/i.test(html)) out.reasons.push("reseller_identity_missing");
    if(id===11 && !/Vision of Sanders/i.test(html)) out.reasons.push("vision_identity_missing");
    if(id===13 && !/I AM MODELING|I Am Modeling/i.test(html)) out.reasons.push("iam_identity_missing");
    if(id===8 && !/education/i.test(html)) out.reasons.push("credit_education_positioning_missing");
    if(id===32 && !/partnership/i.test(html)) out.reasons.push("partners_identity_missing");
    if(id===33 && !/vendor/i.test(html)) out.reasons.push("vendor_identity_missing");
    if(id===35 && !/press|media/i.test(html)) out.reasons.push("press_identity_missing");
    if(id===36 && !/developer/i.test(html)) out.reasons.push("developer_identity_missing");
  } catch (e) {
    out.status=0; out.finalUrl=""; out.reasons.push("fetch_error_"+e.name);
  }
  return out;
}

const results=[];
for(const target of targets) results.push(await check(target));

let green=0, review=0;
for(const r of results){
  const status=r.reasons.length?"REVIEW":"GREEN";
  if(status==="GREEN") green++; else review++;
  console.log(`${status} | #${r.id} | ${r.name} | http=${r.status} | final=${r.finalUrl} | title=${r.title||"-"} | reasons=${r.reasons.join(",")||"-"} | warnings=${r.warnings.join(",")||"-"}`);
}
console.log(`SUMMARY | green=${green} | review=${review} | total=${results.length}`);
if(results.length!==30) process.exit(2);
if(review>0) process.exit(1);
