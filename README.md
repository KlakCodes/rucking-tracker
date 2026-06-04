# Rucking Tracker

A simple Expo and React Native app for manually tracking rucking workouts.

## Features

- Add rucks with date, distance, duration, carried weight, and notes.
- Save entries locally on the device with AsyncStorage.
- Edit existing ruck entries from the history list.
- View total rucks completed, total distance, and average pace.
- See the most recent ruck on the home screen.
- Browse history and delete saved rucks.
- View a simple distance-over-time progress chart.

## Tech Stack

- TypeScript
- React Native
- Expo
- AsyncStorage
- react-native-chart-kit
- react-native-svg

## Install Dependencies

Install Node.js first if it is not already installed.

Then install the project dependencies:

```bash
npm install
```

AsyncStorage is included in `package.json`. If you ever need to install it manually in a fresh Expo project, run:

```bash
npx expo install @react-native-async-storage/async-storage
```

The progress chart uses `react-native-chart-kit` and `react-native-svg`. They are included in `package.json`. If you ever need to install them manually in a fresh Expo SDK 54 project, run:

```bash
npx expo install react-native-svg
npm install react-native-chart-kit
```

## Run The App

Start the Expo development server:

```bash
npm start
```

If Expo Go shows an SDK compatibility error after upgrading, clear Metro's cache:

```bash
npx expo start -c
```

Then choose one of these options:

- Press `a` in the terminal to open on an Android emulator.
- Press `i` in the terminal to open on an iOS simulator on macOS.
- Scan the QR code with Expo Go on a phone.

You can also run platform shortcuts:

```bash
npm run android
npm run ios
```

## Project Structure

```text
App.tsx
src/
  components/
    RuckForm.tsx
    RuckCard.tsx
    SummaryCard.tsx
  screens/
    AddRuckScreen.tsx
    EditRuckScreen.tsx
    HistoryScreen.tsx
    HomeScreen.tsx
    ProgressScreen.tsx
  storage/
    ruckStorage.ts
  utils/
    ruckStats.ts
  theme.ts
  types.ts
```

## Type Checking

Run the TypeScript checker with:

```bash
npm run typecheck
```
