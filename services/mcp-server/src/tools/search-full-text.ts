/** @format */

import { z } from "zod";
import type { SearchService } from "../services/search.service.js";
import { SearchQueryBuilder } from "../types/search.types.js";

export const searchFullTextSchema = z.object({
  query: z.string().min(1).describe("Search query text"),
  documentType: z
    .array(
      z.enum([
        "general",
        "feature-design",
        "adr",
        "database-schema",
        "api-design",
        "sync-strategy",
        "ux-flow",
        "testing-strategy",
        "deployment-runbook",
        "security-audit",
      ]),
    )
    .optional()
    .describe("Filter by document types"),
  module: z.array(z.string()).optional().describe("Filter by modules"),
  status: z
    .array(
      z.enum([
        "draft",
        "review",
        "approved",
        "accepted",
        "deprecated",
        "superseded",
      ]),
    )
    .optional()
    .describe("Filter by status"),
  page: z
    .number()
    .min(1)
    .optional()
    .default(1)
    .describe("Page number for pagination"),
  limit: z
    .number()
    .min(1)
    .max(50)
    .optional()
    .default(10)
    .describe("Results per page (max 50)"),
  includeSnippets: z
    .boolean()
    .optional()
    .default(true)
    .describe("Include content snippets in results"),
});

export type SearchFullTextInput = z.infer<typeof searchFullTextSchema>;

export function searchFullText(
  input: SearchFullTextInput,
  searchService: SearchService,
) {
  const queryBuilder = new SearchQueryBuilder();

  queryBuilder.text(input.query).paginate(input.page || 1, input.limit || 10);

  if (input.documentType && input.documentType.length > 0) {
    queryBuilder.ofType(...input.documentType);
  }

  if (input.module && input.module.length > 0) {
    queryBuilder.inModule(...input.module);
  }

  if (input.status && input.status.length > 0) {
    queryBuilder.withStatus(...input.status);
  }

  const searchQuery = queryBuilder.build();
  const results = searchService.search(searchQuery);

  return {
    success: true,
    query: input.query,
    results: results.results.map((result) => ({
      document: {
        uri: result.document.uri,
        title: result.document.title,
        module: result.document.module,
        type: result.document.document_type,
        status: result.document.status,
        lastUpdated: result.document.last_updated,
      },
      score: result.score,
      matchedFields: result.matchedFields,
      highlights: input.includeSnippets ? result.highlights : undefined,
    })),
    pagination: results.pagination,
    aggregations: results.aggregations,
    queryTime: results.queryTime,
  };
}
