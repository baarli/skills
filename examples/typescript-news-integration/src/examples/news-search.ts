/**
 * Basic News Search Example
 *
 * This example demonstrates how to search for recent news using the Tavily API.
 */

import { createTavilyClient, formatSearchResults } from '../lib/tavily';

async function main() {
  // Create a client (uses TAVILY_API_KEY environment variable)
  const client = createTavilyClient();

  console.log('Searching for AI news from the past week...\n');

  try {
    // Search for recent AI news
    const response = await client.searchNews('artificial intelligence', 'week', 10);

    // Display formatted results
    console.log(formatSearchResults(response));

    // Display statistics
    console.log('\n--- Statistics ---');
    console.log(`Total results: ${response.results.length}`);
    console.log(`Average score: ${(response.results.reduce((sum, r) => sum + r.score, 0) / response.results.length).toFixed(2)}`);

    // Show top 3 results
    console.log('\n--- Top 3 Results ---');
    response.results.slice(0, 3).forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.title}`);
      console.log(`   ${result.url}`);
      console.log(`   Score: ${result.score.toFixed(2)}`);
    });

  } catch (error) {
    console.error('Error searching news:', error);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  main();
}

export { main };
