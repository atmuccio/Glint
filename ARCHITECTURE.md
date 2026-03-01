# @glint-ng/core — Architecture

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
Each color scale is a separate module (`@glint-ng/core` internal `palette/colors/blue.ts`). esbuild can't tree-shake object properties, so unused scales are excluded at the module level.

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

## App Shell Layout

The shell provides a CSS Grid-based app layout with sidebar, header, and content areas. The sidebar supports collapse/expand with animated transitions.

```text
+──────────────+────────────────────────+
│ sidebar      │ header    (col2, row1) │
│ (col1,       ├────────────────────────┤
│  row 1/-1)   │ content   (col2, row2) │
│              │ (scrollable)           │
+──────────────+────────────────────────+
```

### Shell DI Token
`GLINT_SHELL_SIDEBAR` allows child components (e.g., PanelMenu) to detect sidebar state via DI:

```typescript
export interface GlintShellSidebarHost {
  collapsed: Signal<boolean>;
  width: Signal<string>;
  collapsedWidth: Signal<string>;
}
```

`GlintShellSidebarComponent` provides this token. `GlintPanelMenuComponent` optionally injects it to adapt to collapsed mode (hiding labels, showing icon-only items with tooltips).

### Grid Layout
`GlintShellComponent` uses a private CSS variable `--_sidebar-width` computed from the sidebar's signals:

```css
:host {
  display: grid;
  grid-template-columns: var(--_sidebar-width, 0px) 1fr;
  grid-template-rows: auto 1fr;
  transition: grid-template-columns var(--glint-duration-normal) var(--glint-easing);
}
```

The sidebar width animates via CSS `transition` on the grid columns, driven by `contentChild()` signal reads.

### Responsive Collapse
`breakpointCollapse` input (default: 1024px) uses `matchMedia` via `afterNextRender` for SSR safety. Set to `0` to disable auto-collapse.

## Icon System

### Overview
Library-agnostic SVG icon renderer with hierarchical DI registry. The system is designed so the public API accepts raw SVG strings from any source, while defaulting to Lucide icons for internal components.

### Architecture
```
GlintIconComponent          — renders SVG strings, looks up by name
GLINT_ICON_REGISTRY         — multi:true InjectionToken<Record<string, string>[]>
provideGlintIcons()         — registers a Record<string, string> in the registry
mapIcons<T>(icons, fn)      — generic adapter: converts any format → SVG strings
lucideToSvg()               — Lucide IconNode → SVG string converter
provideGlintUI()            — auto-registers ~36 default Lucide icons
```

### DI Pattern
Uses `multi: true` providers. The component flattens all providers with a single `reduce()`. Later providers override earlier ones. Child injectors naturally override parent injectors via Angular's DI hierarchy.

```typescript
// Register raw SVG strings
provideGlintIcons({ logo: '<svg>...</svg>' })

// Register Lucide icons via adapter
import { Home, Users } from 'lucide';
provideGlintIcons(mapIcons({ home: Home, users: Users }, lucideToSvg))

// Register any icon library
provideGlintIcons(mapIcons(heroicons, myHeroConverter))
```

### Component Implementation
- Uses `afterRenderEffect({ write })` to set `innerHTML` from resolved SVG string
- Sizes via `--glint-icon-size` CSS variable (defaults to `1em`)
- Inherits `currentColor` for seamless theme integration
- Dev-mode warning when icon name not found in registry
- `aria-hidden="true"` for decorative icons, `aria-label` for meaningful ones

### GlintMenuItem.icon
The `icon` field on `GlintMenuItem` is a registered icon name (string). Menu components render it via `<glint-icon [name]="item.icon" />` instead of the previous `[innerHTML]` approach, eliminating the XSS vector.

### Test Infrastructure
`provideGlintTestIcons()` registers all icon names with minimal placeholder SVGs. Add to TestBed for specs testing components that contain `<glint-icon>`.

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

## Component Patterns (Detailed)

### CVA Pattern (Form Controls)
All form controls implement `ControlValueAccessor` without `NG_VALUE_ACCESSOR` provider. Instead, they self-inject `NgControl` and set `valueAccessor` manually:

```typescript
private ngControl = inject(NgControl, { optional: true, self: true });
constructor() {
  if (this.ngControl) this.ngControl.valueAccessor = this;
}
```

Disabled state merges template input with CVA state:
```typescript
private disabledFromCVA = signal(false);
isDisabled = computed(() => this.disabled() || this.disabledFromCVA());
```

Components with native elements (input, textarea) use `afterRenderEffect({ write })` to sync the disabled attribute to the DOM.

### Content Projection (Tabs, Accordion, Stepper)
Container components discover child panels via `contentChildren()`:
```typescript
panels = contentChildren(GlintTabPanelComponent);
```

Each panel wraps content in `<ng-template>` for lazy rendering. The container renders active panel(s) via `NgTemplateOutlet`.

### CDK Overlay (Menu, Popover, Drawer, Dialog)
All overlay components use `ZoneAwareOverlayService` to create zone-aware overlays:
```typescript
const { overlayRef, injector } = this.overlay.createZoneAwareOverlay(config, this.injector);
```

This ensures CSS custom properties from the current style zone are applied to the overlay element, maintaining theme consistency even though overlays render at body level.

### Service-based (Toast, ConfirmDialog)
These provide imperative APIs via injectable services:
- `GlintToastService.show()` — adds toast to a signal-based message queue
- `GlintConfirmDialogService.confirm()` — opens a dialog and returns `Promise<boolean>`

### Data-driven (Table, Menu, Breadcrumb, Timeline)
Components accept typed arrays as required inputs:
```typescript
items = input.required<GlintMenuItem[]>();
events = input.required<GlintTimelineEvent[]>();
```
