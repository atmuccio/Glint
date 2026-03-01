/**
 * Tree node model used by Tree, TreeTable, TreeSelect, and OrganizationChart.
 */
export interface GlintTreeNode<T = unknown> {
  /** Unique key for the node */
  key?: string;
  /** Display label */
  label?: string;
  /** Arbitrary data payload */
  data?: T;
  /** Icon identifier */
  icon?: string;
  /** Child nodes */
  children?: GlintTreeNode<T>[];
  /** Whether this node is a leaf (has no expandable children) */
  leaf?: boolean;
  /** Whether this node is currently expanded */
  expanded?: boolean;
  /** Whether this node is selectable */
  selectable?: boolean;
  /** CSS style class */
  styleClass?: string;
}
