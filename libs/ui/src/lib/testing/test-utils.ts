/**
 * Shared test utilities for @glint-ng/core components.
 */
import { Provider } from '@angular/core';
import { provideGlintIcons } from '../icon/icon.registry';

/** Minimal SVG placeholder for testing — a simple 24x24 rect. */
const TEST_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24"/></svg>';

/** All icon names used by library components. */
const ALL_ICON_NAMES = [
  'x', 'check', 'plus', 'minus', 'search', 'pencil', 'trash',
  'chevronDown', 'chevronUp', 'chevronLeft', 'chevronRight',
  'chevronsLeft', 'chevronsRight', 'chevronsUp', 'chevronsDown',
  'arrowUp', 'arrowDown', 'arrowLeft', 'arrowRight',
  'arrowUpDown', 'arrowLeftRight',
  'circleCheck', 'info', 'triangleAlert', 'circleX',
  'star', 'eye', 'eyeOff', 'gripVertical', 'menu',
  'externalLink', 'ellipsisVertical', 'maximize', 'layoutGrid',
  'calendar',
] as const;

/**
 * Provides all icon names used by library components with test placeholder SVGs.
 *
 * Add to `TestBed.configureTestingModule({ providers: [provideGlintTestIcons()] })`
 * for specs that test components containing `<glint-icon>`.
 */
export function provideGlintTestIcons(): Provider[] {
  return provideGlintIcons(
    Object.fromEntries(ALL_ICON_NAMES.map(name => [name, TEST_SVG])),
  );
}

/**
 * Removes all content from CDK overlay containers.
 * Call in `afterEach` blocks of tests that open overlays
 * to prevent leaking DOM between test cases.
 */
export function cleanupOverlays(): void {
  document.querySelectorAll('.cdk-overlay-container').forEach(el => {
    el.innerHTML = '';
  });
}
