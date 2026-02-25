# @glint/ui

Angular Style Zone UI component library — 80+ themeable components built on Angular CDK with signal-based cascading style customization.

[Live Demo](https://atmuccio.github.io/Glint/) · [GitHub](https://github.com/atmuccio/Glint) · [Contributing](https://github.com/atmuccio/Glint/blob/main/CONTRIBUTING.md)

## Installation

```bash
npm install @glint/ui @angular/cdk lucide
```

**Requirements**: Angular 21+, Node.js 22+

## Setup

Add `provideGlintUI()` to your application config:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideGlintUI } from '@glint/ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideGlintUI(),
  ],
};
```

This registers the default theme tokens, icon set (~36 Lucide icons), and overlay services.

## Your First Component

Import and use any component directly — all components are standalone:

```typescript
import { Component } from '@angular/core';
import { GlintButton } from '@glint/ui';

@Component({
  selector: 'app-root',
  imports: [GlintButton],
  template: `
    <glint-button severity="primary" (click)="count = count + 1">
      Clicked {{ count }} times
    </glint-button>
  `,
})
export class AppComponent {
  count = 0;
}
```

## Theming with Style Zones

Wrap any section of your app in a `<glint-style-zone>` to override theme tokens. Zones nest and inherit:

```typescript
import { Component } from '@angular/core';
import { StyleZoneComponent, GlintButton, GlintColor } from '@glint/ui';

@Component({
  selector: 'app-themed',
  imports: [StyleZoneComponent, GlintButton],
  template: `
    <!-- Blue primary -->
    <glint-style-zone [theme]="{ colorPrimary: blue500 }">
      <glint-button severity="primary">Blue button</glint-button>

      <!-- Nested: green primary, inherits everything else -->
      <glint-style-zone [theme]="{ colorPrimary: green500 }">
        <glint-button severity="primary">Green button</glint-button>
      </glint-style-zone>
    </glint-style-zone>
  `,
})
export class ThemedComponent {
  blue500 = GlintColor.Blue.S500;
  green500 = GlintColor.Green.S500;
}
```

### Theme Presets

Use built-in presets for common configurations:

```typescript
import { DARK_ZONE, COMPACT_ZONE, DANGER_ZONE, SOFT_ZONE } from '@glint/ui';
```

```html
<glint-style-zone [theme]="DARK_ZONE">
  <!-- Dark-themed section -->
</glint-style-zone>
```

## Custom Icons

`provideGlintUI()` registers ~36 default Lucide icons. To add more:

```typescript
import { provideGlintIcons, mapIcons, lucideToSvg } from '@glint/ui';
import { Camera, Download, Share2 } from 'lucide';

export const appConfig: ApplicationConfig = {
  providers: [
    provideGlintUI(),
    provideGlintIcons(mapIcons({ Camera, Download, Share2 }, lucideToSvg)),
  ],
};
```

Then use them by name:

```html
<glint-icon name="Camera" />
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

## Key Concepts

- **Standalone components** — No NgModules. Import components directly.
- **Signal inputs** — All components use `input()` / `input.required()`, not `@Input()`.
- **ControlValueAccessor** — Form components (Input, Select, Checkbox, etc.) work with `ngModel` and Reactive Forms.
- **CDK Overlays** — Dialogs, menus, tooltips, and drawers use `@angular/cdk/overlay` with automatic zone theme inheritance.
- **Branded types** — Theme tokens use `CSSColor`, `CSSLength`, etc. for compile-time safety.

## License

[MIT](https://github.com/atmuccio/Glint/blob/main/LICENSE) — Copyright (c) 2026 Anthony Muccio
