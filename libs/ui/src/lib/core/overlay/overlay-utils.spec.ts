import { ElementRef } from '@angular/core';
import { resolveNativeElement } from './overlay-utils';
import type { OverlayTarget } from './overlay-utils';

describe('resolveNativeElement', () => {
  it('should return the same element when given an HTMLElement', () => {
    const el = document.createElement('div');
    expect(resolveNativeElement(el)).toBe(el);
  });

  it('should unwrap an ElementRef to its nativeElement', () => {
    const el = document.createElement('button');
    const ref = new ElementRef(el);
    expect(resolveNativeElement(ref)).toBe(el);
  });

  it('should unwrap an object with elementRef property', () => {
    const el = document.createElement('span');
    const ref = new ElementRef(el);
    const componentLike: OverlayTarget = { elementRef: ref };
    expect(resolveNativeElement(componentLike)).toBe(el);
  });
});
