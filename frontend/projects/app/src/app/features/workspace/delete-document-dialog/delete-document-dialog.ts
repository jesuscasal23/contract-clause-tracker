import { Component, computed, input, output } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { DocumentListItem } from '../../../core/models';

/** Confirmation dialog shown before a document (and its labels) is deleted. */
@Component({
  selector: 'app-delete-document-dialog',
  imports: [...HlmButtonImports],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" (click)="cancel.emit()"></div>
      <div class="relative w-full max-w-sm rounded-xl border bg-card p-6 shadow-xl">
        <h2 class="text-lg font-semibold">Delete document?</h2>
        <p class="mt-2 text-sm text-muted-foreground">
          This permanently deletes <span class="font-medium text-foreground">{{ doc().filename }}</span>@if (labelCount() > 0) {
            and its
            <span class="font-medium text-foreground">{{ labelCount() }} clause annotation{{ labelCount() === 1 ? '' : 's' }}</span>}.
        </p>
        <div class="mt-5 flex justify-end gap-2">
          <button hlmBtn variant="outline" size="sm" (click)="cancel.emit()">Cancel</button>
          <button hlmBtn variant="destructive" size="sm" (click)="confirm.emit()">Delete</button>
        </div>
      </div>
    </div>
  `,
})
export class DeleteDocumentDialog {
  readonly doc = input.required<DocumentListItem>();
  readonly cancel = output<void>();
  readonly confirm = output<void>();

  readonly labelCount = computed(() =>
    (this.doc().clause_summary ?? []).reduce((sum, c) => sum + c.count, 0),
  );
}
