/** 0 = standard user, 1 = administrator */
export const ROLE_USER = 0;
export const ROLE_ADMIN = 1;

export type UserRole = typeof ROLE_USER | typeof ROLE_ADMIN;

/** Coerce DB / JSON values (number, string, bigint) to 0 or 1 */
export function normalizeRole(role: unknown): UserRole {
  if (role === ROLE_ADMIN || role === "1" || role === 1n) return ROLE_ADMIN;
  if (role === ROLE_USER || role === "0" || role === 0n) return ROLE_USER;
  const n = typeof role === "number" ? role : Number(role);
  return n === ROLE_ADMIN ? ROLE_ADMIN : ROLE_USER;
}

export function isAdmin(role: unknown): role is typeof ROLE_ADMIN {
  return normalizeRole(role) === ROLE_ADMIN;
}

export function roleLabel(role: unknown): string {
  return isAdmin(role) ? "Admin" : "User";
}

/** Where signed-in users land after login (admins always use /admin). */
export function accountHomePath(role: unknown): "/admin/overview" | "/dashboard" {
  return isAdmin(role) ? "/admin/overview" : "/dashboard";
}