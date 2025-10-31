/**
 * Oblien Search SDK
 * Powerful AI-powered search, extract, and crawl capabilities
 * 
 * @example
 * ```javascript
 * import { SearchClient } from 'search-agent';
 * 
 * const client = new SearchClient({
 *   clientId: process.env.OBLIEN_CLIENT_ID,
 *   clientSecret: process.env.OBLIEN_CLIENT_SECRET
 * });
 * 
 * // Search with AI answers
 * const results = await client.search(
 *   ['What is machine learning?', 'Latest AI news'],
 *   true, // include AI-generated answers
 *   { summaryLevel: 'intelligent' }
 * );
 * 
 * // Extract content from URLs
 * const extracted = await client.extract([
 *   {
 *     url: 'https://example.com',
 *     details: ['Extract title', 'Extract main content', 'Extract key points']
 *   }
 * ]);
 * 
 * // Crawl and research
 * await client.crawl(
 *   'Crawl https://example.com/blog and summarize all articles',
 *   (event) => console.log('Crawl event:', event),
 *   { type: 'deep' }
 * );
 * ```
 */

/**
 * SearchClient - Main client for Oblien Search API
 */
export class SearchClient {
  /**
   * Create a new SearchClient
   * @param {Object} config - Configuration object
   * @param {string} config.clientId - Your Oblien client ID
   * @param {string} config.clientSecret - Your Oblien client secret
   * @param {string} [config.apiURL='https://api.oblien.com'] - API base URL
   */
  constructor(config) {
    if (!config.clientId) {
      throw new Error('clientId is required');
    }
    if (!config.clientSecret) {
      throw new Error('clientSecret is required');
    }

    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.apiURL = (config.apiURL || 'https://api.oblien.com').replace(/\/$/, '');
  }

