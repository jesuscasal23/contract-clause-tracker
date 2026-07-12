import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  Annotation,
  ClauseType,
  DocumentDetail,
  DocumentListItem,
  RawDocumentDetail,
} from './models';

/**
 * Base URL of the FastAPI backend. Overridable at runtime via a global
 * `window.__API_BASE__` (set in index.html / Docker) without a rebuild.
 */
declare global {
  interface Window {
    __API_BASE__?: string;
  }
}
const API_BASE =
  (typeof window !== 'undefined' && window.__API_BASE__) || 'http://localhost:8000';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = API_BASE;

  listDocuments(search?: string): Observable<DocumentListItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.http
      .get<{ documents: DocumentListItem[] }>(`${this.base}/documents${qs}`)
      .pipe(map((res) => res.documents ?? []));
  }

  getDocument(id: number): Observable<DocumentDetail> {
    return this.http
      .get<RawDocumentDetail>(`${this.base}/documents/${id}`)
      .pipe(map((raw) => this.normalize(raw)));
  }

  uploadDocument(file: File): Observable<DocumentDetail> {
    const form = new FormData();
    form.append('file', file);
    return this.http
      .post<RawDocumentDetail>(`${this.base}/documents`, form)
      .pipe(map((raw) => this.normalize(raw)));
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/documents/${id}`);
  }

  listClauseTypes(): Observable<ClauseType[]> {
    return this.http.get<ClauseType[]>(`${this.base}/clause-types`);
  }

  createAnnotation(sentenceId: number, clauseTypeId: number): Observable<Annotation> {
    return this.http.post<Annotation>(`${this.base}/annotations`, {
      sentence_id: sentenceId,
      clause_type_id: clauseTypeId,
    });
  }

  updateAnnotation(
    id: number,
    patch: Partial<Pick<Annotation, 'status' | 'clause_type_id'>>,
  ): Observable<Annotation> {
    return this.http.patch<Annotation>(`${this.base}/annotations/${id}`, patch);
  }

  deleteAnnotation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/annotations/${id}`);
  }

  /** Flatten the backend's per-sentence annotations into the UI's flat shape. */
  private normalize(raw: RawDocumentDetail): DocumentDetail {
    return {
      id: raw.id,
      filename: raw.filename,
      format: raw.format,
      raw_text: raw.raw_text,
      created_at: raw.created_at,
      sentences: raw.sentences.map((s) => ({
        id: s.id,
        ordinal: s.ordinal,
        char_start: s.char_start,
        char_end: s.char_end,
        text: s.text,
      })),
      annotations: raw.sentences.flatMap((s) => s.annotations ?? []),
    };
  }
}
