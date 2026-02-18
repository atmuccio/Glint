import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { GlintTreeNode } from '../core/tree/tree-node.model';
import { GlintOrgChartNodeComponent } from './org-chart-node.component';

/**
 * Top-down hierarchical organization chart.
 *
 * Renders a root `GlintTreeNode` as a card, with connector lines linking
 * it to its children. Each child is rendered recursively via
 * `GlintOrgChartNodeComponent`.
 *
 * Supports single and multiple selection modes via the `selectionMode` input.
 * Use `[(selection)]` for two-way binding to the currently selected node(s).
 *
 * @example
 * ```html
 * <glint-organization-chart
 *   [value]="orgRoot"
 *   selectionMode="single"
 *   [(selection)]="selectedNode"
 *   (nodeSelect)="onSelect($event)"
 * />
 * ```
 */
@Component({
  selector: 'glint-organization-chart',
  standalone: true,
  imports: [GlintOrgChartNodeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: block; overflow: auto',
    'role': 'tree',
  },
  styles: `
    .org-chart {
      display: flex;
      inline-size: fit-content;
      min-inline-size: 100%;
      justify-content: center;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      padding: var(--glint-spacing-md);
      box-sizing: border-box;
    }
  `,
  template: `
    <div class="org-chart">
      <glint-org-chart-node
        [node]="value()"
        [selectionMode]="selectionMode()"
        [selection]="selection()"
        (nodeSelect)="onNodeSelect($event)"
        (nodeUnselect)="onNodeUnselect($event)"
      />
    </div>
  `,
})
export class GlintOrganizationChartComponent {
  /** Root tree node of the organization chart. */
  value = input.required<GlintTreeNode>();

  /** Selection mode: single, multiple, or null (no selection). */
  selectionMode = input<'single' | 'multiple' | null>(null);

  /** Currently selected node(s). Two-way bindable via `[(selection)]`. */
  selection = model<GlintTreeNode | GlintTreeNode[] | null>(null);

  /** Emitted when a node is selected. */
  nodeSelect = output<GlintTreeNode>();

  /** Emitted when a node is unselected. */
  nodeUnselect = output<GlintTreeNode>();

  /** Handle node selection from a child node component. */
  protected onNodeSelect(node: GlintTreeNode): void {
    const mode = this.selectionMode();

    if (mode === 'single') {
      const current = this.selection();
      if (current && !Array.isArray(current)) {
        this.nodeUnselect.emit(current);
      }
      this.selection.set(node);
    } else if (mode === 'multiple') {
      const current = this.selection();
      const arr = Array.isArray(current) ? [...current] : [];
      arr.push(node);
      this.selection.set(arr);
    }

    this.nodeSelect.emit(node);
  }

  /** Handle node unselection from a child node component. */
  protected onNodeUnselect(node: GlintTreeNode): void {
    const mode = this.selectionMode();

    if (mode === 'single') {
      this.selection.set(null);
    } else if (mode === 'multiple') {
      const current = this.selection();
      const arr = Array.isArray(current) ? [...current] : [];
      const idx = arr.indexOf(node);
      if (idx >= 0) {
        arr.splice(idx, 1);
      }
      this.selection.set(arr.length > 0 ? arr : null);
    }

    this.nodeUnselect.emit(node);
  }
}
