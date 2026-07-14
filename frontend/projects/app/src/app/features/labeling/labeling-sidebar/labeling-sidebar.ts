import { Component, input, output } from '@angular/core';
import { ClauseType } from '../../../core/models';

/** One row of the per-document summary: a clause type and how often it occurs. */
export interface ClauseSummaryRow {
  type: ClauseType;
  count: number;
}

/**
 * Right rail of the labeling view (presentational): the clause-type palette
 * and the live "clauses in this document" summary. Clicking a summary row
 * asks the container to scroll to the first matching sentence.
 */
@Component({
  selector: 'app-labeling-sidebar',
  templateUrl: './labeling-sidebar.html',
  host: { class: 'contents' },
})
export class LabelingSidebar {
  readonly clauseTypes = input.required<ClauseType[]>();
  readonly summary = input.required<ClauseSummaryRow[]>();
  readonly totalLabeled = input(0);

  readonly scrollTo = output<ClauseType>();
}
