import { json } from "../../_lib/http.js";

export async function onRequestGet(context){
  if(!context.env.DB)return json({ok:false,error:"Database unavailable."},503);
  const result=await context.env.DB.prepare(
    `SELECT id,slug,name,description,price_cents,currency,product_type,payment_url
     FROM products WHERE status='published' ORDER BY created_at DESC LIMIT 100`
  ).all();
  return json({ok:true,products:result.results||[]});
}
