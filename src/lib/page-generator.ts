/**
 * Auto-generate pages from topic content
 * Splits content into pages based on word count and line count
 * Approximately 80-100 words per page, 10-12 lines per page
 */

export function generatePages(content: string): string[] {
  const wordsPerPage = 90; // Average words per page
  const linesPerPage = 11; // Average lines per page

  // Split content into words (Urdu words are separated by spaces)
  const words = content.trim().split(/\s+/);

  const pages: string[] = [];
  let currentPageWords: string[] = [];
  let currentPageLines: string[] = [];
  let currentLineWords: string[] = [];

  for (const word of words) {
    // Add word to current line
    currentLineWords.push(word);

    // Check if line is too long (approximately 8-10 words per line for Urdu)
    if (currentLineWords.length >= 8) {
      // Complete the line
      currentPageLines.push(currentLineWords.join(' '));
      currentLineWords = [];

      // Check if we've reached the lines per page limit
      if (currentPageLines.length >= linesPerPage) {
        // Complete the page
        pages.push(currentPageLines.join('\n'));
        currentPageLines = [];
      }
    }
  }

  // Don't forget the last line if it has words
  if (currentLineWords.length > 0) {
    currentPageLines.push(currentLineWords.join(' '));
  }

  // Don't forget the last page if it has lines
  if (currentPageLines.length > 0) {
    pages.push(currentPageLines.join('\n'));
  }

  // If no pages were generated, create one with the original content
  if (pages.length === 0) {
    pages.push(content);
  }

  return pages;
}

/**
 * Calculate approximate page count for a topic
 */
export function calculatePageCount(content: string): number {
  const wordsPerPage = 90;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerPage);
}
