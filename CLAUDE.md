# @glint-ng/core — AI Coding Assistant Instructions

## Project Overview
Angular Style Zone UI component library built on Angular CDK. Provides zoned, cascading style customization via CSS custom properties and signal-based DI.

**Package**: `@glint-ng/core` | **Prefix**: `glint-` | **Angular**: 21.x | **Nx**: 22.x

## Commands
```bash
npx nx build ui              # Build library (ng-packagr)
npx nx test ui               # Run library tests (Vitest)
npx nx lint ui               # Lint library
npx nx serve demo            # Serve demo app (dev mode)
npx nx build demo            # Build demo app
npx nx test demo             # Run demo app tests
npx nx graph                 # Visualize dependency graph
```

## Project Structure
```
libs/ui/src/lib/
├── core/                    # Theme system, tokens, palette, utilities
│   ├── types/branded.ts     # CSSColor, CSSLength, CSSBorderRadius, etc.
│   ├── tokens/              # ZoneTheme model, DI token, registration
│   ├── palette/             # Color scales, spacing, radius, shadows, etc.
│   ├── style-zone/          # StyleZoneComponent
│   ├── overlay/             # ZoneAwareOverlayService
│   └── utils/               # mergeZoneThemes, dev-validation
├── icon/                    # Icon system (agnostic renderer, Lucide defaults)
│   ├── icon.component.ts    # GlintIconComponent (SVG renderer)
│   ├── icon.registry.ts     # GLINT_ICON_REGISTRY + provideGlintIcons()
│   ├── icon.config.ts       # GLINT_ICON_CONFIG + provideGlintIconConfig()
│   ├── map-icons.ts         # mapIcons<T>() + lucideToSvg()
│   └── default-icons.ts     # ~36 Lucide icons registered by provideGlintUI()
├── accordion/               # Accordion + AccordionPanel (content projection)
├── avatar/                  # Avatar + AvatarGroup
├── badge/                   # Badge (severity, size)
├── breadcrumb/              # Breadcrumb (data-driven)
├── button/                  # GlintButton (severity, variant, size)
├── card/                    # GlintCard + header/subtitle/footer directives
├── checkbox/                # Checkbox (CVA)
├── chip/                    # Chip (removable)
├── confirm-dialog/          # ConfirmDialog service (imperative)
├── dialog/                  # Dialog service + container (CDK overlay)
├── divider/                 # Divider (horizontal/vertical, labeled)
├── drawer/                  # Drawer (CDK overlay, positions)
├── fieldset/                # Fieldset (toggleable)
├── input/                   # GlintInput (CVA, variants)
├── input-number/            # InputNumber (CVA, spinner)
├── menu/                    # Menu (CDK overlay, data-driven)
├── message/                 # Message (inline, severities)
├── paginator/               # Paginator (rows, page events)
├── panel-menu/              # PanelMenu (icons, collapsed mode, router links)
├── password/                # Password (CVA, strength meter)
├── popover/                 # Popover (CDK overlay)
├── presets/                 # Theme presets (DARK_ZONE, etc.)
├── progress-bar/            # ProgressBar (determinate/indeterminate)
├── progress-spinner/        # ProgressSpinner
├── radio-button/            # RadioButton (CVA)
├── search/                  # Search (lightweight, non-CVA, model() binding)
├── select/                  # Select + SelectOption (CDK overlay, CVA)
├── shell/                   # Shell layout (sidebar, header, content, DI token)
├── skeleton/                # Skeleton (shapes)
├── slider/                  # Slider (CVA, min/max/step)
├── split-button/            # SplitButton (CDK overlay)
├── stepper/                 # Stepper + Step (content projection, error states)
├── table/                   # Table + Column directive (selection, empty template)
├── tabs/                    # Tabs + TabPanel (content projection)
├── tag/                     # Tag (severity, removable)
├── textarea/                # Textarea (CVA, auto-resize)
├── timeline/                # Timeline (data-driven)
├── toast/                   # Toast service + component (imperative)
├── toggle-switch/           # ToggleSwitch (CVA)
├── toolbar/                 # Toolbar (slot directives)
└── tooltip/                 # Tooltip directive (CDK overlay, positioned)
```

### Component Patterns
Components follow five key architectural patterns:

