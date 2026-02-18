import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { GlintTreeNode } from '../core/tree/tree-node.model';

/**
 * Internal recursive node component for the organization chart.
 *
 * Renders a single node card with connector lines to its children.
 * Each child is rendered as another `glint-org-chart-node`, enabling
 * recursive tree rendering.
 *
 * @internal Not exported from the public API.
 */
@Component({
  selector: 'glint-org-chart-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: block',
  },
  styles: `
    .org-node-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .org-node {
      display: inline-flex;
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      background: var(--glint-color-surface);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      cursor: default;
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
      outline: none;
    }

    .org-node.selectable {
      cursor: pointer;
    }

    .org-node.selectable:hover {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    .org-node.selectable:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .org-node.selected {
      border-color: var(--glint-color-primary);
      background: color-mix(in oklch, var(--glint-color-primary), transparent 85%);
    }

    .org-node-content {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
    }

    .org-label {
      white-space: nowrap;
      color: var(--glint-color-text);
    }

    .org-children-connector {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .org-line-down {
      inline-size: 2px;
      block-size: 1.5rem;
      background: var(--glint-color-border);
    }

    .org-children {
      display: flex;
      gap: 0;
      border-block-start: 2px solid var(--glint-color-border);
    }

    .org-child-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-inline: var(--glint-spacing-md);
    }

    .org-line-top {
      inline-size: 2px;
      block-size: 1.5rem;
      background: var(--glint-color-border);
    }

    /* Single child: hide the horizontal connector line */
    .org-children.single-child {
      border-block-start: none;
    }
  `,
  template: `
    <div class="org-node-container">
      <div
        class="org-node"
        [class.selected]="isSelected()"
        [class.selectable]="node().selectable !== false && selectionMode() !== null"
        (click)="onSelect()"
        (keydown.enter)="onSelect()"
        (keydown.space)="onSelect(); $event.preventDefault()"
        role="treeitem"
        [attr.aria-selected]="selectionMode() ? isSelected() : null"
        tabindex="0"
      >
        <div class="org-node-content">
          <span class="org-label">{{ node().label }}</span>
        </div>
      </div>
      @if (node().children?.length && node().expanded !== false) {
        <div class="org-children-connector">
          <div class="org-line-down"></div>
          <div
            class="org-children"
            [class.single-child]="node().children!.length === 1"
          >
            @for (child of node().children!; track child.key ?? child.label ?? $index) {
              <div class="org-child-wrapper">
                <div class="org-line-top"></div>
                <glint-org-chart-node
                  [node]="child"
                  [selectionMode]="selectionMode()"
                  [selection]="selection()"
                  (nodeSelect)="nodeSelect.emit($event)"
                  (nodeUnselect)="nodeUnselect.emit($event)"
                />
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class GlintOrgChartNodeComponent {
  /** The tree node to render. */
  node = input.required<GlintTreeNode>();

  /** Selection mode passed down from the parent chart. */
  selectionMode = input<'single' | 'multiple' | null>(null);

  /** Current selection state passed down from the parent chart. */
  selection = input<GlintTreeNode | GlintTreeNode[] | null>(null);

  /** Emitted when a node is selected. */
  nodeSelect = output<GlintTreeNode>();

  /** Emitted when a node is unselected. */
  nodeUnselect = output<GlintTreeNode>();

  /** Whether this node is currently selected. */
  protected isSelected = computed(() => {
    const sel = this.selection();
    const node = this.node();
    if (!sel) return false;
    if (Array.isArray(sel)) return sel.includes(node);
    return sel === node;
  });

  /** Handle node click for selection. */
  protected onSelect(): void {
    const mode = this.selectionMode();
    const node = this.node();
    if (!mode || node.selectable === false) return;

    if (this.isSelected()) {
      this.nodeUnselect.emit(node);
    } else {
      this.nodeSelect.emit(node);
    }
  }
}
