import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CdkAccordion } from '@angular/cdk/accordion';
import { GlintAccordionPanelComponent } from './accordion-panel.component';
import { GlintIconComponent } from '../icon/icon.component';

/**
 * Accordion container with expandable panels.
 *
 * Uses `CdkAccordion` as a host directive to manage single/multi expand mode
 * via `UniqueSelectionDispatcher`. The `multiple` input maps to CDK's `multi`.
 *
 * @example
 * ```html
 * <glint-accordion>
 *   <glint-accordion-panel header="Section 1">Content 1</glint-accordion-panel>
 *   <glint-accordion-panel header="Section 2">Content 2</glint-accordion-panel>
 * </glint-accordion>
 * ```
 */
@Component({
  selector: 'glint-accordion',
  standalone: true,
  imports: [NgTemplateOutlet, GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: CdkAccordion, inputs: ['multi: multiple'] }],
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      overflow: hidden;
    }

    .panel + .panel {
      border-block-start: 1px solid var(--glint-color-border);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      inline-size: 100%;
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      border: none;
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      text-align: start;
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .header:hover:not(.disabled) {
      background: var(--glint-color-surface-variant);
    }

    .header:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .header.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .chevron {
      font-size: 0.75em;
      transition: rotate var(--glint-duration-fast) var(--glint-easing);
    }

    .chevron.open {
      rotate: 180deg;
    }

    .body {
      padding: var(--glint-spacing-md);
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
    }
  `,
  template: `
    @for (panel of panels(); track panel.panelId) {
      <div class="panel">
        <button
          class="header"
          [class.disabled]="panel.disabled()"
          [id]="panel.headerId"
          [attr.aria-expanded]="panel.expanded()"
          [attr.aria-controls]="panel.panelId"
          [attr.aria-disabled]="panel.disabled() || null"
          (click)="onToggle(panel)"
          (keydown)="onKeydown($event)"
        >
          <span>{{ panel.header() }}</span>
          <span class="chevron" [class.open]="panel.expanded()" aria-hidden="true"><glint-icon name="chevronDown" /></span>
        </button>
        @if (panel.expanded()) {
          <div
            class="body"
            role="region"
            [id]="panel.panelId"
            [attr.aria-labelledby]="panel.headerId"
          >
            <ng-container [ngTemplateOutlet]="panel.contentTemplate()" />
          </div>
        }
      </div>
    }
  `,
})
export class GlintAccordionComponent {
  panels = contentChildren(GlintAccordionPanelComponent);

  onToggle(panel: GlintAccordionPanelComponent): void {
    if (panel.disabled()) return;
    // CDK handles single-expand coordination via UniqueSelectionDispatcher
    panel.toggle();
  }

  onKeydown(event: KeyboardEvent): void {
    const headers = Array.from(
      (event.currentTarget as HTMLElement).closest('glint-accordion')
        ?.querySelectorAll('.header:not(.disabled)') ?? []
    ) as HTMLButtonElement[];
    const idx = headers.indexOf(event.currentTarget as HTMLButtonElement);

    if (event.key === 'ArrowDown' && idx < headers.length - 1) {
      event.preventDefault();
      headers[idx + 1].focus();
    } else if (event.key === 'ArrowUp' && idx > 0) {
      event.preventDefault();
      headers[idx - 1].focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      headers[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      headers[headers.length - 1]?.focus();
    }
  }
}
