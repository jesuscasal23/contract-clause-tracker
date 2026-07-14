import { Component, computed, inject, input, output, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { WorkspaceStore } from '../../../core/workspace-store';
import { ClauseSummaryItem, ClauseType, DocumentListItem } from '../../../core/models';
import { tint } from '../../../core/color.util';

interface DocGroup {
  type: ClauseType | null;
  label: string;
  docs: DocumentListItem[];
}

/**
 * Left document panel (presentational): upload button, search, clause filter +
 * grouping controls, and the document rows. All list state lives in the
 * Workspace shell — this component renders inputs and emits user intent, so
 * the desktop aside and the mobile drawer show the same panel without
 * drifting apart. Only the transient filter-dropdown open state is local.
 */
@Component({
  selector: 'app-doc-list-panel',
  imports: [NgTemplateOutlet, ...HlmButtonImports, ...HlmInputImports, ...HlmSpinnerImports],
  templateUrl: './doc-list-panel.html',
  host: { class: 'contents' },
})
export class DocListPanel {
  private readonly store = inject(WorkspaceStore);

  /** Full document list (header count, "no documents yet" state). */
  readonly docs = input.required<DocumentListItem[]>();
  /** Documents after the clause filter — what the rows actually show. */
  readonly visibleDocs = input.required<DocumentListItem[]>();
  readonly clauseTypes = input.required<ClauseType[]>();
  readonly loading = input(false);
  readonly search = input('');
  readonly activeFilterId = input<number | null>(null);
  readonly grouped = input(false);

  readonly searchChange = output<string>();
  readonly filterChange = output<number | null>();
  readonly groupedToggle = output<void>();
  readonly openDoc = output<number>();
  readonly deleteDoc = output<DocumentListItem>();
  readonly uploadClick = output<void>();

  readonly filterOpen = signal(false);

  readonly activeFilterType = computed<ClauseType | null>(
    () => this.clauseTypes().find((t) => t.id === this.activeFilterId()) ?? null,
  );

  readonly groups = computed<DocGroup[]>(() => {
    const list = this.visibleDocs();
    const result: DocGroup[] = [];
    for (const t of this.clauseTypes()) {
      const docs = list.filter((d) => (d.clause_summary ?? []).some((c) => c.clause_type_id === t.id));
      if (docs.length) result.push({ type: t, label: t.name, docs });
    }
    const unlabeled = list.filter((d) => (d.clause_summary ?? []).length === 0);
    if (unlabeled.length) result.push({ type: null, label: 'Unlabeled', docs: unlabeled });
    return result;
  });

  setFilter(id: number | null): void {
    this.filterOpen.set(false);
    this.filterChange.emit(id);
  }

  requestDelete(doc: DocumentListItem, ev: Event): void {
    ev.stopPropagation();
    this.deleteDoc.emit(doc);
  }

  isActive(id: number): boolean {
    return this.store.selectedDocId() === id;
  }

  /** The doc's summary entry for the group it is rendered under (grouped mode). */
  groupEntry(doc: DocumentListItem, type: ClauseType): ClauseSummaryItem | null {
    return (doc.clause_summary ?? []).find((c) => c.clause_type_id === type.id) ?? null;
  }

  /** How many other clause types the doc has — i.e. in how many other groups it appears. */
  otherClauseCount(doc: DocumentListItem, type: ClauseType): number {
    return (doc.clause_summary ?? []).filter((c) => c.clause_type_id !== type.id).length;
  }

  chipStyle(color: string): string {
    return `background-color:${tint(color, 0.12)};color:${color};border:1px solid ${tint(color, 0.3)};`;
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
