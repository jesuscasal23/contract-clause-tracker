import { Component, input, output } from '@angular/core';
import { Annotation, ClauseType, DocumentDetail, Sentence } from '../../../core/models';
import { tint } from '../../../core/color.util';
import { displayHeading, titleize } from '../../../core/text.util';

/** A sentence prepared for rendering: its primary annotation + clause type, if any. */
export interface ViewSentence {
  s: Sentence;
  heading: boolean;
  ann?: Annotation;
  type?: ClauseType;
}

/**
 * The document reading pane (presentational): title, sentence flow with
 * clause highlights and tags. Emits the clicked sentence + its screen rect;
 * the Labeling container decides what happens next (popover, API calls).
 */
@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.html',
  host: { class: 'contents' },
  styles: [
    `
      .doc-body {
        font-size: 15px;
        line-height: 2rem;
      }
      .s {
        cursor: pointer;
        border-radius: 3px;
        padding: 0 1px;
        transition: box-shadow 0.1s ease;
      }
      .s:hover {
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 35%, transparent);
      }
      .s.selected {
        box-shadow: 0 0 0 2px var(--primary);
      }
      .s.flash {
        animation: flash 1.2s ease;
      }
      @keyframes flash {
        20% {
          box-shadow: 0 0 0 3px var(--primary);
        }
      }
      .tag {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        border-radius: 999px;
        padding: 1px 6px;
        margin: 0 3px;
        white-space: nowrap;
        vertical-align: 2px;
      }
    `,
  ],
})
export class DocumentView {
  readonly doc = input.required<DocumentDetail>();
  readonly sentences = input.required<ViewSentence[]>();
  readonly totalLabeled = input(0);
  readonly selectedId = input<number | null>(null);
  readonly flashId = input<number | null>(null);

  /** The clicked sentence and its screen rect (for positioning the popover). */
  readonly sentenceClick = output<{ id: number; rect: DOMRect }>();

  readonly displayHeading = displayHeading;
  readonly titleize = titleize;

  onSentenceClick(v: ViewSentence, ev: MouseEvent): void {
    if (v.heading) return;
    ev.stopPropagation();
    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    this.sentenceClick.emit({ id: v.s.id, rect });
  }

  sentenceStyle(v: ViewSentence): string {
    if (!v.ann || !v.type) return '';
    if (v.ann.status === 'suggested') {
      return `background-color:${tint(v.type.color, 0.06)};outline:1px dashed ${v.type.color};outline-offset:1px;border-radius:3px;`;
    }
    return `background-color:${tint(v.type.color, 0.14)};border-radius:3px;`;
  }

  tagStyle(color: string): string {
    return `background-color:${color};color:#fff;`;
  }
}
