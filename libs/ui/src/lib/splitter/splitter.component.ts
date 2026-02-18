import {
  ChangeDetectionStrategy,
  Component,
  computed,
  AfterContentChecked,
  AfterContentInit,
  contentChildren,
  ElementRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

/**
 * Panel component used inside `<glint-splitter>` to define resizable regions.
 *
 * Wraps projected content in an `<ng-template>` for lazy rendering by the parent splitter.
 *
 * @example
 * ```html
 * <glint-splitter>
 *   <glint-splitter-panel [size]="30">Left</glint-splitter-panel>
 *   <glint-splitter-panel [size]="70">Right</glint-splitter-panel>
 * </glint-splitter>
 * ```
 */
@Component({
  selector: 'glint-splitter-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: block; overflow: auto;',
  },
  template: `
    <ng-template #content>
      <ng-content />
    </ng-template>
  `,
})
export class GlintSplitterPanelComponent {
  /** Initial percentage size of this panel (0-100). If omitted, panels share space equally. */
  size = input<number | undefined>(undefined);

  /** Minimum percentage size of this panel. */
  minSize = input(0);

  /** Template outlet for rendering by parent splitter. */
  contentTemplate = viewChild.required<TemplateRef<unknown>>('content');
}

/**
 * Splitter component that provides resizable panels with draggable gutters.
 *
 * Discovers projected `<glint-splitter-panel>` children via `contentChildren`
 * and renders them with interleaved gutter handles for resizing.
 *
 * @example
 * ```html
 * <glint-splitter layout="horizontal" [gutterSize]="4">
 *   <glint-splitter-panel [size]="30" [minSize]="10">Left</glint-splitter-panel>
 *   <glint-splitter-panel [size]="70" [minSize]="20">Right</glint-splitter-panel>
 * </glint-splitter>
 * ```
 */
@Component({
  selector: 'glint-splitter',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: flex; width: 100%; height: 100%; overflow: hidden;',
    '[style.flex-direction]': 'layout() === "vertical" ? "column" : "row"',
  },
  styles: `
    .splitter-panel {
      display: block;
      overflow: auto;
      flex-shrink: 0;
      flex-grow: 0;
    }

    .splitter-gutter {
      flex-shrink: 0;
      flex-grow: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--glint-color-border);
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
      touch-action: none;
      user-select: none;
    }

    .splitter-gutter:hover,
    .splitter-gutter:focus-visible {
      background: color-mix(in oklch, var(--glint-color-border), var(--glint-color-text) 15%);
    }

    .splitter-gutter:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .splitter-gutter.horizontal {
      cursor: col-resize;
      flex-direction: column;
      gap: 2px;
    }

    .splitter-gutter.vertical {
      cursor: row-resize;
      flex-direction: row;
      gap: 2px;
    }

    .grip-dot {
      border-radius: 50%;
      background: color-mix(in oklch, var(--glint-color-text), transparent 60%);
    }

    .horizontal .grip-dot {
      width: 2px;
      height: 2px;
    }

    .vertical .grip-dot {
      width: 2px;
      height: 2px;
    }
  `,
  template: `
    @for (panel of panels(); track $index; let i = $index; let last = $last) {
      <div
        class="splitter-panel"
        [style.flex-basis]="panelBasis()(i)"
      >
        <ng-container [ngTemplateOutlet]="panel.contentTemplate()" />
      </div>
      @if (!last) {
        <div
          class="splitter-gutter"
          [class.horizontal]="layout() === 'horizontal'"
          [class.vertical]="layout() === 'vertical'"
          [style.width]="layout() === 'horizontal' ? gutterSize() + 'px' : '100%'"
          [style.height]="layout() === 'vertical' ? gutterSize() + 'px' : '100%'"
          role="separator"
          [attr.aria-orientation]="layout() === 'horizontal' ? 'vertical' : 'horizontal'"
          [attr.aria-valuenow]="panelSizes()[i]"
          [attr.aria-valuemin]="panels()[i].minSize()"
          [attr.aria-valuemax]="100 - panels()[i + 1].minSize()"
          tabindex="0"
          (pointerdown)="onGutterPointerDown($event, i)"
          (keydown)="onGutterKeydown($event, i)"
        >
          <span class="grip-dot" aria-hidden="true"></span>
          <span class="grip-dot" aria-hidden="true"></span>
          <span class="grip-dot" aria-hidden="true"></span>
        </div>
      }
    }
  `,
})
export class GlintSplitterComponent implements AfterContentInit, AfterContentChecked {
  /** Layout direction of the splitter. */
  layout = input<'horizontal' | 'vertical'>('horizontal');

  /** Width of the gutter between panels in pixels. */
  gutterSize = input(4);

  /** Emitted when a resize operation finishes. */
  resizeEnd = output<{ sizes: number[] }>();

  /** Projected splitter panels. */
  panels = contentChildren(GlintSplitterPanelComponent);

  /** Panel sizes as percentages. */
  panelSizes = signal<number[]>([]);

