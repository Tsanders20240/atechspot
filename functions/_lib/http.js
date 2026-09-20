export function json(body, status = 200, headers = {}) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers }
  });
}

export async function bodyJson(request) {
  try { return await request.json(); }
  catch { return null; }
}

export function cleanText(value, max = 1000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export function requireFields(payload, fields) {
  if (!payload) return fields;
  return fields.filter(key => payload[key] === undefined || payload[key] === null || String(payload[key]).trim() === "");
}
