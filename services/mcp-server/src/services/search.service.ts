/** @format */

import { readFileSync } from "fs";
import Fuse from "fuse.js";
import type {
  DocumentMetadata,
  DocumentStatus,
  DocumentType,
} from "../types/documentation.types.js";
import type {
  ContentSnippet,
  FuzzySearchConfig,
  PaginatedSearchResults,
  SearchAggregations,
  SearchQuery,
} from "../types/search.types.js";
import { extractSnippet } from "../utils/markdown-parser.js";
import { DocumentationIndexService } from "./documentation-index.service.js";

export class SearchService {
  private indexService: DocumentationIndexService;
  private fuseInstance: Fuse<DocumentMetadata> | null = null;

  constructor(indexService: DocumentationIndexService) {
    this.indexService = indexService;
  }

  public initializeFuzzySearch(): void {
    const config: FuzzySearchConfig = {
      threshold: 0.3,
      distance: 100,
      keys: [
        { name: "title", weight: 0.4 },
        { name: "keywords", weight: 0.3 },
        { name: "module", weight: 0.2 },
        { name: "document_type", weight: 0.1 },
      ],
      includeScore: true,
      shouldSort: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
    };

    const documents = this.indexService.getAllDocuments();
    this.fuseInstance = new Fuse(documents, config);
    console.log(
      `[SearchService] Initialized fuzzy search with ${documents.length} documents`,
    );
  }

  public search(query: SearchQuery): PaginatedSearchResults {
    const startTime = Date.now();
    let results = this.executeSearch(query);

    results = this.applyFilters(results, query);
    results = this.scoreResults(results, query);

    const totalResults = results.length;
    const page = query.pagination?.page || 1;
    const limit = query.pagination?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedResults = results.slice(startIndex, endIndex);

    const aggregations = this.buildAggregations(results);

    return {
      results: paginatedResults.map((result) => ({
        document: result.document,
        score: result.score,
        highlights: result.highlights || [],
        matchedFields: result.matchedFields || [],
      })),
      pagination: {
        total: totalResults,
        page,
        limit,
        totalPages: Math.ceil(totalResults / limit),
        hasNext: endIndex < totalResults,
        hasPrev: page > 1,
      },
      aggregations,
      queryTime: Date.now() - startTime,
    };
  }

  private executeSearch(query: SearchQuery): Array<{
    document: DocumentMetadata;
    score: number;
    highlights?: ContentSnippet[];
    matchedFields?: string[];
  }> {
    if (query.text && this.fuseInstance) {
      const fuseResults = this.fuseInstance.search(query.text);
      return fuseResults.map((result) => ({
        document: result.item,
        score: 1 - (result.score || 0),
        matchedFields: this.getMatchedFields(result.item, query.text!),
        highlights: this.extractHighlights(result.item, query.text!),
      }));
    }

    if (query.keywords && query.keywords.length > 0) {
      const keywordResults = new Set<DocumentMetadata>();
      for (const keyword of query.keywords) {
        const docs = this.indexService.getDocumentsByKeyword(keyword);
        docs.forEach((doc) => keywordResults.add(doc));
      }
      return Array.from(keywordResults).map((doc) => ({
        document: doc,
        score: 0.8,
        matchedFields: ["keywords"],
      }));
    }

    const allDocs = this.indexService.getAllDocuments();
    return allDocs.map((doc) => ({
      document: doc,
      score: 0.5,
      matchedFields: [],
    }));
  }

  private applyFilters(
    results: Array<{
      document: DocumentMetadata;
      score: number;
      highlights?: ContentSnippet[];
      matchedFields?: string[];
    }>,
    query: SearchQuery,
  ): typeof results {
    return results.filter((result) => {
      const doc = result.document;

      if (
        query.documentType &&
        !query.documentType.includes(doc.document_type)
      ) {
        return false;
      }

      if (query.module && !query.module.includes(doc.module)) {
        return false;
      }

      if (query.status && !query.status.includes(doc.status)) {
        return false;
      }

      if (query.dateRange) {
        const docDate = new Date(doc.last_updated);
        if (query.dateRange.from && docDate < new Date(query.dateRange.from)) {
          return false;
        }
        if (query.dateRange.to && docDate > new Date(query.dateRange.to)) {
          return false;
        }
      }

      return true;
    });
  }

