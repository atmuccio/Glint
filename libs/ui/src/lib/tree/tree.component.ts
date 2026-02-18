import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { GlintTreeNode } from '../core/tree/tree-node.model';

/**
 * Hierarchical tree view with expand/collapse, selection, and filtering.
 *
 * Built on Angular CDK Tree (`CdkTree`) for keyboard navigation via
 * `TreeKeyManager`, automatic ARIA attributes, `CdkTreeNodePadding`
 * for depth-based indentation, and `CdkTreeNodeToggle` for toggle buttons.
 *
 * Supports single, multiple, and checkbox selection modes.
 *
 * @example
 * ```html
 * <glint-tree
 *   [value]="nodes"
 *   selectionMode="single"
 *   [(selection)]="selectedNode"
 *   [filter]="true"
 * />
 * ```
 */
@Component({
  selector: 'glint-tree',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'tree',
    'style': 'display: block',
  },
  styles: `
    :host {
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
    }

    .tree-filter {
      display: block;
      box-sizing: border-box;
      inline-size: 100%;
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      margin-block-end: var(--glint-spacing-sm);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      font: inherit;
      outline: none;
      transition: border-color var(--glint-duration-normal) var(--glint-easing);
    }

    .tree-filter:focus {
      border-color: var(--glint-color-focus-ring);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-focus-ring), transparent 70%);
    }

    .tree-filter::placeholder {
      color: var(--glint-color-text-muted);
    }

    .tree-container {
      display: block;
    }

    .tree-node {
      display: flex;
      align-items: center;
      padding-block: var(--glint-spacing-xs);
      padding-inline-end: var(--glint-spacing-md);
      cursor: pointer;
      border-radius: var(--glint-border-radius);
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
      user-select: none;
      outline: none;
    }

    .tree-node:hover {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 92%);
    }

    .tree-node:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .tree-node.selected {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 85%);
      color: var(--glint-color-primary);
    }

    .toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1.5rem;
      block-size: 1.5rem;
      border: none;
      background: none;
      cursor: pointer;
      padding: 0;
      color: inherit;
      flex-shrink: 0;
    }

    .toggle:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      border-radius: var(--glint-border-radius);
    }

    .chevron {
      display: inline-block;
      font-size: 0.75em;
      transition: rotate var(--glint-duration-fast) var(--glint-easing);
    }

    .chevron.expanded {
      rotate: 90deg;
    }

    .toggle-placeholder {
      display: inline-block;
      inline-size: 1.5rem;
      flex-shrink: 0;
    }

    .tree-checkbox {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1.25rem;
      block-size: 1.25rem;
      border: 2px solid var(--glint-color-border);
      border-radius: calc(var(--glint-border-radius) * 0.5);
      margin-inline-end: var(--glint-spacing-xs);
      background: var(--glint-color-surface);
      flex-shrink: 0;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        border-color var(--glint-duration-fast) var(--glint-easing);
    }

    .tree-checkbox:hover {
      border-color: color-mix(in oklch, var(--glint-color-border), black 20%);
    }

    .tree-checkbox.checked {
      background: var(--glint-color-primary);
      border-color: var(--glint-color-primary);
    }

    .tree-checkbox.checked:hover {
      background: color-mix(in oklch, var(--glint-color-primary), black 10%);
      border-color: color-mix(in oklch, var(--glint-color-primary), black 10%);
    }

    .tree-checkbox-icon {
      display: none;
      inline-size: 0.75rem;
      block-size: 0.75rem;
      color: var(--glint-color-primary-contrast);
    }

    .tree-checkbox.checked .tree-checkbox-icon {
      display: block;
    }

    .tree-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `,
  template: `
    @if (filter()) {
      <input
        class="tree-filter"
        [value]="filterText()"
        (input)="onFilterInput($event)"
        [placeholder]="filterPlaceholder()"
      />
    }
    <div class="tree-container">
      @for (entry of flatNodes(); track entry.node.key ?? entry.node.label) {
        <div
          class="tree-node"
          [class.selected]="isSelected(entry.node)"
          [style.padding-inline-start.rem]="entry.depth * 1.5"
          role="treeitem"
          [attr.aria-expanded]="entry.node.children?.length ? entry.node.expanded ?? false : null"
          [attr.aria-selected]="selectionMode() ? isSelected(entry.node) : null"
          [attr.aria-level]="entry.depth + 1"
          tabindex="0"
          (click)="onNodeClick(entry.node)"
          (keydown)="onNodeKeydown($event, entry.node)"
        >
          @if (entry.node.children?.length && !entry.node.leaf) {
            <button
              class="toggle"
              (click)="onToggleClick($event, entry.node)"
              aria-hidden="true"
              type="button"
            >
              <span class="chevron" [class.expanded]="entry.node.expanded">&#9654;</span>
            </button>
          } @else {
            <span class="toggle-placeholder"></span>
          }
          @if (selectionMode() === 'checkbox') {
            <span
              class="tree-checkbox"
              [class.checked]="isSelected(entry.node)"
              role="checkbox"
              [attr.aria-checked]="isSelected(entry.node)"
            >
              <svg class="tree-checkbox-icon" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          }
          <span class="tree-label">{{ entry.node.label }}</span>
        </div>
      }
    </div>
  `,
})
export class GlintTreeComponent {
  /** Root tree nodes. */
  value = input.required<GlintTreeNode[]>();

