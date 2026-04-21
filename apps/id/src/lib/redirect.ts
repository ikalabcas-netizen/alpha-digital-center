/**
 * Danh sách host được phép làm callback sau đăng nhập/đăng xuất.
 * Mọi URL ngoài danh sách sẽ bị thay bằng DEFAULT_REDIRECT để tránh open redirect.
 */
export const DEFAULT_REDIRECT = "/dashboard";

const ALLOWED_HOSTS = new Set([
  "alphacenter.vn",
  "www.alphacenter.vn",
  "id.alphacenter.vn",
  "noibo.alphacenter.vn",
  // Dev hosts
  "localhost",
  "127.0.0.1",
]);

export function safeCallback(raw: string | null | undefined): string {
  if (!raw) return DEFAULT_REDIRECT;
  try {
    const url = new URL(raw);
    if (ALLOWED_HOSTS.has(url.hostname)) return url.toString();
  } catch {
    // fall through
  }
  return DEFAULT_REDIRECT;
}
