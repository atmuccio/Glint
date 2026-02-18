import {
  ChangeDetectionStrategy,
  Component,
  computed,
  output,
  signal,
} from '@angular/core';
import type { GlintTreeNode } from '../core/tree/tree-node.model';

/** Flattened node for rendering, carrying depth and expansion state. */
interface FlatTreeNode {
  node: GlintTreeNode;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
}

/**
 * Internal tree-select panel rendered inside the CDK overlay.
 * Not exported from the public API.
 */
@Component({
  selector: 'glint-tree-select-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'tree',
    'class': 'tree-select-panel',
  },
  styles: `
    :host {
      display: block;
      background: var(--glint-color-surface);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      overflow: auto;
      max-block-size: 16rem;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      outline: none;
    }

    .filter-wrapper {
      padding: var(--glint-spacing-xs);
      border-block-end: 1px solid var(--glint-color-border);
    }

    .filter-input {
      display: block;
      inline-size: 100%;
      padding-block: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-sm);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      font: inherit;
      outline: none;
    }

    .filter-input:focus {
      border-color: var(--glint-color-focus-ring);
    }

    .tree-node {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      padding-block: var(--glint-spacing-sm);
      padding-inline-end: var(--glint-spacing-md);
      cursor: pointer;
      color: var(--glint-color-text);
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .tree-node:hover {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    .tree-node.selected {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 85%);
      font-weight: 500;
    }

    .tree-node.not-selectable {
      cursor: default;
    }

    .toggle-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1rem;
      block-size: 1rem;
      font-size: 0.75rem;
      flex-shrink: 0;
      cursor: pointer;
      color: var(--glint-color-text-muted);
      transition: transform var(--glint-duration-fast) var(--glint-easing);
    }

    .toggle-icon.expanded {
      transform: rotate(90deg);
    }

    .toggle-placeholder {
      display: inline-block;
      inline-size: 1rem;
      flex-shrink: 0;
    }

    .checkbox-box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1.125rem;
      block-size: 1.125rem;
      border: 2px solid var(--glint-color-border);
      border-radius: calc(var(--glint-border-radius) * 0.5);
      background: var(--glint-color-surface);
      flex-shrink: 0;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        border-color var(--glint-duration-fast) var(--glint-easing);
    }

    .checkbox-box.checked {
      background: var(--glint-color-primary);
      border-color: var(--glint-color-primary);
    }

    .checkbox-check {
      inline-size: 0.625rem;
      block-size: 0.625rem;
      color: var(--glint-color-primary-contrast);
    }

    .node-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .empty-message {
      padding: var(--glint-spacing-md);
      text-align: center;
      color: var(--glint-color-text-muted);
      font-size: 0.875em;
    }
  `,
  template: `
    @if (showFilter()) {
      <div class="filter-wrapper">
        <input
          class="filter-input"
          type="text"
          placeholder="Filter..."
          [value]="filterText()"
          (input)="onFilterInput($event)"
        />
      </div>
    }
    @if (visibleNodes().length === 0) {
      <div class="empty-message">No results found</div>
    }
    @for (flat of visibleNodes(); track flat.node.key ?? flat.node.label) {
      <div
        class="tree-node"
        [class.selected]="isNodeSelected(flat.node)"
        [class.not-selectable]="flat.node.selectable === false"
        [style.padding-inline-start]="getIndent(flat.depth)"
        role="treeitem"
        tabindex="0"
        [attr.aria-expanded]="flat.hasChildren ? flat.expanded : null"
        [attr.aria-selected]="isNodeSelected(flat.node)"
        [attr.aria-level]="flat.depth + 1"
        (click)="onNodeClick(flat)"
        (keydown.enter)="onNodeClick(flat)"
        (keydown.space)="onNodeClick(flat); $event.preventDefault()"
      >
        @if (flat.hasChildren) {
          <span
            class="toggle-icon"
            [class.expanded]="flat.expanded"
            (click)="onToggleExpand(flat.node, $event)"
            aria-hidden="true"
          >&#9654;</span>
        } @else {
          <span class="toggle-placeholder"></span>
        }
        @if (selectionMode() === 'checkbox') {
          <span class="checkbox-box" [class.checked]="isNodeSelected(flat.node)">
            @if (isNodeSelected(flat.node)) {
              <svg class="checkbox-check" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            }
          </span>
        }
        <span class="node-label">{{ flat.node.label }}</span>
      </div>
    }
  `,
})
export class TreeSelectPanelComponent {
  /** Tree data to display */
  options = signal<GlintTreeNode[]>([]);
  /** Filter enabled */
  showFilter = signal(false);
  /** Selection mode */
  selectionMode = signal<'single' | 'multiple' | 'checkbox'>('single');
  /** Currently selected node keys */
  selectedKeys = signal<Set<string>>(new Set());

