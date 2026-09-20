import { platformSnapshot } from "../_lib/platform.js";

export function onRequestGet() {
  return Response.json({
    platform: "ATechSpot",
    phase: 2,
    architectureVersion: "2.0.0",
    applications: platformSnapshot()
  }, {
    headers: { "Cache-Control": "no-store" }
  });
}
