/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/stryke.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

/**
 * List of blocked IPv4 ranges for Server-Side Request Forgery (SSRF) protection
 */
export const BLOCKED_IPV4_RANGES = [
  // Loopback
  { start: "127.0.0.0", end: "127.255.255.255" },
  // Private networks (RFC 1918)
  { start: "10.0.0.0", end: "10.255.255.255" },
  { start: "172.16.0.0", end: "172.31.255.255" },
  { start: "192.168.0.0", end: "192.168.255.255" },
  // Link-local
  { start: "169.254.0.0", end: "169.254.255.255" },
  // AWS metadata service
  { start: "169.254.169.254", end: "169.254.169.254" },
  // Broadcast
  { start: "255.255.255.255", end: "255.255.255.255" },
  // Current network
  { start: "0.0.0.0", end: "0.255.255.255" }
];

/**
 * List of blocked hostnames for Server-Side Request Forgery (SSRF) protection
 *
 * @remarks
 * This includes common internal hostnames and patterns that should not be accessed
 */
const BLOCKED_HOSTNAMES = [
  "localhost",
  "localhost.localdomain",
  "ip6-localhost",
  "ip6-loopback",
  // Kubernetes internal
  "kubernetes.default",
  "kubernetes.default.svc",
  "kubernetes.default.svc.cluster.local",
  // Common internal service names
  "internal",
  "metadata",
  "metadata.google.internal"
];

/**
 * Convert an IPv4 address to a 32-bit integer for range comparison
 *
 * @param ip - The IPv4 address as a string
 * @returns The 32-bit integer representation of the IPv4 address, or -1 if invalid
 */
export function ipv4ToInt(ip: string): number {
  const parts = ip.split(".").map(Number);
  if (
    parts.length !== 4 ||
    parts.some(p => Number.isNaN(p) || p < 0 || p > 255) ||
    !parts[0] ||
    !parts[1] ||
    !parts[2] ||
    !parts[3]
  ) {
    return -1;
  }
  return (
    ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
  );
}

/**
 * Check if an IPv4 address is in a blocked range for Server-Side Request Forgery (SSRF) protection
 *
 * @param ip - The IPv4 address as a string
 * @returns True if the IP is in a blocked range, false otherwise
 */
export function isBlockedIPv4(ip: string): boolean {
  const ipInt = ipv4ToInt(ip);
  if (ipInt === -1) return false;

  for (const range of BLOCKED_IPV4_RANGES) {
    const startInt = ipv4ToInt(range.start);
    const endInt = ipv4ToInt(range.end);
    if (ipInt >= startInt && ipInt <= endInt) {
      return true;
    }
  }

  return false;
}

/**
 * Check if an IPv6 address is a blocked address for Server-Side Request Forgery (SSRF) protection
 *
 * @param ip - The IPv6 address as a string
 * @returns True if the IP is blocked, false otherwise
 */
function isBlockedIPv6(ip: string): boolean {
  // Normalize the address
  const normalized = ip.toLowerCase();

  // Loopback
  if (normalized === "::1" || normalized === "0:0:0:0:0:0:0:1") {
    return true;
  }

  // Unspecified
  if (normalized === "::" || normalized === "0:0:0:0:0:0:0:0") {
    return true;
  }

  // IPv4-mapped IPv6 addresses (::ffff:x.x.x.x)
  const ipv4Mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (ipv4Mapped && ipv4Mapped[1]) {
    return isBlockedIPv4(ipv4Mapped[1]);
  }

  // Link-local (fe80::/10)
  if (
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb")
  ) {
    return true;
  }

  // Unique local (fc00::/7)
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) {
    return true;
  }

  return false;
}

/**
 * Check if a hostname is blocked for Server-Side Request Forgery (SSRF) protection by comparing against a list of blocked hostnames and patterns. This includes exact matches, subdomain checks, and common internal domain patterns.
 *
 * @param hostname - The hostname to check
 * @returns True if the hostname is blocked, false otherwise
 */
export function isBlockedHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();

  // Check exact matches
  if (BLOCKED_HOSTNAMES.includes(lower)) {
    return true;
  }

  // Check if it's a subdomain of a blocked hostname
  for (const blocked of BLOCKED_HOSTNAMES) {
    if (lower.endsWith(`.${blocked}`)) {
      return true;
    }
  }

  // Check for .local TLD (mDNS)
  if (lower.endsWith(".local")) {
    return true;
  }

  // Check for .internal domains
  if (lower.endsWith(".internal")) {
    return true;
  }

  return false;
}

