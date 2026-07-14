import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { ApiService } from '../../core/api.service';
import { WorkspaceStore } from '../../core/workspace-store';
import { Annotation, ClauseType, DocumentDetail } from '../../core/models';
import { isHeading } from '../../core/text.util';
import { DocumentView, ViewSentence } from './document-view/document-view';
import { ClausePopover } from './clause-popover/clause-popover';
import { LabelingSidebar, ClauseSummaryRow } from './labeling-sidebar/labeling-sidebar';

/**
 * Labeling container: loads the routed document, owns the annotation state
 * and API calls, and coordinates its three presentational children — the
 * document view, the clause popover, and the right sidebar.
 */
@Component({
  selector: 'app-labeling',
  imports: [...HlmButtonImports, ...HlmSpinnerImports, DocumentView, ClausePopover, LabelingSidebar],
  templateUrl: './labeling.html',
  host: {
    '(window:scroll)': 'onViewportChange()',
    '(window:resize)': 'onViewportChange()',
  },
})
export class Labeling {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(WorkspaceStore);

  private docId = NaN;

  readonly doc = signal<DocumentDetail | null>(null);
  readonly annotations = signal<Annotation[]>([]);
  readonly clauseTypes = signal<ClauseType[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  // popover state
  readonly selectedSentenceId = signal<number | null>(null);
  readonly popoverTop = signal(0);
  readonly popoverLeft = signal(0);
  readonly flashId = signal<number | null>(null);

  private readonly clauseTypeMap = computed(() => {
    const m = new Map<number, ClauseType>();
    for (const t of this.clauseTypes()) m.set(t.id, t);
    return m;
  });

  /** One primary (non-rejected) annotation per sentence; confirmed beats suggested. */
  private readonly annBySentence = computed(() => {
    const m = new Map<number, Annotation>();
    for (const a of this.annotations()) {
      if (a.status === 'rejected') continue;
      const existing = m.get(a.sentence_id);
      if (!existing || (existing.status === 'suggested' && a.status === 'confirmed')) {
        m.set(a.sentence_id, a);
      }
    }
    return m;
  });

  readonly viewSentences = computed<ViewSentence[]>(() => {
    const d = this.doc();
    if (!d) return [];
    const annMap = this.annBySentence();
    const typeMap = this.clauseTypeMap();
    return d.sentences.map((s) => {
      const ann = annMap.get(s.id);
      return {
        s,
        heading: isHeading(s.text),
        ann,
        type: ann ? typeMap.get(ann.clause_type_id) : undefined,
      };
    });
  });

  readonly summary = computed<ClauseSummaryRow[]>(() => {
    const counts = new Map<number, number>();
    for (const a of this.annBySentence().values()) {
      counts.set(a.clause_type_id, (counts.get(a.clause_type_id) ?? 0) + 1);
    }
    const rows: ClauseSummaryRow[] = [];
    for (const t of this.clauseTypes()) {
      const c = counts.get(t.id);
      if (c) rows.push({ type: t, count: c });
    }
    return rows;
  });

  readonly totalLabeled = computed(() => this.annBySentence().size);

  readonly selectedAnn = computed<Annotation | undefined>(() => {
    const id = this.selectedSentenceId();
    return id == null ? undefined : this.annBySentence().get(id);
  });

  constructor() {
    this.api.listClauseTypes().subscribe({ next: (t) => this.clauseTypes.set(t), error: () => {} });
    // The shell keeps this component mounted across /documents/:id changes,
    // so react to param changes rather than reading the snapshot once.
    this.route.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((pm) => this.load(Number(pm.get('id'))));
    inject(DestroyRef).onDestroy(() => this.store.clearDoc(this.docId));
    // Publish the live clause summary so the shell's left list stays in sync.
    effect(() => {
      const d = this.doc();
      if (!d) return;
      this.store.liveSummary.set({
        docId: d.id,
        summary: this.summary().map((r) => ({
          clause_type_id: r.type.id,
          name: r.type.name,
          color: r.type.color,
          count: r.count,
        })),
      });
    });
  }

  private load(id: number): void {
    this.docId = id;
    this.closePopover();
    this.doc.set(null);
    this.annotations.set([]);
    this.error.set(false);
    if (Number.isNaN(id)) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }
    this.store.selectedDocId.set(id);
    this.loading.set(true);
    this.api.getDocument(id).subscribe({
      next: (d) => {
        if (this.docId !== id) return; // stale response after switching docs
        this.doc.set(d);
        this.annotations.set(d.annotations ?? []);
        this.loading.set(false);
      },
      error: () => {
        if (this.docId !== id) return;
        this.error.set(true);
        this.loading.set(false);
        toast.error('Could not load document. Is the backend running on :8000?');
      },
    });
  }

  // ---- labeling interaction ----
  onSentenceClick(e: { id: number; rect: DOMRect }): void {
    this.popoverTop.set(e.rect.bottom + 6);
    this.popoverLeft.set(Math.max(8, Math.min(e.rect.left, window.innerWidth - 296)));
    this.selectedSentenceId.set(e.id);
  }

  applyType(typeId: number): void {
    const sid = this.selectedSentenceId();
    if (sid == null) return;
    const existing = this.annBySentence().get(sid);
    if (existing && existing.clause_type_id === typeId) {
      this.closePopover();
      return;
    }
    if (existing) {
      this.api.updateAnnotation(existing.id, { clause_type_id: typeId }).subscribe({
        next: (a) => this.upsertAnn(a),
        error: () => toast.error('Update failed'),
      });
    } else {
      this.api.createAnnotation(sid, typeId).subscribe({
        next: (a) => this.upsertAnn(a),
        error: () => toast.error('Could not add label'),
      });
    }
    this.closePopover();
  }

  removeLabel(): void {
    const ann = this.selectedAnn();
    if (ann) {
      this.api.deleteAnnotation(ann.id).subscribe({
        next: () => this.annotations.update((l) => l.filter((x) => x.id !== ann.id)),
        error: () => toast.error('Remove failed'),
      });
    }
    this.closePopover();
  }

  accept(): void {
    const ann = this.selectedAnn();
    if (ann) {
      this.api.updateAnnotation(ann.id, { status: 'confirmed' }).subscribe({
        next: (a) => this.upsertAnn(a),
        error: () => toast.error('Failed'),
      });
    }
    this.closePopover();
  }

  reject(): void {
    const ann = this.selectedAnn();
    if (ann) {
      this.api.updateAnnotation(ann.id, { status: 'rejected' }).subscribe({
        next: (a) => this.upsertAnn(a),
        error: () => toast.error('Failed'),
      });
    }
    this.closePopover();
  }

  closePopover(): void {
    this.selectedSentenceId.set(null);
  }

  onViewportChange(): void {
    if (this.selectedSentenceId() !== null) this.closePopover();
  }

  scrollToType(t: ClauseType): void {
    const target = this.viewSentences().find((v) => v.ann?.clause_type_id === t.id);
    if (!target) return;
    document.getElementById('s-' + target.s.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.flashId.set(target.s.id);
    setTimeout(() => this.flashId.set(null), 1200);
  }

  back(): void {
    this.router.navigate(['/']);
  }

  private upsertAnn(a: Annotation): void {
    this.annotations.update((list) => {
      const i = list.findIndex((x) => x.id === a.id);
      if (i >= 0) {
        const copy = [...list];
        copy[i] = a;
        return copy;
      }
      return [...list, a];
    });
  }
}
