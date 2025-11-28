/** @format */

import { readdirSync, statSync } from "fs";
import { join } from "path";
import type {
  DocumentationIndex,
  DocumentContext,
  DocumentMetadata,
  DocumentStatus,
  DocumentType,
} from "../types/documentation.types.js";
import { parseMarkdownFile } from "../utils/markdown-parser.js";

export class DocumentationIndexService {
  private index: DocumentationIndex;
  private docsRootPath: string;

  constructor(docsRootPath: string = "/home/erik/test/docs") {
    this.docsRootPath = docsRootPath;
    this.index = this.createEmptyIndex();
  }

  private createEmptyIndex(): DocumentationIndex {
    return {
      documents: new Map(),
      byType: new Map(),
      byModule: new Map(),
      byStatus: new Map(),
      byKeyword: new Map(),
      relationshipGraph: new Map(),
      lastIndexed: new Date(),
      stats: {
        totalDocuments: 0,
        documentsByType: {} as Record<DocumentType, number>,
        documentsByModule: {},
        documentsByStatus: {} as Record<DocumentStatus, number>,
        avgKeywordsPerDoc: 0,
        avgRelatedDocsPerDoc: 0,
      },
    };
  }

  public initialize(): void {
    console.log(`[DocumentationIndexService] Scanning ${this.docsRootPath}...`);
    const startTime = Date.now();

    const markdownFiles = this.scanDirectory(this.docsRootPath);
    console.log(
      `[DocumentationIndexService] Found ${markdownFiles.length} markdown files`,
    );

    for (const filePath of markdownFiles) {
      try {
        const parsed = parseMarkdownFile(filePath);
        if (this.isValidMetadata(parsed.metadata)) {
          this.addDocument(parsed.metadata);
        }
      } catch (error) {
        console.error(
          `[DocumentationIndexService] Failed to parse ${filePath}:`,
          error,
        );
      }
    }

    this.buildIndices();
    this.calculateStats();

    const elapsed = Date.now() - startTime;
    console.log(
      `[DocumentationIndexService] Indexed ${this.index.stats.totalDocuments} documents in ${elapsed}ms`,
    );
  }

  private scanDirectory(dirPath: string): string[] {
    const files: string[] = [];

    try {
      const entries = readdirSync(dirPath);

      for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        const stats = statSync(fullPath);

        if (stats.isDirectory()) {
          files.push(...this.scanDirectory(fullPath));
        } else if (entry.endsWith(".md")) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(
        `[DocumentationIndexService] Failed to scan ${dirPath}:`,
        error,
      );
    }

    return files;
  }

  private isValidMetadata(
    metadata: Partial<DocumentMetadata>,
  ): metadata is DocumentMetadata {
    return !!(
      metadata.document_type &&
      metadata.module &&
      metadata.status &&
      metadata.uri &&
      metadata.filePath
    );
  }

  private addDocument(doc: DocumentMetadata): void {
    this.index.documents.set(doc.uri, doc);
  }

  private buildIndices(): void {
    this.index.byType.clear();
    this.index.byModule.clear();
    this.index.byStatus.clear();
    this.index.byKeyword.clear();
    this.index.relationshipGraph.clear();

    for (const doc of this.index.documents.values()) {
      if (!this.index.byType.has(doc.document_type)) {
        this.index.byType.set(doc.document_type, []);
      }
      this.index.byType.get(doc.document_type)!.push(doc);

      if (!this.index.byModule.has(doc.module)) {
        this.index.byModule.set(doc.module, []);
      }
      this.index.byModule.get(doc.module)!.push(doc);

      if (!this.index.byStatus.has(doc.status)) {
        this.index.byStatus.set(doc.status, []);
      }
      this.index.byStatus.get(doc.status)!.push(doc);

      for (const keyword of doc.keywords) {
        const normalizedKeyword = keyword.toLowerCase().trim();
        if (!this.index.byKeyword.has(normalizedKeyword)) {
          this.index.byKeyword.set(normalizedKeyword, []);
        }
        this.index.byKeyword.get(normalizedKeyword)!.push(doc);
      }

      this.index.relationshipGraph.set(
        doc.uri,
        new Set(Object.values(doc.related_docs)),
      );
    }

    this.index.lastIndexed = new Date();
  }