/**
 * Check if a hostname appears to be an IP address and if so, whether it's blocked for Server-Side Request Forgery (SSRF) protection
 *
 * @param hostname - The hostname to check
 * @returns True if the hostname is a blocked IP address, false otherwise
 */
export function isBlockedIPAddress(hostname: string): boolean {
  // IPv4 check
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return isBlockedIPv4(hostname);
  }

  // IPv6 check (with brackets removed if present)
  const ipv6 = hostname.replace(/^\[|\]$/g, "");
  if (ipv6.includes(":")) {
    return isBlockedIPv6(ipv6);
  }

  return false;
}

/**
 * A result object for URL validation, indicating whether the URL is valid, any error message if invalid, and a sanitized version of the URL if valid. This structure allows for clear communication of validation results and can be easily extended in the future if needed.
 *
 * @remarks
 * The `valid` property indicates if the URL passed validation. The `error` property provides a message explaining why the URL is invalid, if applicable. The `sanitizedUrl` property contains a cleaned-up version of the URL that can be safely used if the original URL is valid.
 */
export interface URLValidationResult {
  valid: boolean;
  error?: string;
  sanitizedUrl?: string;
}

/**
 * Validate a URL for use in general contexts (e.g. fetching data, making API calls) with Server-Side Request Forgery (SSRF) protection. This function checks if the URL is well-formed, uses allowed protocols (http/https), and ensures that the hostname does not resolve to internal IP addresses or hostnames. It also checks for non-standard ports that might indicate internal services.
 *
 * @param url - The URL to validate
 * @returns A URLValidationResult object indicating whether the URL is valid, any error message if invalid, and a sanitized version of the URL if valid
 */
export function validateUrl(url: string): URLValidationResult {
  try {
    const parsed = new URL(url);

    // Only allow http and https
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return {
        valid: false,
        error: "Only HTTP and HTTPS protocols are allowed"
      };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check for blocked hostnames
    if (isBlockedHostname(hostname)) {
      return {
        valid: false,
        error: "Access to internal hostnames is not allowed"
      };
    }

    // Check for blocked IP addresses
    if (isBlockedIPAddress(hostname)) {
      return {
        valid: false,
        error: "Access to internal IP addresses is not allowed"
      };
    }

    // Check for non-standard ports that might indicate internal services
    const port = parsed.port
      ? Number.parseInt(parsed.port, 10)
      : parsed.protocol === "https:"
        ? 443
        : 80;

    // Block common internal service ports
    const blockedPorts = [
      22, // SSH
      23, // Telnet
      25, // SMTP
      53, // DNS
      135, // RPC
      139, // NetBIOS
      445, // SMB
      1433, // MSSQL
      1521, // Oracle
      3306, // MySQL
      3389, // RDP
      5432, // PostgreSQL
      5900, // VNC
      6379, // Redis
      9200, // Elasticsearch
      27017 // MongoDB
    ];

    if (blockedPorts.includes(port)) {
      return { valid: false, error: `Access to port ${port} is not allowed` };
    }

    return { valid: true, sanitizedUrl: parsed.toString() };
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }
}

/**
 * Validate a URL for use in URL preview.
 *
 * @remarks
 * These validations are more restrictive than general URL validations. For URL previews, we want to be extra cautious to prevent any potential SSRF vulnerabilities, so we enforce stricter rules on allowed ports and ensure that the URL is well-formed and does not point to internal resources. This function builds upon the general `validateUrl` function and adds additional checks specific to URL previews, such as blocking non-standard HTTP ports that are commonly used for internal services. By using this function for URL previews, we can help ensure that the URLs being previewed are safe and do not pose a security risk to the application or its users.
 *
 * @param url - The URL to validate for preview
 * @returns A URLValidationResult object indicating whether the URL is valid for preview, any error message if invalid, and a sanitized version of the URL if valid
 */
export function validateUrlForPreview(url: string): URLValidationResult {
  const result = validateUrl(url);
  if (!result.valid) {
    return result;
  }

  const parsed = new URL(url);

  // For previews, only allow standard HTTP ports
  const port = parsed.port
    ? Number.parseInt(parsed.port, 10)
    : parsed.protocol === "https:"
      ? 443
      : 80;
  if (port !== 80 && port !== 443 && port !== 8080 && port !== 8443) {
    return {
      valid: false,
      error:
        "Only standard HTTP ports (80, 443, 8080, 8443) are allowed for URL preview"
    };
  }

  return result;
}