  /** Emitted when a node is selected/deselected */
  nodeSelected = output<GlintTreeNode>();

  /** Internal filter text */
  filterText = signal('');
  /** Track expanded state by node key/label */
  private expandedKeys = signal<Set<string>>(new Set());

  /** Flatten tree into visible list, respecting expansion and filter */
  visibleNodes = computed<FlatTreeNode[]>(() => {
    const filter = this.filterText().toLowerCase();
    const expandedSet = this.expandedKeys();
    const nodes = this.options();

    if (filter) {
      // When filtering, show all matching nodes with full ancestry visible
      return this.flattenFiltered(nodes, 0, filter);
    }

    return this.flattenVisible(nodes, 0, expandedSet);
  });

  isNodeSelected(node: GlintTreeNode): boolean {
    const key = this.getNodeKey(node);
    return this.selectedKeys().has(key);
  }

  getIndent(depth: number): string {
    return `${depth * 1.25 + 0.5}rem`;
  }

  onFilterInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterText.set(value);
  }

  onNodeClick(flat: FlatTreeNode): void {
    // Don't select non-selectable nodes
    if (flat.node.selectable === false) return;
    this.nodeSelected.emit(flat.node);
  }

  onToggleExpand(node: GlintTreeNode, event: Event): void {
    event.stopPropagation();
    const key = this.getNodeKey(node);
    const current = new Set(this.expandedKeys());
    if (current.has(key)) {
      current.delete(key);
    } else {
      current.add(key);
    }
    this.expandedKeys.set(current);
  }

  private getNodeKey(node: GlintTreeNode): string {
    return node.key ?? node.label ?? '';
  }

  private hasChildren(node: GlintTreeNode): boolean {
    return !node.leaf && !!node.children && node.children.length > 0;
  }

  private flattenVisible(
    nodes: GlintTreeNode[],
    depth: number,
    expandedSet: Set<string>
  ): FlatTreeNode[] {
    const result: FlatTreeNode[] = [];
    for (const node of nodes) {
      const children = this.hasChildren(node);
      const key = this.getNodeKey(node);
      const expanded = expandedSet.has(key);
      result.push({ node, depth, hasChildren: children, expanded });
      if (children && expanded && node.children) {
        result.push(...this.flattenVisible(node.children, depth + 1, expandedSet));
      }
    }
    return result;
  }

  private flattenFiltered(
    nodes: GlintTreeNode[],
    depth: number,
    filter: string
  ): FlatTreeNode[] {
    const result: FlatTreeNode[] = [];
    for (const node of nodes) {
      const children = this.hasChildren(node);
      const labelMatch = (node.label ?? '').toLowerCase().includes(filter);
      const childMatches = children && node.children
        ? this.flattenFiltered(node.children, depth + 1, filter)
        : [];

      if (labelMatch || childMatches.length > 0) {
        result.push({ node, depth, hasChildren: children, expanded: childMatches.length > 0 });
        result.push(...childMatches);
      }
    }
    return result;
  }
}
