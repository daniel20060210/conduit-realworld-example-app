/**
 * Remove Markdown syntax from a string to extract plain text content.
 * Code blocks and inline code are kept (their content is included in word count).
 */
export function stripMarkdown(markdown) {
  let text = markdown;

  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, "");

  // Remove images (keep alt text)
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");

  // Convert links to just their text
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");

  // Remove header markers (# ## ### etc.)
  text = text.replace(/^#{1,6}\s+/gm, "");

  // Remove bold/italic markers
  text = text.replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2");

  // Remove inline code backticks
  text = text.replace(/`{1,2}([^`]*)`{1,2}/g, "$1");

  // Remove fenced code block markers (``` or ~~~) but keep content
  text = text.replace(/^[~`]{3,}\s*\w*\s*$/gm, "");

  // Remove list markers (- * + or numbered)
  text = text.replace(/^[\s]*[-*+]\s+/gm, "");
  text = text.replace(/^[\s]*\d+\.\s+/gm, "");

  // Remove blockquote markers
  text = text.replace(/^>\s?/gm, "");

  // Remove horizontal rules
  text = text.replace(/^(\*{3,}|-{3,}|_{3,})\s*$/gm, "");

  // Collapse multiple newlines
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

/**
 * Count the number of "words" in a plain text string.
 * Counting rules:
 *   - Each Chinese character counts as 1
 *   - Each English word (contiguous letters) counts as 1
 *   - Punctuation, numbers, and whitespace are NOT counted
 */
export function countWords(plainText) {
  if (!plainText) return 0;

  let count = 0;

  // Count Chinese characters (CJK Unified Ideographs)
  const chineseChars = plainText.match(/[一-鿿]/g);
  if (chineseChars) {
    count += chineseChars.length;
  }

  // Count English words (contiguous alphabetic characters)
  const englishWords = plainText.match(/[a-zA-Z]+/g);
  if (englishWords) {
    count += englishWords.length;
  }

  return count;
}

/**
 * Estimate reading time based on word count.
 * Uses 300 words-per-minute, rounding up (ceil).
 * Returns at least 1 minute for any non-zero count.
 */
export function estimateReadingTime(wordCount) {
  const WORDS_PER_MINUTE = 300;
  if (wordCount <= 0) return 0;
  return Math.ceil(wordCount / WORDS_PER_MINUTE);
}
