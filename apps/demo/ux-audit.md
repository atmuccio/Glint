# UX Audit — @glint/ui Demo App

**Date**: 2026-02-18
**Browser**: Chromium 1400x900
**Pages audited**: 28/28

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 4 |
| Major | 12 |
| Minor | 16 |
| Suggestion | 10 |

---

## Critical Issues

### 1. [critical] Progress Bar (Determinate) uses black fill instead of primary color
**Page**: `/feedback`
The determinate progress bar renders with a solid black fill (`#000`) instead of the theme's primary color (`--glint-color-primary`). This breaks visual consistency with the severity-colored progress bars shown directly below it, which correctly use green/blue/orange/red fills.

**Fix**: Set the determinate bar's fill to `var(--glint-color-primary)`.

### 2. [critical] Organization Chart nodes clipped/overflowing container
**Page**: `/trees`
The org chart's left-most nodes are clipped by the container boundary. "James Park (CTO)" renders as just "(CTO)", "David Johnson (Backend Lead)" shows as "d Johnson (Backend Lead)", and bottom-left nodes like "Priya Patel (Developer)" show only "oper)". The horizontal scrollbar appears but the initial scroll position hides the left side of the chart.

**Fix**: Either center the chart within its container, add `overflow: auto` with the scroll starting at center, or set `min-width` to prevent clipping. Consider auto-fitting the chart to the available width.

### 3. [critical] Slider thumb is solid black — not themed
**Page**: `/form-controls`
All slider thumbs render as solid black circles regardless of theme. The thumb should use `var(--glint-color-primary)` to match the rest of the design system. The track fill (left of thumb) is also not colored — it appears as a uniform gray line with no visual indication of the selected range.

**Fix**: Style the slider thumb with `background: var(--glint-color-primary)` and add a filled track segment showing the active range.

### 4. [critical] Dark + Compact (Pre-composed) zone — outlined button invisible
**Page**: `/theme`
In the "Dark + Compact (Pre-composed)" zone, the second button (outlined variant) is nearly invisible — it renders as a faint white rectangle on the dark background with no visible text. The text color likely matches the dark background.

**Fix**: Ensure outlined buttons in dark zones use a light text color (e.g., `var(--glint-color-text-primary)` which should resolve to white/light in dark contexts).

---

## Major Issues

### 5. [major] Slider "With labels" shows "0" twice — confusing label layout
**Page**: `/form-controls`
The "With labels" slider displays three labels below: "0", "0", and "100". The first "0" is the min label and the second "0" is the current value — but they appear identical and adjacent, creating confusion. When the value is at minimum, there's no visual distinction between them.

**Fix**: Either differentiate the current value label (bold, colored, or positioned above the thumb) or hide the current value label when it matches min/max.

### 6. [major] Table striped rows have no visible striping
**Page**: `/table`
The "Striped Table" section shows alternating rows but the striping contrast is too subtle to be perceptible. At the 1400px viewport the alternating row backgrounds appear identical to the default white background.

**Fix**: Increase the striped row background contrast. Use something like `color-mix(in oklch, var(--glint-color-surface-ground) 50%, var(--glint-color-surface-section))`.

### 7. [major] Password toggle icon renders as small circle glyph
**Page**: `/text-inputs`
The password visibility toggle button shows as a tiny "○" character instead of a recognizable eye/eye-slash icon. This is not discoverable as a clickable toggle and doesn't communicate its purpose.

**Fix**: Replace the text glyph with an SVG eye icon (open eye for hidden, slashed eye for visible). Consider using the same icon approach as the checkbox checkmark.

### 8. [major] Select dropdown feels sparse — excessive vertical whitespace
**Page**: `/select`
The select demo page has only two demo cards ("Basic Select" and "Select with FormControl") that occupy a small portion of the viewport. The options inside dropdowns also have generous padding that makes the component feel oversized compared to inputs.

**Fix**: Add more select variants to the demo (disabled, multi-select, grouped options, with placeholder). For the component itself, review option item padding to match input field density.

