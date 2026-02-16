import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

/** Timeline event model */
export interface GlintTimelineEvent {
  /** Event title */
  title: string;
  /** Event description */
  description?: string;
  /** Optional date/time text */
  date?: string;
  /** Severity color for the marker */
  severity?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}

/**
 * Timeline for displaying chronological events.
 *
 * @example
 * ```html
 * <glint-timeline [events]="[
 *   { title: 'Created', date: 'Jan 1', severity: 'info' },
 *   { title: 'In Progress', date: 'Jan 5', severity: 'warning' },
 *   { title: 'Completed', date: 'Jan 10', severity: 'success' }
 * ]" />
 * ```
 */
@Component({
  selector: 'glint-timeline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-layout]': 'layout()',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .event {
      display: flex;
      gap: var(--glint-spacing-md);
      position: relative;
    }

    .marker-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }

    .marker {
      inline-size: 0.875rem;
      block-size: 0.875rem;
      border-radius: 50%;
      background: var(--glint-color-primary);
      flex-shrink: 0;
      z-index: 1;
    }

    .marker.success { background: var(--glint-color-success); }
    .marker.info { background: var(--glint-color-info); }
    .marker.warning { background: var(--glint-color-warning); }
    .marker.danger { background: var(--glint-color-error); }

    .line {
      flex: 1;
      inline-size: 2px;
      background: var(--glint-color-border);
    }

    .content {
      padding-block-end: var(--glint-spacing-lg);
    }

    .title {
      font-weight: 600;
      color: var(--glint-color-text);
    }

    .date {
      font-size: 0.75rem;
      color: var(--glint-color-text-muted);
      margin-block-start: 0.125rem;
    }

    .description {
      margin-block-start: var(--glint-spacing-xs);
      color: var(--glint-color-text-muted);
      line-height: 1.5;
    }
  `,
  template: `
    @for (event of events(); track $index; let last = $last) {
      <div class="event">
        <div class="marker-col">
          <div class="marker" [class]="event.severity ?? 'primary'"></div>
          @if (!last) {
            <div class="line"></div>
          }
        </div>
        <div class="content">
          <div class="title">{{ event.title }}</div>
          @if (event.date) {
            <div class="date">{{ event.date }}</div>
          }
          @if (event.description) {
            <div class="description">{{ event.description }}</div>
          }
        </div>
      </div>
    }
  `,
})
export class GlintTimelineComponent {
  /** Timeline events to display */
  events = input.required<GlintTimelineEvent[]>();
  /** Layout direction */
  layout = input<'vertical' | 'horizontal'>('vertical');
}
