/** @format */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import cors from "cors";
import express from "express";
import { readdir, readFile, stat } from "fs/promises";
import { basename, dirname, join, relative, resolve } from "path";
import { fileURLToPath } from "url";
import { DocumentationIndexService } from "./services/documentation-index.service.js";
import { SearchService } from "./services/search.service.js";
import {
  getDocContext,
  getDocContextSchema,
  queryDocsByModule,
  queryDocsByModuleSchema,
  queryDocsByType,
  queryDocsByTypeSchema,
  searchFullText,
  searchFullTextSchema,
} from "./tools/index.js";

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "../../../");
const DOCS_DIR = join(PROJECT_ROOT, "docs");

// Initialize services
const indexService = new DocumentationIndexService(DOCS_DIR);
const searchService = new SearchService(indexService);

console.log("[Server] Initializing documentation index...");
indexService.initialize();
console.log("[Server] Initializing search service...");
searchService.initializeFuzzySearch();
console.log("[Server] Services ready!");

const stats = indexService.getStats();
console.log(`[Server] Indexed ${stats.totalDocuments} documents`);
console.log(`[Server] Modules:`, Object.keys(stats.documentsByModule));

// Helper to recursively find markdown files
async function getDocsFiles(
  dir: string,
  baseDir: string = dir,
): Promise<
  Array<{ uri: string; name: string; description: string; filePath: string }>
> {
  try {
    // Verify directory exists first
    try {
      await stat(dir);
    } catch {
      return [];
    }

    const entries = await readdir(dir, { withFileTypes: true });
    const results: Array<{
      uri: string;
      name: string;
      description: string;
      filePath: string;
    }> = [];

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        // Avoid hidden directories and node_modules
        if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
          results.push(...(await getDocsFiles(fullPath, baseDir)));
        }
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const relPath = relative(baseDir, fullPath);
        const uriPath = relPath.replace(/\\/g, "/").replace(/\.md$/, "");
        const uri = `docs://${uriPath}`;

        results.push({
          uri,
          name: basename(entry.name, ".md").replace(/-/g, " "),
          description: `Documentation for ${relPath}`,
          filePath: fullPath,
        });
      }
    }
    return results;
  } catch {
    return [];
  }
}

// Initialize Server
const server = new Server(
  {
    name: "payment-system-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      prompts: {},
      tools: {},
    },
  },
);

/**
 * RESOURCES: Expose documentation as read-only resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  try {
    const docs = await getDocsFiles(DOCS_DIR);
    return {
      resources: docs.map((doc) => ({
        uri: doc.uri,
        name: doc.name,
        description: doc.description,
        mimeType: "text/markdown",
      })),
    };
  } catch {
    return { resources: [] };
  }
});
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (!uri.startsWith("docs://")) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Unknown resource scheme: ${uri}`,
    );
  }

  // Convert URI back to file path
  // docs://folder/file -> docs/folder/file.md
  const relPath = uri.substring("docs://".length);
  const filePath = join(DOCS_DIR, `${relPath}.md`);

  // Security check: ensure we are still inside DOCS_DIR
  const resolvedPath = resolve(filePath);
  if (!resolvedPath.startsWith(resolve(DOCS_DIR))) {
    throw new McpError(ErrorCode.InvalidRequest, `Access denied: ${uri}`);
  }

  try {
    const content = await readFile(filePath, "utf-8");
    return {
      contents: [
        {
          uri: uri,
          mimeType: "text/markdown",
          text: content,
        },
      ],
    };
  } catch (error) {
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to read file: ${String(error)}`,
    );
  }
});

/**
 * PROMPTS: Pre-defined workflows that enforce standards
 */
