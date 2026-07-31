
const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const json = (status, payload) =>
  new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS });

const clean = (value, max = 4000) =>
  String(value ?? "").replace(/\u0000/g, "").trim().slice(0, max);

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const validEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value) && value.length <= 254;

async function parseBody(request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) return request.json();
  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

async function deliverLead({ request, env, leadType, requiredFields }) {
  let body;
  try {
    body = await parseBody(request);
  } catch {
    return json(400, { ok: false, message: "Invalid form submission." });
  }

  if (clean(body.website, 100)) {
    return json(200, { ok: true, message: "Thank you." });
  }

  const started = Number(body.form_started_at || 0);
  const elapsed = Date.now() - started;
  if (!started || elapsed < 1500 || elapsed > 86400000) {
    return json(400, {
      ok: false,
      message: "Please reload the page and complete the form again."
    });
  }

  const name = clean(body["Full Name"] || body.Name, 120);
  const email = clean(body.Email, 254);

  if (name.length < 2 || !validEmail(email)) {
    return json(400, {
      ok: false,
      message: "Enter a valid name and email address."
    });
  }

  for (const field of requiredFields) {
    if (!clean(body[field], 4000)) {
      return json(400, {
        ok: false,
        message: `Complete the ${field} field.`
      });
    }
  }

  if (!env.RESEND_API_KEY) {
    return json(503, {
      ok: false,
      code: "MISSING_RESEND_KEY",
      message: "Email delivery is not configured yet."
    });
  }

  const ignored = new Set(["website", "form_started_at", "cf-turnstile-response"]);
  const fields = {};
  for (const [key, value] of Object.entries(body)) {
    if (!ignored.has(key)) fields[clean(key, 100)] = clean(value, 4000);
  }

  const combined = Object.values(fields).join("\n");
  if ((combined.match(/https?:\/\/|www\./gi) || []).length > 4) {
    return json(400, { ok: false, message: "Submission rejected." });
  }
  if (/<\s*(script|iframe|object|embed)/i.test(combined)) {
    return json(400, { ok: false, message: "Submission rejected." });
  }

  const rows = Object.entries(fields).map(([key, value]) => `
    <tr>
      <th style="text-align:left;vertical-align:top;padding:9px;border:1px solid #d8e0e8;background:#f4f7fa">
        ${escapeHtml(key)}
      </th>
      <td style="padding:9px;border:1px solid #d8e0e8">
        ${escapeHtml(value).replace(/\n/g, "<br>")}
      </td>
    </tr>
  `).join("");

  const recipient = env.FORM_TO_EMAIL || "aplustechucation@gmail.com";
  const sender = env.FORM_FROM_EMAIL || "A+ Techucation Website <onboarding@resend.dev>";

  let resendResponse;
  try {
    resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email,
        subject: `[AtechSpot Website] ${leadType} — ${name}`,
        html: `
          <h2>${escapeHtml(leadType)}</h2>
          <p>A new request was submitted through AtechSpot.com.</p>
          <table style="border-collapse:collapse;width:100%;max-width:850px">${rows}</table>
          <p style="margin-top:18px;color:#5f6f7f">
            Reply to this email to respond directly to ${escapeHtml(name)} at ${escapeHtml(email)}.
          </p>
        `
      })
    });
  } catch {
    return json(503, {
      ok: false,
      code: "EMAIL_PROVIDER_UNREACHABLE",
      message: "The email service is temporarily unavailable."
    });
  }

  const providerText = await resendResponse.text();

  if (!resendResponse.ok) {
    console.error("Resend error:", resendResponse.status, providerText);
    return json(503, {
      ok: false,
      code: "RESEND_REJECTED",
      message: "The email provider rejected the message. Confirm the Cloudflare RESEND_API_KEY secret and use onboarding@resend.dev until your domain is verified."
    });
  }

  return json(200, {
    ok: true,
    message: "Thank you. Your request was emailed successfully."
  });
}

export async function onRequestPost({ request, env }) {
  return deliverLead({
    request,
    env,
    leadType: "Data Recovery Intake",
    requiredFields: ["Device Type", "Problem Description"]
  });
}

export function onRequestGet() {
  return json(405, { ok: false, message: "Method not allowed." });
}
