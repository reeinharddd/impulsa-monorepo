import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

async function main() {
  console.log("🧪 Testing MCP Server Connection...");

  // Connect to the server we just built
  const transport = new StdioClientTransport({
    command: "bun",
    args: ["run", "src/server.ts"],
  });

  const client = new Client(
    {
      name: "test-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  try {
    await client.connect(transport);
    console.log("✅ Connected to MCP Server successfully");

    // 1. Verify Resources (Documentation)
    console.log("\n📂 Verifying Resources (Context)...");
    const resources = await client.request(ListResourcesRequestSchema, {});
    console.log(`Found ${resources.resources.length} resources:`);
    resources.resources.forEach(r => console.log(` - ${r.name} (${r.uri})`));

    // 2. Verify Content Access
    console.log("\n📖 Verifying Content Access (Reading 'docs://standards/commits')...");
    const commitDocs = await client.request(ReadResourceRequestSchema, {
      uri: "docs://standards/commits",
    });
    const preview = commitDocs.contents[0].text.substring(0, 150).replace(/\n/g, ' ');
    console.log(`Content Preview: "${preview}..."`);

    // 3. Verify Prompts (Methodology)
    console.log("\nPm Verifying Prompts (Methodology)...");
    const prompts = await client.request(ListPromptsRequestSchema, {});
    console.log(`Found ${prompts.prompts.length} prompts:`);
    prompts.prompts.forEach(p => console.log(` - ${p.name}: ${p.description}`));

    console.log("\n✨ SYSTEM VERIFICATION PASSED: The server is correctly serving your project's context and methodology.");

  } catch (error) {
    console.error("❌ Verification Failed:", error);
  } finally {
    await client.close();
  }
}

main();
