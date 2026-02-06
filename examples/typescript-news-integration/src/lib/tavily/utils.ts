/**
 * Utility functions for working with Tavily news search results
 */

import { TavilySearchResult, TavilySearchResponse } from './client';

/**
 * Format search results into a readable text summary
 * @param response - Tavily search response
 * @returns Formatted string with results
 */
export function formatSearchResults(response: TavilySearchResponse): string {
  const lines: string[] = [];

  lines.push(`Query: ${response.query}`);
  lines.push(`Found ${response.results.length} results (${response.response_time.toFixed(2)}s)\n`);

  if (response.answer) {
    lines.push(`AI Summary:\n${response.answer}\n`);
  }

  response.results.forEach((result, index) => {
    lines.push(`${index + 1}. ${result.title}`);
    lines.push(`   URL: ${result.url}`);
    lines.push(`   Score: ${result.score.toFixed(2)}`);
    if (result.published_date) {
      lines.push(`   Published: ${result.published_date}`);
    }
    lines.push(`   ${result.content}\n`);
  });

  return lines.join('\n');
}

/**
 * Filter results by minimum relevance score
 * @param results - Array of search results
 * @param minScore - Minimum score threshold (0-1)
 * @returns Filtered results
 */
export function filterByScore(
  results: TavilySearchResult[],
  minScore: number = 0.7
): TavilySearchResult[] {
  return results.filter(result => result.score >= minScore);
}

/**
 * Group results by domain
 * @param results - Array of search results
 * @returns Map of domain to results
 */
export function groupByDomain(
  results: TavilySearchResult[]
): Map<string, TavilySearchResult[]> {
  const grouped = new Map<string, TavilySearchResult[]>();

  results.forEach(result => {
    try {
      const domain = new URL(result.url).hostname;
      const existing = grouped.get(domain) || [];
      existing.push(result);
      grouped.set(domain, existing);
    } catch (e) {
      // Skip invalid URLs
    }
  });

  return grouped;
}

/**
 * Extract keywords from search results
 * @param results - Array of search results
 * @param topN - Number of top keywords to return
 * @returns Array of top keywords
 */
export function extractKeywords(
  results: TavilySearchResult[],
  topN: number = 10
): string[] {
  const wordFreq = new Map<string, number>();

  // Common words to exclude
  const stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their'
  ]);

  results.forEach(result => {
    const text = `${result.title} ${result.content}`.toLowerCase();
    const words = text.match(/\b[a-z]{3,}\b/g) || [];

    words.forEach(word => {
      if (!stopWords.has(word)) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });
  });

  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
}

/**
 * Create a summary from multiple search results
 * @param results - Array of search results
 * @param maxLength - Maximum length of summary in characters
 * @returns Combined summary text
 */
export function createSummary(
  results: TavilySearchResult[],
  maxLength: number = 500
): string {
  const sentences: string[] = [];
  let currentLength = 0;

  // Get first sentence from each result until we reach maxLength
  for (const result of results) {
    const content = result.content.trim();
    const firstSentence = content.split(/[.!?]/)[0] + '.';

    if (currentLength + firstSentence.length <= maxLength) {
      sentences.push(firstSentence);
      currentLength += firstSentence.length + 1;
    } else {
      break;
    }
  }

  return sentences.join(' ');
}
