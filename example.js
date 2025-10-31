/**
 * Example usage of Oblien Search SDK
 * 
 * Before running, set environment variables:
 * export OBLIEN_CLIENT_ID=your-client-id
 * export OBLIEN_CLIENT_SECRET=your-client-secret
 */

import { SearchClient } from './src/index.js';

// Initialize client
const client = new SearchClient({
  clientId: process.env.OBLIEN_CLIENT_ID,
  clientSecret: process.env.OBLIEN_CLIENT_SECRET
});

// Example 1: Basic Search
async function exampleSearch() {
  console.log('\n=== Example 1: Basic Search ===\n');
  
  const results = await client.search(['What is TypeScript?']);
  
  console.log(`Query: ${results[0].query}`);
  console.log(`Found ${results[0].results.length} results`);
  console.log(`Top result: ${results[0].results[0].title}`);
}

// Example 2: Search with AI Answers
async function exampleSearchWithAnswers() {
  console.log('\n=== Example 2: Search with AI Answers ===\n');
  
  const results = await client.search(
    ['What is machine learning?', 'Latest developments in AI'],
    true,
    { summaryLevel: 'intelligent', maxResults: 3 }
  );
  
  results.forEach(result => {
    console.log(`\nQuery: ${result.query}`);
    console.log(`Answer: ${result.answer}`);
    console.log(`Results: ${result.results.length}`);
  });
}

// Example 3: Content Extraction
async function exampleExtract() {
  console.log('\n=== Example 3: Content Extraction ===\n');
  
  const extracted = await client.extract([
    {
      url: 'https://oblien.com',
      details: [
        'Extract the main heading',
        'Extract the company description',
        'Extract key features mentioned'
      ],
      summaryLevel: 'medium'
    }
  ], {
    format: 'markdown'
  });
  
  if (extracted.success) {
    console.log('Extraction successful!');
    console.log('URL:', extracted.data[0].page.url);
    console.log('Result:', JSON.stringify(extracted.data[0].result, null, 2));
    console.log('Time taken:', extracted.time_took, 'ms');
  }
}

// Example 4: Website Crawling with Streaming
async function exampleCrawl() {
  console.log('\n=== Example 4: Website Crawling ===\n');
  
  let pageCount = 0;
  let contentChunks = 0;
  
  const result = await client.crawl(
    'Crawl https://oblien.com and summarize the main services offered',
    (event) => {
      if (event.type === 'page_crawled') {
        pageCount++;
        console.log(`  Crawled page ${pageCount}: ${event.url || 'processing...'}`);
      } else if (event.type === 'content') {
        contentChunks++;
        console.log(`  Content chunk ${contentChunks} received`);
      } else if (event.type === 'thinking') {
        console.log(`  AI thinking: ${event.thought || 'analyzing...'}`);
      }
    },
    {
      type: 'focused',
      maxPages: 5,
      thinking: true
    }
  );
  
  console.log(`\nCrawl completed in ${result.time_took}ms`);
  console.log(`Total pages: ${pageCount}`);
  console.log(`Total content chunks: ${contentChunks}`);
}

// Example 5: Error Handling
async function exampleErrorHandling() {
  console.log('\n=== Example 5: Error Handling ===\n');
  
  try {
    // This will fail - empty queries array
    await client.search([]);
  } catch (error) {
    console.log('Caught expected error:', error.message);
  }
  
  try {
    // This will fail - missing required details
    await client.extract([{ url: 'https://example.com' }]);
  } catch (error) {
    console.log('Caught expected error:', error.message);
  }
}

// Run all examples
async function runAllExamples() {
  try {
    await exampleSearch();
    await exampleSearchWithAnswers();
    await exampleExtract();
    await exampleCrawl();
    await exampleErrorHandling();
    
    console.log('\n=== All examples completed successfully! ===\n');
  } catch (error) {
    console.error('Error running examples:', error.message);
  }
}

// Uncomment to run:
// runAllExamples();

// Or run individual examples:
// exampleSearch();
// exampleSearchWithAnswers();
// exampleExtract();
// exampleCrawl();
// exampleErrorHandling();

