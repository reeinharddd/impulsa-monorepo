/** @format */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
	CallToolRequestSchema,
	ListResourcesRequestSchema,
	ListPromptsRequestSchema,
	ListToolsRequestSchema,
	ReadResourceRequestSchema,
	GetPromptRequestSchema,
	ErrorCode,
	McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { join, resolve } from 'path';
import { readdir, readFile, stat } from 'fs/promises';

// Configuration
const PROJECT_ROOT = resolve(process.cwd(), '../../');
const DOCS_DIR = join(PROJECT_ROOT, 'docs');

// Initialize Server
const server = new Server(
	{
		name: 'payment-system-mcp',
		version: '1.0.0',
	},
	{
		capabilities: {
			resources: {},
			prompts: {},
			tools: {},
		},
	}
);

/**
 * RESOURCES: Expose documentation as read-only resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
	// In a real implementation, we would recursively walk the docs directory
	// For now, we'll expose key documentation files
	return {
		resources: [
			{
				uri: 'docs://standards/commits',
				name: 'Commit Standards',
				description: 'Rules for writing commit messages',
				mimeType: 'text/markdown',
			},
			{
				uri: 'docs://standards/development',
				name: 'Development Rules',
				description: 'Core development workflow and rules',
				mimeType: 'text/markdown',
			},
			{
				uri: 'docs://templates/feature',
				name: 'Feature Template',
				description: 'Template for designing new features',
				mimeType: 'text/markdown',
			},
		],
	};
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
	const uri = request.params.uri;

	let filePath = '';
	if (uri === 'docs://standards/commits') {
		// Extract commit section from DEVELOPMENT-RULES.md or similar
		// For simplicity, we'll read the whole file where rules are defined
		filePath = join(DOCS_DIR, 'process/workflow/DEVELOPMENT-RULES.md');
	} else if (uri === 'docs://standards/development') {
		filePath = join(DOCS_DIR, 'process/workflow/DEVELOPMENT-RULES.md');
	} else if (uri === 'docs://templates/feature') {
		filePath = join(DOCS_DIR, 'templates/01-FEATURE-DESIGN-TEMPLATE.md');
	} else {
		throw new McpError(ErrorCode.InvalidRequest, `Unknown resource: ${uri}`);
	}

	try {
		const content = await readFile(filePath, 'utf-8');
		return {
			contents: [
				{
					uri: uri,
					mimeType: 'text/markdown',
					text: content,
				},
			],
		};
	} catch (error) {
		throw new McpError(
			ErrorCode.InternalError,
			`Failed to read file: ${error}`
		);
	}
});

/**
 * PROMPTS: Pre-defined workflows that enforce standards
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
	return {
		prompts: [
			{
				name: 'generate-commit',
				description:
					'Generate a standard-compliant commit message for staged changes',
				arguments: [
					{
						name: 'diff',
						description: 'The git diff of staged changes',
						required: true,
					},
				],
			},
			{
				name: 'scaffold-feature',
				description:
					'Create a plan for a new feature following the standard template',
				arguments: [
					{
						name: 'description',
						description: 'Description of the feature to build',
						required: true,
					},
				],
			},
		],
	};
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
	const name = request.params.name;

	if (name === 'generate-commit') {
		const diff = request.params.arguments?.diff as string;
		const rulesPath = join(DOCS_DIR, 'process/workflow/DEVELOPMENT-RULES.md'); // Assuming commit rules are here
		const rules = await readFile(rulesPath, 'utf-8');

		return {
			messages: [
				{
					role: 'user',
					content: {
						type: 'text',
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

	if (name === 'scaffold-feature') {
		const description = request.params.arguments?.description as string;
		const templatePath = join(
			DOCS_DIR,
			'templates/01-FEATURE-DESIGN-TEMPLATE.md'
		);
		const template = await readFile(templatePath, 'utf-8');

		return {
			messages: [
				{
					role: 'user',
					content: {
						type: 'text',
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
 * TOOLS: Executable actions (Optional for now, but good for future)
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
	return {
		tools: [],
	};
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('MCP Server running on stdio');