### 9. [major] Compact zone buttons not visibly smaller
**Page**: `/theme`
The "Compact Zone" section shows two buttons labeled "Compact" but they appear the same size as buttons in the "Default Theme" section above. The compact zone should visibly reduce padding and font size.

**Fix**: Verify the compact zone theme overrides actually propagate `--glint-font-size-*` and `--glint-spacing-*` tokens. The buttons should be noticeably smaller.

### 10. [major] Soft Zone card has no visible difference from default cards
**Page**: `/theme`
The "Soft Card" in the Soft Zone section looks identical to default cards — same border radius, same shadow. The description says "rounded corners and softer shadows" but no visual difference is apparent.

**Fix**: Ensure the soft zone applies larger `--glint-border-radius-*` values (e.g., `1rem` vs the default) and softer/larger box shadows.

### 11. [major] Dark Zone card — title "Dark Card" has poor contrast
**Page**: `/theme`
In the Dark Zone, the card title "Dark Card" renders in a color that could have better contrast against the dark background. The input label "Dark Input" similarly appears muted.

**Fix**: Ensure card titles and input labels in dark zones use `var(--glint-color-text-primary)` which should be light on dark backgrounds.

### 12. [major] Checkbox tree nodes have unstyled native checkboxes
**Page**: `/trees`
The "Tree with Checkbox Selection" section renders native HTML checkboxes that don't match the styled glint-checkbox component used on the `/form-controls` page. This breaks visual consistency.

**Fix**: Replace native `<input type="checkbox">` with `<glint-checkbox>` or apply the same custom checkbox styling.

### 13. [major] TreeTable alternating row color nearly imperceptible
**Page**: `/trees`
Similar to the main table issue, the tree table's alternating rows have almost no visible contrast between odd and even rows.

**Fix**: Apply the same striping fix as the main table component.

### 14. [major] Float Label with native input — border styling mismatch
**Page**: `/advanced-inputs`
The Float Label demo using a native `<input>` has a visible border styling mismatch compared to `<glint-input>`. The border appears thinner and a different color, breaking the visual harmony within the same demo section.

**Fix**: Ensure Float Label applies consistent border styling regardless of the inner input type. Consider requiring `<glint-input>` inside Float Label.

### 15. [major] Cascade Select and Tree Select dropdowns are narrower than peers
**Page**: `/advanced-selects`
The CascadeSelect and TreeSelect dropdown panels are noticeably narrower than the standard Select and MultiSelect dropdowns. This creates visual inconsistency when these components appear on the same form.

**Fix**: Set a consistent `min-width` on overlay panels, or match the trigger element width like the standard Select does.

### 16. [major] InputOTP boxes don't show focus ring on the active box
**Page**: `/advanced-inputs`
When typing in the OTP input, individual boxes don't visually indicate which one is active/focused. There's no focus ring or border color change on the current input position.

**Fix**: Add `:focus-within` or active-segment styling to highlight the current OTP position.

---

## Minor Issues

### 17. [minor] Debug "Value:" text uses inconsistent typography
**Pages**: `/form-controls`, `/selection`, `/advanced-inputs`, `/text-inputs`
Several demo sections display reactive state as `"Value: 40"` or `"FormControl value: true"` using what appears to be a monospace/code font. This is inconsistent — some use monospace, others use the body font.

**Fix**: Standardize all debug output in demos to use a consistent style (e.g., a `<code>` tag with `font-family: monospace` and a light background).

### 18. [minor] Sidebar navigation doesn't indicate current route on page load
**Page**: All pages
The sidebar correctly highlights the active link (e.g., "Form Controls" has a left accent bar and brighter text), but on initial page load there can be a brief flash before the active state appears.

**Fix**: Ensure `routerLinkActive` class is applied synchronously on initial render.