  /**
   * Get authentication headers
   * @private
   * @returns {Object} Headers with client credentials
   */
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-Client-ID': this.clientId,
      'X-Client-Secret': this.clientSecret,
    };
  }

  /**
   * Perform web searches with optional AI-generated answers
   * 
   * @param {string[]} queries - Array of search queries to execute
   * @param {boolean} [includeAnswers=false] - Generate AI answers for search results
   * @param {Object} [options={}] - Additional search options
   * @param {boolean} [options.includeMetadata] - Include search metadata
   * @param {'low'|'medium'|'intelligent'} [options.summaryLevel] - AI answer quality level
   * @param {number} [options.maxResults] - Maximum results per query
   * @param {string} [options.language] - Language code (e.g., 'en', 'es')
   * @param {string} [options.region] - Region code (e.g., 'us', 'uk')
   * @param {'day'|'week'|'month'|'year'|'all'} [options.freshness] - Result freshness
   * @returns {Promise<Array>} Array of search results, one per query
   * 
   * @example
   * ```javascript
   * const results = await client.search(
   *   ['What is TypeScript?', 'Best practices for React'],
   *   true,
   *   { summaryLevel: 'intelligent', maxResults: 5 }
   * );
   * 
   * results.forEach(result => {
   *   console.log(`Query: ${result.query}`);
   *   console.log(`Answer: ${result.answer}`);
   *   console.log(`Results:`, result.results);
   * });
   * ```
   */
  async search(queries, includeAnswers = false, options = {}) {
    if (!queries || !Array.isArray(queries) || queries.length === 0) {
      throw new Error('queries must be a non-empty array');
    }

    const response = await fetch(`${this.apiURL}/search`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        queries,
        includeAnswers,
        options,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `Search request failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Extract specific content from web pages using AI
   * 
   * @param {Array} pages - Array of pages to extract content from
   * @param {string} pages[].url - Page URL
   * @param {string[]} pages[].details - Array of extraction instructions (e.g., ['Extract title', 'Extract main content'])
   * @param {'low'|'medium'|'intelligent'} [pages[].summaryLevel] - Extraction quality level
   * @param {Object} [options={}] - Additional extraction options
   * @param {boolean} [options.includeMetadata] - Include extraction metadata
   * @param {number} [options.timeout] - Request timeout in milliseconds
   * @param {number} [options.maxContentLength] - Maximum content length
   * @param {'markdown'|'html'|'text'} [options.format] - Output format
   * @returns {Promise<Object>} Extraction response with success status, data array, and errors
   * 
   * @example
   * ```javascript
   * const extracted = await client.extract([
   *   {
   *     url: 'https://example.com/article',
   *     details: [
   *       'Extract the article title',
   *       'Extract the main content',
   *       'Extract the author name',
   *       'Extract publication date'
   *     ],
   *     summaryLevel: 'medium'
   *   },
   *   {
   *     url: 'https://example.com/products',
   *     details: ['Extract all product names and prices']
   *   }
   * ], { format: 'markdown' });
   * 
   * if (extracted.success) {
   *   extracted.data.forEach(item => {
   *     console.log(`URL: ${item.page.url}`);
   *     console.log(`Result:`, item.result);
   *   });
   * }
   * ```
   */
  async extract(pages, options = {}) {
    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      throw new Error('pages must be a non-empty array');
    }

    // Validate pages format
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      if (!page.url) {
        throw new Error(`Page at index ${i} is missing required field: url`);
      }
      if (!page.details || !Array.isArray(page.details) || page.details.length === 0) {
        throw new Error(`Page at index ${i} is missing required field: details (must be non-empty array)`);
      }
    }

    const response = await fetch(`${this.apiURL}/search/extract`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        pages,
        options,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `Extract request failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Crawl and research websites with real-time streaming results
   * 
   * @param {string} instructions - Crawl instructions (must include URL and what to extract/research)
   * @param {Function} [onEvent] - Callback function for streaming events
   * @param {Object} [options={}] - Additional crawl options
   * @param {'deep'|'shallow'|'focused'} [options.type='deep'] - Crawl type/depth
   * @param {boolean} [options.thinking=true] - Enable AI thinking process
   * @param {boolean} [options.allow_thinking_callback=true] - Stream thinking events
   * @param {boolean} [options.stream_text=true] - Stream text results
   * @param {number} [options.maxDepth] - Maximum crawl depth
   * @param {number} [options.maxPages] - Maximum pages to crawl
   * @returns {Promise<Object>} Final crawl response with success status and timing
   * 
   * @example
   * ```javascript
   * // With streaming events
   * const result = await client.crawl(
   *   'Crawl https://example.com/blog and extract titles and summaries of all articles',
   *   (event) => {
   *     if (event.type === 'page_crawled') {
   *       console.log('Crawled:', event.url);
   *     } else if (event.type === 'content') {
   *       console.log('Content:', event.text);
   *     } else if (event.type === 'thinking') {
   *       console.log('AI thinking:', event.thought);
   *     }
   *   },
   *   { type: 'deep', maxPages: 10 }
   * );
   * 
   * console.log(`Crawl completed in ${result.time_took}ms`);
   * ```
   */
  async crawl(instructions, onEvent, options = {}) {
    if (!instructions || typeof instructions !== 'string') {
      throw new Error('instructions is required and must be a string');
    }

    const response = await fetch(`${this.apiURL}/search/crawl`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        instructions,
        options: {
          type: 'deep',
          thinking: true,
          allow_thinking_callback: true,
          stream_text: true,
          ...options,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `Crawl request failed: ${response.status}`);
    }

    // Handle SSE stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let finalResult = null;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'error') {
                throw new Error(data.error || 'Crawl error');
              }

              if (data.type === 'crawl_end') {
                finalResult = data.data;
              } else if (onEvent && typeof onEvent === 'function') {
                onEvent(data);
              }
            } catch (parseError) {
              if (parseError.message.includes('Crawl error')) {
                throw parseError;
              }
              // Ignore JSON parse errors for malformed chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return finalResult || { success: true, time_took: 0 };
  }
}

export default SearchClient;

