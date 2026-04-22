/**
 * IP whitelist cho chấm công.
 * Cấu hình env (CIDR, phân cách bằng `,`):
 *   OFFICE_IPS="203.0.113.10/32,203.0.113.0/24,2001:db8::/32"
 *
 * Hỗ trợ IPv4 (CIDR) và IPv6 (CIDR đơn giản — match prefix bit).
 */

import { NextRequest } from 'next/server';

export function loadOfficeIps(): string[] {
  const raw = process.env.OFFICE_IPS?.trim();
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Lấy IP client thực từ request. Thứ tự ưu tiên:
 *   1. CF-Connecting-IP — Cloudflare (khi noibo.alphacenter.vn bật CF proxy)
 *   2. True-Client-IP — CF Enterprise
 *   3. X-Forwarded-For — Traefik / standard proxy chain (lấy IP đầu)
 *   4. X-Real-IP — Nginx convention
 */
export function getClientIp(req: NextRequest): string | null {
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const trueIp = req.headers.get('true-client-ip');
  if (trueIp) return trueIp.trim();

  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();

  const xri = req.headers.get('x-real-ip');
  if (xri) return xri.trim();

  return null;
}

/**
 * Convert IPv4 string → 32-bit unsigned integer.
 */
function ipv4ToInt(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  let result = 0;
  for (const p of parts) {
    const n = parseInt(p, 10);
    if (isNaN(n) || n < 0 || n > 255) return null;
    result = (result << 8) + n;
  }
  return result >>> 0; // unsigned
}

function isIpv4(ip: string): boolean {
  return /^[\d.]+$/.test(ip) && ip.split('.').length === 4;
}

/**
 * Match IPv4 vào CIDR.
 */
function matchIpv4Cidr(ip: string, cidr: string): boolean {
  const [base, prefixStr] = cidr.split('/');
  const prefix = parseInt(prefixStr || '32', 10);
  if (isNaN(prefix) || prefix < 0 || prefix > 32) return false;
  const ipInt = ipv4ToInt(ip);
  const baseInt = ipv4ToInt(base!);
  if (ipInt === null || baseInt === null) return false;
  if (prefix === 0) return true;
  const mask = (~0 << (32 - prefix)) >>> 0;
  return (ipInt & mask) === (baseInt & mask);
}

/**
 * Match IPv6 đơn giản (so sánh prefix bit).
 */
function matchIpv6Cidr(ip: string, cidr: string): boolean {
  const [base, prefixStr] = cidr.split('/');
  const prefix = parseInt(prefixStr || '128', 10);
  if (isNaN(prefix) || prefix < 0 || prefix > 128) return false;
  const ipBin = ipv6ToBinary(ip);
  const baseBin = ipv6ToBinary(base!);
  if (!ipBin || !baseBin) return false;
  return ipBin.slice(0, prefix) === baseBin.slice(0, prefix);
}

function ipv6ToBinary(ip: string): string | null {
  try {
    // Expand "::" để đủ 8 group
    let groups = ip.split(':');
    const emptyIdx = groups.indexOf('');
    if (emptyIdx !== -1) {
      const fill = Array(9 - groups.length).fill('0');
      groups = [...groups.slice(0, emptyIdx), ...fill, ...groups.slice(emptyIdx + 1)].filter((g) => g !== '');
    }
    if (groups.length !== 8) return null;
    return groups
      .map((g) => parseInt(g || '0', 16).toString(2).padStart(16, '0'))
      .join('');
  } catch {
    return null;
  }
}

export interface IpCheckResult {
  ok: boolean;
  ip: string | null;
  matched?: string;
  message?: string;
}

/**
 * Trả ok=true nếu IP nằm trong whitelist.
 * Nếu OFFICE_IPS chưa cấu hình → ok=true (dev mode).
 */
export function checkIpWhitelist(req: NextRequest): IpCheckResult {
  const ip = getClientIp(req);
  const whitelist = loadOfficeIps();

  if (whitelist.length === 0) {
    return { ok: true, ip, message: 'OFFICE_IPS chưa cấu hình — bypass IP check (dev mode)' };
  }
  if (!ip) {
    return { ok: false, ip: null, message: 'Không xác định được IP client' };
  }

  for (const cidr of whitelist) {
    const isV4 = isIpv4(cidr.split('/')[0]!);
    const matched = isV4 ? matchIpv4Cidr(ip, cidr) : matchIpv6Cidr(ip, cidr);
    if (matched) return { ok: true, ip, matched: cidr };
  }
  return {
    ok: false,
    ip,
    message: `IP ${ip} không nằm trong whitelist văn phòng`,
  };
}
