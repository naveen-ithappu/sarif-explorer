// SARIF (Static Analysis Results Interchange Format) type definitions

export interface SarifReport {
  $schema?: string;
  version: string;
  runs: SarifRun[];
}

export interface SarifRun {
  tool: SarifTool;
  results: SarifResult[];
  artifacts?: SarifArtifact[];
}

export interface SarifTool {
  driver: SarifToolComponent;
  extensions?: SarifToolComponent[];
}

export interface SarifToolComponent {
  name: string;
  version?: string;
  informationUri?: string;
}

export interface SarifResult {
  ruleId: string;
  level: 'error' | 'warning' | 'info' | 'note' | 'none';
  message: SarifMessage;
  locations: SarifLocation[];
  rule?: SarifReportingDescriptor;
}

export interface SarifMessage {
  text: string;
  markdown?: string;
}

export interface SarifLocation {
  physicalLocation: SarifPhysicalLocation;
  logicalLocations?: SarifLogicalLocation[];
}

export interface SarifPhysicalLocation {
  artifactLocation: SarifArtifactLocation;
  region: SarifRegion;
  contextRegion?: SarifRegion;
}

export interface SarifArtifactLocation {
  uri: string;
  uriBaseId?: string;
  index?: number;
}

export interface SarifRegion {
  startLine: number;
  startColumn?: number;
  endLine?: number;
  endColumn?: number;
  charOffset?: number;
  charLength?: number;
  snippet?: SarifArtifactContent;
}

export interface SarifArtifactContent {
  text?: string;
  binary?: string;
  rendered?: SarifMultiformatMessageString;
}

export interface SarifMultiformatMessageString {
  text: string;
  markdown?: string;
}

export interface SarifLogicalLocation {
  fullyQualifiedName?: string;
  name?: string;
  index?: number;
  kind?: string;
}

export interface SarifReportingDescriptor {
  id: string;
  name?: string;
  shortDescription?: SarifMultiformatMessageString;
  fullDescription?: SarifMultiformatMessageString;
  helpUri?: string;
  help?: SarifMultiformatMessageString;
}

export interface SarifArtifact {
  location: SarifArtifactLocation;
  length?: number;
  roles?: string[];
  mimeType?: string;
  contents?: SarifArtifactContent;
  encoding?: string;
  sourceLanguage?: string;
}

// Internal data structures for our application
export interface Violation {
  ruleId: string;
  level: 'error' | 'warning' | 'info' | 'note' | 'none';
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  fileUri: string;
  snippet?: string;
}

export interface FileViolations {
  [fileUri: string]: Violation[];
}

export interface SarifData {
  files: string[];
  fileViolations: FileViolations;
  totalViolations: number;
  statistics: {
    errorCount: number;
    warningCount: number;
    infoCount: number;
    averageViolationsPerFile: number;
  };
} 