# Glint UI

**Angular Style Zone UI component library** — 80+ themeable components built on Angular CDK with signal-based cascading style customization.

![CI](https://github.com/atmuccio/Glint/actions/workflows/ci.yml/badge.svg)
![npm](https://img.shields.io/npm/v/@glint-ng/core)
![License](https://img.shields.io/badge/license-MIT-blue)

[Live Demo](https://atmuccio.github.io/Glint/) · [Getting Started](libs/ui/README.md) · [Contributing](CONTRIBUTING.md) · [Changelog](CHANGELOG.md)

---

## Features

- **Style Zones** — Nest `<glint-style-zone>` components to cascade theme overrides through your component tree. Each zone inherits from its parent and overlays its own tokens.
- **80+ Components** — Forms, data display, navigation, overlays, layout, and feedback — everything you need for production apps.
- **Signal-based Theming** — Built on Angular signals for reactive, synchronous theme propagation with no zone.js dependency.
- **Zone-aware Overlays** — Dialogs, menus, tooltips, and drawers automatically inherit the theme of their trigger zone.
- **Type-safe Tokens** — Branded types (`CSSColor`, `CSSLength`, `CSSBorderRadius`) catch theming mistakes at compile time.
- **Angular CDK Foundation** — Accordion, Stepper, Dialog, Overlay, Drag & Drop, and Virtual Scrolling powered by `@angular/cdk`.
- **Tree-shakeable** — Import only what you use. Unused components are eliminated from production builds.

## Quick Start

### 1. Install

```bash
npm install @glint-ng/core @angular/cdk lucide
```

### 2. Configure

```typescript
import { provideGlintUI } from '@glint-ng/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideGlintUI(),
  ],
};
```

### 3. Use

```html
<glint-button severity="primary">Click me</glint-button>

<glint-style-zone [theme]="{ colorPrimary: GlintColor.Blue.S500 }">
  <glint-button severity="primary">Blue button</glint-button>
</glint-style-zone>
```

## Component Catalog

| Category | Components |
|----------|-----------|
| **Form** | Input, InputNumber, Textarea, Password, Select, MultiSelect, Checkbox, RadioButton, ToggleSwitch, ToggleButton, SelectButton, Slider, Knob, Rating, ColorPicker, DatePicker, AutoComplete, CascadeSelect, TreeSelect, InputMask, InputOTP, FileUpload, FloatLabel, InputGroup, ListBox |
| **Data** | Table, TreeTable, DataView, Tree, OrganizationChart, Scroller, Timeline, Avatar, Badge, Tag, Chip, Card, Carousel, Galleria, Image, ImageCompare, MeterGroup |
| **Navigation** | Menu, MenuBar, TieredMenu, ContextMenu, PanelMenu, Breadcrumb, Paginator, Dock, SpeedDial, SplitButton, Tabs, Stepper |
| **Overlay** | Dialog, ConfirmDialog, ConfirmPopup, Drawer, Popover, Tooltip, OverlayBadge |
| **Feedback** | Toast, Message, ProgressBar, ProgressSpinner, Skeleton, BlockUI |
| **Layout** | Shell, Divider, Splitter, ScrollPanel, Panel, Fieldset, Accordion, Toolbar, Inplace, ScrollTop |
| **Theming** | StyleZone, Presets (DARK_ZONE, COMPACT_ZONE, DANGER_ZONE, SOFT_ZONE) |

## Theming with Style Zones

Style Zones let you override theme tokens for any section of your app. Zones nest and inherit:

```html
<!-- Root zone: blue primary -->
<glint-style-zone [theme]="{ colorPrimary: GlintColor.Blue.S500 }">
  <glint-button severity="primary">Blue</glint-button>

  <!-- Nested zone: green primary, inherits everything else -->
  <glint-style-zone [theme]="{ colorPrimary: GlintColor.Green.S500 }">
    <glint-button severity="primary">Green</glint-button>
  </glint-style-zone>
</glint-style-zone>
```

Use built-in presets for common configurations:

```typescript
import { DARK_ZONE, COMPACT_ZONE } from '@glint-ng/core';
```

```html
<glint-style-zone [theme]="DARK_ZONE">
  <!-- Dark-themed section -->
</glint-style-zone>
```

## Development

```bash
npm install                  # Install dependencies
npx nx serve demo           # Launch demo app
npx nx test ui              # Run library tests (Vitest)
npx nx lint ui              # Lint library
npx nx build ui             # Build library (ng-packagr)
npx nx build demo           # Build demo app
npx nx graph                # Visualize dependency graph
```

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation, including:

- Style Zone cascading model
- Token registration and CSS custom properties
- Zone-aware overlay system
- Signal-based DI patterns

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Development setup instructions
- Coding standards and component conventions
- Testing requirements
- Pull request process

## License

[MIT](LICENSE) — Copyright (c) 2026 Anthony Muccio