- **CVA (ControlValueAccessor)**: Form controls (Input, Checkbox, RadioButton, ToggleSwitch, Textarea, InputNumber, Password, Slider, Select) self-inject `NgControl`, use `disabledFromCVA` signal merged with `disabled` input via `computed()`
- **Content Projection**: Container components (Tabs, Accordion, Stepper) use `contentChildren()` + `ng-template` + `NgTemplateOutlet` for lazy panel rendering
- **CDK Overlay**: Components needing positioned popups (Menu, Popover, Drawer, SplitButton, Tooltip, Dialog) use `ZoneAwareOverlayService` for zone-aware overlays
- **Service-based (Imperative)**: Toast and ConfirmDialog provide injectable services with `show()`/`confirm()` APIs
- **Data-driven**: Components accepting structured input arrays (Table, Menu, Breadcrumb, Timeline) use `input.required<T[]>()`
- **Shell Layout**: CSS Grid-based app layout (Shell, ShellSidebar, ShellHeader, ShellContent) with `GLINT_SHELL_SIDEBAR` DI token for child components to detect sidebar state
- **Icon System**: `GlintIconComponent` renders SVG strings from hierarchical `GLINT_ICON_REGISTRY` (multi:true DI). `provideGlintUI()` registers ~36 Lucide defaults. Users extend via `provideGlintIcons(mapIcons(icons, converter))`. `GlintMenuItem.icon` is a registered icon name.

## Coding Conventions

### Components
- **Standalone only** — no NgModules
- **Signal inputs**: `input()`, `input.required()` — never `@Input()`
- **Signal outputs**: `output()` — never `@Output() EventEmitter`
- **Computed state**: `computed()` — never getters
- **Change detection**: `ChangeDetectionStrategy.OnPush` on all components
- **DOM writes**: `afterRenderEffect({ write })` — never `effect()` for DOM mutations
- **DI**: `inject()` function — never constructor injection
- **Control flow**: `@if`, `@for`, `@switch` — never `*ngIf`, `*ngFor`
- **Host binding**: `host: {}` in component metadata — never `@HostBinding`/`@HostListener`
- **Selectors**: `glint-` prefix for components, `glintCamelCase` for directives

### Branded Types
All theme values use branded types for compile-time safety:
```typescript
type CSSColor = string & { readonly __brand: 'css-color' };
type CSSLength = string & { readonly __brand: 'css-length' };
```
Palette constants are pre-cast. Raw values require explicit cast: `'#custom' as CSSColor`.

### Styles
- **Inline CSS** for simple components (button, card)
- **External `.css` files** for complex components (dialog, select)
- **No SCSS in components** — only `libs/ui/src/styles/` uses SCSS
- Reference tokens as `var(--glint-color-primary)`, etc.
- Variants via `host: { '[attr.data-variant]': 'variant()' }` and `:host([data-variant="filled"])`
- Use `color-mix(in oklch, ...)` for hover/active states
- Use logical CSS properties (`padding-inline`, `margin-block-start`) for RTL
- Declare transitions: `transition: background-color var(--glint-duration-normal) var(--glint-easing-standard)`

### Testing
- **Vitest** with `@analogjs/vitest-angular`
- Use CDK `ComponentHarness` for complex interactive components
- Test zone theme inheritance, ARIA attributes, keyboard navigation
- Test CVA integration with `FormControl` for form components

### Common Gotchas
1. **DOM writes in effect()** — Always use `afterRenderEffect({ write })` instead
2. **inject() in useFactory** — Use `inject()` directly, never `deps: []` with `forwardRef`
3. **toSignal() context** — Must be called in injection context (field initializer), not in methods
4. **display: contents** — Never add ARIA roles to `<glint-style-zone>` host element
5. **Overlay CSS vars** — Apply to `overlayRef.overlayElement` (per-overlay), NEVER to `cdk-overlay-container` (shared)
6. **CSS @property syntax** — Color tokens MUST use `syntax: '<color>'` for transitions and `color-mix()` to work
7. **Tree-shaking** — Color scales are separate modules; don't re-export individual scales from barrel unless needed
8. **ZONE_INHERIT sentinel** — Calls `style.removeProperty()`, not `setProperty('')`

## Architecture Quick Reference
See [ARCHITECTURE.md](ARCHITECTURE.md) for full details. Key patterns:
- **Style Zone**: `<glint-style-zone [theme]="{ colorPrimary: GlintColor.Blue.S500 }">`
- **Theme DI**: `inject(ZONE_THEME)` returns `Signal<ZoneTheme>`
- **Token registration**: `CSS.registerProperty()` at runtime from `DEFAULT_ZONE_THEME`
- **Overlay inheritance**: `ZoneAwareOverlayService` captures zone and applies to overlay pane