  private calculateStats(): void {
    this.index.stats.totalDocuments = this.index.documents.size;

    this.index.stats.documentsByType = {} as Record<DocumentType, number>;
    for (const [type, docs] of this.index.byType.entries()) {
      this.index.stats.documentsByType[type] = docs.length;
    }

    this.index.stats.documentsByModule = {};
    for (const [module, docs] of this.index.byModule.entries()) {
      this.index.stats.documentsByModule[module] = docs.length;
    }

    this.index.stats.documentsByStatus = {} as Record<DocumentStatus, number>;
    for (const [status, docs] of this.index.byStatus.entries()) {
      this.index.stats.documentsByStatus[status] = docs.length;
    }

    let totalKeywords = 0;
    let totalRelatedDocs = 0;
    for (const doc of this.index.documents.values()) {
      totalKeywords += doc.keywords.length;
      totalRelatedDocs += Object.keys(doc.related_docs).length;
    }

    this.index.stats.avgKeywordsPerDoc =
      this.index.stats.totalDocuments > 0
        ? totalKeywords / this.index.stats.totalDocuments
        : 0;
    this.index.stats.avgRelatedDocsPerDoc =
      this.index.stats.totalDocuments > 0
        ? totalRelatedDocs / this.index.stats.totalDocuments
        : 0;
  }

  public getDocumentsByType(type: DocumentType): DocumentMetadata[] {
    return this.index.byType.get(type) || [];
  }

  public getDocumentsByModule(module: string): DocumentMetadata[] {
    return this.index.byModule.get(module) || [];
  }

  public getDocumentsByStatus(status: DocumentStatus): DocumentMetadata[] {
    return this.index.byStatus.get(status) || [];
  }

  public getDocumentsByKeyword(keyword: string): DocumentMetadata[] {
    return this.index.byKeyword.get(keyword.toLowerCase().trim()) || [];
  }

  public getDocumentByUri(uri: string): DocumentMetadata | undefined {
    return this.index.documents.get(uri);
  }

  public getRelatedDocuments(uri: string, depth: number = 1): DocumentContext {
    const primary = this.index.documents.get(uri);
    if (!primary) {
      throw new Error(`Document not found: ${uri}`);
    }

    const relatedUris = this.traverseRelationships(uri, depth);
    const relatedDocs: DocumentMetadata[] = [];

    for (const relatedUri of relatedUris) {
      const doc = this.index.documents.get(relatedUri);
      if (doc) {
        relatedDocs.push(doc);
      }
    }

    const related: DocumentContext["related"] = {
      architecture: relatedDocs.filter((d) => d.document_type === "adr"),
      database: relatedDocs.filter(
        (d) => d.document_type === "database-schema",
      ),
      api: relatedDocs.filter((d) => d.document_type === "api-design"),
      ux: relatedDocs.filter((d) => d.document_type === "ux-flow"),
      testing: relatedDocs.filter(
        (d) => d.document_type === "testing-strategy",
      ),
      feature: relatedDocs.filter((d) => d.document_type === "feature-design"),
      other: relatedDocs.filter(
        (d) =>
          ![
            "adr",
            "database-schema",
            "api-design",
            "ux-flow",
            "testing-strategy",
            "feature-design",
          ].includes(d.document_type),
      ),
    };

    return {
      primary,
      related,
      depth,
      totalDocuments: relatedDocs.length,
    };
  }

  private traverseRelationships(
    startUri: string,
    maxDepth: number,
  ): Set<string> {
    const visited = new Set<string>();
    const queue: Array<{ uri: string; depth: number }> = [
      { uri: startUri, depth: 0 },
    ];

    while (queue.length > 0) {
      const { uri, depth } = queue.shift()!;

      if (visited.has(uri) || depth > maxDepth) {
        continue;
      }

      visited.add(uri);

      const neighbors = this.index.relationshipGraph.get(uri);
      if (neighbors) {
        for (const neighborUri of neighbors) {
          if (!visited.has(neighborUri)) {
            queue.push({ uri: neighborUri, depth: depth + 1 });
          }
        }
      }
    }

    visited.delete(startUri);
    return visited;
  }

  public getStats() {
    return { ...this.index.stats, lastIndexed: this.index.lastIndexed };
  }

  public getAllDocuments(): DocumentMetadata[] {
    return Array.from(this.index.documents.values());
  }

  public rebuild(): void {
    this.index = this.createEmptyIndex();
    this.initialize();
  }
}
