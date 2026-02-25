# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

#### Icon System
- `GlintIconComponent` SVG renderer with hierarchical `GLINT_ICON_REGISTRY` (multi DI)
- `provideGlintUI()` auto-registers ~36 Lucide icons via `mapIcons()` + `lucideToSvg()`
- All components migrated from Unicode entities to `<glint-icon>`

#### Layout & Navigation
- **Shell** layout system (ShellSidebar, ShellHeader, ShellContent) with CSS Grid
- **Search** component (lightweight, non-CVA, model binding)
- **PanelMenu** with icons, collapsed mode, and router links
- **Dock**, **SpeedDial**, **MenuBar**, **TieredMenu**, **ContextMenu**
- **Breadcrumb**, **Paginator**

#### Form Components
- **AutoComplete** with CVA and async suggestions
- **MultiSelect** with CVA and chip display
- **DatePicker** with CVA and calendar overlay
- **ColorPicker** with CVA and overlay panel
- **Knob** circular slider with SVG and CVA
- **FileUpload** with drag-and-drop
- **InputMask**, **InputOTP**, **InputNumber**, **Password**, **Slider**
- **CascadeSelect**, **TreeSelect**
- **FloatLabel**, **InputGroup**
- **Checkbox**, **RadioButton**, **ToggleSwitch**, **ToggleButton**, **SelectButton**
- **Textarea** with auto-resize
- **Rating** component
- **ListBox** component

#### Data Display
- **Table** with selection, sorting, sticky columns, empty template
- **TreeTable** with hierarchical data
- **DataView** with layout toggle and pagination
- **Tree** component with expand/collapse
- **OrganizationChart**
- **Timeline**, **Avatar** + AvatarGroup, **Badge**, **Tag**, **Chip**
- **Carousel** with autoplay and touch support
- **Galleria** with thumbnails and fullscreen
- **Image** with fullscreen preview, **ImageCompare** with drag slider
- **Scroller** with CDK virtual scrolling

#### Containers & Layout
- **Accordion** (CDK-based) with content projection
- **Tabs** with lazy panel rendering
- **Stepper** (CDK-based) with error states
- **Fieldset** (toggleable)
- **Panel**, **Inplace**
- **Splitter** with resizable panels
- **ScrollPanel** with custom scrollbars
- **Toolbar**, **Divider**
- **Card** with header/subtitle/footer directives
- **MeterGroup**, **Skeleton**

#### Overlays & Feedback
- **Dialog** (CDK-based) with header, close button, position options
- **ConfirmDialog** imperative service
- **ConfirmPopup** with anchored overlay
- **Drawer** (positions: left, right, top, bottom)
- **Popover**, **Tooltip** with delay and positioning
- **Menu**, **SplitButton** with CDK overlay
- **Toast** imperative service with severities
- **Message** (inline, severity variants)
- **ProgressBar** (determinate/indeterminate), **ProgressSpinner**
- **BlockUI** content masking
- **OverlayBadge**
- **ScrollTop**

#### Lists & Editing
- **OrderList** with CDK drag-drop reordering
- **PickList** with cross-list drag-drop
- **Editor** with contenteditable rich text

#### Core / Theming
- **Style Zone** system — cascading theme customization via `<glint-style-zone>`
- Branded types (`CSSColor`, `CSSLength`, `CSSBorderRadius`) for compile-time safety
- Color palette with full scales (Blue, Green, Red, Amber, etc.)
- Theme presets: `DARK_ZONE`, `COMPACT_ZONE`, `DANGER_ZONE`, `SOFT_ZONE`
- `ZoneAwareOverlayService` for zone-aware CDK overlays
- Runtime `CSS.registerProperty()` for typed token transitions
- Signal-based DI with `ZONE_THEME` token

#### Infrastructure
- Nx 22.x monorepo with Angular 21.x
- Vitest test suite (700+ tests)
- ng-packagr library build with tree-shaking support
- Demo application with 80+ component showcase pages

### Changed

- Migrated Accordion to `CdkAccordion`
- Migrated Stepper to `CdkStepper`
- Migrated Dialog to `CdkDialog`
- Migrated all `effect()` DOM writes to `afterRenderEffect()`
- Enhanced Table with `trackBy`, `fixedLayout`, sticky columns, alignment

### Fixed

- Resolved all lint warnings across test files
- UX audit fixes: card directives, overlays, visual polish
- ARIA fixes and convention cleanup across all components
- Tooltip escape dismissal and z-index scale
- Button hover/active feedback for outlined and ghost variants
- Input disabled state driven through FormControl via NgControl injection
- CSS tokens set on `:root` for zero-ceremony usage
