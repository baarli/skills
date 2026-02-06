/**
 * Advanced News Search Example
 *
 * This example demonstrates advanced search features including:
 * - Domain filtering
 * - Deep search
 * - Content analysis
 */

import {
  createTavilyClient,
  filterByScore,
  groupByDomain,
  extractKeywords,
  createSummary,
} from '../lib/tavily';

async function main() {
  const client = createTavilyClient();

  console.log('Performing advanced news search on climate change...\n');

  try {
    // Advanced search with domain filtering
    const response = await client.search({
      query: 'climate change latest developments',
      topic: 'news',
      time_range: 'week',
      max_results: 15,
      search_depth: 'advanced',
      include_answer: true,
      include_domains: [
        'reuters.com',
        'bbc.com',
        'theguardian.com',
        'nytimes.com',
        'apnews.com'
      ],
    });

    // Display AI-generated answer
    if (response.answer) {
      console.log('=== AI Summary ===');
      console.log(response.answer);
      console.log();
    }

    // Filter high-quality results
    const highQualityResults = filterByScore(response.results, 0.75);
    console.log(`=== High Quality Results (score >= 0.75) ===`);
    console.log(`Found ${highQualityResults.length} out of ${response.results.length} results\n`);

    // Group by domain
    const byDomain = groupByDomain(highQualityResults);
    console.log('=== Results by Domain ===');
    byDomain.forEach((results, domain) => {
      console.log(`${domain}: ${results.length} results`);
    });
    console.log();

    // Extract keywords
    const keywords = extractKeywords(highQualityResults, 15);
    console.log('=== Top Keywords ===');
    console.log(keywords.join(', '));
    console.log();

    // Create summary
    const summary = createSummary(highQualityResults, 400);
    console.log('=== Combined Summary ===');
    console.log(summary);
    console.log();

    // Display top 5 results with details
    console.log('=== Top 5 Results ===');
    highQualityResults.slice(0, 5).forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.title}`);
      console.log(`   URL: ${result.url}`);
      console.log(`   Score: ${result.score.toFixed(3)}`);
      console.log(`   Content: ${result.content.substring(0, 200)}...`);
    });

  } catch (error) {
    console.error('Error in advanced search:', error);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  main();
}

export { main };