### 19. [minor] Tooltip page has too little content — feels incomplete
**Page**: `/tooltip`
Only two sections (Basic and Disabled) are shown. Missing demos for: tooltip positions (top/right/bottom/left), custom delay, HTML content in tooltips, tooltip on disabled elements.

**Fix**: Add position variants, delay configuration, and escape behavior demos.

### 20. [minor] Dialog demo page has only a trigger button — no inline preview
**Page**: `/dialog`
The page only shows a "Open Dialog" button with no visible component preview. Unlike other demo pages that show the component inline, users must click to see anything.

**Fix**: Consider showing a static/non-modal preview of the dialog content, or add more dialog variant triggers (sizes, positions, with form content).

### 21. [minor] Toast demo page has only trigger buttons — no visible toasts
**Page**: `/toast`
Similar to the dialog page, toast demos only show trigger buttons. The actual toast appearance is only visible after clicking.

**Fix**: Consider showing a permanent/pinned example toast for each severity, plus the interactive triggers.

### 22. [minor] Message close button ("x") is small and hard to target
**Page**: `/feedback`
The dismissible message's close button renders as a small "x" character that's a tight touch/click target (appears ~16x16px).

**Fix**: Increase the click target to at least 32x32px with padding. Consider using an SVG icon.

### 23. [minor] Breadcrumb separator uses plain "/" — could be styled
**Page**: `/navigation`
The breadcrumb separator is a plain "/" text character. While functional, it looks less polished than a chevron icon (">") used in most modern design systems.

**Fix**: Consider using an SVG chevron-right icon as the default separator, with an option to customize.

### 24. [minor] Stepper step circles don't fill with primary color when active
**Page**: `/stepper-timeline`
The active step in the stepper has a border highlight but the circle isn't filled with the primary color. Completed steps similarly lack a filled/checked appearance.

**Fix**: Fill the active step circle with `var(--glint-color-primary)` and show a checkmark in completed steps.

### 25. [minor] Timeline connector line has inconsistent thickness
**Page**: `/stepper-timeline`
The vertical connector line between timeline items varies slightly in apparent thickness, possibly due to sub-pixel rendering at the current zoom level.

**Fix**: Ensure the connector uses a consistent `2px` border or `width` value.

### 26. [minor] Avatar fallback initials are not centered in some sizes
**Page**: `/data-display`
The avatar component's text fallback (initials) appears slightly off-center vertically in the smaller size variants.

**Fix**: Ensure `display: flex; align-items: center; justify-content: center` is applied to the text container at all sizes.

### 27. [minor] Paginator "Rows per page" select is unstyled
**Page**: `/table`
The paginator's rows-per-page dropdown appears as a native `<select>` element that doesn't match the styled `<glint-select>` component.

**Fix**: Replace with `<glint-select>` or apply consistent dropdown styling.

### 28. [minor] Skeleton shapes don't animate
**Page**: `/feedback`
The skeleton placeholders render as static gray blocks without the characteristic shimmer/pulse animation that indicates loading.

**Fix**: Add a CSS `@keyframes` shimmer or pulse animation to the skeleton component.

### 29. [minor] Checkbox indeterminate state icon is a dash — low contrast
**Page**: `/form-controls`
The indeterminate checkbox shows a horizontal dash/minus icon that has lower visual weight than the checked state's checkmark. It could be mistaken for an unchecked state at a glance.

**Fix**: Make the dash thicker (2px) and ensure it uses the same fill color as the checkmark.

### 30. [minor] Toggle switch track has no "on" color differentiation
**Page**: `/form-controls`
When toggled on, the switch track appears the same gray color as the off state. Only the thumb position changes. Most design systems use a colored track (primary color) for the "on" state.

**Fix**: Apply `background: var(--glint-color-primary)` to the track when the switch is checked.

### 31. [minor] Card subtitle text is same color as body text
**Page**: `/card`
The card subtitle (when present) uses the same color/weight as body text, making it indistinguishable from regular paragraph content.

**Fix**: Use a muted text color (`var(--glint-color-text-secondary)`) and/or smaller font size for subtitles.