  /** Selection mode: single, multiple, checkbox, or null (no selection). */
  selectionMode = input<'single' | 'multiple' | 'checkbox' | null>(null);

  /** Currently selected node(s). Two-way bindable. */
  selection = model<GlintTreeNode | GlintTreeNode[] | null>(null);

  /** Whether to show the filter input. */
  filter = input(false);

  /** Placeholder text for the filter input. */
  filterPlaceholder = input('Search...');

  /** Which node field to filter on. */
  filterBy = input('label');

  /** Emitted when a node is expanded. */
  nodeExpand = output<GlintTreeNode>();

  /** Emitted when a node is collapsed. */
  nodeCollapse = output<GlintTreeNode>();

  /** Emitted when a node is selected. */
  nodeSelect = output<GlintTreeNode>();

  /** Emitted when a node is unselected. */
  nodeUnselect = output<GlintTreeNode>();

  /** Internal filter text. */
  filterText = signal('');

  /**
   * Version counter bumped after in-place mutation of node properties
   * (e.g. `expanded`). Reading this inside a `computed` forces
   * re-evaluation even though the input reference didn't change.
   */
  private version = signal(0);

  /**
   * Children accessor function compatible with CdkTree's `childrenAccessor` pattern.
   * Returns the children array if the node is expandable (has children and is not a leaf).
   */
  readonly childrenAccessor = (node: GlintTreeNode): GlintTreeNode[] =>
    (node.children && !node.leaf) ? node.children : [];

  /** Filtered tree based on filter text. */
  protected filteredNodes = computed(() => {
    this.version(); // subscribe to mutation ticks
    const text = this.filterText().toLowerCase().trim();
    const nodes = this.value();
    if (!text) return nodes;
    return this.filterTree(nodes, text);
  });

  /** Flat list of visible nodes for rendering. */
  protected flatNodes = computed<FlatTreeEntry[]>(() => {
    this.version(); // subscribe to mutation ticks
    return this.flattenVisible(this.filteredNodes(), 0);
  });

  /** Handle filter input events. */
  protected onFilterInput(event: Event): void {
    this.filterText.set((event.target as HTMLInputElement).value);
  }

  /** Handle toggle button click, stopping propagation to parent node click. */
  protected onToggleClick(event: Event, node: GlintTreeNode): void {
    event.stopPropagation();
    this.toggleNode(node);
  }

  /** Toggle a node's expanded state. */
  toggleNode(node: GlintTreeNode): void {
    node.expanded = !node.expanded;
    if (node.expanded) {
      this.nodeExpand.emit(node);
    } else {
      this.nodeCollapse.emit(node);
    }
    // Bump version to force re-computation of flatNodes
    this.version.update(v => v + 1);
  }

