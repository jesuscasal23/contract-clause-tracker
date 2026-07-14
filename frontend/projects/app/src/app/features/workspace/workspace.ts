import { Component, computed, effect, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { toast } from 'ngx-sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { ApiService } from '../../core/api.service';
import { WorkspaceStore } from '../../core/workspace-store';
import { ClauseType, DocumentDetail, DocumentListItem } from '../../core/models';
import { DocListPanel } from './doc-list-panel/doc-list-panel';
import { UploadModal } from './upload-modal/upload-modal';
import { DeleteDocumentDialog } from './delete-document-dialog/delete-document-dialog';

/**
 * Workspace shell: top bar, left document panel (desktop aside + mobile
 * drawer) and the routed center view. Owns the document-list data and
 * coordinates search, filtering, uploads, deletes and navigation; the
 * panel and the two dialogs are child components.
 */
@Component({
  selector: 'app-workspace',
  imports: [
    NgTemplateOutlet,
    RouterOutlet,
    ...HlmButtonImports,
    DocListPanel,
    UploadModal,
    DeleteDocumentDialog,
  ],
  templateUrl: './workspace.html',
})
export class Workspace {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly store = inject(WorkspaceStore);

  readonly docs = signal<DocumentListItem[]>([]);
  readonly clauseTypes = signal<ClauseType[]>([]);
  readonly loading = signal(true);
  readonly search = signal('');
  readonly activeClauseFilter = signal<number | null>(null);
  readonly groupBy = signal(false);
  readonly drawerOpen = signal(false);
  readonly uploadOpen = signal(false);

  /** Document awaiting delete confirmation (drives the confirm dialog). */
  readonly pendingDelete = signal<DocumentListItem | null>(null);

  private searchTimer: ReturnType<typeof setTimeout> | undefined;

  /** Doc list with the open document's chips kept live from the labeling view. */
  readonly liveDocs = computed(() => {
    const live = this.store.liveSummary();
    if (!live) return this.docs();
    return this.docs().map((d) => (d.id === live.docId ? { ...d, clause_summary: live.summary } : d));
  });

  readonly filteredDocs = computed(() => {
    const f = this.activeClauseFilter();
    const list = this.liveDocs();
    if (f == null) return list;
    return list.filter((d) => (d.clause_summary ?? []).some((c) => c.clause_type_id === f));
  });

  constructor() {
    this.api.listClauseTypes().subscribe({
      next: (t) => this.clauseTypes.set(t),
      error: () => {},
    });
    this.reload();
    effect(() => {
      if (this.store.uploadRequests()) this.uploadOpen.set(true);
    });
    // Fold the live summary into the base list: docs() is only fetched on
    // load/search, so without this a doc labeled during the session reverts
    // to its stale (possibly empty) summary once another doc is selected.
    effect(() => {
      const live = this.store.liveSummary();
      if (!live) return;
      this.docs.update((list) =>
        list.map((d) => (d.id === live.docId ? { ...d, clause_summary: live.summary } : d)),
      );
    });
  }

  reload(): void {
    this.loading.set(true);
    this.api.listDocuments(this.search().trim() || undefined).subscribe({
      next: (d) => {
        this.docs.set(d);
        this.loading.set(false);
        // Default selection: never sit on the empty state while documents exist
        // (deep-links to /documents/:id are untouched — the URL isn't '/').
        if (this.router.url === '/' && d.length) {
          this.router.navigate(['/documents', d[0].id]);
        }
      },
      error: () => {
        this.docs.set([]);
        this.loading.set(false);
        toast.error('Could not load documents. Is the backend running on :8000?');
      },
    });
  }

  onSearchInput(value: string): void {
    this.search.set(value);
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.reload(), 300);
  }

  toggleGroupBy(): void {
    this.groupBy.update((g) => !g);
  }

  open(id: number): void {
    this.drawerOpen.set(false);
    this.router.navigate(['/documents', id]);
  }

  confirmDelete(): void {
    const doc = this.pendingDelete();
    if (!doc) return;
    this.pendingDelete.set(null);
    const id = doc.id;
    this.api.deleteDocument(id).subscribe({
      next: () => {
        const wasOpen = this.store.selectedDocId() === id;
        const visible = this.filteredDocs();
        const idx = visible.findIndex((d) => d.id === id);
        const neighbor = visible[idx + 1] ?? visible[idx - 1];
        this.docs.update((list) => list.filter((d) => d.id !== id));
        if (wasOpen) {
          if (neighbor) this.router.navigate(['/documents', neighbor.id]);
          else this.router.navigate(['/']);
        }
        toast('Document deleted');
      },
      error: () => toast.error('Delete failed'),
    });
  }

  /** A finished upload: put the new document on top of the list and open it. */
  onUploaded(doc: DocumentDetail): void {
    this.drawerOpen.set(false);
    const item: DocumentListItem = {
      id: doc.id,
      filename: doc.filename,
      format: doc.format,
      created_at: doc.created_at,
      sentence_count: doc.sentences.length,
      clause_summary: [],
    };
    this.docs.update((list) => [item, ...list]);
    toast.success(`"${doc.filename}" uploaded · ${doc.sentences.length} sentences`);
    this.router.navigate(['/documents', doc.id]);
  }
}
