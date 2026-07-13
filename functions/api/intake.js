export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = body.name || 'Unknown';
    const email = body.email || 'Unknown';
    const phone = body.phone || 'Not provided';
    const message = body.message || 'No message';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'A+ Techucation <onboarding@resend.dev>',
        to: 'aplustechucation@gmail.com',
        subject: 'New Universal Intake Request',
        html: `
          <h2>New Intake Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      }),
    });

    if (res.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const errorText = await res.text();
    return new Response(JSON.stringify({ error: errorText }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
