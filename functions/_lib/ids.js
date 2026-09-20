export function id(prefix) {
  return prefix + "-" + crypto.randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase();
}
