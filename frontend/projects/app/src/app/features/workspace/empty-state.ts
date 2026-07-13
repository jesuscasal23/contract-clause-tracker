import { Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { WorkspaceStore } from '../../core/workspace-store';

/** Center placeholder shown when no document is selected. */
@Component({
  selector: 'app-empty-state',
  imports: [...HlmButtonImports],
  template: `
    <div class="flex min-h-[60vh] items-center justify-center rounded-xl border border-dashed px-6">
      <div class="max-w-sm py-16 text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
        </div>
        <h2 class="text-base font-medium">No document selected</h2>
        <p class="mt-1 text-sm text-muted-foreground">
          Select a document from the list to start labeling, or upload a new contract.
        </p>
        <button hlmBtn class="mt-5" (click)="store.requestUpload()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Upload contract
        </button>
      </div>
    </div>
  `,
})
export class EmptyState {
  readonly store = inject(WorkspaceStore);
}