### 32. [minor] Knob component has no visible value label
**Page**: `/advanced-inputs`
The knob (circular slider) doesn't display its current numeric value inside or below the circle. Users must rely solely on the visual angle to guess the value.

**Fix**: Show the current value centered inside the knob circle.

---

## Suggestions

### 33. [suggestion] Add hover states to sidebar navigation links
**Page**: All pages
Sidebar links don't show a visible hover state (e.g., background highlight or text color change). Adding subtle hover feedback would improve discoverability.

### 34. [suggestion] Add section anchors/IDs for deep linking
**Page**: All pages
Demo sections (e.g., "Checkboxes", "Radio Buttons") don't have URL anchors. Adding `id` attributes to section headings would enable direct linking to specific component demos.

### 35. [suggestion] Group related form demos into a single page
**Pages**: `/input`, `/text-inputs`, `/select`, `/form-controls`, `/selection`, `/advanced-inputs`, `/advanced-selects`
Seven separate pages for form-related components leads to navigation overhead. Consider consolidating into 2-3 pages: "Text Inputs", "Selection & Controls", "Advanced Inputs".

### 36. [suggestion] Add a "Copy code" snippet to each demo section
**Page**: All pages
Each demo section could include a collapsible code snippet showing the Angular template usage. This is standard in component library documentation.

### 37. [suggestion] Sidebar should scroll independently of content
**Page**: All pages (when viewport is short)
On shorter viewports, the sidebar and content scroll together. A sticky/fixed sidebar with independent overflow scrolling would improve navigation on all viewport sizes.

### 38. [suggestion] Use consistent section card styling across all pages
**Pages**: Various
Most pages wrap each demo in a card-like container with a subtle border. A few sections break this pattern (e.g., some Tree demos). Standardize the container treatment.

### 39. [suggestion] Add empty state for filtered tree with no results
**Page**: `/trees`
The "Tree with Filter" section doesn't show an empty state message when the filter query matches no nodes.

### 40. [suggestion] Consider adding a dark mode toggle to the demo shell
**Page**: All pages
The theme page demonstrates dark zones, but there's no global toggle to preview the entire demo app in dark mode. A toggle in the sidebar header would help validate dark mode across all components.

### 41. [suggestion] Add responsive breakpoint preview
**Page**: All pages
The demo currently only shows desktop layout. Consider adding viewport size toggles (mobile/tablet/desktop) to validate responsive behavior.

### 42. [suggestion] Show disabled state variants for more components
**Pages**: Various
Some components (Button, Input, Checkbox) show disabled states, but many others (Tabs, Accordion, Select options, Menu items) don't demonstrate their disabled appearance.

---

## Pages Covered

| # | Route | Status |
|---|-------|--------|
| 1 | `/button` | Audited |
| 2 | `/input` | Audited |
| 3 | `/text-inputs` | Audited |
| 4 | `/select` | Audited |
| 5 | `/form-controls` | Audited |
| 6 | `/selection` | Audited |
| 7 | `/advanced-inputs` | Audited |
| 8 | `/advanced-selects` | Audited |
| 9 | `/card` | Audited |
| 10 | `/data-display` | Audited |
| 11 | `/table` | Audited |
| 12 | `/tabs` | Audited |
| 13 | `/accordion` | Audited |
| 14 | `/trees` | Audited |
| 15 | `/lists` | Audited |
| 16 | `/media` | Audited |
| 17 | `/feedback` | Audited |
| 18 | `/toast` | Audited |
| 19 | `/dialog` | Audited |
| 20 | `/navigation` | Audited |
| 21 | `/stepper-timeline` | Audited |
| 22 | `/advanced-menus` | Audited |
| 23 | `/divider` | Audited |
| 24 | `/containers` | Audited |
| 25 | `/panels` | Audited |
| 26 | `/utilities` | Audited |
| 27 | `/tooltip` | Audited |
| 28 | `/theme` | Audited |
