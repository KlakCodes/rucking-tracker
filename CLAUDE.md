# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rucking Tracker is a React Native mobile app built with Expo SDK 54 and TypeScript (strict mode). It tracks rucking workouts — distance, duration, weight carried — with local-only storage via AsyncStorage.

## Commands

- `npm start` — start Expo dev server
- `npm start -c` — start with cleared Metro cache (use after Expo upgrades to fix SDK compatibility errors)
- `npm run android` / `npm run ios` — run on emulator/simulator
- `npm run typecheck` — TypeScript type-check (tsc --noEmit)

- `npm run lint` — ESLint (TypeScript + React Hooks rules)

No test runner or formatter is configured.

## Key Constraints

- **Expo SDK must remain at version 54.** Do not upgrade the Expo SDK or related Expo packages.
- TypeScript strict mode is enforced — no implicit any, strict null checks.

## Architecture

- **No router library.** Screen navigation uses string-based state in App.tsx (`currentScreen`). New screens must be added to the switch logic there.
- **No state management library.** App.tsx owns the ruck data array and passes callbacks as props.
- **AsyncStorage key** is `"rucking-tracker:rucks"` in `src/storage/ruckStorage.ts`. Changing it loses all user data.
- Runtime type guard `isRuckEntry()` validates deserialized data from AsyncStorage.

## Code Patterns

- Functional components with hooks; no class components.
- All styles use `StyleSheet.create()` — no inline styles.
- Colors and spacing come from `src/theme.ts` — use `colors.*` and `spacing.*` instead of hardcoded values.
- Unit types use `"miles" | "kilometres"` and `"kg" | "lb"` (note: "kilometres" with British spelling).
- Date strings use YYYY-MM-DD format. Parse with `parseEntryDate()` from `src/utils/ruckStats.ts` to avoid timezone issues — do not use `new Date(dateString)` directly.
- Pace calculation returns `number | null` (null when distance or duration is zero).
- Entry IDs are generated with `String(Date.now())`.
