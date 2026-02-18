import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

/**
 * Format bytes into human-readable file size string.
 * @internal
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  return `${size % 1 === 0 ? size : size.toFixed(1)} ${units[i]}`;
}

/**
 * File upload component with drag-and-drop, file list, and validation.
 *
 * @example
 * ```html
 * <glint-file-upload
 *   [multiple]="true"
 *   accept="image/*,.pdf"
 *   [maxFileSize]="5242880"
 *   (selectFiles)="onFiles($event)"
 * />
 * ```
 */
@Component({
  selector: 'glint-file-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: block',
    '[class.disabled]': 'disabled()',
  },
  styles: `
    :host {
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
    }

    :host(.disabled) {
      opacity: 0.5;
      pointer-events: none;
    }

    .drop-zone {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--glint-spacing-md);
      padding-block: var(--glint-spacing-lg);
      padding-inline: var(--glint-spacing-md);
      border: 2px dashed var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      text-align: center;
      transition:
        border-color var(--glint-duration-fast) var(--glint-easing),
        background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .drop-zone.dragover {
      border-color: var(--glint-color-primary);
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    .drop-zone-text {
      color: var(--glint-color-text-muted);
      font-size: 0.875rem;
    }

    .choose-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      font-weight: var(--glint-font-weight);
      color: var(--glint-color-primary-contrast);
      background: var(--glint-color-primary);
      border: 1px solid var(--glint-color-primary);
      border-radius: var(--glint-border-radius);
      cursor: pointer;
      transition:
        background-color var(--glint-duration-normal) var(--glint-easing),
        border-color var(--glint-duration-normal) var(--glint-easing);
    }

    .choose-btn:hover {
      background: color-mix(in oklch, var(--glint-color-primary), white 15%);
      border-color: color-mix(in oklch, var(--glint-color-primary), white 15%);
    }

    .choose-btn:active {
      background: color-mix(in oklch, var(--glint-color-primary), white 30%);
      border-color: color-mix(in oklch, var(--glint-color-primary), white 30%);
    }

    .choose-btn:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px var(--glint-color-surface), 0 0 0 4px var(--glint-color-focus-ring);
    }

    .hidden-input {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .file-list {
      list-style: none;
      margin-block-start: var(--glint-spacing-md);
      margin-block-end: 0;
      padding-inline-start: 0;
      display: flex;
      flex-direction: column;
      gap: var(--glint-spacing-xs);
    }

    .file-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-block: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-sm);
      background: var(--glint-color-surface-variant);
      border-radius: var(--glint-border-radius);
      border: 1px solid var(--glint-color-border);
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      min-inline-size: 0;
    }

    .file-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .file-size {
      color: var(--glint-color-text-muted);
      font-size: 0.8125rem;
      white-space: nowrap;
    }

    .remove-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1.5rem;
      block-size: 1.5rem;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--glint-color-text-muted);
      cursor: pointer;
      font-size: 0.875rem;
      line-height: 1;
      flex-shrink: 0;
      transition:
        color var(--glint-duration-fast) var(--glint-easing),
        background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .remove-btn:hover {
      color: var(--glint-color-error);
      background: color-mix(in oklch, var(--glint-color-error), transparent 90%);
    }

    .remove-btn:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 1px;
    }

    .clear-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      margin-block-start: var(--glint-spacing-sm);
      padding-block: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-sm);
      font-family: var(--glint-font-family);
      font-size: 0.8125rem;
      color: var(--glint-color-error);
      background: transparent;
      border: 1px solid var(--glint-color-error);
      border-radius: var(--glint-border-radius);
      cursor: pointer;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        color var(--glint-duration-fast) var(--glint-easing);
    }

    .clear-btn:hover {
      background: color-mix(in oklch, var(--glint-color-error), transparent 90%);
    }

    .clear-btn:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 1px;
    }
  `,
  template: `
    <input
      #fileInput
      class="hidden-input"
      type="file"
      [multiple]="multiple()"
      [accept]="accept()"
      [disabled]="disabled()"
      (change)="onFileInputChange($event)"
    />

    <div
      class="drop-zone"
      [class.dragover]="isDragOver()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
    >
      <button
        class="choose-btn"
        type="button"
        [disabled]="disabled()"
        (click)="openFileDialog()"
      >{{ chooseLabel() }}</button>
      <span class="drop-zone-text">Drag and drop files here</span>
    </div>

    @if (showFileList() && files().length > 0) {
      <ul class="file-list">
        @for (file of files(); track file.name + file.size + file.lastModified) {
          <li class="file-item">
            <span class="file-info">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatSize(file.size) }}</span>
            </span>
            <button
              class="remove-btn"
              type="button"
              aria-label="Remove"
              (click)="onRemoveFile(file)"
            >&#10005;</button>
          </li>
        }
      </ul>
      <button
        class="clear-btn"
        type="button"
        (click)="onClear()"
      >Clear all</button>
    }
  `,
})
export class GlintFileUploadComponent {
  /** Allow multiple file selection */
  multiple = input(false);
  /** Accepted file types (e.g., 'image/*,.pdf') */
  accept = input('');
  /** Maximum file size in bytes (0 = unlimited) */
  maxFileSize = input(0);
  /** Disabled state */
  disabled = input(false);
  /** Label for the choose button */
  chooseLabel = input('Choose');
  /** Show the list of selected files */
  showFileList = input(true);
  /** Auto-emit on selection (emit immediately when files are chosen) */
  auto = input(false);

