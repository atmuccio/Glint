# Contributing to Glint UI

Thank you for your interest in contributing! This guide will help you get started.

## Prerequisites

- **Node.js** 22.x or later (LTS recommended)
- **npm** 10.x or later
- **Git**

## Development Setup

1. **Fork** the repository on GitHub
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/Glint.git
   cd Glint
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Verify** the setup:
   ```bash
   npx nx test ui --watch=false
   npx nx lint ui
   npx nx build ui
   ```

## Development Workflow

### Branch Naming

Create a feature branch from `main`:

```bash
git checkout -b issue/<number>-short-description
```

Examples: `issue/42-fix-button-focus`, `issue/99-add-color-picker`

### Making Changes

```bash
npx nx serve demo    # Launch demo app for visual testing
npx nx test ui       # Run tests in watch mode during development
```

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

**Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
**Scope**: `ui`, `demo`, or a specific component name

Examples:
- `feat(ui): add ColorPicker component`
- `fix(button): correct focus ring on keyboard navigation`
- `docs: update CONTRIBUTING.md`

### Submitting a Pull Request

1. Ensure all checks pass:
   ```bash
   npx nx lint ui
   npx nx test ui --watch=false
   npx nx build ui
   ```
2. Push your branch:
   ```bash
   git push -u origin issue/<number>-short-description
   ```
3. Open a Pull Request against `main`
4. Fill out the PR template completely

## Coding Standards

### Component Conventions

All components follow strict conventions documented in:

- **[CLAUDE.md](CLAUDE.md)** — Full coding conventions and architecture reference
- **[libs/ui/CONVENTIONS.md](libs/ui/CONVENTIONS.md)** — Component-specific patterns

Key requirements:

- **Standalone components only** — no NgModules
- **Signal inputs** (`input()`, `input.required()`) — never `@Input()`
- **Signal outputs** (`output()`) — never `@Output()`
- **OnPush change detection** on all components
- **`@if` / `@for` / `@switch`** control flow — never structural directives
- **`inject()`** function — never constructor injection
- **`host: {}`** in metadata — never `@HostBinding` / `@HostListener`

### Code Style

- **ESLint** and **Prettier** are configured — run `npx nx lint ui` before submitting
- Use **inline CSS** for simple components, **external `.css` files** for complex ones
- Reference theme tokens as `var(--glint-color-primary)`, etc.
- Use logical CSS properties (`padding-inline`, `margin-block-start`) for RTL support

### Testing

- **Vitest** with `@analogjs/vitest-angular` (not Jasmine/Karma)
- Test ARIA attributes, keyboard navigation, and theme inheritance
- Test CVA integration with `FormControl` for form components
- Use CDK `ComponentHarness` for complex interactive components

## Review Process

After submitting a PR:

1. **Automated checks** — CI must pass (lint, test, build)
2. **Code review** — A maintainer will review your PR. Expect feedback on:
   - Adherence to component conventions
   - Test coverage
   - Accessibility
   - Performance implications
3. **Iteration** — Address any feedback with additional commits
4. **Merge** — Once approved, a maintainer will merge your PR

We aim to review PRs within a few days. For larger contributions, consider opening an issue first to discuss the approach.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Please read it before participating.

## Questions?

- Open a [GitHub Discussion](https://github.com/atmuccio/Glint/discussions) for questions
- Check existing [issues](https://github.com/atmuccio/Glint/issues) before filing a new one