  private scoreResults(
    results: Array<{
      document: DocumentMetadata;
      score: number;
      highlights?: ContentSnippet[];
      matchedFields?: string[];
    }>,
    query: SearchQuery,
  ): typeof results {
    const scoring = query.scoring || {
      titleWeight: 0.4,
      keywordWeight: 0.3,
      contentWeight: 0.2,
      metadataWeight: 0.1,
      recencyBoost: 0,
    };

    results.forEach((result) => {
      let finalScore = result.score;

      if (result.matchedFields?.includes("title")) {
        finalScore += scoring.titleWeight || 0;
      }
      if (result.matchedFields?.includes("keywords")) {
        finalScore += scoring.keywordWeight || 0;
      }
      if (result.matchedFields?.includes("content")) {
        finalScore += scoring.contentWeight || 0;
      }

      if (scoring.recencyBoost && scoring.recencyBoost > 0) {
        const daysSinceUpdate =
          (Date.now() - new Date(result.document.last_updated).getTime()) /
          (1000 * 60 * 60 * 24);
        const recencyFactor = Math.exp(-daysSinceUpdate / 365);
        finalScore += recencyFactor * scoring.recencyBoost;
      }

      result.score = Math.min(1, finalScore);
    });

    if (query.sort) {
      results.sort((a, b) => {
        const fieldA = a.document[query.sort!.field as keyof DocumentMetadata];
        const fieldB = b.document[query.sort!.field as keyof DocumentMetadata];

        if (query.sort!.field === "score") {
          return query.sort!.order === "asc"
            ? a.score - b.score
            : b.score - a.score;
        }

        if (typeof fieldA === "string" && typeof fieldB === "string") {
          return query.sort!.order === "asc"
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        }

        return 0;
      });
    } else {
      results.sort((a, b) => b.score - a.score);
    }

    return results;
  }

  private getMatchedFields(
    doc: DocumentMetadata,
    searchText: string,
  ): string[] {
    const matched: string[] = [];
    const lowerText = searchText.toLowerCase();

    if (doc.title.toLowerCase().includes(lowerText)) {
      matched.push("title");
    }
    if (doc.keywords.some((k) => k.toLowerCase().includes(lowerText))) {
      matched.push("keywords");
    }
    if (doc.module.toLowerCase().includes(lowerText)) {
      matched.push("module");
    }

    return matched;
  }

  private extractHighlights(
    doc: DocumentMetadata,
    searchText: string,
  ): ContentSnippet[] {
    const snippets: ContentSnippet[] = [];

    try {
      const fileContent = readFileSync(doc.filePath, "utf-8");
      const snippet = extractSnippet(fileContent, searchText, 2);

      if (snippet) {
        snippets.push({
          text: snippet,
          startIndex: 0,
          endIndex: snippet.length,
          matchedTerms: [searchText],
          score: 0.8,
        });
      }
    } catch {
      // File not accessible
    }

    return snippets;
  }

  private buildAggregations(
    results: Array<{ document: DocumentMetadata }>,
  ): SearchAggregations {
    const aggregations: SearchAggregations = {
      byType: {} as Record<DocumentType, number>,
      byModule: {},
      byStatus: {} as Record<DocumentStatus, number>,
      byKeyword: [],
    };

    const keywordCounts = new Map<string, number>();

    for (const { document: doc } of results) {
      aggregations.byType[doc.document_type] =
        (aggregations.byType[doc.document_type] || 0) + 1;

      aggregations.byModule[doc.module] =
        (aggregations.byModule[doc.module] || 0) + 1;

      aggregations.byStatus[doc.status] =
        (aggregations.byStatus[doc.status] || 0) + 1;

      for (const keyword of doc.keywords) {
        keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
      }
    }

    aggregations.byKeyword = Array.from(keywordCounts.entries())
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return aggregations;
  }
}
