import { cleanText, json } from "../../_lib/http.js";

export async function onRequestGet(context){
  if(!context.env.DB)return json({ok:false,error:"Database unavailable."},503);
  const url=new URL(context.request.url);
  const q=cleanText(url.searchParams.get("q")||"",120);
  let statement,bind=[];
  if(q){
    statement=context.env.DB.prepare(
      `SELECT slug,title,body,updated_at FROM articles
       WHERE status='published' AND (title LIKE ? OR body LIKE ?)
       ORDER BY updated_at DESC LIMIT 30`
    );
    bind=[`%${q}%`,`%${q}%`];
  }else{
    statement=context.env.DB.prepare(
      "SELECT slug,title,body,updated_at FROM articles WHERE status='published' ORDER BY updated_at DESC LIMIT 30"
    );
  }
  const result=await statement.bind(...bind).all();
  return json({ok:true,query:q,articles:result.results||[]});
}
