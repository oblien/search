# Oblien Search SDK

AI-powered web search, content extraction, and website crawling SDK for Node.js.

## Installation

```bash
npm install oblien-search
```

## Quick Start

```javascript
import { SearchClient } from 'oblien-search';

const client = new SearchClient({
  clientId: process.env.OBLIEN_CLIENT_ID,
  clientSecret: process.env.OBLIEN_CLIENT_SECRET
});

// Search with AI-generated answers
const results = await client.search(
  ['What is machine learning?'],
  true,
  { summaryLevel: 'intelligent' }
);

console.log(results[0].answer);
```

## Authentication

Get your API credentials from [Oblien Dashboard](https://oblien.com/dashboard/api).

```javascript
const client = new SearchClient({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  apiURL: 'https://api.oblien.com' // optional, defaults to production
});
```

## API Reference

### Search

Perform AI-powered web searches with batch processing support.

#### Method

```javascript
client.search(queries, includeAnswers, options)
```

#### Parameters

**queries** (string[], required)
- Array of search queries to execute
- Supports batch processing of multiple queries

**includeAnswers** (boolean, optional, default: false)
- Generate AI-powered answers for search results
- Answers are created using advanced language models

**options** (object, optional)
- `includeMetadata` (boolean) - Include search metadata in response
- `summaryLevel` ('low' | 'medium' | 'intelligent') - AI answer quality level
  - `low` - Fast, basic answers
  - `medium` - Balanced quality and speed (recommended)
  - `intelligent` - Highest quality, slower generation
- `maxResults` (number) - Maximum number of results per query
- `language` (string) - Language code (e.g., 'en', 'es', 'fr', 'de')
- `region` (string) - Region code (e.g., 'us', 'uk', 'eu', 'asia')
- `freshness` ('day' | 'week' | 'month' | 'year' | 'all') - Result freshness filter
- `startDate` (string) - Start date for range filtering (ISO 8601 format)
- `endDate` (string) - End date for range filtering (ISO 8601 format)
- `includeImages` (boolean) - Include images in search results
- `includeImageDescriptions` (boolean) - Include AI-generated image descriptions
- `includeFavicon` (boolean) - Include website favicons
- `includeRawContent` ('none' | 'with_links' | 'with_images_and_links') - Raw content inclusion level
- `chunksPerSource` (number) - Number of content chunks per source
- `country` (string) - Country code filter
- `includeDomains` (string[]) - Array of domains to include in search
- `excludeDomains` (string[]) - Array of domains to exclude from search
- `searchTopic` ('general' | 'news' | 'finance') - Search topic category
- `searchDepth` ('basic' | 'advanced') - Search depth level
- `timeRange` ('none' | 'day' | 'week' | 'month' | 'year') - Time range filter

#### Returns

Promise resolving to array of search results. Each result contains:

```typescript
{
  success: boolean,           // Whether the search succeeded
  query: string,             // Original search query
  results: Array<{
    url: string,            // Result URL
    title: string,          // Result title
    content: string,        // Result content/snippet
    // Additional fields based on options
  }>,
  answer?: string,           // AI-generated answer (if includeAnswers=true)
  metadata?: object,         // Search metadata (if includeMetadata=true)
  time_took: number         // Time taken in milliseconds
}
```

#### Examples

**Basic search:**

```javascript
const results = await client.search(['TypeScript tutorial']);

console.log(results[0].results[0].title);
console.log(results[0].results[0].url);
```

**Search with AI answers:**

```javascript
const results = await client.search(
  ['What is quantum computing?'],
  true,
  { summaryLevel: 'intelligent' }
);

console.log(results[0].answer);
```

**Batch search with options:**

```javascript
const results = await client.search(
  [
    'Latest AI developments',
    'Machine learning best practices',
    'Neural networks explained'
  ],
  true,
  {
    summaryLevel: 'medium',
    maxResults: 5,
    freshness: 'week',
    language: 'en',
    region: 'us'
  }
);

results.forEach(result => {
  console.log(`Query: ${result.query}`);
  console.log(`Answer: ${result.answer}`);
  console.log(`Results count: ${result.results.length}`);
});
```

**Advanced filtering:**

```javascript
const results = await client.search(
  ['climate change research'],
  false,
  {
    includeDomains: ['nature.com', 'science.org', 'pnas.org'],
    searchTopic: 'general',
    freshness: 'year',
    includeMetadata: true
  }
);
```

### Extract

Extract specific content from web pages using AI-powered extraction.

#### Method

```javascript
client.extract(pages, options)
```

#### Parameters

**pages** (array, required)
- Array of page objects to extract content from
- Each page must include:
  - `url` (string, required) - Page URL to extract from
  - `details` (string[], required) - Array of extraction instructions
  - `summaryLevel` ('low' | 'medium' | 'intelligent', optional) - Extraction quality level

**options** (object, optional)
- `includeMetadata` (boolean) - Include extraction metadata
- `timeout` (number) - Request timeout in milliseconds (default: 30000)
- `maxContentLength` (number) - Maximum content length to extract
- `format` ('markdown' | 'html' | 'text') - Output format (default: 'markdown')
- `extractDepth` ('basic' | 'advanced') - Extraction depth level
- `includeImages` (boolean) - Include images in extracted content
- `includeFavicon` (boolean) - Include page favicon
- `maxLength` (number) - Maximum extraction length

#### Returns

Promise resolving to extraction response:

```typescript
{
  success: boolean,          // Whether extraction succeeded
  data: Array<{
    result: object,         // Extracted content
    page: {
      url: string,
      details: string[],
      summaryLevel: string
    }
  }>,
  errors: string[],          // Array of error messages (if any)
  time_took: number         // Time taken in milliseconds
}
```

#### Examples

**Basic extraction:**

```javascript
const extracted = await client.extract([
  {
    url: 'https://example.com/article',
    details: [
      'Extract the article title',
      'Extract the main content',
      'Extract the author name'
    ]
  }
]);

if (extracted.success) {
  console.log(extracted.data[0].result);
}
```

**Batch extraction with different instructions:**

```javascript
const extracted = await client.extract([
  {
    url: 'https://example.com/blog/post-1',
    details: [
      'Extract blog post title',
      'Extract publication date',
      'Extract main content',
      'Extract tags'
    ],
    summaryLevel: 'medium'
  },
  {
    url: 'https://example.com/products',
    details: [
      'Extract all product names',
      'Extract product prices',
      'Extract product descriptions'
    ],
    summaryLevel: 'intelligent'
  },
  {
    url: 'https://example.com/about',
    details: [
      'Extract company mission',
      'Extract team members',
      'Extract contact information'
    ]
  }
], {
  format: 'markdown',
  timeout: 60000
});

extracted.data.forEach(item => {
  console.log(`URL: ${item.page.url}`);
  console.log(`Extracted:`, item.result);
});
```

**Advanced extraction with options:**

```javascript
const extracted = await client.extract([
  {
    url: 'https://research.example.com/paper',
    details: [
      'Extract paper abstract',
      'Extract key findings',
      'Extract methodology',
      'Extract conclusions',
      'Extract references'
    ],
    summaryLevel: 'intelligent'
  }
], {
  format: 'markdown',
  extractDepth: 'advanced',
  includeMetadata: true,
  maxContentLength: 100000
});
```

### Crawl

Crawl and research websites with real-time streaming results.

#### Method

```javascript
client.crawl(instructions, onEvent, options)
```

#### Parameters

**instructions** (string, required)
- Natural language instructions for the crawl
- Must include the target URL and what to extract/research
- Example: "Crawl https://example.com/blog and extract all article titles and summaries"

**onEvent** (function, optional)
- Callback function for real-time streaming events
- Receives event objects with type and data
- Event types:
  - `page_crawled` - Page was successfully crawled
  - `content` - Content chunk extracted
  - `thinking` - AI thinking process (if enabled)
  - `error` - Error occurred
  - `crawl_end` - Crawl completed

**options** (object, optional)
- `type` ('deep' | 'shallow' | 'focused') - Crawl type (default: 'deep')
  - `deep` - Comprehensive crawl with detailed analysis
  - `shallow` - Quick crawl of main pages only
  - `focused` - Targeted crawl based on instructions
- `thinking` (boolean) - Enable AI thinking process (default: true)
- `allow_thinking_callback` (boolean) - Stream thinking events to callback (default: true)
- `stream_text` (boolean) - Stream text results to callback (default: true)
- `maxDepth` (number) - Maximum crawl depth (number of link levels)
- `maxPages` (number) - Maximum number of pages to crawl
- `includeExternal` (boolean) - Include external links in crawl
- `timeout` (number) - Request timeout in milliseconds
- `crawlDepth` ('basic' | 'advanced') - Crawl depth level
- `format` ('markdown' | 'html' | 'text') - Output format
- `includeImages` (boolean) - Include images in crawled content
- `includeFavicon` (boolean) - Include favicons
- `followLinks` (boolean) - Follow links during crawl

#### Returns

Promise resolving to final crawl response:

```typescript
{
  success: boolean,          // Whether crawl succeeded
  time_took: number         // Time taken in milliseconds
}
```

#### Examples

**Basic crawl:**

```javascript
const result = await client.crawl(
  'Crawl https://example.com/blog and summarize all blog posts'
);

console.log(`Completed in ${result.time_took}ms`);
```

**Crawl with event streaming:**

```javascript
const result = await client.crawl(
  'Crawl https://example.com/docs and extract all API endpoints with their descriptions',
  (event) => {
    if (event.type === 'page_crawled') {
      console.log(`Crawled page: ${event.url}`);
    } else if (event.type === 'content') {
      console.log(`Content found: ${event.text}`);
    } else if (event.type === 'thinking') {
      console.log(`AI thinking: ${event.thought}`);
    }
  },
  {
    type: 'deep',
    maxPages: 20
  }
);
```

**Advanced crawl with options:**

```javascript
let crawledPages = [];
let extractedContent = [];

const result = await client.crawl(
  'Research https://news.example.com and find all articles about artificial intelligence from the last week',
  (event) => {
    switch (event.type) {
      case 'page_crawled':
        crawledPages.push(event.url);
        console.log(`Progress: ${crawledPages.length} pages crawled`);
        break;
      
      case 'content':
        extractedContent.push(event.text);
        console.log(`Extracted content length: ${event.text.length} chars`);
        break;
      
      case 'thinking':
        console.log(`AI Analysis: ${event.thought}`);
        break;
      
      case 'error':
        console.error(`Error: ${event.error}`);
        break;
    }
  },
  {
    type: 'focused',
    thinking: true,
    maxDepth: 3,
    maxPages: 50,
    includeExternal: false,
    format: 'markdown'
  }
);

console.log(`Crawl completed:`);
console.log(`- Total pages: ${crawledPages.length}`);
console.log(`- Content chunks: ${extractedContent.length}`);
console.log(`- Time: ${result.time_took}ms`);
```

**Research-focused crawl:**

```javascript
const result = await client.crawl(
  `Crawl https://company.example.com and create a comprehensive report including:
   - Company overview and mission
   - Product offerings and features
   - Pricing information
   - Customer testimonials
   - Contact information and locations`,
  (event) => {
    if (event.type === 'content') {
      // Process extracted content in real-time
      processAndStore(event.text);
    }
  },
  {
    type: 'deep',
    thinking: true,
    maxDepth: 4,
    format: 'markdown'
  }
);
```

## Error Handling

All methods throw errors for failed requests. Always use try-catch blocks:

```javascript
try {
  const results = await client.search(['test query']);
  console.log(results);
} catch (error) {
  console.error('Search failed:', error.message);
}
```

Common error scenarios:

**Missing credentials:**
```javascript
// Throws: 'clientId is required'
new SearchClient({ clientSecret: 'secret' });
```

**Invalid parameters:**
```javascript
// Throws: 'queries must be a non-empty array'
await client.search([]);

// Throws: 'Page at index 0 is missing required field: details'
await client.extract([{ url: 'https://example.com' }]);
```

**API errors:**
```javascript
try {
  await client.search(['query']);
} catch (error) {
  // Error message includes API error details
  console.error(error.message);
}
```

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import { SearchClient, SearchOptions, SearchResult } from 'oblien-search';

const client = new SearchClient({
  clientId: process.env.OBLIEN_CLIENT_ID!,
  clientSecret: process.env.OBLIEN_CLIENT_SECRET!
});

const options: SearchOptions = {
  summaryLevel: 'intelligent',
  maxResults: 10,
  freshness: 'week'
};

const results: SearchResult[] = await client.search(
  ['TypeScript best practices'],
  true,
  options
);
```

## Rate Limiting

The API implements rate limiting. Refer to response headers for current limits:
- `X-RateLimit-Limit` - Total requests allowed per window
- `X-RateLimit-Remaining` - Requests remaining in current window
- `X-RateLimit-Reset` - Window reset time (Unix timestamp)

## Best Practices

### Search

1. **Batch related queries** - Process multiple related searches in one request
2. **Use appropriate summary levels** - 'low' for speed, 'intelligent' for quality
3. **Set reasonable maxResults** - Typical range: 5-20 results
4. **Apply filters early** - Use domain filters and freshness to improve relevance

```javascript
// Good: Batch related queries
const results = await client.search(
  ['ML frameworks', 'ML tools', 'ML libraries'],
  true,
  { summaryLevel: 'medium', maxResults: 5 }
);

// Better: Use filters for precision
const results = await client.search(
  ['latest research'],
  true,
  {
    includeDomains: ['arxiv.org', 'nature.com'],
    freshness: 'month'
  }
);
```

### Extract

1. **Be specific with details** - Clear instructions produce better results
2. **Batch similar extractions** - Process related pages together
3. **Set appropriate timeouts** - Increase for large pages or slow sites

```javascript
// Good: Specific extraction instructions
const extracted = await client.extract([
  {
    url: 'https://example.com',
    details: [
      'Extract the main heading (h1 tag)',
      'Extract the first paragraph of content',
      'Extract any pricing information mentioned'
    ]
  }
]);

// Better: Include context in instructions
const extracted = await client.extract([
  {
    url: 'https://example.com/product',
    details: [
      'Extract product name from the title',
      'Extract pricing from the price section',
      'Extract feature list from the features section',
      'Extract customer rating if available'
    ],
    summaryLevel: 'intelligent'
  }
], {
  timeout: 60000,
  format: 'markdown'
});
```

### Crawl

1. **Provide clear instructions** - Include URL and specific research goals
2. **Set appropriate limits** - maxPages and maxDepth prevent runaway crawls
3. **Use event callbacks** - Process results in real-time for large crawls
4. **Choose the right type** - 'focused' for specific targets, 'deep' for comprehensive

```javascript
// Good: Clear, focused instructions
await client.crawl(
  'Crawl https://docs.example.com and extract all API method signatures',
  (event) => processEvent(event),
  { type: 'focused', maxPages: 30 }
);

// Better: Detailed instructions with constraints
await client.crawl(
  `Research https://example.com/blog for articles about:
   - Cloud computing trends
   - DevOps best practices
   - Container orchestration
   Extract title, date, and summary for each relevant article`,
  (event) => {
    if (event.type === 'content') {
      saveToDatabase(event.text);
    }
  },
  {
    type: 'deep',
    maxPages: 50,
    maxDepth: 3,
    thinking: true
  }
);
```

## Support

- Documentation: [https://oblien.com/docs/search-api](https://oblien.com/docs/search-api)
- Dashboard: [https://oblien.com/dashboard](https://oblien.com/dashboard)
- Issues: [https://github.com/oblien/oblien-search/issues](https://github.com/oblien/oblien-search/issues)

## License

MIT

