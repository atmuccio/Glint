import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import { TreeSelectPanelComponent } from './tree-select-panel.component';
import type { GlintTreeNode } from '../core/tree/tree-node.model';

let treeSelectNextId = 0;

/**
 * Tree select dropdown component with ControlValueAccessor support.
 *
 * Displays a trigger that opens an overlay containing a tree view.
 * Supports single, multiple, and checkbox selection modes.
 *
 * @example
 * ```html
 * <glint-tree-select
 *   [options]="treeData"
 *   placeholder="Select a node"
 *   [formControl]="treeCtrl"
 * />
 *
 * <glint-tree-select
 *   [options]="treeData"
 *   selectionMode="checkbox"
 *   [filter]="true"
 *   [(ngModel)]="selectedNodes"
 * />
 * ```
 */
@Component({
  selector: 'glint-tree-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': '"inline-block"',
    '[class.open]': 'isOpen()',
    '[class.disabled]': 'isDisabled()',
  },
  styles: `
    :host {
      position: relative;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .tree-select-trigger {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      cursor: pointer;
      outline: none;
      min-block-size: 2.5rem;
      min-inline-size: 12rem;
      transition:
        border-color var(--glint-duration-normal) var(--glint-easing),
        box-shadow var(--glint-duration-normal) var(--glint-easing),
        background-color var(--glint-duration-normal) var(--glint-easing);
    }

    .tree-select-trigger:hover:not(.disabled) {
      border-color: color-mix(in oklch, var(--glint-color-border), black 15%);
    }

    .tree-select-trigger:focus-visible:not(.disabled) {
      border-color: var(--glint-color-focus-ring);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-focus-ring), transparent 70%);
    }

    :host(.open) .tree-select-trigger {
      border-color: var(--glint-color-primary);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-primary), transparent 70%);
    }

    .tree-select-trigger.disabled {
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    }

    .tree-select-label {
      flex: 1;
      min-inline-size: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tree-select-label.placeholder {
      color: var(--glint-color-text-muted);
    }

    .tree-select-caret {
      flex-shrink: 0;
      font-size: 0.75em;
      transition: transform var(--glint-duration-fast) var(--glint-easing);
    }

    :host(.open) .tree-select-caret {
      transform: rotate(180deg);
    }
  `,
  template: `
    <div
      #triggerEl
      class="tree-select-trigger"
      [class.disabled]="isDisabled()"
      tabindex="0"
      role="combobox"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'tree'"
      [attr.aria-controls]="panelId"
      [attr.aria-disabled]="isDisabled() || null"
      (click)="togglePanel()"
      (keydown)="onTriggerKeydown($event)"
    >
      @if (hasSelection()) {
        <span class="tree-select-label">{{ displayLabel() }}</span>
      } @else {
        <span class="tree-select-label placeholder">{{ placeholder() }}</span>
      }
      <span class="tree-select-caret" aria-hidden="true">&#9662;</span>
    </div>
  `,
})
export class GlintTreeSelectComponent implements ControlValueAccessor {
  /** Tree data to display in the panel */
  options = input.required<GlintTreeNode[]>();
  /** Selection mode */
  selectionMode = input<'single' | 'multiple' | 'checkbox'>('single');
  /** Placeholder text when no value selected */
  placeholder = input('Select...');
  /** Whether to show a filter input in the panel */
  filter = input(false);
  /** Disabled state from template */
  disabled = input(false);

  readonly panelId = `glint-tree-select-panel-${treeSelectNextId++}`;

  /** Whether the panel is open */
  readonly isOpen = signal(false);
  /** Currently selected nodes */
  readonly selectedNodes = signal<GlintTreeNode[]>([]);
  /** Filter text */
  readonly filterText = signal('');

  private triggerEl = viewChild.required<ElementRef<HTMLElement>>('triggerEl');

  private overlayService = inject(ZoneAwareOverlayService);
  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  /** CVA disabled state */
  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  private ngControl = inject(NgControl, { optional: true, self: true });
  private onChange: (value: GlintTreeNode | GlintTreeNode[] | null) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  private overlayRef: OverlayRef | null = null;

