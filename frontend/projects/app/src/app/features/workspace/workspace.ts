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

  // upload modal state
  readonly uploadOpen = signal(false);
  readonly uploading = signal(false);
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
  }

  reload(): void {
    this.loading.set(true);
    this.api.listDocuments(this.search().trim() || undefined).subscribe({
      next: (d) => {
        this.docs.set(d);
        this.loading.set(false);
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

  deleteDoc(id: number, ev: Event): void {
    ev.stopPropagation();
    this.api.deleteDocument(id).subscribe({
      next: () => {
        this.docs.update((list) => list.filter((d) => d.id !== id));
        if (this.store.selectedDocId() === id) this.router.navigate(['/']);
        toast('Document deleted');
      },
      error: () => toast.error('Delete failed'),
    });
  }

  // ---- upload ----
  openUpload(): void {
    this.uploadError.set(null);
    this.uploadOpen.set(true);
  }

  closeUpload(): void {
    if (!this.uploading()) this.uploadOpen.set(false);
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
    this.uploading.set(true);
    this.uploadPhase.set('Uploading…');
    const t = setTimeout(() => {
      if (this.uploading()) this.uploadPhase.set('Analyzing sentences…');
    }, 600);
    this.api.uploadDocument(file).subscribe({
      next: (doc) => {
        clearTimeout(t);
        this.uploading.set(false);
        this.uploadOpen.set(false);
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
      },
      error: (err) => {
        clearTimeout(t);
        this.uploading.set(false);
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
