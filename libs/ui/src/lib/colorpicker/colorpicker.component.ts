import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';

// ── Color math helpers ────────────────────────────────────

/** HSB representation: h 0-360, s 0-100, b 0-100 */
export interface HSB {
  h: number;
  s: number;
  b: number;
}

/** RGB representation: r/g/b 0-255 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/** HSL representation: h 0-360, s 0-100, l 0-100 */
export interface HSL {
  h: number;
  s: number;
  l: number;
}

export function hsbToRgb(hsb: HSB): RGB {
  const h = hsb.h / 60;
  const s = hsb.s / 100;
  const b = hsb.b / 100;

  const c = b * s;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = b - c;

  let r1 = 0, g1 = 0, b1 = 0;

  if (h >= 0 && h < 1) { r1 = c; g1 = x; b1 = 0; }
  else if (h >= 1 && h < 2) { r1 = x; g1 = c; b1 = 0; }
  else if (h >= 2 && h < 3) { r1 = 0; g1 = c; b1 = x; }
  else if (h >= 3 && h < 4) { r1 = 0; g1 = x; b1 = c; }
  else if (h >= 4 && h < 5) { r1 = x; g1 = 0; b1 = c; }
  else { r1 = c; g1 = 0; b1 = x; }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace(/^#/, '');
  let r: number, g: number, b: number;

  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  } else {
    return null;
  }

  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

export function rgbToHsb(rgb: RGB): HSB {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : (delta / max) * 100;
  const brightness = max * 100;

  return { h, s, b: brightness };
}

export function hsbToHex(hsb: HSB): string {
  return rgbToHex(hsbToRgb(hsb));
}

export function hexToHsb(hex: string): HSB {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsb(rgb) : { h: 0, s: 100, b: 100 };
}

export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function formatColor(hsb: HSB, format: 'hex' | 'rgb' | 'hsl'): string {
  switch (format) {
    case 'hex':
      return hsbToHex(hsb);
    case 'rgb': {
      const { r, g, b } = hsbToRgb(hsb);
      return `rgb(${r}, ${g}, ${b})`;
    }
    case 'hsl': {
      const { h, s, l } = rgbToHsl(hsbToRgb(hsb));
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
  }
}

// ── Component ─────────────────────────────────────────────

let nextId = 0;

/**
 * Color picker with saturation/brightness gradient, hue strip, and hex input.
 * Supports overlay and inline modes with full CVA integration.
 *
 * @example
 * ```html
 * <glint-colorpicker [formControl]="colorCtrl" />
 * <glint-colorpicker [inline]="true" [format]="'rgb'" />
 * ```
 */
@Component({
  selector: 'glint-colorpicker',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.disabled]': 'isDisabled()',
    '[class.inline]': 'inline()',
  },
  styles: `
    :host {
      display: inline-block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .swatch-trigger {
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      padding: var(--glint-spacing-xs);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      cursor: pointer;
      transition:
        border-color var(--glint-duration-normal) var(--glint-easing),
        box-shadow var(--glint-duration-normal) var(--glint-easing);
    }

    .swatch-trigger:hover {
      border-color: color-mix(in oklch, var(--glint-color-border), var(--glint-color-text) 25%);
    }

    .swatch-trigger:focus-visible {
      outline: none;
      border-color: var(--glint-color-focus-ring);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-focus-ring), transparent 70%);
    }

    :host(.disabled) .swatch-trigger {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .swatch-preview {
      inline-size: 1.75rem;
      block-size: 1.75rem;
      border-radius: calc(var(--glint-border-radius) - 2px);
      border: 1px solid rgb(0 0 0 / 0.1);
    }

    .panel {
      background: var(--glint-color-surface);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      box-shadow: var(--glint-shadow);
      padding: var(--glint-spacing-md);
      inline-size: 260px;
      display: flex;
      flex-direction: column;
      gap: var(--glint-spacing-sm);
    }

    :host(.inline) .panel {
      border: 1px solid var(--glint-color-border);
      box-shadow: none;
    }

    .gradient-area {
      position: relative;
      inline-size: 100%;
      block-size: 160px;
      border-radius: calc(var(--glint-border-radius) - 2px);
      cursor: crosshair;
      touch-action: none;
      overflow: hidden;
    }

    .gradient-area .white-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to right, #fff, transparent);
    }

    .gradient-area .black-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent, #000);
    }

    .gradient-pointer {
      position: absolute;
      inline-size: 14px;
      block-size: 14px;
      border: 2px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 0 1px rgb(0 0 0 / 0.3), inset 0 0 0 1px rgb(0 0 0 / 0.3);
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    .hue-strip {
      position: relative;
      inline-size: 100%;
      block-size: 14px;
      border-radius: 7px;
      background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
      cursor: pointer;
      touch-action: none;
    }

    .hue-thumb {
      position: absolute;
      inset-block-start: 50%;
      inline-size: 14px;
      block-size: 14px;
      border: 2px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 2px rgb(0 0 0 / 0.4);
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    .controls-row {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
    }

    .color-preview {
      inline-size: 2rem;
      block-size: 2rem;
      border-radius: calc(var(--glint-border-radius) - 2px);
      border: 1px solid rgb(0 0 0 / 0.1);
      flex-shrink: 0;
    }

    .hex-input {
      flex: 1;
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      font-family: var(--glint-font-family);
      font-size: 0.8125rem;
      padding-block: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-sm);
      outline: none;
      transition: border-color var(--glint-duration-fast) var(--glint-easing);
    }

    .hex-input:focus {
      border-color: var(--glint-color-focus-ring);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-focus-ring), transparent 70%);
    }
  `,
  template: `
    @if (!inline()) {
      <button
        class="swatch-trigger"
        type="button"
        #triggerEl
        [attr.aria-label]="'Color picker, current color: ' + currentHex()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="'dialog'"
        [disabled]="isDisabled()"
        (click)="toggle()"
      >
        <span class="swatch-preview" [style.background]="currentHex()"></span>
      </button>
    }

    @if (inline()) {
      <ng-container [ngTemplateOutlet]="panelTemplate" />
    }

    <ng-template #panelTemplate>
      <div
        class="panel"
        role="application"
        aria-label="Color picker"
        (keydown)="onPanelKeydown($event)"
      >
        <!-- Saturation/Brightness gradient -->
        <div
          class="gradient-area"
          #gradientEl
          [style.background]="hueBackground()"
          (pointerdown)="onGradientPointerDown($event)"
        >
          <div class="white-overlay"></div>
          <div class="black-overlay"></div>
          <div
            class="gradient-pointer"
            [style.left.%]="hsb().s"
            [style.top.%]="100 - hsb().b"
          ></div>
        </div>

        <!-- Hue strip -->
        <div
          class="hue-strip"
          #hueEl
          aria-label="Hue"
          (pointerdown)="onHuePointerDown($event)"
        >
          <div
            class="hue-thumb"
            [style.left.%]="(hsb().h / 360) * 100"
          ></div>
        </div>

        <!-- Hex input + preview swatch -->
        <div class="controls-row">
          <div class="color-preview" [style.background]="currentHex()"></div>
          <input
            class="hex-input"
            type="text"
            aria-label="Hex color value"
            [value]="currentHex()"
            (keydown.enter)="onHexInput($event)"
            (blur)="onHexInput($event)"
          />
        </div>
      </div>
    </ng-template>
  `,
})
export class GlintColorPickerComponent implements ControlValueAccessor {
  /** Disabled state */
  disabled = input(false);
  /** Show panel inline (no overlay) */
  inline = input(false);
  /** Output color format */
  format = input<'hex' | 'rgb' | 'hsl'>('hex');

