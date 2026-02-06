/**
 * Tavily News Search Integration
 *
 * This module provides a TypeScript interface for searching news articles
 * using the Tavily API.
 */

export interface TavilySearchOptions {
  query: string;
  topic?: 'general' | 'news' | 'finance';
  max_results?: number;
  search_depth?: 'ultra-fast' | 'fast' | 'basic' | 'advanced';
  time_range?: 'day' | 'week' | 'month' | 'year';
  include_raw_content?: boolean;
  include_answer?: boolean;
  include_images?: boolean;
  include_domains?: string[];
  exclude_domains?: string[];
}

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  raw_content?: string;
  published_date?: string;
}

export interface TavilySearchResponse {
  query: string;
  results: TavilySearchResult[];
  answer?: string;
  images?: string[];
  response_time: number;
}

/**
 * TavilyClient class for interacting with the Tavily News Search API
 */
export class TavilyClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.tavily.com';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Tavily API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Search for news articles using the Tavily API
   * @param options - Search options
   * @returns Promise with search results
   */
  async search(options: TavilySearchOptions): Promise<TavilySearchResponse> {
    const { query, topic = 'news', max_results = 5, ...rest } = options;

    const payload = {
      query,
      topic,
      max_results,
      ...rest,
    };

    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'x-client-source': 'typescript-news-integration',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Tavily API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Search for recent news on a specific topic
   * @param query - Search query
   * @param timeRange - Time range for news (default: 'week')
   * @param maxResults - Maximum number of results (default: 5)
   * @returns Promise with search results
   */
  async searchNews(
    query: string,
    timeRange: 'day' | 'week' | 'month' | 'year' = 'week',
    maxResults: number = 5
  ): Promise<TavilySearchResponse> {
    return this.search({
      query,
      topic: 'news',
      time_range: timeRange,
      max_results: maxResults,
      include_answer: true,
    });
  }

  /**
   * Get detailed news articles with full content
   * @param query - Search query
   * @param maxResults - Maximum number of results (default: 3)
   * @returns Promise with search results including raw content
   */
  async getDetailedNews(
    query: string,
    maxResults: number = 3
  ): Promise<TavilySearchResponse> {
    return this.search({
      query,
      topic: 'news',
      max_results: maxResults,
      include_raw_content: true,
      include_answer: true,
      search_depth: 'advanced',
    });
  }
}

/**
 * Create a Tavily client instance
 * @param apiKey - Tavily API key (defaults to TAVILY_API_KEY env variable)
 * @returns TavilyClient instance
 */
export function createTavilyClient(apiKey?: string): TavilyClient {
  const key = apiKey || process.env.TAVILY_API_KEY;
  if (!key) {
    throw new Error('Tavily API key must be provided or set in TAVILY_API_KEY environment variable');
  }
  return new TavilyClient(key);
}
