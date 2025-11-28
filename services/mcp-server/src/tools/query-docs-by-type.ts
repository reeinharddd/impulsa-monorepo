/** @format */

import { z } from "zod";
import type { DocumentationIndexService } from "../services/documentation-index.service.js";
import type { DocumentType } from "../types/documentation.types.js";

export const queryDocsByTypeSchema = z.object({
  documentType: z
    .enum([
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
    ])
    .describe("Type of document to filter by"),
  status: z
    .enum([
      "draft",
      "review",
      "approved",
      "accepted",
      "deprecated",
      "superseded",
    ])
    .optional()
    .describe("Filter by document status"),
  module: z.string().optional().describe("Filter by specific module"),
});

export type QueryDocsByTypeInput = z.infer<typeof queryDocsByTypeSchema>;

export function queryDocsByType(
  input: QueryDocsByTypeInput,
  indexService: DocumentationIndexService,
) {
  let docs = indexService.getDocumentsByType(
    input.documentType as DocumentType,
  );

  if (input.status) {
    docs = docs.filter((doc) => doc.status === input.status);
  }

  if (input.module) {
    docs = docs.filter((doc) => doc.module === input.module);
  }

  if (docs.length === 0) {
    return {
      success: false,
      message: `No documents found for type: ${input.documentType}`,
      filters: { status: input.status, module: input.module },
    };
  }

  return {
    success: true,
    documentType: input.documentType,
    totalDocuments: docs.length,
    filters: { status: input.status, module: input.module },
    documents: docs.map((doc) => ({
      uri: doc.uri,
      title: doc.title,
      module: doc.module,
      status: doc.status,
      version: doc.version,
      lastUpdated: doc.last_updated,
      author: doc.author,
      keywords: doc.keywords,
      filePath: doc.filePath,
    })),
  };
}
