# @glint/ui — Architecture

## Style Zone System

### Overview
The Style Zone system provides cascading, zoned style customization. Consumers wrap content in `<glint-style-zone>` components with a `[theme]` input to override design tokens. Zones nest — inner zones inherit from outer zones and override selectively.

```html
<glint-style-zone [theme]="{ colorPrimary: GlintColor.Blue.S500 }">
  <glint-button severity="primary">Blue</glint-button>

  <glint-style-zone [theme]="{ colorPrimary: GlintColor.Green.S500 }">
    <glint-button severity="primary">Green (inherits contrast from outer)</glint-button>
  </glint-style-zone>
</glint-style-zone>
```

### Dual Delivery Mechanism
Each `<glint-style-zone>` delivers theme values through two channels:

1. **CSS custom properties** on the host element → visual styling cascades naturally through the DOM tree. Components read `var(--glint-color-primary)` etc.

2. **Signal<ZoneTheme> via DI** → behavioral properties (density, default variant) accessed programmatically via `inject(ZONE_THEME)`.

### Why Signals for the DI Token
A plain `InjectionToken<ZoneTheme>` captures once at injection time. By providing a `computed()` signal, children always get the latest value when the zone's theme input changes.

### CSS Custom Property Cascade Flow
```
CSS.registerProperty() → initial-value (global defaults)
    ↓ (inherits: true)
<glint-style-zone> host → style.setProperty('--glint-*', ...)
    ↓ (CSS inheritance)
  <glint-button> → var(--glint-color-primary) resolves
    ↓ (CSS inheritance)
  <glint-style-zone> inner host → overrides specific properties
      ↓ (CSS inheritance)
    <glint-button> → var(--glint-color-primary) resolves to inner value
```

### ZONE_INHERIT Sentinel
Setting a property to `ZONE_INHERIT` calls `style.removeProperty()` on that CSS variable, causing it to fall back to the nearest ancestor's value or the `@property` initial-value.

## CSS Architecture

### @layer Order
```scss
@layer glint.reset, glint.tokens, glint.components, glint.utilities;
```
- **reset**: Minimal `box-sizing: border-box`
- **tokens**: Reserved for CSS custom property defaults (registered via JS)
- **components**: All component styles live here
- **utilities**: Visibility helpers, sr-only, etc.

**Consumer override strategy**: Unlayered consumer styles always beat layered library styles. This is by design.

### @property Registration (Runtime)
All CSS custom properties are registered at runtime via `CSS.registerProperty()` from TypeScript. The single source of truth is `DEFAULT_ZONE_THEME` in `zone-theme.model.ts`.

```typescript
CSS.registerProperty({
  name: '--glint-color-primary',
  syntax: '<color>',       // Enables transitions and color-mix()
  inherits: true,          // Theme tokens cascade through zones
  initialValue: '#3b82f6', // From DEFAULT_ZONE_THEME.colorPrimary
});
```

**Token inheritance rules:**
- **Theme tokens** (colors, fonts, spacing): `inherits: true` — cascade through zones
- **Component-internal tokens** (if added later): `inherits: false` — scoped, better perf

### Color Tokens Must Use `syntax: '<color>'`
This is required for:
- `color-mix(in oklch, var(--glint-color-primary), transparent 20%)` to work
- CSS `transition: background-color` to animate between theme changes

## Branded Type System

### Purpose
Prevent category mistakes at compile time. A `CSSColor` value can't accidentally be passed where a `CSSLength` is expected.

```typescript
type CSSColor = string & { readonly __brand: 'css-color' };
type CSSLength = string & { readonly __brand: 'css-length' };
type CSSBorderRadius = string & { readonly __brand: 'css-border-radius' };
type CSSShadow = string & { readonly __brand: 'css-shadow' };
type CSSFontFamily = string & { readonly __brand: 'css-font-family' };
type CSSDuration = string & { readonly __brand: 'css-duration' };
```

### Palette Constants
Pre-cast constants provide IDE autocomplete with full type safety:
```typescript
GlintColor.Blue.S500      // CSSColor
GlintSpacing.Md           // CSSLength
GlintRadius.Lg            // CSSBorderRadius
```

**Raw escape hatch** (deliberate friction):
```typescript
'#custom' as CSSColor     // Explicit cast required
```

### Dot-Accessible Keys
Color scales use `S50..S950` prefix (not numeric `50..950`) for IDE autocomplete compatibility in Angular templates:
```typescript
GlintColor.Blue.S500  // ✓ Works in templates
GlintColor.Blue[500]  // ✗ Numeric keys break template autocomplete
```

### Tree-Shaking
Each color scale is a separate module (`@glint/ui` internal `palette/colors/blue.ts`). esbuild can't tree-shake object properties, so unused scales are excluded at the module level.

## Overlay Zone Inheritance

### The Problem
Angular CDK overlays render in `<div class="cdk-overlay-container">` at `<body>` level, breaking CSS custom property inheritance from zones.

### The Solution: ZoneAwareOverlayService
1. Captures the current `ZONE_THEME` signal from the calling component's injector
2. Applies CSS variables to `overlayRef.overlayElement` (the individual overlay pane, NOT the shared container)
3. Creates a child `Injector` providing the captured theme signal
4. For long-lived overlays (dialog): uses `afterRenderEffect({ write })` for reactive CSS updates, with cleanup tied to overlay lifecycle via `DestroyRef`

**Critical**: Never set `--glint-*` on `cdk-overlay-container` — it's shared across all overlays.

### Dialog Injector Pattern
```typescript
// Consumer code — injector captured automatically
const dialog = injectGlintDialog();
dialog.open(MyComponent, { data: { ... } });

// Internal — injectGlintDialog() captures caller's injector
export function injectGlintDialog(): GlintDialog {
  const injector = inject(Injector);
  const dialog = inject(GlintDialogService);
  return { open: (comp, config) => dialog.open(comp, config, injector) };
}
```

## Component API Conventions

### Inputs
| Input | Type | Used By |
|---|---|---|
| `variant` | Component-specific literal union | All components |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'neutral'` | Button |
| `disabled` | `boolean` | Button, Input, Select |
| `loading` | `boolean` | Button |

### Variant Implementation
```typescript
host: { '[attr.data-variant]': 'variant()' }
```
```css
:host([data-variant="filled"]) { /* filled styles */ }
:host([data-variant="outlined"]) { /* outlined styles */ }
```

### Animated Theme Transitions
Components declare transition properties for smooth theme switching:
```css
:host {
  transition:
    background-color var(--glint-duration-normal) var(--glint-easing-standard),
    color var(--glint-duration-normal) var(--glint-easing-standard),
    border-color var(--glint-duration-normal) var(--glint-easing-standard),
    box-shadow var(--glint-duration-normal) var(--glint-easing-standard);
}
```

### Form Integration
- **v1**: `ControlValueAccessor` only
- `setDisabledState` merges with `disabled` input via `computed()`:
  ```typescript
  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());
  ```

## Dev-Mode Validation
Behind `ngDevMode` guard, `CSS.supports()` checks validate theme values at runtime with helpful error messages pointing to the correct palette constants.
