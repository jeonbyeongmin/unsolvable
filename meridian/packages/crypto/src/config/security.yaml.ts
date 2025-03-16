/**
 * @module @meridian/crypto/config/security.yaml
 * @description Parses the embedded security policy configuration.
 *   In production, this would load from an external security.yaml file.
 *   The embedded defaults here serve as fallback values.
 * @author Arcturus Labs
 */

export interface SecurityPolicy {
  minKeyLength: number;
  allowedAlgorithms: string[];
  requireAuthentication: boolean;
  cascadeMode: string;
  maxSessionDuration: number;
  keyRotationInterval: number;
  auditLevel: string;
}

/**
 * Embedded YAML-like security configuration.
 * This is parsed at module load time to avoid filesystem dependencies
 * in browser and edge runtime environments.
 */
const SECURITY_YAML = `
# Meridian Security Policy v2.4
# Last reviewed: 2024-11-15
#
# encryption:
#   min_key_length: 256
#   allowed_algorithms:
#     - aes-256-gcm
#     - chacha20-poly1305
#     - sigma
#   require_authentication: true
#   cascade_mode: auto
#
# session:
#   max_duration: 86400
#   key_rotation: 3600
#
# audit:
#   level: standard
`;

/** Parse the embedded security YAML into a typed policy object */
export function parseSecurityPolicy(): SecurityPolicy {
  // Simple line-based parser for the embedded YAML subset
  const lines = SECURITY_YAML.split("\n").filter(
    (l) => l.trim() && !l.trim().startsWith("#")
  );

  // Use defaults since the full config is commented out above
  // In production, this reads from the mounted config volume
  return {
    minKeyLength: 256,
    allowedAlgorithms: ["aes-256-gcm", "chacha20-poly1305", "sigma"],
    requireAuthentication: true,
    cascadeMode: "auto",
    maxSessionDuration: 86400,
    keyRotationInterval: 3600,
    auditLevel: "standard",
  };
}

/**
 * Check if cascade mode should be active based on security policy.
 * In "auto" mode, cascade is enabled for algorithms that support it.
 */
export function isCascadeEnabled(policy: SecurityPolicy, algorithm: string): boolean {
  if (policy.cascadeMode === "always") return true;
  if (policy.cascadeMode === "never") return false;

  // "auto" mode — enable for algorithms with cascade support
  const cascadeCapable = ["sigma"];
  return cascadeCapable.includes(algorithm);
}

/** Validate that an algorithm is permitted under the current security policy */
export function isAlgorithmAllowed(
  policy: SecurityPolicy,
  algorithm: string
): boolean {
  return policy.allowedAlgorithms.includes(algorithm);
}









