/** Toast message configuration */
export interface GlintToastMessage {
  /** Severity level */
  severity: 'success' | 'info' | 'warning' | 'danger';
  /** Summary (title) text */
  summary: string;
  /** Optional detail text */
  detail?: string;
  /** Auto-dismiss duration in ms (0 = sticky). Default: 3000 */
  duration?: number;
  /** Whether the toast can be manually closed. Default: true */
  closable?: boolean;
}

/** Internal toast with unique ID for tracking */
export interface GlintToastEntry extends GlintToastMessage {
  readonly id: number;
}

/** Position for the toast container */
export type GlintToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';
