import {
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

/**
 * Circular knob/dial component with CVA support.
 * Renders an SVG arc that can be adjusted via pointer drag or keyboard.
 *
 * @example
 * ```html
 * <glint-knob [formControl]="volumeCtrl" />
 * <glint-knob [min]="0" [max]="360" [step]="15" [size]="120" />
 * ```
 */
@Component({
  selector: 'glint-knob',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.disabled]': 'isDisabled()',
    'style': 'display: inline-block',
  },
  styles: `
    :host {
      font-family: var(--glint-font-family);
    }

    :host(.disabled) {
      opacity: 0.5;
      pointer-events: none;
    }

    svg {
      outline: none;
    }

    svg:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
      border-radius: 50%;
    }

    .knob-track {
      fill: none;
      stroke: var(--glint-color-border);
    }

    .knob-value {
      fill: none;
      stroke: var(--glint-color-primary);
      transition: stroke-dashoffset var(--glint-duration-normal) var(--glint-easing);
    }

    .knob-text {
      fill: var(--glint-color-text);
      font-family: var(--glint-font-family);
      text-anchor: middle;
      dominant-baseline: central;
    }
  `,
  template: `
    <svg
      #svgEl
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.viewBox]="viewBox()"
      tabindex="0"
      role="slider"
      [attr.aria-valuenow]="value()"
      [attr.aria-valuemin]="min()"
      [attr.aria-valuemax]="max()"
      [attr.aria-disabled]="isDisabled() || null"
      (pointerdown)="onPointerDown($event)"
      (keydown)="onKeyDown($event)"
    >
      <circle
        class="knob-track"
        [attr.cx]="center()"
        [attr.cy]="center()"
        [attr.r]="radius()"
        [attr.stroke-width]="strokeWidth()"
        [attr.stroke-dasharray]="arcLength()"
        [attr.stroke-dashoffset]="trackDashOffset()"
        [attr.transform]="arcTransform()"
      />
      <circle
        class="knob-value"
        [attr.cx]="center()"
        [attr.cy]="center()"
        [attr.r]="radius()"
        [attr.stroke-width]="strokeWidth()"
        [attr.stroke-dasharray]="arcLength()"
        [attr.stroke-dashoffset]="valueDashOffset()"
        [attr.transform]="arcTransform()"
        stroke-linecap="round"
      />
      @if (showValue()) {
        <text
          class="knob-text"
          [attr.x]="center()"
          [attr.y]="center()"
          [attr.font-size]="fontSize()"
        >{{ formattedValue() }}</text>
      }
    </svg>
  `,
})
export class GlintKnobComponent implements ControlValueAccessor {
  /** Minimum value */
  min = input(0);
  /** Maximum value */
  max = input(100);
  /** Step increment */
  step = input(1);
  /** Diameter of the knob in px */
  size = input(100);
  /** Stroke width of the arc */
  strokeWidth = input(14);
  /** Show numeric value in center */
  showValue = input(true);
  /** Format string for center text — {value} is replaced with current value */
  valueTemplate = input('{value}');
  /** Disabled state */
  disabled = input(false);
  /** Read-only state */
  readonly = input(false);

  /** Emits the current value on change */
  valueChange = output<number>();

  protected value = signal(0);

  private svgRef = viewChild<ElementRef<SVGElement>>('svgEl');

  private ngControl = inject(NgControl, { self: true, optional: true });
  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  private onChange: (val: number) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  private tracking = false;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  // ── Computed layout values ──────────────────
  protected viewBox = computed(() => `0 0 ${this.size()} ${this.size()}`);
  protected center = computed(() => this.size() / 2);
  protected radius = computed(() => (this.size() - this.strokeWidth()) / 2);

  /** Total arc length = 270deg out of 360deg */
  private readonly ARC_DEGREES = 270;
  protected arcLength = computed(() => {
    const circumference = 2 * Math.PI * this.radius();
    return circumference;
  });

  /** The arc covers 270/360 of the circle. The remainder is the gap. */
  protected trackDashOffset = computed(() => {
    const circumference = this.arcLength();
    const arcPortion = this.ARC_DEGREES / 360;
    return circumference * (1 - arcPortion);
  });