  /** Emits formatted color string on change */
  colorChange = output<string>();

  readonly componentId = `glint-colorpicker-${nextId++}`;

  /** Internal HSB state */
  protected hsb = signal<HSB>({ h: 0, s: 100, b: 100 });
  /** Whether the overlay panel is open */
  readonly isOpen = signal(false);

  protected currentHex = computed(() => hsbToHex(this.hsb()));
  protected hueBackground = computed(() => {
    const { h } = this.hsb();
    return hsbToHex({ h, s: 100, b: 100 });
  });
  protected formattedColor = computed(() => formatColor(this.hsb(), this.format()));

  // ── CVA ─────────────────────────────────────────
  private ngControl = inject(NgControl, { self: true, optional: true });
  private disabledFromCVA = signal(false);
  protected isDisabled = computed(() => this.disabled() || this.disabledFromCVA());
  private onChange: (val: string) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  // ── Overlay ─────────────────────────────────────
  private overlayService = inject(ZoneAwareOverlayService);
  private injector = inject(Injector);
  private vcr = inject(ViewContainerRef);
  private destroyRef = inject(DestroyRef);
  private overlayRef: OverlayRef | null = null;

  private triggerEl = viewChild<ElementRef<HTMLElement>>('triggerEl');
  private panelTemplate = viewChild.required<TemplateRef<unknown>>('panelTemplate');

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.destroyRef.onDestroy(() => this.closePanel());
  }

  // ── ControlValueAccessor ────────────────────────

  writeValue(val: string | null): void {
    if (val) {
      // Try to parse the incoming value as hex
      const rgb = hexToRgb(val);
      if (rgb) {
        this.hsb.set(rgbToHsb(rgb));
      }
    }
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabledFromCVA.set(disabled);
  }

  // ── Open / Close ────────────────────────────────

  toggle(): void {
    if (this.isDisabled()) return;
    if (this.isOpen()) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  openPanel(): void {
    if (this.isOpen() || this.isDisabled() || this.inline()) return;

    const trigger = this.triggerEl()?.nativeElement;
    if (!trigger) return;

    const config = new OverlayConfig({
      positionStrategy: this.overlayService
        .position()
        .flexibleConnectedTo(trigger)
        .withPositions([
          { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
          { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
        ])
        .withPush(true),
      scrollStrategy: this.overlayService.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    const { overlayRef, injector } = this.overlayService.createZoneAwareOverlay(
      config,
      this.injector
    );

    this.overlayRef = overlayRef;

    const portal = new TemplatePortal(this.panelTemplate(), this.vcr, undefined, injector);
    overlayRef.attach(portal);

    this.isOpen.set(true);

    overlayRef.backdropClick().subscribe(() => this.closePanel());
    overlayRef.keydownEvents().subscribe((e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closePanel();
        this.triggerEl()?.nativeElement.focus();
      }
    });
  }

  closePanel(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.isOpen.set(false);
  }

  // ── Panel keyboard ─────────────────────────────

  protected onPanelKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.inline()) {
      // inline mode — just blur
      (event.target as HTMLElement)?.blur();
    }
  }

  // ── Gradient (Saturation/Brightness) ────────────

  protected onGradientPointerDown(event: PointerEvent): void {
    if (this.isDisabled()) return;
    const el = event.currentTarget as HTMLElement;
    el.setPointerCapture(event.pointerId);
    this.updateGradientFromEvent(event, el);

    const onMove = (e: PointerEvent) => this.updateGradientFromEvent(e, el);
    const onUp = () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      this.onTouched();
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
  }

  private updateGradientFromEvent(event: PointerEvent, el: HTMLElement): void {
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));

    const s = rect.width > 0 ? (x / rect.width) * 100 : 0;
    const b = rect.height > 0 ? 100 - (y / rect.height) * 100 : 100;

    this.hsb.update(current => ({ ...current, s, b }));
    this.emitChange();
  }

  // ── Hue strip ───────────────────────────────────

  protected onHuePointerDown(event: PointerEvent): void {
    if (this.isDisabled()) return;
    const el = event.currentTarget as HTMLElement;
    el.setPointerCapture(event.pointerId);
    this.updateHueFromEvent(event, el);

    const onMove = (e: PointerEvent) => this.updateHueFromEvent(e, el);
    const onUp = () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      this.onTouched();
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
  }

  private updateHueFromEvent(event: PointerEvent, el: HTMLElement): void {
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const h = rect.width > 0 ? (x / rect.width) * 360 : 0;

    this.hsb.update(current => ({ ...current, h }));
    this.emitChange();
  }

  // ── Hex input ───────────────────────────────────

  protected onHexInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.trim();
    if (!val.startsWith('#')) val = '#' + val;
    const rgb = hexToRgb(val);
    if (rgb) {
      this.hsb.set(rgbToHsb(rgb));
      this.emitChange();
    } else {
      // Revert to current value
      input.value = this.currentHex();
    }
  }

  // ── Emit ────────────────────────────────────────

  private emitChange(): void {
    const formatted = this.formattedColor();
    this.onChange(formatted);
    this.colorChange.emit(formatted);
  }
}
