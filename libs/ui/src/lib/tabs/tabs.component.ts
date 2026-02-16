import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  model,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { GlintTabPanelComponent } from './tab-panel.component';

/**
 * Tabs container with keyboard navigation and ARIA tablist semantics.
 *
 * @example
 * ```html
 * <glint-tabs [(activeIndex)]="selectedTab">
 *   <glint-tab-panel label="General">…</glint-tab-panel>
 *   <glint-tab-panel label="Security">…</glint-tab-panel>
 *   <glint-tab-panel label="Notifications" [disabled]="true">…</glint-tab-panel>
 * </glint-tabs>
 * ```
 */
@Component({
  selector: 'glint-tabs',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'glint-tabs',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .tab-list {
      display: flex;
      border-block-end: 2px solid var(--glint-color-border);
      gap: 0;
    }

    .tab {
      position: relative;
      display: inline-flex;
      align-items: center;
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-lg);
      border: none;
      background: transparent;
      color: var(--glint-color-text-muted);
      font: inherit;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition:
        color var(--glint-duration-fast) var(--glint-easing),
        background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .tab:hover:not(.disabled) {
      color: var(--glint-color-text);
      background: color-mix(in oklch, var(--glint-color-primary), transparent 92%);
    }

    .tab.active {
      color: var(--glint-color-primary);
    }

    .tab.active::after {
      content: '';
      position: absolute;
      inset-block-end: -2px;
      inset-inline: 0;
      block-size: 2px;
      background: var(--glint-color-primary);
    }

    .tab:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .tab.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .panel {
      padding-block: var(--glint-spacing-md);
    }
  `,
  template: `
    <div class="tab-list" role="tablist" tabindex="-1" (keydown)="onKeydown($event)">
      @for (tab of panels(); track tab.panelId; let i = $index) {
        <button
          class="tab"
          [class.active]="activeIndex() === i"
          [class.disabled]="tab.disabled()"
          role="tab"
          [id]="tab.tabId"
          [attr.aria-selected]="activeIndex() === i"
          [attr.aria-controls]="tab.panelId"
          [attr.aria-disabled]="tab.disabled() || null"
          [tabindex]="activeIndex() === i ? 0 : -1"
          (click)="selectTab(i)"
        >{{ tab.label() }}</button>
      }
    </div>
    @for (tab of panels(); track tab.panelId; let i = $index) {
      @if (activeIndex() === i) {
        <div
          class="panel"
          role="tabpanel"
          [id]="tab.panelId"
          [attr.aria-labelledby]="tab.tabId"
        >
          <ng-container [ngTemplateOutlet]="tab.contentTemplate()" />
        </div>
      }
    }
  `,
})
export class GlintTabsComponent {
  /** Two-way bound active tab index */
  activeIndex = model(0);
  /** Emitted when the active tab changes */
  activeIndexChange = output<number>();

  panels = contentChildren(GlintTabPanelComponent);

  selectTab(index: number): void {
    const tab = this.panels()[index];
    if (tab && !tab.disabled()) {
      this.activeIndex.set(index);
      this.activeIndexChange.emit(index);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const tabs = this.panels();
    const current = this.activeIndex();
    let next = -1;

    if (event.key === 'ArrowRight') {
      next = this.findNextEnabled(current, 1, tabs);
    } else if (event.key === 'ArrowLeft') {
      next = this.findNextEnabled(current, -1, tabs);
    } else if (event.key === 'Home') {
      next = this.findNextEnabled(-1, 1, tabs);
    } else if (event.key === 'End') {
      next = this.findNextEnabled(tabs.length, -1, tabs);
    }

    if (next >= 0 && next !== current) {
      event.preventDefault();
      this.selectTab(next);
      this.focusTab(next);
    }
  }

  private findNextEnabled(
    from: number,
    direction: 1 | -1,
    tabs: readonly GlintTabPanelComponent[],
  ): number {
    let i = from + direction;
    while (i >= 0 && i < tabs.length) {
      if (!tabs[i].disabled()) return i;
      i += direction;
    }
    return -1;
  }

  private focusTab(index: number): void {
    const tab = this.panels()[index];
    if (!tab) return;
    const el = document.getElementById(tab.tabId);
    el?.focus();
  }
}
