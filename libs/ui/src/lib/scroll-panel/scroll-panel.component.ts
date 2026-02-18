import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * A container with custom-styled scrollbars that inherit from the zone theme.
 *
 * @example
 * ```html
 * <glint-scroll-panel style="width: 300px; height: 200px;">
 *   <p>Scrollable content goes here...</p>
 * </glint-scroll-panel>
 * ```
 */
@Component({
  selector: 'glint-scroll-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: block; position: relative; overflow: hidden;',
  },
  styles: `
    .scroll-panel-content {
      overflow: auto;
      width: 100%;
      height: 100%;
      scrollbar-width: thin;
      scrollbar-color: color-mix(in oklch, var(--glint-color-text), transparent 70%) transparent;
    }

    .scroll-panel-content::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    .scroll-panel-content::-webkit-scrollbar-track {
      background: transparent;
    }

    .scroll-panel-content::-webkit-scrollbar-thumb {
      background: color-mix(in oklch, var(--glint-color-text), transparent 70%);
      border-radius: 3px;
    }

    .scroll-panel-content::-webkit-scrollbar-thumb:hover {
      background: color-mix(in oklch, var(--glint-color-text), transparent 50%);
    }
  `,
  template: `
    <div class="scroll-panel-content" [style]="contentStyle()">
      <ng-content />
    </div>
  `,
})
export class GlintScrollPanelComponent {
  /** Additional inline styles to apply to the content container. */
  contentStyles = input('');

  /** Computed style combining the user-provided styles. */
  contentStyle = computed(() => this.contentStyles());
}
