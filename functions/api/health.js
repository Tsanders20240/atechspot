import { appFromUrl } from "../_lib/platform.js";

export function onRequestGet(context) {
  const url = new URL(context.request.url);
  const app = appFromUrl(url);

  return Response.json({
    ok: true,
    platform: "ATechSpot",
    phase: 2,
    service: app?.key || "corporate",
    hostname: url.hostname,
    timestamp: new Date().toISOString()
  }, {
    headers: {
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "https://www.atechspot.com"
    }
  });
}
