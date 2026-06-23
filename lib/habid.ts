export const reservedHabids = new Set(["admin", "support", "system", "moderator", "habidoo", "official", "staff"]);

export function normalizeHabid(value: string) {
  return value.trim().toLowerCase();
}

export function validateHabid(value: string) {
  const habid = normalizeHabid(value);
  if (habid.length < 3 || habid.length > 24) return { valid: false, habid, error: "Habid must be 3-24 characters." };
  if (!/^[a-z0-9][a-z0-9_]*$/.test(habid)) return { valid: false, habid, error: "Use lowercase letters, numbers, and underscores. Start with a letter or number." };
  if (reservedHabids.has(habid)) return { valid: false, habid, error: "This Habid is reserved." };
  return { valid: true, habid, error: undefined };
}
