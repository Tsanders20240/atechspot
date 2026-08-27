
export function onRequestGet({ env }) {
  const configured = Boolean(env.RESEND_API_KEY);
  return new Response(JSON.stringify({
    ok: configured,
    resendConfigured: configured,
    recipient: env.FORM_TO_EMAIL || "aplustechucation@gmail.com",
    sender: env.FORM_FROM_EMAIL || "A+ Techucation Website <onboarding@resend.dev>",
    deployment: "V14-EMAIL-RECIPIENT-FINAL"
  }), {
    status: configured ? 200 : 503,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
