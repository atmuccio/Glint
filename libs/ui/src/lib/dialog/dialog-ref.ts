import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

/**
 * Reference to an open dialog. Used to close the dialog and receive results.
 *
 * @example
 * ```typescript
 * const ref = dialog.open(MyComponent, { data: { id: 1 } });
 * ref.afterClosed().subscribe(result => console.log(result));
 * ```
 */
export class GlintDialogRef<T = unknown, R = unknown> {
  private readonly afterClosedSubject = new Subject<R | undefined>();

  /** Observable that emits the result when the dialog is closed */
  readonly afterClosed$ = this.afterClosedSubject.asObservable();

  /** The component instance rendered inside the dialog */
  componentInstance: T | null = null;

  constructor(private overlayRef: OverlayRef) {}

  /** Close the dialog with an optional result */
  close(result?: R): void {
    this.afterClosedSubject.next(result);
    this.afterClosedSubject.complete();
    this.overlayRef.dispose();
  }
}
