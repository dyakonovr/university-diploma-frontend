/**
 * Sanitizes HTML content for safe rendering in v-html.
 * Replaces tables, iframes, videos, and SVGs with descriptive label badges.
 *
 * @example
 * const sanitized = sanitizeRichContent('<p>Text</p><table><tr><td>data</td></tr></table>');
 * // '<p>Text</p><span class="rich-content-label">Таблица</span>'
 *
 * @returns Sanitized HTML string
 */
export function sanitizeRichContent(html: string): string {
  if (!html) return '';

  let result = html;

  // Replace tables with label
  result = result.replace(
    /<table[\s\S]*?<\/table>/gi,
    '<span class="rich-content-label">📊 Таблица</span>',
  );

  // Replace images with label
  result = result.replace(
    /<img[\s\S]*? \/>/gi,
    '<span class="rich-content-label">📸 Изображение</span>',
  );

  // Replace iframes with label
  result = result.replace(
    /<iframe[\s\S]*?<\/iframe>/gi,
    '<span class="rich-content-label">🎬 Видео</span>',
  );

  // Replace self-closing iframes
  result = result.replace(
    /<iframe[^>]*\/>/gi,
    '<span class="rich-content-label">🎬 Видео</span>',
  );

  // Replace video elements with label
  result = result.replace(
    /<video[\s\S]*?<\/video>/gi,
    '<span class="rich-content-label">🎬 Видео</span>',
  );

  // Replace SVG elements with label
  result = result.replace(
    /<svg[\s\S]*?<\/svg>/gi,
    '<span class="rich-content-label">🎴 Иконка</span>',
  );

  return result;
}