server.setRequestHandler(ListPromptsRequestSchema, () => {
  return {
    prompts: [
      {
        name: "generate-commit",
        description:
          "Generate a standard-compliant commit message for staged changes",
        arguments: [
          {
            name: "diff",
            description: "The git diff of staged changes",
            required: true,
          },
        ],
      },
      {
        name: "scaffold-feature",
        description:
          "Create a plan for a new feature following the standard template",
        arguments: [
          {
            name: "description",
            description: "Description of the feature to build",
            required: true,
          },
        ],
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const name = request.params.name;

  if (name === "generate-commit") {
    const diff = request.params.arguments?.diff as string;
    const rulesPath = join(DOCS_DIR, "process/workflow/DEVELOPMENT-RULES.md"); // Assuming commit rules are here
    const rules = await readFile(rulesPath, "utf-8");

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please generate a commit message for the following changes.
You MUST follow the commit standards defined below:

${rules}

---
CHANGES:
${diff}
`,
          },
        },
      ],
    };
  }

  if (name === "scaffold-feature") {
    const description = request.params.arguments?.description as string;
    const templatePath = join(
      DOCS_DIR,
      "templates/01-FEATURE-DESIGN-TEMPLATE.md",
    );
    const template = await readFile(templatePath, "utf-8");

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `I need to design a new feature: "${description}".
Please create a design document following the strict template below.
Do not skip any sections.

TEMPLATE:
${template}
`,
          },
        },
      ],
    };
  }

  throw new McpError(ErrorCode.InvalidRequest, `Unknown prompt: ${name}`);
});

/**
 * TOOLS: Executable actions
 */
server.setRequestHandler(ListToolsRequestSchema, () => {
  return {
    tools: [
      {
        name: "search_docs",
        description: "Legacy: Search documentation for a specific query",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "query_docs_by_module",
        description: "Get all documents for a specific module",
        inputSchema: {
          type: "object",
          properties: {
            module: {
              type: "string",
              description: "Module name (e.g., 'payments', 'inventory')",
            },
            includeRelated: {
              type: "boolean",
              description: "Include related documents from other modules",
            },
          },
          required: ["module"],
        },
      },
      {
        name: "query_docs_by_type",
        description:
          "Filter documents by type (e.g., 'api-design', 'database-schema')",
        inputSchema: {
          type: "object",
          properties: {
            documentType: {
              type: "string",
              enum: [
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
              ],
              description: "Type of document",
            },
            status: {
              type: "string",
              enum: [
                "draft",
                "review",
                "approved",
                "accepted",
                "deprecated",
                "superseded",
              ],
              description: "Filter by status",
            },
            module: {
              type: "string",
              description: "Filter by module",
            },
          },
          required: ["documentType"],
        },
      },
      {
        name: "get_doc_context",
        description:
          "Get a document with all its related documents (follows relationship graph)",
        inputSchema: {
          type: "object",
          properties: {
            uri: {
              type: "string",
              description:
                "Document URI (e.g., 'docs://technical/backend/payments')",
            },
            depth: {
              type: "number",
              description: "Depth of traversal (1-3)",
              minimum: 1,
              maximum: 3,
            },
            includeContent: {
              type: "boolean",
              description: "Include full document content",
            },
          },
          required: ["uri"],
        },
      },
      {
        name: "search_full_text",
        description:
          "Fuzzy search across all documentation with advanced filtering",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query",
            },
            documentType: {
              type: "array",
              items: {
                type: "string",
                enum: [
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
                ],
              },
              description: "Filter by document types",
            },
            module: {
              type: "array",
              items: { type: "string" },
              description: "Filter by modules",
            },
            status: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "draft",
                  "review",
                  "approved",
                  "accepted",
                  "deprecated",
                  "superseded",
                ],
              },
              description: "Filter by status",
            },
            page: {
              type: "number",
              description: "Page number",
              minimum: 1,
            },
            limit: {
              type: "number",
              description: "Results per page",
              minimum: 1,
              maximum: 50,
            },
            includeSnippets: {
              type: "boolean",
              description: "Include content snippets",
            },
          },
          required: ["query"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const name = request.params.name;
  const args = request.params.arguments;

  try {
    if (name === "query_docs_by_module") {
      const parsed = queryDocsByModuleSchema.parse(args);
      const result = queryDocsByModule(parsed, indexService);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === "query_docs_by_type") {
      const parsed = queryDocsByTypeSchema.parse(args);
      const result = queryDocsByType(parsed, indexService);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === "get_doc_context") {
      const parsed = getDocContextSchema.parse(args);
      const result = getDocContext(parsed, indexService);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === "search_full_text") {
      const parsed = searchFullTextSchema.parse(args);
      const result = searchFullText(parsed, searchService);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === "search_docs") {
      const query = (args?.query as string).toLowerCase();
      const docs = await getDocsFiles(DOCS_DIR);
      const matches = [];

      for (const doc of docs) {
        try {
          const content = await readFile(doc.filePath, "utf-8");
          if (content.toLowerCase().includes(query)) {
            const index = content.toLowerCase().indexOf(query);
            const start = Math.max(0, index - 50);
            const end = Math.min(content.length, index + 150);
            const snippet = content.substring(start, end).replace(/\n/g, " ");

            matches.push({
              uri: doc.uri,
              name: doc.name,
              snippet: `...${snippet}...`,
            });
          }
        } catch {
          // Ignore read errors
        }
      }

      return {
        content: [{ type: "text", text: JSON.stringify(matches, null, 2) }],
      };
    }

    throw new McpError(ErrorCode.InvalidRequest, `Unknown tool: ${name}`);
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(
      ErrorCode.InternalError,
      `Tool execution failed: ${String(error)}`,
    );
  }
});

// Start the server
const app = express();
app.use(express.json());
app.use(cors());

const transports: Record<string, SSEServerTransport> = {};

app.get("/", (req, res) => {
  res.send("MCP Server is running. Connect via SSE at /sse");
});

app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;

  res.on("close", () => {
    delete transports[transport.sessionId];
  });

  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  console.log(
    `Received message on /messages. Query: ${JSON.stringify(req.query)}`,
  );
  const sessionId = req.query.sessionId as string;
  const transport = transports[sessionId];
  if (transport) {
    try {
      await transport.handlePostMessage(req, res, req.body);
    } catch (error) {
      console.error("Error handling message:", error);
      res.status(500).send(String(error));
    }
  } else {
    console.warn(`No transport found for sessionId: ${sessionId}`);
    res.status(400).send("No transport found for sessionId");
  }
});

app.post("/mcp", async (req, res) => {
  console.log("Received message on /mcp");
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on("close", () => {
    void transport.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`MCP Server running on http://localhost:${PORT}`);
});
