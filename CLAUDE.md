# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Frontend DevTools Hub - A collection of AI-powered browser development tools that provide visual performance insights and automated capabilities beyond traditional chatbot assistance. The project consists of a Next.js marketing website and browser extensions.

## Build & Development Commands

### Web Application (Next.js)
```bash
# Navigate to web app directory
cd web-app

# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Architecture Overview

### Project Structure
- **web-app/** - Next.js 15 marketing website using App Router, TypeScript, and Tailwind CSS v4
- **extensions/** - Browser extensions providing visual development tools
  - **performance-heatmapper/** - Chrome/Edge extension for real-time performance visualization
- **docs/** - Project documentation
- **tools/** - Development utilities

### Web Application Architecture
- **Framework**: Next.js 15.5.3 with Turbopack
- **Styling**: Tailwind CSS v4 with PostCSS, using CSS custom properties for theming
- **TypeScript**: Strict mode enabled with path aliasing (`@/*` → `./src/*`)
- **Font System**: Google Fonts (Geist Sans & Geist Mono) optimized via next/font

### Browser Extension Architecture
The Performance Heatmapper extension uses:
- **Manifest V3** with service workers
- **Content scripts** injected on all URLs for performance monitoring
- **Web accessible resources** for overlay rendering and performance collection
- **Popup interface** for extension controls

## Key Technical Patterns

### Next.js Conventions
- App Router with file-based routing in `src/app/`
- Server Components by default with React 19
- Metadata API for SEO optimization
- Global styles imported in root layout

### Styling Approach
- Tailwind CSS v4 with inline theme configuration
- CSS custom properties for light/dark mode theming
- Component-level utility classes for responsive design

### ESLint Configuration
- Extends Next.js core-web-vitals and TypeScript rules
- Flat config using @eslint/eslintrc compatibility layer
- Ignores build artifacts and generated files