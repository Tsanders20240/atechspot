function trustedOrigin(value){
  if(!value)return true;
  try{
    const u=new URL(value);
    return u.protocol==="https:" && (u.hostname==="atechspot.com" || u.hostname.endsWith(".atechspot.com"));
  }catch{return false}
}

export async function onRequest(context) {
  const requestId = crypto.randomUUID();
  const started = Date.now();
  context.data = context.data || {};
  context.data.requestId = requestId;

  try {
    const method=context.request.method.toUpperCase();
    const url=new URL(context.request.url);
    const mutating=["POST","PUT","PATCH","DELETE"].includes(method);
    if(mutating && url.pathname.startsWith("/api/") && !trustedOrigin(context.request.headers.get("Origin"))){
      return Response.json(
        {ok:false,requestId,error:"Untrusted request origin."},
        {status:403,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}}
      );
    }

    const response = await context.next();
    const headers = new Headers(response.headers);
    headers.set("X-ATechSpot-Request-ID", requestId);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    headers.set("X-ATechSpot-Edge-Time", String(Date.now() - started));

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  } catch (error) {
    console.error("phase2_unhandled_error", { requestId, message: error?.message });
    return Response.json(
      { ok: false, requestId, error: "Internal platform error" },
      { status: 500, headers: { "Cache-Control": "no-store", "X-Content-Type-Options":"nosniff" } }
    );
  }
}
