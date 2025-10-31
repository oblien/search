/**
 * Oblien Search SDK - TypeScript Definitions
 * @module oblien-search
 */

/**
 * Configuration options for SearchClient
 */
export interface SearchClientConfig {
  /** Your Oblien client ID */
  clientId: string;
  /** Your Oblien client secret */
  clientSecret: string;
  /** API base URL (default: 'https://api.oblien.com') */
  apiURL?: string;
}

/**
 * Options for search requests
 */
export interface SearchOptions {
  /** Include search metadata in response */
  includeMetadata?: boolean;
  /** Summary level for AI-generated answers: 'low' | 'medium' | 'intelligent' */
  summaryLevel?: 'low' | 'medium' | 'intelligent';
  /** Maximum number of results per query */
  maxResults?: number;
  /** Language code (e.g., 'en', 'es', 'fr') */
  language?: string;
  /** Region code (e.g., 'us', 'uk', 'eu') */
  region?: string;
  /** Result freshness: 'day' | 'week' | 'month' | 'year' | 'all' */
  freshness?: 'day' | 'week' | 'month' | 'year' | 'all';
  /** Start date for date range filtering (ISO 8601) */
  startDate?: string;
  /** End date for date range filtering (ISO 8601) */
  endDate?: string;
  /** Include images in results */
  includeImages?: boolean;
  /** Include image descriptions */
  includeImageDescriptions?: boolean;
  /** Include favicons */
  includeFavicon?: boolean;
  /** Include raw content: 'none' | 'with_links' | 'with_images_and_links' */
  includeRawContent?: 'none' | 'with_links' | 'with_images_and_links';
  /** Chunks per source */
  chunksPerSource?: number;
  /** Country code */
  country?: string;
  /** Domains to include */
  includeDomains?: string[];
  /** Domains to exclude */
  excludeDomains?: string[];
  /** Search topic: 'general' | 'news' | 'finance' */
  searchTopic?: 'general' | 'news' | 'finance';
  /** Search depth: 'basic' | 'advanced' */
  searchDepth?: 'basic' | 'advanced';
  /** Time range: 'none' | 'day' | 'week' | 'month' | 'year' */
  timeRange?: 'none' | 'day' | 'week' | 'month' | 'year';
}

/**
 * Search result for a single query
 */
export interface SearchResult {
  /** Whether the search was successful */
  success: boolean;
  /** The original query */
  query: string;
  /** Search results */
  results: Array<{
    /** Result URL */
    url: string;
    /** Result title */
    title: string;
    /** Result content/description */
    content?: string;
    /** Result snippet */
    snippet?: string;
    /** Additional metadata */
    [key: string]: any;
  }>;
  /** AI-generated answer (if includeAnswers was true) */
  answer?: string;
  /** Search metadata */
  metadata?: any;
  /** Time taken in milliseconds */
  time_took: number;
}

/**
 * Page to extract content from
 */
export interface ExtractPage {
  /** Page URL */
  url: string;
  /** Array of extraction instructions/prompts */
  details: string[];
  /** Summary level: 'low' | 'medium' | 'intelligent' */
  summaryLevel?: 'low' | 'medium' | 'intelligent';
}

/**
 * Options for extract requests
 */
export interface ExtractOptions {
  /** Include extraction metadata */
  includeMetadata?: boolean;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Maximum content length */
  maxContentLength?: number;
  /** Output format: 'markdown' | 'html' | 'text' */
  format?: 'markdown' | 'html' | 'text';
  /** Extraction depth: 'basic' | 'advanced' */
  extractDepth?: 'basic' | 'advanced';
  /** Include images */
  includeImages?: boolean;
  /** Include favicons */
  includeFavicon?: boolean;
  /** Maximum length */
  maxLength?: number;
}

/**
 * Extract result for a single page
 */
export interface ExtractResult {
  /** Extraction result data */
  result: any;
  /** Original page request */
  page: ExtractPage;
}

/**
 * Extract response
 */
export interface ExtractResponse {
  /** Whether extraction was successful */
  success: boolean;
  /** Array of extraction results */
  data: ExtractResult[];
  /** Array of error messages (if any) */
  errors: string[];
  /** Time taken in milliseconds */
  time_took: number;
}

/**
 * Options for crawl requests
 */
export interface CrawlOptions {
  /** Crawl type: 'deep' | 'shallow' | 'focused' */
  type?: 'deep' | 'shallow' | 'focused';
  /** Enable AI thinking process */
  thinking?: boolean;
  /** Stream thinking events to callback */
  allow_thinking_callback?: boolean;
  /** Stream text results to callback */
  stream_text?: boolean;
  /** Maximum crawl depth */
  maxDepth?: number;
  /** Maximum number of pages to crawl */
  maxPages?: number;
  /** Include external links */
  includeExternal?: boolean;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Crawl depth: 'basic' | 'advanced' */
  crawlDepth?: 'basic' | 'advanced';
  /** Output format: 'markdown' | 'html' | 'text' */
  format?: 'markdown' | 'html' | 'text';
  /** Include images */
  includeImages?: boolean;
  /** Include favicons */
  includeFavicon?: boolean;
  /** Follow links */
  followLinks?: boolean;
}

/**
 * SSE event from crawl stream
 */
export interface CrawlEvent {
  /** Event type */
  type: string;
  /** Event data */
  [key: string]: any;
}

/**
 * Final crawl response
 */
export interface CrawlResponse {
  /** Whether crawl was successful */
  success: boolean;
  /** Time taken in milliseconds */
  time_took: number;
}

/**
 * Main Search Client for Oblien Search API
 */
export class SearchClient {
  constructor(config: SearchClientConfig);

  /**
   * Perform web searches with AI-powered results
   * @param queries - Array of search queries
   * @param includeAnswers - Generate AI answers for search results
   * @param options - Additional search options
   * @returns Promise resolving to array of search results
   */
  search(
    queries: string[],
    includeAnswers?: boolean,
    options?: SearchOptions
  ): Promise<SearchResult[]>;

  /**
   * Extract specific content from web pages
   * @param pages - Array of pages with extraction instructions
   * @param options - Additional extraction options
   * @returns Promise resolving to extraction response
   */
  extract(
    pages: ExtractPage[],
    options?: ExtractOptions
  ): Promise<ExtractResponse>;

  /**
   * Crawl and research websites with streaming results
   * @param instructions - Crawl instructions (including URL and what to extract)
   * @param onEvent - Callback for streaming events
   * @param options - Additional crawl options
   * @returns Promise resolving to final crawl response
   */
  crawl(
    instructions: string,
    onEvent?: (event: CrawlEvent) => void,
    options?: CrawlOptions
  ): Promise<CrawlResponse>;
}

export default SearchClient;

