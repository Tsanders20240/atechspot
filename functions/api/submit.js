const H = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const clean = (value, max = 2500) =>
  String(value ?? "").replace(/\u0000/g, "").trim().slice(0, max);

const reply = (status, message) =>
  new Response(JSON.stringify({ ok: status < 400, message }), {
    status,
    headers: H
  });

const validEmail = value =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value) && value.length <= 254;

const esc = value =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

export async function onRequestPost({ request, env }) {
  const url = new URL(request.url);
  const host = url.hostname;
  const allowedHosts = (env.ALLOWED_HOSTS || host)
    .split(",")
    .map(value => value.trim())
    .filter(Boolean);

  if (!allowedHosts.includes(host)) {
    return reply(403, "Unauthorized host.");
  }

  const origin = request.headers.get("Origin");
  if (origin) {
    try {
      if (new URL(origin).hostname !== host) {
        return reply(403, "Unauthorized form origin.");
      }
    } catch {
      return reply(403, "Unauthorized form origin.");
    }
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return reply(400, "Invalid form data.");
  }

  // Honeypot: bots commonly fill hidden fields.
  if (clean(body.website, 100)) {
    return reply(200, "Thank you.");
  }

  // Timing check: blocks instant automated submissions.
  const startedAt = Number(body.form_started_at || 0);
  const elapsed = Date.now() - startedAt;
  if (!startedAt || elapsed < 3000 || elapsed > 86400000) {
    return reply(400, "Please reload the page and complete the form again.");
  }

  const name = clean(body["Full Name"] || body.Name, 120);
  const email = clean(body.Email, 254);

  if (name.length < 2 || !validEmail(email)) {
    return reply(400, "Enter a valid name and email.");
  }

  const fields = {};
  for (const [key, value] of Object.entries(body)) {
    if (["website", "form_started_at", "cf-turnstile-response"].includes(key)) continue;
    fields[clean(key, 100)] = clean(value, 4000);
  }

  const combinedText = Object.values(fields).join("\n");
  const linkCount = (combinedText.match(/https?:\/\/|www\./gi) || []).length;

  if (
    linkCount > 2 ||
    /<\s*(script|iframe|object|embed)/i.test(combinedText)
  ) {
    return reply(400, "Submission rejected.");
  }

  if (!env.RESEND_API_KEY || !env.FORM_TO_EMAIL || !env.FORM_FROM_EMAIL) {
    return reply(
      503,
      "Email delivery is not configured. Please call (713) 396-2993 or email aplustechucation@gmail.com."
    );
  }

  const rows = Object.entries(fields)
    .map(([key, value]) =>
      `<tr>
        <th style="text-align:left;padding:8px;border:1px solid #ddd">${esc(key)}</th>
        <td style="padding:8px;border:1px solid #ddd">${esc(value).replace(/\n/g, "<br>")}</td>
      </tr>`
    )
    .join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from: env.FORM_FROM_EMAIL,
      to: [env.FORM_TO_EMAIL],
      reply_to: email,
      subject: `[Website Lead] ${clean(body.form_type || "Website Form", 100)} — ${name}`,
      html: `<h2>New website lead</h2><table style="border-collapse:collapse">${rows}</table>`
    })
  });

  if (!response.ok) {
    return reply(
      503,
      "Delivery is temporarily unavailable. Please call (713) 396-2993 or email aplustechucation@gmail.com."
    );
  }

  return reply(200, "Thank you. Your request was sent successfully.");
}

export function onRequestGet() {
  return reply(405, "Method not allowed.");
}
