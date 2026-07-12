
const HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const clean = (value, max = 4000) =>
  String(value ?? "").replace(/\u0000/g, "").trim().slice(0, max);

const escapeHtml = value =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const json = (status, message) =>
  new Response(JSON.stringify({ ok: status < 400, message }), {
    status,
    headers: HEADERS
  });

const validEmail = value =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value) && value.length <= 254;

async function parseRequest(request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) return request.json();
  if (type.includes("form")) {
    const form = await request.formData();
    return Object.fromEntries(form.entries());
  }
  throw new Error("Unsupported content type");
}

async function sendLead({ request, env, leadType, requiredFields = [] }) {
  const origin = request.headers.get("Origin");
  if (origin) {
    try {
      const hostname = new URL(origin).hostname;
      const allowed = (env.ALLOWED_HOSTS || "www.atechspot.com,atechspot.com,atechspot.pages.dev")
        .split(",")
        .map(v => v.trim())
        .filter(Boolean);
      if (!allowed.includes(hostname)) return json(403, "Unauthorized form origin.");
    } catch {
      return json(403, "Unauthorized form origin.");
    }
  }

  let body;
  try {
    body = await parseRequest(request);
  } catch {
    return json(400, "Invalid form submission.");
  }

  // Honeypot
  if (clean(body.website, 100)) return json(200, "Thank you.");

  // Minimum form completion time
  const startedAt = Number(body.form_started_at || 0);
  const elapsed = Date.now() - startedAt;
  if (!startedAt || elapsed < 2500 || elapsed > 86400000) {
    return json(400, "Please reload the page and complete the form again.");
  }

  const name = clean(body["Full Name"] || body.Name, 120);
  const email = clean(body.Email, 254);

  if (name.length < 2 || !validEmail(email)) {
    return json(400, "Enter a valid name and email address.");
  }

  for (const field of requiredFields) {
    if (!clean(body[field], 4000)) return json(400, `Complete the ${field} field.`);
  }

  const ignored = new Set(["website", "form_started_at", "cf-turnstile-response"]);
  const safeFields = {};
  for (const [key, value] of Object.entries(body)) {
    if (ignored.has(key)) continue;
    safeFields[clean(key, 100)] = clean(value, 4000);
  }

  const combined = Object.values(safeFields).join("\n");
  const links = (combined.match(/https?:\/\/|www\./gi) || []).length;
  if (links > 3 || /<\s*(script|iframe|object|embed)/i.test(combined)) {
    return json(400, "Submission rejected.");
  }

  if (!env.RESEND_API_KEY || !env.FORM_FROM_EMAIL) {
    return json(503, "Automatic email delivery is not configured.");
  }

  const to = env.FORM_TO_EMAIL || "aplustechucation@gmail.com";
  const rows = Object.entries(safeFields)
    .map(([key, value]) => `
      <tr>
        <th style="text-align:left;padding:8px;border:1px solid #d8e0e8;background:#f4f7fa">${escapeHtml(key)}</th>
        <td style="padding:8px;border:1px solid #d8e0e8">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
      </tr>`)
    .join("");

  const resend = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from: env.FORM_FROM_EMAIL,
      to: [to],
      reply_to: email,
      subject: `[AtechSpot Website] ${leadType} — ${name}`,
      html: `
        <h2>${escapeHtml(leadType)}</h2>
        <p>A new request was submitted on AtechSpot.com.</p>
        <table style="border-collapse:collapse;width:100%;max-width:850px">${rows}</table>
      `
    })
  });

  if (!resend.ok) {
    return json(503, "Email delivery is temporarily unavailable.");
  }

  return json(200, "Thank you. Your request was sent successfully.");
}

export async function onRequestPost({ request, env }) {
  return sendLead({
    request,
    env,
    leadType: "Contact Form",
    requiredFields: ["Topic", "Message"]
  });
}

export function onRequestGet() {
  return json(405, "Method not allowed.");
}
