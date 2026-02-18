/**
 * Shared test utilities for @glint/ui overlay-based components.
 */

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
