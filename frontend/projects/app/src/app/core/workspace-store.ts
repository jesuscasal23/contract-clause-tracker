import { Injectable, signal } from '@angular/core';
import { ClauseSummaryItem } from './models';

/**
 * Shared workspace state between the shell (left document list) and the
 * labeling view (center): which document is open, and its live clause summary
 * so the list's chips stay in sync while labeling without refetching.
 */
@Injectable({ providedIn: 'root' })
export class WorkspaceStore {
  /** Document open in the center labeling view; drives the left list's active row. */
  readonly selectedDocId = signal<number | null>(null);

  /** Live clause summary of the open document, published by the labeling view. */
  readonly liveSummary = signal<{ docId: number; summary: ClauseSummaryItem[] } | null>(null);

  /** Bumped by child views (e.g. the empty state) to ask the shell to open the upload modal. */
  readonly uploadRequests = signal(0);

  requestUpload(): void {
    this.uploadRequests.update((n) => n + 1);
  }

  clearDoc(docId: number): void {
    if (this.selectedDocId() === docId) this.selectedDocId.set(null);
    if (this.liveSummary()?.docId === docId) this.liveSummary.set(null);
  }
}
