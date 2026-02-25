import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { GlintIconComponent } from '../icon/icon.component';

/**
 * Simple rich text editor using `contenteditable` with a formatting toolbar.
 * Implements ControlValueAccessor — the value is an HTML string (innerHTML).
 *
 * @example
 * ```html
 * <glint-editor [formControl]="htmlCtrl" placeholder="Write something..." />
 * <glint-editor [(ngModel)]="html" [height]="'300px'" />
 * ```
 */
@Component({
  selector: 'glint-editor',
  standalone: true,
  imports: [GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.disabled]': 'isDisabled()',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      overflow: hidden;
    }

    :host(.disabled) {
      opacity: 0.6;
      pointer-events: none;
    }

    .editor-toolbar {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      padding: var(--glint-spacing-xs) var(--glint-spacing-sm);
      background: color-mix(in oklch, var(--glint-color-surface), var(--glint-color-border) 20%);
      border-block-end: 1px solid var(--glint-color-border);
      flex-wrap: wrap;
    }

    .toolbar-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-inline-size: 2rem;
      min-block-size: 2rem;
      padding: var(--glint-spacing-xs);
      border: none;
      border-radius: var(--glint-border-radius);
      background: transparent;
      color: var(--glint-color-text);
      font: inherit;
      font-size: 0.875em;
      cursor: pointer;
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .toolbar-btn:hover {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    .toolbar-btn:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .toolbar-separator {
      inline-size: 1px;
      block-size: 1.5rem;
      background: var(--glint-color-border);
      margin-inline: var(--glint-spacing-xs);
    }

    .editor-content {
      padding: var(--glint-spacing-md);
      outline: none;
      overflow: auto;
      background: var(--glint-color-surface);
    }

    .editor-content[contenteditable="true"]:empty::before {
      content: attr(data-placeholder);
      color: var(--glint-color-text-muted);
      pointer-events: none;
    }
  `,
  template: `
    @if (showToolbar() && !isDisabled() && !readonly()) {
      <div class="editor-toolbar" role="toolbar" aria-label="Formatting options">
        <button type="button" class="toolbar-btn" (click)="execCommand('bold')" title="Bold" aria-label="Bold">
          <strong>B</strong>
        </button>
        <button type="button" class="toolbar-btn" (click)="execCommand('italic')" title="Italic" aria-label="Italic">
          <em>I</em>
        </button>
        <button type="button" class="toolbar-btn" (click)="execCommand('underline')" title="Underline" aria-label="Underline">
          <u>U</u>
        </button>
        <span class="toolbar-separator"></span>
        <button type="button" class="toolbar-btn" (click)="execCommand('insertUnorderedList')" title="Bullet list" aria-label="Bullet list">
          &#8226;
        </button>
        <button type="button" class="toolbar-btn" (click)="execCommand('insertOrderedList')" title="Numbered list" aria-label="Numbered list">
          1.
        </button>
        <span class="toolbar-separator"></span>
        <button type="button" class="toolbar-btn" (click)="execCommand('formatBlock', 'H1')" title="Heading 1" aria-label="Heading 1">
          H1
        </button>
        <button type="button" class="toolbar-btn" (click)="execCommand('formatBlock', 'H2')" title="Heading 2" aria-label="Heading 2">
          H2
        </button>
        <button type="button" class="toolbar-btn" (click)="execCommand('formatBlock', 'H3')" title="Heading 3" aria-label="Heading 3">
          H3
        </button>
        <span class="toolbar-separator"></span>
        <button type="button" class="toolbar-btn" (click)="execCommand('removeFormat')" title="Clear formatting" aria-label="Clear formatting">
          <glint-icon name="x" />
        </button>
      </div>
    }
    <div
      #editorContent
      class="editor-content"
      [attr.contenteditable]="!isDisabled() && !readonly()"
      [style.min-block-size]="height()"
      [attr.data-placeholder]="placeholder()"
      (input)="onInput()"
      (blur)="onBlur()"
      role="textbox"
      aria-multiline="true"
      [attr.aria-readonly]="readonly() || null"
      [attr.aria-disabled]="isDisabled() || null"
    ></div>
  `,
})
export class GlintEditorComponent implements ControlValueAccessor {
  /** Disabled state */
  disabled = input(false);
  /** Readonly state */
  readonly = input(false);
  /** Placeholder text shown when editor is empty */
  placeholder = input('');
  /** Height of the editable area */
  height = input('200px');
  /** Whether to show the formatting toolbar */
  showToolbar = input(true);

  /** Emits HTML string on content change */
  textChange = output<string>();

  /** Internal value tracking */
  private value = signal('');

  /** Tracks disabled state driven by the CVA (FormControl) */
  private disabledFromCVA = signal(false);
  /** Merged disabled: either the input prop OR the CVA says disabled */
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  /** Reference to the contenteditable div */
  private editorRef = viewChild<ElementRef<HTMLDivElement>>('editorContent');

  /**
   * NgControl injected directly (no NG_VALUE_ACCESSOR provider needed).
   */
  private ngControl = inject(NgControl, { optional: true, self: true });

  private onChange: (val: string) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    // Write pending value to the contenteditable div once it's available
    afterRenderEffect({
      write: () => {
        const el = this.editorRef()?.nativeElement;
        if (el && this.pendingWrite !== null) {
          el.innerHTML = this.pendingWrite;
          this.pendingWrite = null;
        }
      },
    });
  }

  /** Queued value to write once the DOM element is available */
  private pendingWrite: string | null = null;

  // ── ControlValueAccessor ─────────────────────
  writeValue(val: string | null): void {
    const html = val ?? '';
    this.value.set(html);
    const el = this.editorRef()?.nativeElement;
    if (el) {
      el.innerHTML = html;
    } else {
      this.pendingWrite = html;
    }
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromCVA.set(isDisabled);
  }

  // ── Formatting commands ─────────────────────
  execCommand(command: string, value?: string): void {
    document.execCommand(command, false, value);
    this.readContent();
  }

  // ── Event handlers ──────────────────────────
  protected onInput(): void {
    this.readContent();
  }

  protected onBlur(): void {
    this.onTouched();
  }

  /** Read innerHTML from the contenteditable div and propagate */
  private readContent(): void {
    const el = this.editorRef()?.nativeElement;
    if (!el) return;
    const html = el.innerHTML;
    this.value.set(html);
    this.onChange(html);
    this.textChange.emit(html);
  }
}
