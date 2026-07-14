import { Component, input, output } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { Annotation, ClauseType } from '../../../core/models';

/**
 * In-place popover for the clicked sentence: pick a clause type, accept or
 * reject a model suggestion, or remove the label. Fully controlled — the
 * Labeling container owns the position and the sentence's current annotation.
 */
@Component({
  selector: 'app-clause-popover',
  imports: [...HlmButtonImports],
  templateUrl: './clause-popover.html',
  host: { class: 'contents' },
})
export class ClausePopover {
  readonly top = input.required<number>();
  readonly left = input.required<number>();
  readonly clauseTypes = input.required<ClauseType[]>();
  /** The sentence's current primary annotation, if it already has one. */
  readonly annotation = input<Annotation | undefined>();

  readonly typeSelect = output<number>();
  readonly acceptSuggestion = output<void>();
  readonly rejectSuggestion = output<void>();
  readonly removeLabel = output<void>();
  readonly dismiss = output<void>();
}