  /** Emitted when files are selected */
  selectFiles = output<File[]>();
  /** Emitted when a single file is removed */
  removeFile = output<File>();
  /** Emitted when all files are cleared */
  clear = output<void>();

  protected files = signal<File[]>([]);
  protected isDragOver = signal(false);

  private fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  /** Format file size for display */
  protected formatSize(bytes: number): string {
    return formatFileSize(bytes);
  }

  /** Open the native file picker */
  protected openFileDialog(): void {
    this.fileInputRef()?.nativeElement.click();
  }

  /** Handle native file input change event */
  protected onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const newFiles = this.validateFiles(Array.from(input.files));
    this.addFiles(newFiles);

    // Reset the input so the same file can be selected again
    input.value = '';
  }

  // ── Drag and drop ──────────────────────────────
  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled()) {
      this.isDragOver.set(true);
    }
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    if (this.disabled()) return;

    const droppedFiles = event.dataTransfer?.files;
    if (!droppedFiles?.length) return;

    let incoming = Array.from(droppedFiles);
    if (!this.multiple()) {
      incoming = [incoming[0]];
    }

    const validated = this.validateFiles(incoming);
    this.addFiles(validated);
  }

  // ── File management ────────────────────────────
  protected onRemoveFile(file: File): void {
    this.files.update(current => current.filter(f => f !== file));
    this.removeFile.emit(file);
  }

  protected onClear(): void {
    this.files.set([]);
    this.clear.emit();
  }

  private addFiles(newFiles: File[]): void {
    if (newFiles.length === 0) return;

    if (this.multiple()) {
      this.files.update(current => [...current, ...newFiles]);
    } else {
      this.files.set([newFiles[0]]);
    }

    this.selectFiles.emit(this.files());
  }

  private validateFiles(files: File[]): File[] {
    return files.filter(file => {
      if (this.maxFileSize() > 0 && file.size > this.maxFileSize()) {
        return false;
      }
      if (this.accept()) {
        return this.matchesAccept(file);
      }
      return true;
    });
  }

  private matchesAccept(file: File): boolean {
    const patterns = this.accept().split(',').map(p => p.trim()).filter(Boolean);
    if (patterns.length === 0) return true;

    return patterns.some(pattern => {
      // Extension pattern like .pdf, .jpg
      if (pattern.startsWith('.')) {
        return file.name.toLowerCase().endsWith(pattern.toLowerCase());
      }
      // MIME pattern like image/*, application/pdf
      if (pattern.includes('/')) {
        if (pattern.endsWith('/*')) {
          const type = pattern.slice(0, -2);
          return file.type.startsWith(type + '/');
        }
        return file.type === pattern;
      }
      return false;
    });
  }
}
