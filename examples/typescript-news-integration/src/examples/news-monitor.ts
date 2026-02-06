/**
 * Real-time News Monitor Example
 *
 * This example demonstrates how to monitor breaking news on a specific topic.
 */

import { createTavilyClient, TavilySearchResult } from '../lib/tavily';

interface NewsAlert {
  timestamp: Date;
  query: string;
  newArticles: TavilySearchResult[];
}

class NewsMonitor {
  private client;
  private seenUrls: Set<string> = new Set();
  private query: string;

  constructor(query: string) {
    this.client = createTavilyClient();
    this.query = query;
  }

  /**
   * Check for new articles
   */
  async checkForUpdates(): Promise<NewsAlert | null> {
    try {
      const response = await this.client.searchNews(this.query, 'day', 10);

      // Filter out articles we've already seen
      const newArticles = response.results.filter(
        result => !this.seenUrls.has(result.url)
      );

      // Add new URLs to seen set
      newArticles.forEach(article => this.seenUrls.add(article.url));

      if (newArticles.length > 0) {
        return {
          timestamp: new Date(),
          query: this.query,
          newArticles,
        };
      }

      return null;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return null;
    }
  }

  /**
   * Start monitoring with periodic checks
   */
  startMonitoring(intervalMinutes: number = 15): NodeJS.Timeout {
    console.log(`Starting news monitor for: "${this.query}"`);
    console.log(`Check interval: ${intervalMinutes} minutes\n`);

    // Initial check
    this.checkForUpdates().then(alert => {
      if (alert) {
        this.handleAlert(alert);
      } else {
        console.log(`[${new Date().toISOString()}] No new articles found`);
      }
    });

    // Set up periodic checks
    return setInterval(async () => {
      const alert = await this.checkForUpdates();
      if (alert) {
        this.handleAlert(alert);
      } else {
        console.log(`[${new Date().toISOString()}] No new articles found`);
      }
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Handle a news alert
   */
  private handleAlert(alert: NewsAlert): void {
    console.log(`\n🚨 [${alert.timestamp.toISOString()}] New articles found!`);
    console.log(`Query: "${alert.query}"`);
    console.log(`Count: ${alert.newArticles.length}\n`);

    alert.newArticles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   ${article.url}`);
      console.log(`   Score: ${article.score.toFixed(2)}`);
      console.log();
    });
  }
}

async function main() {
  // Create a monitor for a specific topic
  const monitor = new NewsMonitor('technology breakthroughs');

  // Start monitoring (checks every 15 minutes)
  const intervalId = monitor.startMonitoring(15);

  // For demo purposes, run for 2 minutes then stop
  setTimeout(() => {
    console.log('\nStopping news monitor (demo complete)');
    clearInterval(intervalId);
    process.exit(0);
  }, 2 * 60 * 1000);

  // Keep the process running
  console.log('Press Ctrl+C to stop monitoring\n');
}

// Run the example
if (require.main === module) {
  main();
}

export { NewsMonitor, main };
