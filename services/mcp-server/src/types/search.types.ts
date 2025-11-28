/** @format */

import type {
  DocumentMetadata,
  DocumentType,
  DocumentStatus,
} from "./documentation.types.js";

export interface SearchQuery {
  text?: string;
  documentType?: DocumentType[];
  module?: string[];
  status?: DocumentStatus[];
  keywords?: string[];
  dateRange?: {
    from?: string;
    to?: string;
  };
  scoring?: {
    titleWeight?: number;
    keywordWeight?: number;
    contentWeight?: number;
    metadataWeight?: number;
    recencyBoost?: number;
  };
  pagination?: {
    page: number;
    limit: number;
  };
  sort?: {
    field: keyof DocumentMetadata | "score" | "relevance";
    order: "asc" | "desc";
  };
}

export interface PaginatedSearchResults {
  results: Array<{
    document: DocumentMetadata;
    score: number;
    highlights: ContentSnippet[];
    matchedFields: string[];
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  aggregations?: SearchAggregations;
  queryTime: number;
}

export interface FuzzySearchConfig {
  threshold?: number;
  distance?: number;
  keys: Array<{
    name: string;
    weight: number;
  }>;
  includeScore?: boolean;
  shouldSort?: boolean;
  minMatchCharLength?: number;
  ignoreLocation?: boolean;
}

export interface InvertedIndex {
  keyword: string;
  docUris: Set<string>;
  frequency: number;
}

export interface RelationshipGraph {
  nodes: Map<string, DocumentMetadata>;
  adjacencyList: Map<string, Set<string>>;
  reverseIndex: Map<string, Set<string>>;
}

export interface SearchCache {
  entries: Map<string, { result: PaginatedSearchResults; timestamp: number }>;
  maxSize: number;
  ttl: number;
  stats: {
    hits: number;
    misses: number;
    evictions: number;
  };
}

export interface ContentSnippet {
  text: string;
  startIndex: number;
  endIndex: number;
  matchedTerms: string[];
  score: number;
  context?: {
    before: string;
    after: string;
  };
}

export interface SearchSuggestion {
  original: string;
  suggested: string;
  confidence: number;
  editDistance: number;
}

export interface SearchAggregations {
  byType: Record<DocumentType, number>;
  byModule: Record<string, number>;
  byStatus: Record<DocumentStatus, number>;
  byKeyword: Array<{ keyword: string; count: number }>;
  dateHistogram?: Array<{ date: string; count: number }>;
}

export class SearchQueryBuilder {
  private query: SearchQuery = {};

  text(text: string): this {
    this.query.text = text;
    return this;
  }

  ofType(...types: DocumentType[]): this {
    this.query.documentType = types;
    return this;
  }

  inModule(...modules: string[]): this {
    this.query.module = modules;
    return this;
  }

  withStatus(...statuses: DocumentStatus[]): this {
    this.query.status = statuses;
    return this;
  }

  withKeywords(...keywords: string[]): this {
    this.query.keywords = keywords;
    return this;
  }

  updatedAfter(date: string): this {
    if (!this.query.dateRange) this.query.dateRange = {};
    this.query.dateRange.from = date;
    return this;
  }

  updatedBefore(date: string): this {
    if (!this.query.dateRange) this.query.dateRange = {};
    this.query.dateRange.to = date;
    return this;
  }

  sortBy(
    field: keyof DocumentMetadata | "score",
    order: "asc" | "desc" = "desc",
  ): this {
    this.query.sort = { field, order };
    return this;
  }

  paginate(page: number, limit: number = 10): this {
    this.query.pagination = { page, limit };
    return this;
  }

  build(): SearchQuery {
    return { ...this.query };
  }
}
