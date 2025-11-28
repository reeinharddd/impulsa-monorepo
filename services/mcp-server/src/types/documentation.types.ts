/** @format */

export type DocumentType =
  | "general"
  | "feature-design"
  | "adr"
  | "database-schema"
  | "api-design"
  | "sync-strategy"
  | "ux-flow"
  | "testing-strategy"
  | "deployment-runbook"
  | "security-audit";

export type DocumentStatus =
  | "draft"
  | "review"
  | "approved"
  | "accepted"
  | "deprecated"
  | "superseded";

export interface BaseDocumentMetadata {
  document_type: DocumentType;
  module: string;
  status: DocumentStatus;
  version: string;
  last_updated: string;
  author: string;
  keywords: string[];
  related_docs: Record<string, string>;
  filePath: string;
  uri: string;
  title: string;
}

export interface DatabaseMetadata {
  tables?: string[];
  relationships?: string[];
  indexes?: string[];
  custom_types?: string[];
  triggers?: string[];
}

export interface ApiMetadata {
  endpoints?: Array<{
    method: string;
    path: string;
    description: string;
  }>;
  dtos?: string[];
  status_codes?: number[];
  requires_auth?: boolean;
  allowed_roles?: string[];
}

export interface UxMetadata {
  platform?: "web" | "mobile" | "both";
  screens?: string[];
  user_actions?: string[];
  states?: string[];
  components?: string[];
}

export interface TestingMetadata {
  test_types?: Array<"unit" | "integration" | "e2e">;
  coverage_target?: number;
  tools?: string[];
  critical_paths?: string[];
}

export interface AdrMetadata {
  decision_status?: "proposed" | "accepted" | "deprecated" | "superseded";
  supersedes?: string[];
  related_decisions?: string[];
  decision_date?: string;
}

export type DocumentMetadata = BaseDocumentMetadata & {
  doc_metadata?:
    | { type: "database"; data: DatabaseMetadata }
    | { type: "api"; data: ApiMetadata }
    | { type: "ux"; data: UxMetadata }
    | { type: "testing"; data: TestingMetadata }
    | { type: "adr"; data: AdrMetadata };
};

export interface DocumentationIndex {
  documents: Map<string, DocumentMetadata>;
  byType: Map<DocumentType, DocumentMetadata[]>;
  byModule: Map<string, DocumentMetadata[]>;
  byStatus: Map<DocumentStatus, DocumentMetadata[]>;
  byKeyword: Map<string, DocumentMetadata[]>;
  relationshipGraph: Map<string, Set<string>>;
  lastIndexed: Date;
  stats: {
    totalDocuments: number;
    documentsByType: Record<DocumentType, number>;
    documentsByModule: Record<string, number>;
    documentsByStatus: Record<DocumentStatus, number>;
    avgKeywordsPerDoc: number;
    avgRelatedDocsPerDoc: number;
  };
}

export interface SearchResult {
  document: DocumentMetadata;
  score: number;
  snippets?: Array<{
    text: string;
    lineNumber: number;
    context: "before" | "match" | "after";
  }>;
  matchReason: string;
}

export interface SearchOptions {
  query: string;
  documentType?: DocumentType;
  module?: string;
  status?: DocumentStatus;
  maxResults?: number;
  minScore?: number;
  includeSnippets?: boolean;
  searchMode?: "fuzzy" | "exact" | "keyword";
}

export interface DocumentContext {
  primary: DocumentMetadata;
  related: {
    architecture?: DocumentMetadata[];
    database?: DocumentMetadata[];
    api?: DocumentMetadata[];
    ux?: DocumentMetadata[];
    testing?: DocumentMetadata[];
    feature?: DocumentMetadata[];
    other?: DocumentMetadata[];
  };
  depth: number;
  totalDocuments: number;
}

export interface ValidationResult {
  uri: string;
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    severity: "error" | "warning";
  }>;
  warnings: Array<{
    field: string;
    message: string;
    suggestion?: string;
  }>;
  metadata: {
    found: Partial<BaseDocumentMetadata>;
    expected: string[];
    missing: string[];
  };
}

export interface DocumentationHealthReport {
  generatedAt: Date;
  overview: {
    totalDocuments: number;
    byStatus: Record<DocumentStatus, number>;
    byType: Record<DocumentType, number>;
    byModule: Record<string, number>;
  };
  issues: {
    orphanedDocs: string[];
    incompleteMetadata: Array<{
      uri: string;
      missingFields: string[];
    }>;
    outdatedDocs: Array<{
      uri: string;
      lastUpdated: string;
      daysOld: number;
    }>;
    brokenReferences: Array<{
      source: string;
      target: string;
      referenceType: string;
    }>;
    staleDrafts: Array<{
      uri: string;
      daysSinceLastUpdate: number;
    }>;
  };
  coverage: Record<
    string,
    {
      hasFeatureDesign: boolean;
      hasDatabaseSchema: boolean;
      hasApiDesign: boolean;
      hasUxFlow: boolean;
      hasTestingStrategy: boolean;
      completeness: number;
    }
  >;
  recommendations: string[];
}