  /** Computed flex-basis for each panel, accounting for gutter space. */
  panelBasis = computed(() => {
    const sizes = this.panelSizes();
    const panelCount = this.panels().length;
    const gutterCount = panelCount > 0 ? panelCount - 1 : 0;
    const totalGutterPx = gutterCount * this.gutterSize();
    const gutterPerPanel = panelCount > 0 ? totalGutterPx / panelCount : 0;

    return (index: number): string => {
      const size = sizes[index] ?? 0;
      return `calc(${size}% - ${gutterPerPanel}px)`;
    };
  });

  private readonly hostEl = inject(ElementRef);

  /**
   * Initialize or re-initialize panel sizes from panel inputs.
   */
  private initSizes(): void {
    const panelList = this.panels();
    if (panelList.length === 0) return;

    const sizes: number[] = [];
    let totalSpecified = 0;
    let unspecifiedCount = 0;

    for (const panel of panelList) {
      const s = panel.size();
      if (s !== undefined) {
        sizes.push(s);
        totalSpecified += s;
      } else {
        sizes.push(-1); // placeholder
        unspecifiedCount++;
      }
    }

    const remaining = 100 - totalSpecified;
    const equalShare = unspecifiedCount > 0 ? remaining / unspecifiedCount : 0;

    for (let i = 0; i < sizes.length; i++) {
      if (sizes[i] === -1) {
        sizes[i] = equalShare;
      }
    }

    this.panelSizes.set(sizes);
  }

  ngAfterContentInit(): void {
    this.initSizes();
  }

  ngAfterContentChecked(): void {
    // Re-init if panels change and current sizes don't match
    if (this.panels().length > 0 && this.panelSizes().length !== this.panels().length) {
      this.initSizes();
    }
  }

  /** Handle gutter drag start. */
  onGutterPointerDown(event: PointerEvent, gutterIndex: number): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture(event.pointerId);

    const startPos = this.layout() === 'horizontal' ? event.clientX : event.clientY;
    const startSizes = [...this.panelSizes()];
    const containerSize = this.getContainerSize();

    const onPointerMove = (e: PointerEvent) => {
      const currentPos = this.layout() === 'horizontal' ? e.clientX : e.clientY;
      const deltaPx = currentPos - startPos;
      const totalGutterPx = (this.panels().length - 1) * this.gutterSize();
      const availablePx = containerSize - totalGutterPx;
      const deltaPercent = availablePx > 0 ? (deltaPx / availablePx) * 100 : 0;

      const panelList = this.panels();
      const minA = panelList[gutterIndex].minSize();
      const minB = panelList[gutterIndex + 1].minSize();

      let newSizeA = startSizes[gutterIndex] + deltaPercent;
      let newSizeB = startSizes[gutterIndex + 1] - deltaPercent;

      // Enforce minimums
      if (newSizeA < minA) {
        newSizeB -= (minA - newSizeA);
        newSizeA = minA;
      }
      if (newSizeB < minB) {
        newSizeA -= (minB - newSizeB);
        newSizeB = minB;
      }

      // Final clamp
      newSizeA = Math.max(minA, newSizeA);
      newSizeB = Math.max(minB, newSizeB);

      const newSizes = [...startSizes];
      newSizes[gutterIndex] = newSizeA;
      newSizes[gutterIndex + 1] = newSizeB;
      this.panelSizes.set(newSizes);
    };

    const onPointerUp = () => {
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerup', onPointerUp);
      this.resizeEnd.emit({ sizes: [...this.panelSizes()] });
    };

    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerup', onPointerUp);
  }

  /** Handle keyboard navigation on gutter for accessibility. */
  onGutterKeydown(event: KeyboardEvent, gutterIndex: number): void {
    const step = 1; // 1% per key press
    const isHorizontal = this.layout() === 'horizontal';
    let delta = 0;

    if (isHorizontal && event.key === 'ArrowRight') {
      delta = step;
    } else if (isHorizontal && event.key === 'ArrowLeft') {
      delta = -step;
    } else if (!isHorizontal && event.key === 'ArrowDown') {
      delta = step;
    } else if (!isHorizontal && event.key === 'ArrowUp') {
      delta = -step;
    } else {
      return; // Don't prevent default for other keys
    }

    event.preventDefault();

    const sizes = [...this.panelSizes()];
    const panelList = this.panels();
    const minA = panelList[gutterIndex].minSize();
    const minB = panelList[gutterIndex + 1].minSize();

    let newSizeA = sizes[gutterIndex] + delta;
    let newSizeB = sizes[gutterIndex + 1] - delta;

    // Enforce minimums
    if (newSizeA < minA) {
      newSizeA = minA;
      newSizeB = sizes[gutterIndex] + sizes[gutterIndex + 1] - minA;
    }
    if (newSizeB < minB) {
      newSizeB = minB;
      newSizeA = sizes[gutterIndex] + sizes[gutterIndex + 1] - minB;
    }

    sizes[gutterIndex] = newSizeA;
    sizes[gutterIndex + 1] = newSizeB;
    this.panelSizes.set(sizes);
    this.resizeEnd.emit({ sizes: [...sizes] });
  }

  /** Get container dimension in px for the active axis. */
  private getContainerSize(): number {
    const el = this.hostEl.nativeElement as HTMLElement;
    return this.layout() === 'horizontal' ? el.offsetWidth : el.offsetHeight;
  }
}