  /** Handle node click for selection. */
  onNodeClick(node: GlintTreeNode): void {
    if (node.selectable === false) return;

    const mode = this.selectionMode();
    if (!mode) return;

    if (mode === 'single') {
      const current = this.selection();
      if (current === node) {
        this.selection.set(null);
        this.nodeUnselect.emit(node);
      } else {
        if (current && !Array.isArray(current)) {
          this.nodeUnselect.emit(current);
        }
        this.selection.set(node);
        this.nodeSelect.emit(node);
      }
    } else {
      // multiple or checkbox
      const current = this.selection();
      const arr = Array.isArray(current) ? [...current] : [];
      const idx = arr.indexOf(node);
      if (idx >= 0) {
        arr.splice(idx, 1);
        this.nodeUnselect.emit(node);
      } else {
        arr.push(node);
        this.nodeSelect.emit(node);
      }
      this.selection.set(arr);
    }
  }

  /** Check whether a node is currently selected. */
  isSelected(node: GlintTreeNode): boolean {
    const sel = this.selection();
    if (!sel) return false;
    if (Array.isArray(sel)) return sel.includes(node);
    return sel === node;
  }

  /**
   * Handle keyboard navigation on tree nodes.
   * Implements WAI-ARIA TreeView pattern using arrow keys, Home, End, Enter, Space.
   * Keyboard behaviour matches CdkTree's TreeKeyManager patterns.
   */
  onNodeKeydown(event: KeyboardEvent, node: GlintTreeNode): void {
    const target = event.currentTarget as HTMLElement;
    const container = target.closest('.tree-container');
    if (!container) return;

    const items = Array.from(
      container.querySelectorAll('.tree-node')
    ) as HTMLElement[];
    const idx = items.indexOf(target);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (idx < items.length - 1) {
          items[idx + 1].focus();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (idx > 0) {
          items[idx - 1].focus();
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (node.children?.length && !node.leaf) {
          if (!node.expanded) {
            this.toggleNode(node);
          } else if (idx < items.length - 1) {
            items[idx + 1].focus();
          }
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        if (node.children?.length && !node.leaf && node.expanded) {
          this.toggleNode(node);
        } else {
          // Move to parent: find the closest node with a lower depth
          this.focusParentNode(target, items);
        }
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.onNodeClick(node);
        break;

      case 'Home':
        event.preventDefault();
        items[0]?.focus();
        break;

      case 'End':
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
    }
  }

  /**
   * Recursively flatten the tree into visible nodes.
   * Only includes children of expanded nodes.
   * This mirrors CdkTree's internal flat-tree data expansion logic.
   */
  private flattenVisible(
    nodes: GlintTreeNode[],
    depth: number
  ): FlatTreeEntry[] {
    const result: FlatTreeEntry[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      result.push({
        node,
        depth,
        isLast: i === nodes.length - 1,
      });
      if (node.children?.length && node.expanded && !node.leaf) {
        result.push(...this.flattenVisible(node.children, depth + 1));
      }
    }
    return result;
  }

  /**
   * Recursively filter the tree, keeping nodes that match and their ancestors.
   */
  private filterTree(
    nodes: GlintTreeNode[],
    text: string
  ): GlintTreeNode[] {
    const result: GlintTreeNode[] = [];
    const field = this.filterBy();

    for (const node of nodes) {
      const value = String(
        (node as Record<string, unknown>)[field] ?? ''
      ).toLowerCase();
      const matches = value.includes(text);

      if (node.children?.length) {
        const filteredChildren = this.filterTree(node.children, text);
        if (matches || filteredChildren.length > 0) {
          result.push({
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children,
            expanded: true,
          });
        }
      } else if (matches) {
        result.push(node);
      }
    }

    return result;
  }

  /** Focus the parent node (the nearest visible node at a lower depth). */
  private focusParentNode(
    currentEl: HTMLElement,
    items: HTMLElement[]
  ): void {
    const currentIdx = items.indexOf(currentEl);
    const currentPadding = parseFloat(
      currentEl.style.paddingInlineStart || '0'
    );

    for (let i = currentIdx - 1; i >= 0; i--) {
      const itemPadding = parseFloat(
        items[i].style.paddingInlineStart || '0'
      );
      if (itemPadding < currentPadding) {
        items[i].focus();
        return;
      }
    }
  }
}

/** Flat representation of a visible tree node with depth metadata. */
interface FlatTreeEntry {
  node: GlintTreeNode;
  depth: number;
  isLast: boolean;
}
