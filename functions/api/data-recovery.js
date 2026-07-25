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

const makeReference = () => {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `DR-${stamp}-${random}`;
};

async function parseBody(request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) return request.json();
  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

async function sendResend(env, payload) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Resend ${response.status}: ${text}`);
  return text;
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await parseBody(request); }
  catch { return json(400, { ok: false, message: "Invalid form submission." }); }

  if (clean(body.website, 100)) return json(200, { ok: true, message: "Thank you." });

  const started = Number(body.form_started_at || 0);
  const elapsed = Date.now() - started;
  if (!started || elapsed < 1500 || elapsed > 86400000) {
    return json(400, { ok: false, message: "Please reload the page and complete the form again." });
  }

  const name = clean(body["Full Name"] || body.Name, 120);
  const email = clean(body.Email, 254);
  const deviceType = clean(body["Device Type"], 200);
  const problem = clean(body["Problem Description"], 4000);

  if (name.length < 2 || !validEmail(email)) {
    return json(400, { ok: false, message: "Enter a valid name and email address." });
  }
  if (!deviceType || !problem) {
    return json(400, { ok: false, message: "Complete the device type and problem description fields." });
  }
  if (!clean(body.Authorization, 20) || !clean(body["Partner Disclosure Acknowledgment"], 20)) {
    return json(400, { ok: false, message: "Complete both required acknowledgments." });
  }
  if (!env.RESEND_API_KEY) {
    return json(503, { ok: false, code: "MISSING_RESEND_KEY", message: "Email delivery is not configured yet." });
  }

  const ignored = new Set(["website", "form_started_at", "cf-turnstile-response"]);
  const fields = {};
  for (const [key, value] of Object.entries(body)) {
    if (!ignored.has(key)) fields[clean(key, 100)] = clean(value, 4000);
  }
  fields["Partner Code"] = "DS25379";

  const combined = Object.values(fields).join("\n");
  if ((combined.match(/https?:\/\/|www\./gi) || []).length > 4 || /<\s*(script|iframe|object|embed)/i.test(combined)) {
    return json(400, { ok: false, message: "Submission rejected." });
  }

  const reference = makeReference();
  const rows = Object.entries(fields).map(([key, value]) => `
    <tr><th style="text-align:left;vertical-align:top;padding:9px;border:1px solid #d8e0e8;background:#f4f7fa">${escapeHtml(key)}</th>
    <td style="padding:9px;border:1px solid #d8e0e8">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>
  `).join("");

  const recipient = env.FORM_TO_EMAIL || "aplustechucation@gmail.com";
  const sender = env.FORM_FROM_EMAIL || "A+ Techucation Website <onboarding@resend.dev>";

  try {
    await sendResend(env, {
      from: sender,
      to: [recipient],
      reply_to: email,
      subject: `[AtechSpot] Data Recovery Intake ${reference} — ${name}`,
      html: `<h2>Data Recovery Referral Intake</h2><p><strong>Reference:</strong> ${reference}</p><p>A customer submitted an intake for review before an official DriveSavers referral is created.</p><table style="border-collapse:collapse;width:100%;max-width:850px">${rows}</table><p style="margin-top:18px;color:#5f6f7f">Reply to this email to contact ${escapeHtml(name)} at ${escapeHtml(email)}.</p>`
    });
  } catch (error) {
    console.error("Owner email failed:", error.message);
    return json(503, { ok: false, code: "RESEND_REJECTED", message: "The email provider could not deliver your request. Use the prefilled email backup or call (713) 396-2993." });
  }

  let confirmationSent = true;
  try {
    await sendResend(env, {
      from: sender,
      to: [email],
      reply_to: recipient,
      subject: `A+ Techucation received your data recovery intake — ${reference}`,
      html: `<h2>Your intake was received</h2><p>Hello ${escapeHtml(name)},</p><p>A+ Techucation received your data recovery referral intake.</p><p><strong>Reference number:</strong> ${reference}<br><strong>Partner code:</strong> DS25379</p><p>This intake does not create a DriveSavers job by itself. A+ Techucation will review your information, contact you, and submit the official referral through the private partner dashboard.</p><p><strong>Important:</strong> Stop using the affected device and do not open sealed storage hardware. Do not email passwords, passcodes, encryption keys, Social Security numbers, or confidential file contents.</p><p>Questions? Call (713) 396-2993 or reply to this email.</p>`
    });
  } catch (error) {
    confirmationSent = false;
    console.error("Customer confirmation failed:", error.message);
  }

  return json(200, {
    ok: true,
    reference,
    confirmationSent,
    message: confirmationSent
      ? "Request delivered. A confirmation email was sent to you."
      : "Request delivered. Save your reference number; the confirmation email could not be sent."
  });
}

export function onRequestGet() {
  return json(405, { ok: false, message: "Method not allowed." });
}
