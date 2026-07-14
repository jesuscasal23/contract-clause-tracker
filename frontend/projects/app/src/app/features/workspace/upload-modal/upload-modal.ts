import { Component, effect, inject, model, output, signal } from '@angular/core';
import { toast } from 'ngx-sonner';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { ApiService } from '../../../core/api.service';
import { DocumentDetail } from '../../../core/models';

/**
 * Upload dialog with its own small state machine:
 * idle (drop zone) → busy (spinner + phase text) → done (checkmark) → closes
 * itself and emits `uploaded`. The parent only opens it and handles the result.
 */
@Component({
  selector: 'app-upload-modal',
  imports: [...HlmSpinnerImports],
  templateUrl: './upload-modal.html',
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
export class UploadModal {
  private readonly api = inject(ApiService);

  /** Visibility, two-way bound (`[(open)]`): the parent opens it, it closes itself. */
  readonly open = model(false);
  /** The uploaded document, emitted once the success animation has finished. */
  readonly uploaded = output<DocumentDetail>();

  readonly status = signal<'idle' | 'busy' | 'done'>('idle');
  readonly phase = signal('Uploading…');
  readonly error = signal<string | null>(null);
  readonly dragging = signal(false);

  constructor() {
    // Fresh state each time the dialog opens.
    effect(() => {
      if (this.open()) {
        this.status.set('idle');
        this.error.set(null);
      }
    });
  }

  /** Backdrop / ✕ close — ignored while an upload is in flight. */
  close(): void {
    if (this.status() === 'idle') {
      this.error.set(null);
      this.open.set(false);
    }
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
      this.error.set('Only .txt and .md files are supported.');
      return;
    }
    this.error.set(null);
    this.status.set('busy');
    this.phase.set('Uploading…');
    const started = Date.now();
    const t = setTimeout(() => {
      if (this.status() === 'busy') this.phase.set('Analyzing sentences…');
    }, 600);
    this.api.uploadDocument(file).subscribe({
      next: (doc) => {
        clearTimeout(t);
        // Hold the spinner briefly so fast uploads don't flash, play the
        // success check, then close and hand the document to the parent.
        const spinnerHold = Math.max(0, 500 - (Date.now() - started));
        setTimeout(() => {
          this.status.set('done');
          setTimeout(() => {
            this.open.set(false);
            this.status.set('idle');
            this.uploaded.emit(doc);
          }, 1200);
        }, spinnerHold);
      },
      error: (err) => {
        clearTimeout(t);
        this.status.set('idle');
        const detail = err?.error?.detail;
        this.error.set(typeof detail === 'string' ? detail : 'Upload failed. Please try again.');
        toast.error('Upload failed');
      },
    });
  }
}
