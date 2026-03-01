# @glint-ng/core — Library Conventions

## Adding a New Component

### Checklist
1. Create directory: `libs/ui/src/lib/<component-name>/`
2. Create component file: `<component-name>.component.ts`
3. Use standalone component with `ChangeDetectionStrategy.OnPush`
4. Selector: `glint-<component-name>` (or `glint<CamelCase>` for directives)
5. Use `input()` / `input.required()` for all inputs
6. Use `output()` for all events
7. Inject `ZONE_THEME` for zone-aware styling (if needed)
8. Add `host: { '[attr.data-variant]': 'variant()' }` for variant support
9. Create spec file: `<component-name>.component.spec.ts`
10. Create harness file: `<component-name>.harness.ts` (for complex interactive components)
11. Export from `libs/ui/src/index.ts`

### Component Template
```typescript
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ZONE_THEME } from '../core/tokens/zone-theme.token';

@Component({
  selector: 'glint-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
  },
  styles: `
    :host {
      display: inline-flex;
      /* Use var(--glint-*) for all visual properties */
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
      border-radius: var(--glint-border-radius);
      padding: var(--glint-spacing-sm) var(--glint-spacing-md);
      transition:
        background-color var(--glint-duration-normal) var(--glint-easing-standard),
        color var(--glint-duration-normal) var(--glint-easing-standard);
    }
    :host([data-variant="outlined"]) {
      background: transparent;
      border: 1px solid var(--glint-color-primary);
      color: var(--glint-color-primary);
    }
  `,
  template: `<ng-content />`,
})
export class GlintExampleComponent {
  private zone = inject(ZONE_THEME);
  variant = input<'filled' | 'outlined'>('filled');
}
```

## Adding a New Design Token

### End-to-End Process
1. **Add to ZoneTheme interface** (`core/tokens/zone-theme.model.ts`):
   ```typescript
   export interface ZoneTheme {
     // ... existing
     newToken: CSSColor; // Use appropriate branded type
   }
   ```

2. **Add default value** (`DEFAULT_ZONE_THEME`):
   ```typescript
   export const DEFAULT_ZONE_THEME: ZoneTheme = {
     // ... existing
     newToken: GlintColor.Blue.S500,
   };
   ```

3. **Add CSS mapping** (`THEME_TO_CSS_MAP`):
   ```typescript
   export const THEME_TO_CSS_MAP: Record<keyof ZoneTheme, string> = {
     // ... existing
     newToken: '--glint-new-token',
   };
   ```

4. **Register in `register-tokens.ts`** — happens automatically from the map + defaults.

5. **Use in components**: `var(--glint-new-token)`

### Token Naming Convention
- CSS variable: `--glint-<category>-<name>` (e.g., `--glint-color-primary`)
- TypeScript key: `camelCase` (e.g., `colorPrimary`)

## Adding a Palette Constant

### For a New Color Scale
1. Create `libs/ui/src/lib/core/palette/colors/<scale-name>.ts`:
   ```typescript
   import { CSSColor } from '../../types/branded';

   /** <Scale Name> color scale */
   export const <ScaleName> = {
     S50:  '<hex>' as CSSColor,
     S100: '<hex>' as CSSColor,
     // ... S200 through S900
     S950: '<hex>' as CSSColor,
   } as const;
   ```
2. Add to `colors/index.ts` GlintColor re-export.

### For Other Constants (spacing, radius, etc.)
Follow the existing pattern in the corresponding file. All values must use the correct branded type.

## CSS Style Rules

### When to Use Inline vs External CSS
- **Inline** (`styles: \`...\``): Simple components (button, card, badge). < ~80 lines of CSS.
- **External** (`styleUrl: './component.css'`): Complex components (dialog, select). > ~80 lines.

### CSS Property Guidelines
- Always use `var(--glint-*)` for visual properties — never hardcode colors, spacing, etc.
- Use `color-mix(in oklch, ...)` for derived colors (hover states, focus rings):
  ```css
  background: color-mix(in oklch, var(--glint-color-primary), transparent 10%);
  ```
- Use logical CSS properties for RTL readiness:
  ```css
  padding-inline: var(--glint-spacing-md);  /* Not padding-left/right */
  margin-block-start: var(--glint-spacing-sm); /* Not margin-top */
  ```
- Declare transitions for animated theme switching.

### Component CSS Scope
- Use `:host` for component root styles
- Use `:host([data-variant="..."])` for variant styles
- Use `:host([data-severity="..."])` for severity styles (button)
- Use `:host(.disabled)` or `:host([aria-disabled="true"])` for disabled states

## Testing Requirements

### All Components
- Renders correctly with default props
- Responds to zone theme changes (CSS vars applied)
- ARIA attributes are correct

### Interactive Components (Button, Input, Select)
- Keyboard navigation works
- Focus management is correct (FocusMonitor integration)
- Disabled state prevents interaction

### Form Components (Input, Select)
- CVA works with `FormControl` and `formControlName`
- `setDisabledState` merges with `disabled` input
- Value changes propagate correctly

### Overlay Components (Tooltip, Dialog, Select dropdown)
- Zone theme is applied to overlay content
- Overlay cleans up on destroy (no leaked DOM)
- Backdrop/escape interactions work correctly

### CDK Harness Tests (complex components)
- Use `ComponentHarness` subclass
- Test user interactions through harness methods
- Verify observable state through harness queries
