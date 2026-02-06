# TypeScript News Integration Example

This example demonstrates how to integrate Tavily's News Search API into a TypeScript application. It includes a complete library with utilities for searching, filtering, and analyzing news content.

## Features

- 🔍 **Simple News Search** - Easy-to-use client for searching news articles
- 🎯 **Advanced Filtering** - Filter by domain, score, and time range
- 📊 **Content Analysis** - Extract keywords, create summaries, and group results
- 🚨 **Real-time Monitoring** - Monitor breaking news with periodic checks
- 📝 **TypeScript First** - Full type safety and IntelliSense support

## Installation

```bash
npm install
```

## Setup

1. Get your Tavily API key from [https://tavily.com](https://tavily.com)

2. Set your API key as an environment variable:
   ```bash
   export TAVILY_API_KEY="tvly-your-api-key-here"
   ```

3. Or create a `.env` file:
   ```
   TAVILY_API_KEY=tvly-your-api-key-here
   ```

## Quick Start

### Basic News Search

```typescript
import { createTavilyClient } from './src/lib/tavily';

const client = createTavilyClient();

// Search for recent news
const response = await client.searchNews('artificial intelligence', 'week', 10);

response.results.forEach(article => {
  console.log(article.title);
  console.log(article.url);
  console.log(article.content);
});
```

### Advanced Search with Filters

```typescript
import { createTavilyClient, filterByScore } from './src/lib/tavily';

const client = createTavilyClient();

// Advanced search with domain filtering
const response = await client.search({
  query: 'climate change',
  topic: 'news',
  time_range: 'week',
  max_results: 15,
  search_depth: 'advanced',
  include_domains: ['reuters.com', 'bbc.com', 'theguardian.com'],
});

// Filter high-quality results
const topResults = filterByScore(response.results, 0.8);
```

## Running Examples

### Basic News Search
```bash
npm run example
# or
ts-node src/examples/news-search.ts
```

### Advanced Search
```bash
ts-node src/examples/advanced-search.ts
```

### Real-time News Monitor
```bash
ts-node src/examples/news-monitor.ts
```

## Library Structure

```
src/
├── lib/
│   └── tavily/
│       ├── index.ts      # Main exports
│       ├── client.ts     # Tavily client implementation
│       └── utils.ts      # Utility functions
└── examples/
    ├── news-search.ts    # Basic search example
    ├── advanced-search.ts # Advanced features
    └── news-monitor.ts   # Real-time monitoring
```

## API Reference

### TavilyClient

#### `search(options: TavilySearchOptions): Promise<TavilySearchResponse>`

Main search method with full control over search parameters.

**Options:**
- `query` (string, required) - Search query
- `topic` ('general' | 'news' | 'finance') - Search topic (default: 'news')
- `max_results` (number) - Maximum results to return (default: 5)
- `search_depth` ('ultra-fast' | 'fast' | 'basic' | 'advanced') - Search depth
- `time_range` ('day' | 'week' | 'month' | 'year') - Time range filter
- `include_raw_content` (boolean) - Include full article content
- `include_answer` (boolean) - Include AI-generated answer
- `include_images` (boolean) - Include image results
- `include_domains` (string[]) - Domains to include
- `exclude_domains` (string[]) - Domains to exclude

#### `searchNews(query: string, timeRange?: string, maxResults?: number): Promise<TavilySearchResponse>`

Convenience method for searching news articles.

#### `getDetailedNews(query: string, maxResults?: number): Promise<TavilySearchResponse>`

Get detailed news articles with full content.

### Utility Functions

#### `formatSearchResults(response: TavilySearchResponse): string`
Format search results into a readable text summary.

#### `filterByScore(results: TavilySearchResult[], minScore: number): TavilySearchResult[]`
Filter results by minimum relevance score (0-1).

#### `groupByDomain(results: TavilySearchResult[]): Map<string, TavilySearchResult[]>`
Group search results by domain.

#### `extractKeywords(results: TavilySearchResult[], topN: number): string[]`
Extract top keywords from search results.

#### `createSummary(results: TavilySearchResult[], maxLength: number): string`
Create a combined summary from multiple results.

## Use Cases

### 1. News Aggregation
Build a news aggregator that pulls articles from multiple trusted sources.

```typescript
const response = await client.search({
  query: 'technology news',
  topic: 'news',
  time_range: 'day',
  include_domains: ['techcrunch.com', 'theverge.com', 'arstechnica.com'],
});
```

### 2. Research Assistant
Create a research tool that provides AI-generated summaries with citations.

```typescript
const response = await client.getDetailedNews('quantum computing', 5);
console.log(response.answer); // AI-generated summary
response.results.forEach(r => console.log(r.url)); // Citations
```

### 3. Breaking News Alerts
Monitor specific topics and get alerts for new articles.

```typescript
const monitor = new NewsMonitor('artificial intelligence regulations');
monitor.startMonitoring(15); // Check every 15 minutes
```

### 4. Content Analysis
Analyze news trends by extracting keywords and grouping by source.

```typescript
const keywords = extractKeywords(response.results, 20);
const byDomain = groupByDomain(response.results);
```

## Best Practices

1. **Query Optimization**
   - Keep queries under 400 characters
   - Use specific, focused queries for better results
   - Break complex queries into multiple searches

2. **Result Filtering**
   - Use `include_domains` for trusted sources
   - Filter by `score` for high-quality results
   - Use `time_range` for recent information

3. **Performance**
   - Use `ultra-fast` or `fast` depth for real-time applications
   - Use `advanced` depth for research and accuracy
   - Limit `max_results` to what you actually need

4. **Error Handling**
   - Always wrap API calls in try-catch blocks
   - Implement retry logic for production use
   - Log errors for debugging

## Examples Output

### Basic Search
```
Query: artificial intelligence
Found 10 results (1.23s)

AI Summary:
Recent developments in AI include...

1. OpenAI Announces GPT-5
   URL: https://example.com/...
   Score: 0.95
   OpenAI has announced the next generation...
```

### Advanced Search
```
=== High Quality Results (score >= 0.75) ===
Found 12 out of 15 results

=== Results by Domain ===
reuters.com: 4 results
bbc.com: 3 results
theguardian.com: 5 results

=== Top Keywords ===
climate, change, global, warming, emissions, carbon...
```

## Building

```bash
npm run build
```

The compiled output will be in the `dist/` directory.

## License

MIT

## Resources

- [Tavily API Documentation](https://docs.tavily.com)
- [Tavily JavaScript SDK](https://github.com/tavily-ai/tavily-js)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
