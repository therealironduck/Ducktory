# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ducktory is a Nuxt module that provides an alternative to Storybook and Histoire for creating interactive component stories. Published as `@therealironduck/ducktory` on npm.

## Common Commands

```bash
# Development
bun run dev              # Start dev server (generates Tailwind + runs nuxi dev playground)
bun run dev:prepare      # Prepare module and playground (run after cloning or changing module structure)

# Quality
bun run lint             # ESLint with auto-fix
bun run test:types       # Type checking via vue-tsc (checks both root and playground)

# Build
bun run prepack          # Build module for distribution
bun run dev:build        # Build playground for testing

# Tailwind
bun run tailwind         # Regenerate Tailwind CSS (required when adding new Tailwind classes)
bun run tailwind:watch   # Watch mode for Tailwind CSS
```

**Important**: After cloning, always run `bun install && (cd playground && bun install) && bun run dev:prepare`.

## Architecture

### Module Structure

```
src/
├── module.ts              # Main Nuxt module entry point (DucktoryOptions defined here)
├── build/
│   ├── stories.ts         # Story file parsing and template generation
│   ├── bundler.ts         # Vite bundler extensions
│   ├── integrations.ts    # Integration system loader
│   └── transform/         # AST transformation utilities
├── runtime/
│   ├── pages/             # Ducktory UI pages (index.vue, story.vue)
│   ├── components/        # UI components used by Ducktory
│   ├── composables/       # defineStory(), useDucktory()
│   └── assets/            # Tailwind CSS (generated), fonts
└── types/                 # TypeScript type definitions

playground/                # Example Nuxt app for development
├── stories/               # Example story files
└── nuxt.config.ts
```

### Story Files

Stories are Vue SFCs with `.story.vue` suffix located in the configured `storyDirectory` (default: `stories/`):

```vue
<script lang="ts" setup>
defineStory({
  name: 'Button',
  documentation: 'Optional markdown documentation'
})
</script>

<template>
  <MyButton>Click me</MyButton>
</template>
```

`defineStory()` is a compile-time macro - its arguments are extracted at build time and stripped from production builds.

### Module Configuration

Configure in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@therealironduck/ducktory'],
  ducktory: {
    path: '/ducktory',           // URL path
    enabled: true,               // Disable in production
    storyDirectory: 'stories',   // Where story files live
    debug: false,                // Enable verbose logging
  }
})
```

### Styling

Uses Tailwind CSS v4 with `ducktory:` prefix for all utilities. When adding new Tailwind classes, regenerate CSS with `bun run tailwind`.

## Code Style

- TypeScript with strict mode
- ESLint flat config with `@nuxt/eslint-config`
- 2-space indentation, LF line endings
- Vue Composition API with `<script setup>`