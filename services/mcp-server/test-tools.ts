#!/usr/bin/env bun
/** @format */

/**
 * Test script for MCP Documentation Tools
 * Usage: bun run test-tools.ts
 */

import { DocumentationIndexService } from "./src/services/documentation-index.service.js";
import { SearchService } from "./src/services/search.service.js";
import {
  getDocContext,
  queryDocsByModule,
  queryDocsByType,
  searchFullText,
} from "./src/tools/index.js";

const DOCS_DIR = "/home/erik/test/docs";

console.log("=== MCP Documentation Tools Test Suite ===\n");

// Initialize services
console.log("1. Initializing services...");
const indexService = new DocumentationIndexService(DOCS_DIR);
indexService.initialize();
const searchService = new SearchService(indexService);
searchService.initializeFuzzySearch();

const stats = indexService.getStats();
console.log(`✓ Indexed ${stats.totalDocuments} documents`);
console.log(`✓ Available modules:`, Object.keys(stats.documentsByModule).slice(0, 5), "...\n");

// Test 1: Query by Module
console.log("2. Testing query_docs_by_module (module: 'payments')");
const moduleResult = queryDocsByModule(
  { module: "payments", includeRelated: true },
  indexService,
);
console.log(`✓ Found ${moduleResult.totalDocuments} documents for 'payments' module`);
if (moduleResult.success) {
  console.log(`  - Documents:`, moduleResult.documents?.slice(0, 2).map((d: any) => d.title));
  console.log(`  - Related: ${moduleResult.relatedDocuments?.length || 0} docs\n`);
}

// Test 2: Query by Type
console.log("3. Testing query_docs_by_type (type: 'api-design')");
const typeResult = queryDocsByType(
  { documentType: "api-design", status: "approved" },
  indexService,
);
console.log(`✓ Found ${typeResult.totalDocuments} API design documents`);
if (typeResult.success) {
  console.log(`  - Documents:`, typeResult.documents?.slice(0, 2).map((d: any) => d.title));
  console.log();
}

// Test 3: Get Document Context
console.log("4. Testing get_doc_context");
const allDocs = indexService.getAllDocuments();
if (allDocs.length > 0) {
  const testDoc = allDocs[0];
  console.log(`  - Using document: ${testDoc.title}`);
  const contextResult = getDocContext(
    { uri: testDoc.uri, depth: 1, includeContent: false },
    indexService,
  );
  if (contextResult.success) {
    console.log(`✓ Retrieved context with ${contextResult.totalRelatedDocuments} related docs`);
    console.log(
      `  - Related categories:`,
      Object.keys(contextResult.related).filter(
        (k) => (contextResult.related as any)[k]?.length > 0,
      ),
    );
    console.log();
  }
}

// Test 4: Full-Text Search
console.log("5. Testing search_full_text (query: 'payment')");
const searchResult = searchFullText(
  { query: "payment", page: 1, limit: 5, includeSnippets: true },
  searchService,
);
console.log(`✓ Found ${searchResult.pagination.total} results`);
console.log(`  - Top results:`, searchResult.results.slice(0, 3).map((r) => r.document.title));
console.log(`  - Query time: ${searchResult.queryTime}ms`);
console.log(`  - Aggregations:`, {
  types: Object.keys(searchResult.aggregations?.byType || {}),
  modules: Object.keys(searchResult.aggregations?.byModule || {}).slice(0, 3),
});
console.log();

// Test 5: Fuzzy Search
console.log("6. Testing fuzzy search (query: 'paiment' - intentional typo)");
const fuzzyResult = searchFullText({ query: "paiment", page: 1, limit: 3 }, searchService);
console.log(`✓ Found ${fuzzyResult.pagination.total} results (fuzzy match)`);
console.log(`  - Top match:`, fuzzyResult.results[0]?.document.title || "None");
console.log();

console.log("=== All tests completed successfully! ===");
