#!/usr/bin/env bun
/** @format */

/**
 * MCP Client Test Script
 * Tests all MCP tools through HTTP transport
 */

async function callMCPTool(toolName: string, args: Record<string, unknown>) {
  const response = await fetch("http://localhost:8080/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: `test-${Date.now()}`,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args,
      },
    }),
  });

  const data = await response.json();
  return data;
}

console.log("=== MCP Tools Test Suite ===\n");

// Test 1: Query by Module
console.log("1. Testing query_docs_by_module (module: 'payments')");
const test1 = await callMCPTool("query_docs_by_module", {
  module: "payments",
  includeRelated: true,
});
console.log(JSON.stringify(test1, null, 2));
console.log("\n---\n");

// Test 2: Query by Type
console.log("2. Testing query_docs_by_type (type: 'database-schema')");
const test2 = await callMCPTool("query_docs_by_type", {
  documentType: "database-schema",
  status: "approved",
});
console.log(JSON.stringify(test2, null, 2));
console.log("\n---\n");

// Test 3: Search Full Text
console.log("3. Testing search_full_text (query: 'factory pattern')");
const test3 = await callMCPTool("search_full_text", {
  query: "factory pattern",
  page: 1,
  limit: 3,
  includeSnippets: true,
});
console.log(JSON.stringify(test3, null, 2));
console.log("\n---\n");

// Test 4: Get Document Context
console.log("4. Testing get_doc_context");
const test4 = await callMCPTool("get_doc_context", {
  uri: "docs://technical/backend/database/06-PAYMENTS-SCHEMA",
  depth: 1,
  includeContent: false,
});
console.log(JSON.stringify(test4, null, 2));

console.log("\n=== All tests completed ===");
