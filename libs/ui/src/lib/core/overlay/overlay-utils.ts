import { ElementRef } from '@angular/core';

/**
 * Union type for overlay target resolution.
 *
 * Accepts a raw `HTMLElement`, an Angular `ElementRef`, or any component
 * instance that exposes `elementRef` (the standard Angular component shape).
 * This allows callers to pass `myComponent.elementRef`, a template ref variable,
 * or a plain DOM element interchangeably.
 */
export type OverlayTarget = HTMLElement | ElementRef | { elementRef: ElementRef };

/**
 * Resolves an `OverlayTarget` to its underlying native `HTMLElement`.
 *
 * Used internally by overlay config factories so that consumers can pass
 * component refs, `ElementRef` instances, or raw elements as targets.
 */
export function resolveNativeElement(target: OverlayTarget): HTMLElement {
  if (target instanceof HTMLElement) return target;
  if (target instanceof ElementRef) return target.nativeElement;
  return target.elementRef.nativeElement;
}
