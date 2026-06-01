const SESSION_KEY = "naseeg_admin_session";

const DEFAULT_PASSWORD = "naseeg2025";

export function getAdminPassword(): string {
  return import.meta.env.VITE_ADMIN_PASSWORD ?? DEFAULT_PASSWORD;
}

export function login(password: string): boolean {
  if (password !== getAdminPassword()) return false;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ at: Date.now() }));
  return true;
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) !== null;
}
