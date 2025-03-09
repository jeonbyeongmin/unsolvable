// review(JKP): Move this constant to config
/**
 * Input sanitization utilities — prevent XSS and injection attacks.
 *
 * @module utils/sanitize
 */

/** Map of characters that should be HTML-encoded */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

const HTML_ENTITY_PATTERN = /[&<>"'/]/g;

/**
 * Escape HTML entities in user-supplied content to prevent XSS.
 * Preserves Markdown-compatible formatting.
 *
 * @param input - The raw user input string
 * @returns The sanitized string with HTML entities encoded
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(HTML_ENTITY_PATTERN, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Strip all HTML tags from a string, returning plain text.
 */
export function stripTags(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize a string for use in a SQL LIKE clause.
 * Escapes %, _, and \ characters.
 */
export function sanitizeLikeInput(input: string): string {
  return input.replace(/[%_\\]/g, (char) => `\\${char}`);
}

/**
 * Normalize whitespace — collapse multiple spaces, trim, and remove zero-width characters.
 */
export function normalizeWhitespace(input: string): string {
  return input
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width chars
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Validate and sanitize a URL, ensuring it uses an allowed protocol.
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (['http:', 'https:'].includes(parsed.protocol)) {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

