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
import { CascadeSelectPanelComponent } from './cascade-select-panel.component';
import type { GlintMenuItem } from '../menu/menu-item.model';

let nextId = 0;

/**
 * Cascading dropdown where selecting an item with children opens a nested panel.
 * Supports CVA for reactive forms.
 *
 * @example
 * ```html
 * <glint-cascade-select
 *   [options]="categories"
 *   placeholder="Select category"
 *   [formControl]="categoryCtrl"
 * />
 * ```
 */
@Component({
  selector: 'glint-cascade-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: inline-block',
    '[class.open]': 'isOpen()',
    '[class.disabled]': 'isDisabled()',
  },
  styles: `
    :host {
      position: relative;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .cascade-select-trigger {
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

    .cascade-select-trigger:hover:not(.disabled) {
      border-color: color-mix(in oklch, var(--glint-color-border), black 15%);
    }

    .cascade-select-trigger:focus-visible:not(.disabled) {
      border-color: var(--glint-color-focus-ring);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-focus-ring), transparent 70%);
    }

    :host(.open) .cascade-select-trigger {
      border-color: var(--glint-color-primary);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-primary), transparent 70%);
    }

    :host(.disabled) .cascade-select-trigger,
    .cascade-select-trigger.disabled {
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    }

    .cascade-value {
      flex: 1;
      min-inline-size: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .cascade-value.placeholder {
      color: var(--glint-color-text-muted);
    }

    .cascade-caret {
      flex-shrink: 0;
      font-size: 0.75em;
      transition: transform var(--glint-duration-fast) var(--glint-easing);
    }

    :host(.open) .cascade-caret {
      transform: rotate(180deg);
    }
  `,
  template: `
    <div
      class="cascade-select-trigger"
      #triggerEl
      (click)="togglePanel()"
      [class.disabled]="isDisabled()"
      tabindex="0"
      role="combobox"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-controls]="panelId"
      (keydown)="onTriggerKeydown($event)"
    >
      @if (selectedItem()) {
        <span class="cascade-value">{{ selectedItem()!.label }}</span>
      } @else {
        <span class="cascade-value placeholder">{{ placeholder() }}</span>
      }
      <span class="cascade-caret" aria-hidden="true">&#9662;</span>
    </div>
  `,
})
export class GlintCascadeSelectComponent implements ControlValueAccessor {
  /** Hierarchical menu options */
  options = input.required<GlintMenuItem[]>();
  /** Property name used as the option label */
  optionLabel = input('label');
  /** Placeholder text */
  placeholder = input('Select...');
  /** Disabled state from template */
  disabled = input(false);

  readonly panelId = `glint-cascade-select-panel-${nextId++}`;

  /** Currently selected leaf item */
  readonly selectedItem = signal<GlintMenuItem | null>(null);
  /** Whether the panel is open */
  readonly isOpen = signal(false);

  private triggerEl = viewChild.required<ElementRef<HTMLElement>>('triggerEl');
  private overlayService = inject(ZoneAwareOverlayService);
  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  private overlayRef: OverlayRef | null = null;
  private panelInstance: CascadeSelectPanelComponent | null = null;

  /** CVA disabled state */
  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  private ngControl = inject(NgControl, { optional: true, self: true });
  private onChange: (value: unknown) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.destroyRef.onDestroy(() => this.closePanel());
  }

  // ── ControlValueAccessor ────────────────────────

  writeValue(value: unknown): void {
    if (value == null) {
      this.selectedItem.set(null);
      return;
    }
    // Find item by label match in the hierarchical tree
    const found = this.findItemByLabel(this.options(), value as string);
    this.selectedItem.set(found);
  }

  registerOnChange(fn: (value: unknown) => void): void {
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
      width: triggerEl.offsetWidth,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    const { overlayRef, injector } = this.overlayService.createZoneAwareOverlay(
      config,
      this.injector
    );

    this.overlayRef = overlayRef;

    const portal = new ComponentPortal(CascadeSelectPanelComponent, null, injector);
    const ref = overlayRef.attach(portal);
    this.panelInstance = ref.instance;
    ref.instance.items.set(this.options());
    ref.instance.itemSelected.subscribe((item: GlintMenuItem) => {
      this.selectItem(item);
    });

    this.isOpen.set(true);

    // Close on backdrop click
    overlayRef.backdropClick().subscribe(() => this.closePanel());
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
    this.panelInstance?.closeSubPanel();
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.panelInstance = null;
    this.isOpen.set(false);
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

  // ── Private helpers ─────────────────────────────

  private selectItem(item: GlintMenuItem): void {
    this.selectedItem.set(item);
    this.onChange(item.label);
    this.onTouched();
    this.closePanel();
  }

  private findItemByLabel(items: GlintMenuItem[], label: string): GlintMenuItem | null {
    for (const item of items) {
      if (item.label === label) return item;
      if (item.items) {
        const found = this.findItemByLabel(item.items, label);
        if (found) return found;
      }
    }
    return null;
  }
}
