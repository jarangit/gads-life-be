/**
 * Convert any string to a URL-safe slug.
 *
 * - Lowercases
 * - Replaces spaces / underscores with hyphens
 * - Strips non-alphanumeric (except hyphens)
 * - Collapses consecutive hyphens
 * - Trims leading/trailing hyphens
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // spaces & underscores → hyphen
    .replace(/[^\w\u0E00-\u0E7F-]/g, '-') // keep alphanumeric, Thai, hyphen
    .replace(/-{2,}/g, '-') // collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // trim edge hyphens
}
