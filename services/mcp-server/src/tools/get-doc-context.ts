/** @format */

import { readFileSync } from "fs";
import { z } from "zod";
import type { DocumentationIndexService } from "../services/documentation-index.service.js";

export const getDocContextSchema = z.object({
  uri: z
    .string()
    .describe("Document URI (e.g., 'docs://technical/backend/payments.md')"),
  depth: z
    .number()
    .min(1)
    .max(3)
    .optional()
    .default(1)
    .describe("Depth of relationship traversal (1-3)"),
  includeContent: z
    .boolean()
    .optional()
    .default(false)
    .describe("Include full document content"),
});

export type GetDocContextInput = z.infer<typeof getDocContextSchema>;

export function getDocContext(
  input: GetDocContextInput,
  indexService: DocumentationIndexService,
) {
  try {
    const context = indexService.getRelatedDocuments(
      input.uri,
      input.depth || 1,
    );

    const result: Record<string, unknown> = {
      success: true,
      primary: {
        uri: context.primary.uri,
        title: context.primary.title,
        module: context.primary.module,
        type: context.primary.document_type,
        status: context.primary.status,
        version: context.primary.version,
        lastUpdated: context.primary.last_updated,
        author: context.primary.author,
        keywords: context.primary.keywords,
        filePath: context.primary.filePath,
      },
      related: {
        architecture: context.related.architecture?.map((d) => ({
          uri: d.uri,
          title: d.title,
          module: d.module,
        })),
        database: context.related.database?.map((d) => ({
          uri: d.uri,
          title: d.title,
          module: d.module,
        })),
        api: context.related.api?.map((d) => ({
          uri: d.uri,
          title: d.title,
          module: d.module,
        })),
        ux: context.related.ux?.map((d) => ({
          uri: d.uri,
          title: d.title,
          module: d.module,
        })),
        testing: context.related.testing?.map((d) => ({
          uri: d.uri,
          title: d.title,
          module: d.module,
        })),
        feature: context.related.feature?.map((d) => ({
          uri: d.uri,
          title: d.title,
          module: d.module,
        })),
        other: context.related.other?.map((d) => ({
          uri: d.uri,
          title: d.title,
          module: d.module,
        })),
      },
      depth: context.depth,
      totalRelatedDocuments: context.totalDocuments,
    };

    if (input.includeContent) {
      try {
        result.content = readFileSync(context.primary.filePath, "utf-8");
      } catch {
        result.contentError = "Failed to read file content";
      }
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve document context",
      uri: input.uri,
    };
  }
}
