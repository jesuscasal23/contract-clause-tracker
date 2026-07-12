/**
 * API DTOs — field names are snake_case to match the FastAPI backend JSON
 * (see contract-clause-tracker/docs/requirements.md §6/§7).
 */

export interface ClauseType {
  id: number;
  name: string;
  description?: string | null;
  color: string; // ink hex, e.g. "#fa5b05"; the UI derives a light tint from it
}

export interface Sentence {
  id: number;
  ordinal: number;
  char_start: number;
  char_end: number;
  text: string;
}

export type AnnotationSource = 'user' | 'model';
export type AnnotationStatus = 'confirmed' | 'suggested' | 'rejected';

export interface Annotation {
  id: number;
  sentence_id: number;
  clause_type_id: number;
  char_start: number;
  char_end: number;
  source: AnnotationSource;
  confidence?: number | null;
  status: AnnotationStatus;
}

/**
 * Normalized document used by the UI: a flat sentence list plus a flat annotation
 * list. The ApiService derives this from the backend's RawDocumentDetail.
 */
export interface DocumentDetail {
  id: number;
  filename: string;
  format: string;
  raw_text: string;
  created_at: string;
  sentences: Sentence[];
  annotations: Annotation[];
}

/** Raw shape from GET/POST /documents: annotations are nested inside each sentence. */
export interface RawDocumentDetail {
  id: number;
  filename: string;
  format: string;
  created_at: string;
  raw_text: string;
  sentences: Array<Sentence & { annotations?: Annotation[] }>;
}

export interface ClauseSummaryItem {
  clause_type_id: number;
  name: string;
  color: string;
  count: number;
}

export interface DocumentListItem {
  id: number;
  filename: string;
  format: string;
  created_at: string;
  sentence_count: number;
  clause_summary: ClauseSummaryItem[];
}
