# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build the production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code linting

## Code Quality Tools

- **Biome**: Primary code formatting and linting tool configured in `biome.json`
  - Format code with space indentation, double quotes, trailing commas
  - Specific rules disabled: `noArrayIndexKey`, `noLabelWithoutControl`
  - Next.js domain rules enabled
- **TypeScript**: Strict mode enabled with ES2017 target
- **ESLint**: Next.js configuration for additional linting

## Architecture

This is a Next.js 15 quiz application built with React 19 and TypeScript:

### Core Structure
- **App Router**: Uses Next.js 13+ app directory structure
- **Single Page App**: Main quiz interface in `components/Quiz.tsx`
- **UI Components**: shadcn/ui component library in `components/ui/`
- **Styling**: Tailwind CSS with custom configuration

### Key Components
- `app/page.tsx`: Root page that renders the Quiz component
- `components/Quiz.tsx`: Main quiz application with state management for:
  - Multiple choice questions
  - Coding exercises with code template display
  - Score tracking and progress visualization
  - Result summary and quiz completion flow
- `components/ui/`: Reusable UI components (Button, Card, Progress, Badge, etc.)

### Dependencies
- **UI**: React 19, Next.js 15, shadcn/ui with Radix primitives
- **Styling**: Tailwind CSS, class-variance-authority, clsx, tailwind-merge
- **Icons**: Lucide React
- **Database**: Prisma with SQLite (configured but not actively used in current quiz implementation)

### Quiz Features
- Mixed question types (multiple choice and coding exercises)
- Real-time feedback with explanations
- Progress tracking and scoring
- Mobile-responsive design
- Korean language content focused on data science/ML topics

## Path Aliases
- `@/components` → `./components`
- `@/lib` → `./lib`
- `@/hooks` → `./hooks` (configured but not used)
