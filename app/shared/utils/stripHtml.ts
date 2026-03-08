/**
 * Strips HTML tags and returns the first N sentences of plain text.
 *
 * @example
 * stripHtml('<p>First sentence. Second one.</p><p>Third.</p>', 2)
 * // 'First sentence. Second one.'
 */
export function stripHtml(html: string, maxSentences = 2): string {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const sentences = text.match(/[^.!?]+[.!?]+/g);

  if (!sentences) return text;

  return sentences.slice(0, maxSentences).join(' ').trim();
}
