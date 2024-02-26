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
