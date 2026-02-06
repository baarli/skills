/**
 * Tavily News Integration Library
 *
 * Main entry point for the TypeScript news integration example.
 */

export { TavilyClient, createTavilyClient } from './client';
export type {
  TavilySearchOptions,
  TavilySearchResult,
  TavilySearchResponse,
} from './client';
export {
  formatSearchResults,
  filterByScore,
  groupByDomain,
  extractKeywords,
  createSummary,
} from './utils';
