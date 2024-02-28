# Development

## Requirements

- [Bun](https://bun.sh/) v1.0.x

Or a tool supporting `.tool-versions` file.

## Setups

Run this command after cloning this repository.

```
$ git config core.hooksPath .githooks
```

Install project dependencies.

```
$ bun install
```

## Commands

### Format source code

This project uses [dprint](https://dprint.dev/).

```
$ bun run fmt
```

### Start dev server

This starts Vite server on localhost.

```
$ bun run dev
```

### Start Storybook

This starts Storybook dev server on <http://localhost:6006>.

```
$ bun run storybook
```

### Build

This creates `dist/` directory at project root.

```
$ bun run build
```

## Release

A GitHub Actions workflow automatically builds contents of `master` branch then deploys to GitHub Pages.
