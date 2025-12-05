#!/usr/bin/env bun
async function test() {
  const response = await fetch("http://localhost:8080/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "test-context",
      method: "tools/call",
      params: {
        name: "get_doc_context",
        arguments: {
          uri: "docs://technical/backend/database/06-PAYMENTS-SCHEMA.md",
          depth: 1,
          includeContent: false,
        },
      },
    }),
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