  /** Rotation so the arc starts at bottom-left (135deg from top) */
  protected arcTransform = computed(() => {
    const c = this.center();
    return `rotate(135 ${c} ${c})`;
  });

  /** Dash offset for the value arc based on current value percentage */
  protected valueDashOffset = computed(() => {
    const circumference = this.arcLength();
    const arcPortion = this.ARC_DEGREES / 360;
    const usable = circumference * arcPortion;
    const range = this.max() - this.min();
    const pct = range <= 0 ? 0 : (this.value() - this.min()) / range;
    // offset = full arc minus filled portion + the gap
    return circumference - usable * pct;
  });

  protected fontSize = computed(() => this.size() * 0.22);

  protected formattedValue = computed(() =>
    this.valueTemplate().replace('{value}', String(this.value()))
  );

  // ── ControlValueAccessor ──────────────────────
  writeValue(val: number | null): void {
    this.value.set(val ?? this.min());
  }

  registerOnChange(fn: (val: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabledFromCVA.set(disabled);
  }

  // ── Pointer interaction ───────────────────────
  protected onPointerDown(event: PointerEvent): void {
    if (this.isDisabled() || this.readonly()) return;

    this.tracking = true;
    const svg = this.svgRef()?.nativeElement;
    if (!svg) return;

    svg.setPointerCapture(event.pointerId);
    this.updateValueFromPointer(event);

    const onMove = (e: PointerEvent) => {
      if (!this.tracking) return;
      this.updateValueFromPointer(e);
    };

    const onUp = () => {
      this.tracking = false;
      this.onTouched();
      svg.removeEventListener('pointermove', onMove);
      svg.removeEventListener('pointerup', onUp);
    };

    svg.addEventListener('pointermove', onMove);
    svg.addEventListener('pointerup', onUp);
  }

  private updateValueFromPointer(event: PointerEvent): void {
    const svg = this.svgRef()?.nativeElement;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;

    // atan2 returns angle from positive x-axis, in radians
    // Convert to degrees from top (12 o'clock)
    let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angleDeg < 0) angleDeg += 360;

    // Our arc starts at 135deg (from top, clockwise) and spans 270deg
    // Normalize to arc space: 0 at start (135deg from top), 270 at end
    const startAngle = 135;
    let arcAngle = angleDeg - startAngle;
    if (arcAngle < 0) arcAngle += 360;

    // Clamp: if the angle falls in the dead zone (270..360), snap to nearest end
    if (arcAngle > this.ARC_DEGREES) {
      const midDeadZone = this.ARC_DEGREES + (360 - this.ARC_DEGREES) / 2;
      arcAngle = arcAngle < midDeadZone ? this.ARC_DEGREES : 0;
    }

    const pct = arcAngle / this.ARC_DEGREES;
    const range = this.max() - this.min();
    const raw = this.min() + pct * range;
    const stepped = this.snap(raw);
    this.setValue(stepped);
  }

  // ── Keyboard interaction ──────────────────────
  protected onKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled() || this.readonly()) return;

    let handled = true;
    const s = this.step();

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        this.setValue(this.snap(this.value() + s));
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        this.setValue(this.snap(this.value() - s));
        break;
      case 'Home':
        this.setValue(this.min());
        break;
      case 'End':
        this.setValue(this.max());
        break;
      default:
        handled = false;
    }

    if (handled) {
      event.preventDefault();
      this.onTouched();
    }
  }

  // ── Helpers ──────────────────────────────────
  private snap(raw: number): number {
    const s = this.step();
    const min = this.min();
    return Math.round((raw - min) / s) * s + min;
  }

  private clamp(val: number): number {
    return Math.min(this.max(), Math.max(this.min(), val));
  }

  private setValue(raw: number): void {
    const clamped = this.clamp(raw);
    if (clamped === this.value()) return;
    this.value.set(clamped);
    this.onChange(clamped);
    this.valueChange.emit(clamped);
  }
}
