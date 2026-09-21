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
  if (!response.ok) {
    console.error("Resend error:", response.status, text);
    throw new Error("RESEND_REJECTED");
  }
  return text;
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, message: "Invalid intake submission." });
  }

  if (clean(body.website, 100)) {
    return json(200, { ok: true, message: "Thank you." });
  }

  const started = Number(body.form_started_at || 0);
  const elapsed = Date.now() - started;
  if (!started || elapsed < 1500 || elapsed > 86400000) {
    return json(400, {
      ok: false,
      message: "Please reload the intake page and complete the form again."
    });
  }

  const name = clean(body["Full Name"] || body.Name || body.name, 120);
  const email = clean(body.Email || body.email, 254);
  const phone = clean(body.Phone || body.phone, 60);
  const message = clean(body.Message || body.message, 4000);

  if (name.length < 2 || !validEmail(email) || !message) {
    return json(400, {
      ok: false,
      message: "Complete your name, valid email address and project description."
    });
  }

  if (!env.RESEND_API_KEY) {
    return json(503, {
      ok: false,
      code: "MISSING_RESEND_KEY",
      message: "Secure email delivery is temporarily unavailable."
    });
  }

  const ignored = new Set(["website", "form_started_at", "cf-turnstile-response"]);
  const fields = {};
  for (const [key, value] of Object.entries(body)) {
    if (!ignored.has(key)) fields[clean(key, 100)] = clean(value, 4000);
  }

  const combined = Object.values(fields).join("\n");
  if ((combined.match(/https?:\/\/|www\./gi) || []).length > 6 ||
      /<\s*(script|iframe|object|embed)/i.test(combined)) {
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
  const sender = env.FORM_FROM_EMAIL || "ATechSpot Website <forms@atechspot.com>";
  const topic = clean(body.Topic || body["Ecosystem Path"] || "New Client Intake", 140);

  try {
    await sendResend(env, {
      from: sender,
      to: [recipient],
      reply_to: email,
      subject: `[ATechSpot Intake] ${topic} — ${name}`,
      html: `
        <h2>New ATechSpot Client Intake</h2>
        <p>A new assessment was submitted through ATechSpot.com.</p>
        <table style="border-collapse:collapse;width:100%;max-width:850px">${rows}</table>
        <p style="margin-top:18px;color:#5f6f7f">
          Reply to this email to respond directly to ${escapeHtml(name)} at ${escapeHtml(email)}.
        </p>
      `
    });

    // Immediate acknowledgement keeps the lead warm without promising a response time.
    await sendResend(env, {
      from: sender,
      to: [email],
      subject: "We received your ATechSpot request",
      html: `
        <h2>Thank you, ${escapeHtml(name)}.</h2>
        <p>Your ATechSpot intake was received successfully.</p>
        <p><strong>Requested starting point:</strong> ${escapeHtml(topic)}</p>
        <p>We will review the information you submitted and use it to determine the most appropriate next step, which may be a recommendation, consultation, strategy review, support path or written project scope.</p>
        <p>You do not need to submit the form again. If you need to add information, reply to this email.</p>
        <p>— ATechSpot<br>Technology Within Us.</p>
      `
    }).catch(error => {
      console.error("Lead acknowledgement delivery failed:", error);
    });

    return json(200, {
      ok: true,
      message: "Your assessment was received successfully. Check your email for confirmation."
    });
  } catch (error) {
    console.error("ATechSpot intake delivery error:", error);
    return json(503, {
      ok: false,
      code: "EMAIL_DELIVERY_FAILED",
      message: "We could not deliver your intake right now. Please try again shortly."
    });
  }
}

export function onRequestGet() {
  return json(405, { ok: false, message: "Method not allowed." });
}
