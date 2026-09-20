export async function onRequest(context) {
  const requestId = crypto.randomUUID();
  const started = Date.now();

  try {
    const response = await context.next();
    const headers = new Headers(response.headers);
    headers.set("X-ATechSpot-Request-ID", requestId);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
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
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
