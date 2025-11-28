/** @format */

import { z } from "zod";
import type { DocumentationIndexService } from "../services/documentation-index.service.js";

export const queryDocsByModuleSchema = z.object({
  module: z
    .string()
    .describe("Module name (e.g., 'payments', 'inventory', 'pos')"),
  includeRelated: z
    .boolean()
    .optional()
    .describe("Include related documents from other modules"),
});

export type QueryDocsByModuleInput = z.infer<typeof queryDocsByModuleSchema>;

export function queryDocsByModule(
  input: QueryDocsByModuleInput,
  indexService: DocumentationIndexService,
) {
  const docs = indexService.getDocumentsByModule(input.module);

  if (docs.length === 0) {
    return {
      success: false,
      message: `No documents found for module: ${input.module}`,
      availableModules: Object.keys(indexService.getStats().documentsByModule),
    };
  }

  const result: Record<string, unknown> = {
    success: true,
    module: input.module,
    totalDocuments: docs.length,
    documents: docs.map((doc) => ({
      uri: doc.uri,
      title: doc.title,
      type: doc.document_type,
      status: doc.status,
      version: doc.version,
      lastUpdated: doc.last_updated,
      keywords: doc.keywords,
    })),
  };

  if (input.includeRelated) {
    const relatedDocs = new Set<string>();
    docs.forEach((doc) => {
      Object.values(doc.related_docs).forEach((uri) => relatedDocs.add(uri));
    });

    result.relatedDocuments = Array.from(relatedDocs).map((uri) => {
      const relatedDoc = indexService.getDocumentByUri(uri);
      return relatedDoc
        ? {
            uri: relatedDoc.uri,
            title: relatedDoc.title,
            module: relatedDoc.module,
            type: relatedDoc.document_type,
          }
        : { uri, title: "Unknown", module: "unknown", type: "general" };
    });
  }

  return result;
}
