import { Injectable, signal } from '@angular/core';
import type { GlintToastEntry, GlintToastMessage, GlintToastPosition } from './toast.model';

let nextToastId = 0;

/**
 * Service for showing toast notifications.
 *
 * @example
 * ```typescript
 * const toast = inject(GlintToastService);
 * toast.show({ severity: 'success', summary: 'Saved', detail: 'Record saved successfully' });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class GlintToastService {
  /** Current toast messages */
  readonly messages = signal<GlintToastEntry[]>([]);

  /** Position for the toast container */
  readonly position = signal<GlintToastPosition>('top-right');

  private timers = new Map<number, ReturnType<typeof setTimeout>>();

  /** Show a toast message */
  show(message: GlintToastMessage): number {
    const id = nextToastId++;
    const entry: GlintToastEntry = { ...message, id };
    this.messages.update(msgs => [...msgs, entry]);

    const duration = message.duration ?? 3000;
    if (duration > 0) {
      const timer = setTimeout(() => this.dismiss(id), duration);
      this.timers.set(id, timer);
    }

    return id;
  }

  /** Dismiss a specific toast by ID */
  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.messages.update(msgs => msgs.filter(m => m.id !== id));
  }

  /** Clear all toasts */
  clear(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    this.messages.set([]);
  }
}
