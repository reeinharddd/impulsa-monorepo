/** @format */

import { readFileSync } from "fs";
import matter from "gray-matter";
import type {
  BaseDocumentMetadata,
  DocumentMetadata,
  ValidationResult,
} from "../types/documentation.types.js";

export interface DocumentSection {
  title: string;
  level: number;
  content: string;
  startLine: number;
  endLine: number;
}

export interface CodeBlock {
  language: string;
  code: string;
  startLine: number;
  endLine: number;
}

export function parseMarkdownFile(filePath: string): {
  metadata: Partial<DocumentMetadata>;
  content: string;
  sections: DocumentSection[];
  codeBlocks: CodeBlock[];
} {
  const fileContent = readFileSync(filePath, "utf-8");
  const parsed = matter(fileContent);
  const metadata = normalizeMetadata(parsed.data, filePath);
  const sections = extractSections(parsed.content);
  const codeBlocks = extractCodeBlocks(parsed.content);

  return {
    metadata,
    content: parsed.content,
    sections,
    codeBlocks,
  };
}

export function normalizeMetadata(
  rawMetadata: Record<string, unknown>,
  filePath: string,
): Partial<DocumentMetadata> {
  return {
    document_type:
      (rawMetadata.document_type as DocumentMetadata["document_type"]) ||
      "general",
    module: (rawMetadata.module as string) || "unknown",
    status: (rawMetadata.status as DocumentMetadata["status"]) || "draft",
    version: (rawMetadata.version as string) || "0.0.0",
    last_updated:
      (rawMetadata.last_updated as string) ||
      new Date().toISOString().split("T")[0],
    author: (rawMetadata.author as string) || "@unknown",
    keywords: Array.isArray(rawMetadata.keywords)
      ? (rawMetadata.keywords as string[])
      : typeof rawMetadata.keywords === "string"
        ? [rawMetadata.keywords]
        : [],
    related_docs:
      typeof rawMetadata.related_docs === "object" &&
      rawMetadata.related_docs !== null
        ? (rawMetadata.related_docs as Record<string, string>)
        : {},
    filePath,
    uri: pathToUri(filePath),
    title: extractTitle(rawMetadata, filePath),
  };
}

export function extractSections(content: string): DocumentSection[] {
  const lines = content.split("\n");
  const sections: DocumentSection[] = [];
  let currentSection: Partial<DocumentSection> | null = null;

  lines.forEach((line, index) => {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);

    if (headingMatch) {
      if (currentSection) {
        sections.push(currentSection as DocumentSection);
      }
      currentSection = {
        title: headingMatch[2].trim(),
        level: headingMatch[1].length,
        content: "",
        startLine: index + 1,
        endLine: index + 1,
      };
    } else if (currentSection) {
      currentSection.content += line + "\n";
      currentSection.endLine = index + 1;
    }
  });

  if (currentSection) {
    sections.push(currentSection as DocumentSection);
  }

  return sections;
}

export function extractCodeBlocks(content: string): CodeBlock[] {
  const lines = content.split("\n");
  const blocks: CodeBlock[] = [];
  let inBlock = false;
  let currentBlock: Partial<CodeBlock> | null = null;

  lines.forEach((line, index) => {
    const codeBlockMatch = line.match(/^```(\w+)?/);

    if (codeBlockMatch && !inBlock) {
      inBlock = true;
      currentBlock = {
        language: codeBlockMatch[1] || "plaintext",
        code: "",
        startLine: index + 1,
        endLine: index + 1,
      };
    } else if (line.startsWith("```") && inBlock && currentBlock) {
      currentBlock.endLine = index + 1;
      blocks.push(currentBlock as CodeBlock);
      inBlock = false;
      currentBlock = null;
    } else if (inBlock && currentBlock) {
      currentBlock.code += line + "\n";
    }
  });

  return blocks;
}

export function extractTitle(
  metadata: Record<string, unknown>,
  filePath: string,
): string {
  if (metadata.title && typeof metadata.title === "string") {
    return metadata.title;
  }

  const fileName = filePath.split("/").pop() || "unknown";
  return fileName.replace(/\.md$/, "").replace(/-/g, " ");
}

export function extractSnippet(
  content: string,
  query: string,
  contextLines: number = 2,
): string {
  const lines = content.split("\n");
  const queryLower = query.toLowerCase();

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes(queryLower)) {
      const start = Math.max(0, i - contextLines);
      const end = Math.min(lines.length, i + contextLines + 1);
      return lines.slice(start, end).join("\n");
    }
  }

  return lines.slice(0, 3).join("\n");
}

export function validateDocumentMetadata(
  metadata: Partial<DocumentMetadata>,
): ValidationResult {
  const required: (keyof BaseDocumentMetadata)[] = [
    "document_type",
    "module",
    "status",
    "version",
    "last_updated",
    "author",
    "keywords",
    "related_docs",
  ];

  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];
  const missing: string[] = [];
  const found: Partial<BaseDocumentMetadata> = {};

  required.forEach((field) => {
    if (metadata[field] !== undefined) {
      found[field] = metadata[field] as never;
    } else {
      missing.push(field);
      errors.push({
        field,
        message: `Required field '${field}' is missing`,
        severity: "error",
      });
    }
  });

  if (metadata.keywords && metadata.keywords.length === 0) {
    warnings.push({
      field: "keywords",
      message: "No keywords defined",
      suggestion: "Add relevant keywords for better searchability",
    });
  }

  return {
    uri: metadata.uri || "unknown",
    isValid: errors.length === 0,
    errors,
    warnings,
    metadata: {
      found,
      expected: required,
      missing,
    },
  };
}

export function pathToUri(filePath: string): string {
  return filePath.replace(/^.*\/docs\//, "docs://");
}
