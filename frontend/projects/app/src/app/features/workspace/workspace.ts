import { Component, computed, effect, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { toast } from 'ngx-sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { ApiService } from '../../core/api.service';
import { WorkspaceStore } from '../../core/workspace-store';
import { ClauseType, DocumentListItem } from '../../core/models';
import { tint } from '../../core/color.util';

interface DocGroup {
  type: ClauseType | null;
  label: string;
  docs: DocumentListItem[];
}

@Component({
  selector: 'app-workspace',
  imports: [NgTemplateOutlet, RouterOutlet, ...HlmButtonImports, ...HlmInputImports, ...HlmSpinnerImports],
  templateUrl: './workspace.html',
  styles: [
    `
      .checkmark {
        width: 3.5rem;
        height: 3.5rem;
      }
      .checkmark-circle {
        stroke: var(--primary);
        stroke-width: 2.5;
        fill: none;
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        animation: cm-draw 0.5s cubic-bezier(0.65, 0, 0.45, 1) forwards;
      }
      .checkmark-check {
        stroke: var(--primary);
        stroke-width: 3.5;
        stroke-linecap: round;
        stroke-linejoin: round;
        fill: none;
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: cm-draw 0.35s cubic-bezier(0.65, 0, 0.45, 1) 0.45s forwards;
      }
      @keyframes cm-draw {
        to {
          stroke-dashoffset: 0;
        }
      }
    `,
  ],
})
export class Workspace {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  readonly store = inject(WorkspaceStore);

  readonly docs = signal<DocumentListItem[]>([]);
  readonly clauseTypes = signal<ClauseType[]>([]);
  readonly loading = signal(true);
  readonly search = signal('');
  readonly activeClauseFilter = signal<number | null>(null);
  readonly groupBy = signal(false);
  readonly filterOpen = signal(false);
  readonly drawerOpen = signal(false);

  /** Document awaiting delete confirmation (drives the confirm modal). */
  readonly pendingDelete = signal<DocumentListItem | null>(null);

  // upload modal state
  readonly uploadOpen = signal(false);
  readonly uploadStatus = signal<'idle' | 'busy' | 'done'>('idle');
  readonly uploadPhase = signal('Uploading…');
  readonly uploadError = signal<string | null>(null);
  readonly dragging = signal(false);

  private searchTimer: ReturnType<typeof setTimeout> | undefined;

  /** Doc list with the open document's chips kept live from the labeling view. */
  private readonly liveDocs = computed(() => {
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

  readonly groups = computed<DocGroup[]>(() => {
    const list = this.filteredDocs();
    const result: DocGroup[] = [];
    for (const t of this.clauseTypes()) {
      const docs = list.filter((d) => (d.clause_summary ?? []).some((c) => c.clause_type_id === t.id));
      if (docs.length) result.push({ type: t, label: t.name, docs });
    }
    const unlabeled = list.filter((d) => (d.clause_summary ?? []).length === 0);
    if (unlabeled.length) result.push({ type: null, label: 'Unlabeled', docs: unlabeled });
    return result;
  });

  readonly activeFilterType = computed<ClauseType | null>(
    () => this.clauseTypes().find((t) => t.id === this.activeClauseFilter()) ?? null,
  );

  constructor() {
    this.api.listClauseTypes().subscribe({
      next: (t) => this.clauseTypes.set(t),
      error: () => {},
    });
    this.reload();
    effect(() => {
      if (this.store.uploadRequests()) this.openUpload();
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

  setFilter(id: number | null): void {
    this.activeClauseFilter.set(id);
    this.filterOpen.set(false);
  }

  toggleGroupBy(): void {
    this.groupBy.update((g) => !g);
  }

  open(id: number): void {
    this.drawerOpen.set(false);
    this.router.navigate(['/documents', id]);
  }

  isActive(id: number): boolean {
    return this.store.selectedDocId() === id;
  }

  requestDelete(doc: DocumentListItem, ev: Event): void {
    ev.stopPropagation();
    this.pendingDelete.set(doc);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
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

  labelCount(d: DocumentListItem): number {
    return (d.clause_summary ?? []).reduce((sum, c) => sum + c.count, 0);
  }

  // ---- upload ----
  openUpload(): void {
    this.uploadError.set(null);
    this.uploadStatus.set('idle');
    this.uploadOpen.set(true);
  }

  closeUpload(): void {
    if (this.uploadStatus() === 'idle') this.uploadOpen.set(false);
  }

  onDrop(ev: DragEvent): void {
    ev.preventDefault();
    this.dragging.set(false);
    const file = ev.dataTransfer?.files?.[0];
    if (file) this.upload(file);
  }

  onDragOver(ev: DragEvent): void {
    ev.preventDefault();
    this.dragging.set(true);
  }

  onDragLeave(ev: DragEvent): void {
    ev.preventDefault();
    this.dragging.set(false);
  }

  onFileInput(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.upload(file);
    input.value = '';
  }

  private upload(file: File): void {
    if (!/\.(txt|md)$/i.test(file.name)) {
      this.uploadError.set('Only .txt and .md files are supported.');
      return;
    }
    this.uploadError.set(null);
    this.uploadStatus.set('busy');
    this.uploadPhase.set('Uploading…');
    const started = Date.now();
    const t = setTimeout(() => {
      if (this.uploadStatus() === 'busy') this.uploadPhase.set('Analyzing sentences…');
    }, 600);
    this.api.uploadDocument(file).subscribe({
      next: (doc) => {
        clearTimeout(t);
        // Hold the spinner briefly so fast uploads don't flash, play the
        // success check, then close and open the new document.
        const spinnerHold = Math.max(0, 500 - (Date.now() - started));
        setTimeout(() => {
          this.uploadStatus.set('done');
          setTimeout(() => {
            this.uploadOpen.set(false);
            this.uploadStatus.set('idle');
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
          }, 1200);
        }, spinnerHold);
      },
      error: (err) => {
        clearTimeout(t);
        this.uploadStatus.set('idle');
        const detail = err?.error?.detail;
        this.uploadError.set(typeof detail === 'string' ? detail : 'Upload failed. Please try again.');
        toast.error('Upload failed');
      },
    });
  }

  // ---- view helpers ----
  chipStyle(color: string): string {
    return `background-color:${tint(color, 0.12)};color:${color};border:1px solid ${tint(color, 0.3)};`;
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
