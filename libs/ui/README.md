# @glint/ui

Angular Style Zone UI component library built on Angular CDK. Provides zoned, cascading style customization via CSS custom properties and signal-based DI.

## Features

- **Style Zones** — Cascading theme customization via `<glint-style-zone>` wrapper components
- **40+ Components** — Buttons, forms, data display, navigation, feedback, overlays, shell layout
- **Signal-based** — Built on Angular signals for reactive theme propagation
- **Zone-aware Overlays** — Dialogs, menus, and tooltips inherit zone themes automatically
- **Type-safe Theming** — Branded types (`CSSColor`, `CSSLength`) prevent category mistakes

## Component Catalog

| Category | Components |
|----------|-----------|
| **General** | Button |
| **Form** | Input, InputNumber, Textarea, Password, Select, Checkbox, RadioButton, ToggleSwitch, Slider |
| **Data Display** | Card, Table, Badge, Tag, Avatar, Chip, Timeline |
| **Containers** | Tabs, Accordion, Fieldset, Stepper, Toolbar |
| **Navigation** | Menu, PanelMenu, Breadcrumb, SplitButton, Paginator |
| **Feedback** | Message, Toast, ProgressBar, ProgressSpinner, Skeleton |
| **Overlay** | Dialog, ConfirmDialog, Drawer, Popover, Tooltip |
| **Layout** | Shell, ShellSidebar, ShellHeader, ShellContent, Divider, StyleZone |
| **Theming** | Presets (DARK_ZONE, COMPACT_ZONE, DANGER_ZONE, SOFT_ZONE) |

## Theming

Wrap content in `<glint-style-zone>` to customize tokens. Zones nest and inherit:

```html
<glint-style-zone [theme]="{ colorPrimary: GlintColor.Blue.S500 }">
  <glint-button severity="primary">Blue button</glint-button>

  <glint-style-zone [theme]="{ colorPrimary: GlintColor.Green.S500 }">
    <glint-button severity="primary">Green button</glint-button>
  </glint-style-zone>
</glint-style-zone>
```

Use presets for common configurations:

```typescript
import { DARK_ZONE, COMPACT_ZONE } from '@glint/ui';
```

## Development

```bash
npx nx build ui              # Build library
npx nx test ui               # Run tests (Vitest)
npx nx lint ui               # Lint
npx nx serve demo            # Serve demo app
```
