---
name: typescript-news-integration
description: "Complete TypeScript integration example for Tavily News Search API. Includes client library, utilities, and working examples for building news aggregators, research tools, and real-time monitoring systems."
---

# TypeScript News Integration Skill

Complete TypeScript integration example for building production-ready news search applications with Tavily's API.

## Prerequisites

**Tavily API Key Required** - Get your key at https://tavily.com

Add to `~/.claude/settings.json`:
```json
{
  "env": {
    "TAVILY_API_KEY": "tvly-your-api-key-here"
  }
}
```

## What's Included

This skill provides a complete TypeScript integration example with:

- **Client Library** (`src/lib/tavily/`) - Type-safe Tavily API client
- **Utility Functions** - Tools for filtering, analyzing, and formatting results
- **Working Examples** - Three complete example applications
- **Documentation** - Full API reference and best practices

## Quick Start

### View the Example Code

The complete example is located in `examples/typescript-news-integration/`:

```bash
cd examples/typescript-news-integration
cat README.md
```

### File Structure

```
examples/typescript-news-integration/
├── src/
│   ├── lib/
│   │   └── tavily/
│   │       ├── client.ts    # Main client implementation
│   │       ├── utils.ts     # Helper functions
│   │       └── index.ts     # Exports
│   └── examples/
│       ├── news-search.ts   # Basic search example
│       ├── advanced-search.ts # Advanced features
│       └── news-monitor.ts  # Real-time monitoring
├── package.json
├── tsconfig.json
└── README.md
```

## Core Library

### TavilyClient

The main client for interacting with Tavily's News Search API:

```typescript
import { createTavilyClient } from './src/lib/tavily';

const client = createTavilyClient();

// Search for recent news
const response = await client.searchNews(
  'artificial intelligence',
  'week',  // time range
  10       // max results
);
```

### Available Methods

#### `search(options: TavilySearchOptions)`
Full-featured search with all available options:
- Query parameters (query, topic, max_results)
- Search depth (ultra-fast, fast, basic, advanced)
- Time filtering (day, week, month, year)
- Domain filtering (include/exclude)
- Content options (raw content, images, AI answer)

#### `searchNews(query, timeRange, maxResults)`
Convenience method optimized for news search:
- Automatically sets topic to 'news'
- Includes AI-generated answer
- Simple parameters for common use cases

#### `getDetailedNews(query, maxResults)`
Get comprehensive article data:
- Advanced search depth
- Full article content included
- AI-generated summary
- Best for research and analysis

## Utility Functions

### Content Analysis

```typescript
import {
  filterByScore,
  groupByDomain,
  extractKeywords,
  createSummary,
  formatSearchResults
} from './src/lib/tavily';

// Filter high-quality results
const topResults = filterByScore(response.results, 0.8);

// Group by source
const byDomain = groupByDomain(response.results);

// Extract trending topics
const keywords = extractKeywords(response.results, 15);

// Create brief summary
const summary = createSummary(response.results, 500);

// Format for display
const formatted = formatSearchResults(response);
```

## Example Applications

### 1. Basic News Search (`news-search.ts`)

Simple news search with formatted output:
- Search recent news on any topic
- Display results with scores
- Show statistics and top results

```bash
cd examples/typescript-news-integration
npm install
npm run example
```

### 2. Advanced Search (`advanced-search.ts`)

Demonstrates advanced features:
- Domain filtering for trusted sources
- High-quality result filtering
- Keyword extraction
- Content grouping and analysis

```bash
ts-node src/examples/advanced-search.ts
```

### 3. Real-time Monitor (`news-monitor.ts`)

Monitor breaking news in real-time:
- Periodic checks for new articles
- Deduplication of seen articles
- Alert system for new content
- Configurable check intervals

```bash
ts-node src/examples/news-monitor.ts
```

## Integration Patterns

### News Aggregator

Build a news aggregator with multiple sources:

```typescript
const response = await client.search({
  query: 'technology news',
  topic: 'news',
  time_range: 'day',
  max_results: 20,
  include_domains: [
    'techcrunch.com',
    'theverge.com',
    'arstechnica.com',
    'wired.com'
  ],
});
```

### Research Assistant

Create a research tool with citations:

```typescript
const response = await client.getDetailedNews(
  'quantum computing breakthroughs',
  5
);

// AI-generated summary
console.log(response.answer);

// Full citations
response.results.forEach(article => {
  console.log(`[${article.title}](${article.url})`);
});
```

### Breaking News Alerts

Monitor specific topics:

```typescript
import { NewsMonitor } from './src/examples/news-monitor';

const monitor = new NewsMonitor('AI regulations');
monitor.startMonitoring(15); // Check every 15 minutes
```

### Content Analysis Pipeline

Analyze news trends:

```typescript
// Get news data
const response = await client.searchNews('climate change', 'week', 50);

// Extract insights
const keywords = extractKeywords(response.results, 20);
const bySource = groupByDomain(response.results);
const topStories = filterByScore(response.results, 0.85);

// Generate report
const summary = createSummary(topStories, 1000);
```

## API Reference

### Types

```typescript
interface TavilySearchOptions {
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

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  raw_content?: string;
  published_date?: string;
}

interface TavilySearchResponse {
  query: string;
  results: TavilySearchResult[];
  answer?: string;
  images?: string[];
  response_time: number;
}
```

## Best Practices

### Query Optimization
- Keep queries focused and under 400 characters
- Use specific terms for better relevance
- Break complex queries into multiple searches

### Result Quality
- Use `include_domains` for trusted sources
- Filter by score (>0.75 for high quality)
- Apply time_range for recent information

### Performance
- Use `ultra-fast` for real-time applications
- Use `advanced` for research accuracy
- Limit max_results to actual needs

### Error Handling
```typescript
try {
  const response = await client.searchNews(query);
  // Process results
} catch (error) {
  console.error('Search failed:', error);
  // Implement retry logic or fallback
}
```

## Use Cases

1. **News Aggregation** - Multi-source news collection
2. **Research Tools** - Academic and market research
3. **Content Discovery** - Topic exploration and trend analysis
4. **Real-time Monitoring** - Breaking news alerts
5. **Competitive Intelligence** - Industry news tracking
6. **AI Agents** - News search for autonomous agents
7. **RAG Systems** - Real-time data for LLM context

## Installation for Your Project

To use this library in your own TypeScript project:

1. Copy the library files:
   ```bash
   cp -r examples/typescript-news-integration/src/lib/tavily ./src/lib/
   ```

2. Install dependencies:
   ```bash
   npm install @tavily/core
   npm install -D @types/node typescript
   ```

3. Import and use:
   ```typescript
   import { createTavilyClient } from './lib/tavily';

   const client = createTavilyClient();
   const results = await client.searchNews('your query');
   ```

## Resources

- [Full Example Code](../../examples/typescript-news-integration/)
- [Tavily API Documentation](https://docs.tavily.com)
- [Tavily JavaScript SDK](https://github.com/tavily-ai/tavily-js)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Tips

- **Start Simple** - Use `searchNews()` method first
- **Then Customize** - Graduate to `search()` for advanced features
- **Use Types** - Leverage TypeScript for better development experience
- **Check Examples** - Review example code for common patterns
- **Monitor Costs** - Be mindful of API usage in production

## Next Steps

1. Review the [example code](../../examples/typescript-news-integration/)
2. Try running the examples locally
3. Adapt the library for your use case
4. Build your application
5. Deploy to production

For production deployments, consider:
- Rate limiting and retry logic
- Caching frequently accessed results
- Error monitoring and alerting
- API key rotation and security