  /** Whether there are selected nodes */
  hasSelection = computed(() => this.selectedNodes().length > 0);

  /** Display label for the trigger */
  displayLabel = computed(() => {
    const selected = this.selectedNodes();
    if (selected.length === 0) return '';
    return selected.map(n => n.label ?? '').join(', ');
  });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.destroyRef.onDestroy(() => this.closePanel());
  }

  // ── ControlValueAccessor ────────────────────────

  writeValue(value: GlintTreeNode | GlintTreeNode[] | null): void {
    if (value == null) {
      this.selectedNodes.set([]);
    } else if (Array.isArray(value)) {
      this.selectedNodes.set(value);
    } else {
      this.selectedNodes.set([value]);
    }
  }

  registerOnChange(fn: (value: GlintTreeNode | GlintTreeNode[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromCVA.set(isDisabled);
  }

  // ── Open / Close ────────────────────────────────

  togglePanel(): void {
    if (this.isDisabled()) return;
    if (this.isOpen()) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  openPanel(): void {
    if (this.isOpen() || this.isDisabled()) return;

    const triggerEl = this.triggerEl().nativeElement;

    const config = new OverlayConfig({
      positionStrategy: this.overlayService
        .position()
        .flexibleConnectedTo(triggerEl)
        .withPositions([
          { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
          { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
        ])
        .withPush(true),
      scrollStrategy: this.overlayService.scrollStrategies.reposition(),
      width: Math.max(triggerEl.offsetWidth, 200),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    const { overlayRef, injector } = this.overlayService.createZoneAwareOverlay(
      config,
      this.injector
    );

    this.overlayRef = overlayRef;

    const portal = new ComponentPortal(TreeSelectPanelComponent, null, injector);
    const ref = overlayRef.attach(portal);

    // Configure panel
    ref.instance.options.set(this.options());
    ref.instance.showFilter.set(this.filter());
    ref.instance.selectionMode.set(this.selectionMode());
    ref.instance.selectedKeys.set(this.buildSelectedKeys());

    // Subscribe to node selection
    ref.instance.nodeSelected.subscribe((node: GlintTreeNode) => {
      this.handleNodeSelection(node);
      // Update panel's selected keys after selection
      ref.instance.selectedKeys.set(this.buildSelectedKeys());
    });

    this.isOpen.set(true);

    // Close on backdrop click
    overlayRef.backdropClick().subscribe(() => this.closePanel());

    // Close on Escape key
    overlayRef.keydownEvents().subscribe((e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closePanel();
        this.triggerEl().nativeElement.focus();
      }
    });
  }

  closePanel(): void {
    if (!this.isOpen()) return;
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.isOpen.set(false);
    this.filterText.set('');
  }

  // ── Keyboard ────────────────────────────────────

  onTriggerKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.openPanel();
        }
        break;
      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.closePanel();
          this.triggerEl().nativeElement.focus();
        }
        break;
    }
  }

  // ── Selection logic ─────────────────────────────

  private handleNodeSelection(node: GlintTreeNode): void {
    const mode = this.selectionMode();

    if (mode === 'single') {
      this.selectedNodes.set([node]);
      this.onChange(node);
      this.onTouched();
      this.closePanel();
    } else {
      // multiple or checkbox
      const key = this.getNodeKey(node);
      const current = this.selectedNodes();
      const idx = current.findIndex(n => this.getNodeKey(n) === key);

      if (idx >= 0) {
        this.selectedNodes.set(current.filter((_, i) => i !== idx));
      } else {
        this.selectedNodes.set([...current, node]);
      }

      const selected = this.selectedNodes();
      this.onChange(selected.length > 0 ? selected : null);
      this.onTouched();
    }
  }

  private buildSelectedKeys(): Set<string> {
    return new Set(this.selectedNodes().map(n => this.getNodeKey(n)));
  }

  private getNodeKey(node: GlintTreeNode): string {
    return node.key ?? node.label ?? '';
  }
}
