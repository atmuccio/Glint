# Glint

Monorepo for the `@glint/ui` Angular component library and demo application.

## Projects

| Project | Path | Description |
|---------|------|-------------|
| `@glint/ui` | `libs/ui/` | Style Zone UI component library |
| `demo` | `apps/demo/` | Interactive component showcase |

## Quick Start

```bash
npm install
npx nx serve demo            # Launch demo app
```

## Development

```bash
npx nx build ui              # Build library
npx nx test ui               # Run library tests
npx nx lint ui               # Lint library
npx nx build demo            # Build demo app
npx nx graph                 # Visualize dependency graph
```

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.
See [libs/ui/README.md](libs/ui/README.md) for the component library documentation.
