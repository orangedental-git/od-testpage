# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a reference project for building scroll-driven video animation landing pages. The primary artifact is [scroll-animation-best-practices.md](scroll-animation-best-practices.md), which defines the architecture and patterns for all pages built here.

## Architecture

All pages are **single-file HTML** with inline CSS and JS — no frameworks, no build tools, no package manager. The canonical structure is:

- Fixed fullscreen `<video>` element (z-index: 0) behind all content
- Scrollable body (`height: 500vh` or similar) to create scroll distance
- `position: fixed` text blocks (z-index: 1) that fade in/out based on scroll fraction
- Fixed transparent nav bar (z-index: 10)

The core mechanic: scroll position maps directly to `video.currentTime` via a normalized scroll fraction (0–1).

## Key Implementation Rules

- **Video**: `muted playsinline preload="auto"` — no `autoplay`, no `controls`
- **Scroll mapping**: Always wait for `loadedmetadata` before attaching scroll listeners; set `currentTime` directly, never call `play()`
- **Text triggers**: Use `data-start` / `data-end` attributes (scroll fractions 0–1) on `.text-block` elements
- **Performance**: Wrap scroll handlers in `requestAnimationFrame`; use `will-change: transform, opacity` on animated elements; show a loader until `canplaythrough` fires
- **Text positioning**: Alternate left/right/center placement; 8–12% padding from edges; never center over the main video subject

## Development

No build step — open `index.html` directly in a browser. For live reload, any static file server works (e.g., `npx serve .` or VS Code Live Server).

## Redesign
Lies vor jeder Änderung an der Homepage die .md Dateien in /docs und befolge alle Regeln und Hinweise darin.