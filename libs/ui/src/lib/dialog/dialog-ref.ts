import { DialogRef as CdkDialogRef } from '@angular/cdk/dialog';
import { Observable, ReplaySubject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

/**
 * Reference to an open dialog. Used to close the dialog and receive results.
 *
 * Wraps CDK's `DialogRef` and exposes a stable public API.
 *
 * The ref supports a deferred initialization pattern: it can be created
 * before the CDK DialogRef exists and wired up afterwards via `_connectCdkRef()`.
 * This allows the ref to be provided in the injector before CDK Dialog opens.
 *
 * @example
 * ```typescript
 * const ref = dialog.open(MyComponent, { data: { id: 1 } });
 * ref.afterClosed$.subscribe(result => console.log(result));
 * ```
 */
export class GlintDialogRef<T = unknown, R = unknown> {
  private cdkDialogRef: CdkDialogRef<R> | null = null;
  private readonly cdkRef$ = new ReplaySubject<CdkDialogRef<R>>(1);

  /** Observable that emits the result when the dialog is closed */
  readonly afterClosed$: Observable<R | undefined>;

  /** The component instance rendered inside the dialog */
  componentInstance: T | null = null;

  private constructor() {
    // afterClosed$ waits for the CDK ref to be connected, then delegates
    this.afterClosed$ = this.cdkRef$.pipe(
      take(1),
      switchMap(ref => ref.closed),
    );
  }

  /**
   * Creates a deferred GlintDialogRef that can be wired to a CDK DialogRef later.
   * @internal
   */
  static createDeferred<T, R>(): GlintDialogRef<T, R> {
    return new GlintDialogRef<T, R>();
  }

  /**
   * Connects this ref to the real CDK DialogRef after opening.
   * @internal
   */
  _connectCdkRef(cdkRef: CdkDialogRef<R>): void {
    this.cdkDialogRef = cdkRef;
    this.cdkRef$.next(cdkRef);
    this.cdkRef$.complete();
  }

  /** Close the dialog with an optional result */
  close(result?: R): void {
    this.cdkDialogRef?.close(result);
  }
}
