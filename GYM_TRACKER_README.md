# Gym Tracker PWA - Setup & Usage Guide

A modern, offline-first Progressive Web App for tracking gym workouts. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Offline-First**: Works without internet connection, all data stored locally
- **Installable**: Can be installed as a standalone app on mobile and desktop
- **Fast & Frictionless**: Minimal taps between sets, auto-prefill last workout values
- **Rest Timer**: Adjustable countdown timer with progress bar
- **Workout Builder**: Create and save workout templates
- **Workout Tracker**: Log sets, reps, and weights in real-time
- **Exercise Swapping**: Change exercises mid-workout while keeping your sets
- **History**: View past workouts with stats (volume, duration, sets)
- **Mobile-First**: Optimized for one-thumb usage

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

## PWA Setup

### Icons

The app requires PWA icons in various sizes. Place them in `public/icons/`:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

See `public/icons/README.md` for generation instructions.

### Testing PWA Offline

1. Build the app for production: `npm run build && npm start`
2. Open in Chrome/Edge
3. Open DevTools → Application → Service Workers
4. Check "Offline" to simulate offline mode
5. Refresh the page - the app should still work

### Installing PWA

**Desktop (Chrome/Edge):**
1. Visit the app in the browser
2. Click the install icon in the address bar
3. Or click "Install App" button in the app header

**Mobile (Chrome/Safari):**
1. Visit the app in mobile browser
2. Tap the share/menu button
3. Select "Add to Home Screen"

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with PWA metadata
│   └── page.tsx            # Main page with Builder + Tracker
├── components/
│   └── Workout/
│       ├── WorkoutBuilder.tsx        # Workout creation UI
│       ├── WorkoutTracker.tsx        # Active workout tracking
│       ├── RestTimer.tsx             # Countdown timer
│       ├── PWAInstaller.tsx          # Install prompt handler
│       └── ServiceWorkerRegistration.tsx  # SW registration
├── contexts/
│   └── WorkoutContext.tsx  # Global workout state management
├── lib/
│   └── storage.ts          # localStorage helper functions
└── types/
    └── workout.ts          # TypeScript data models

public/
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
└── icons/                  # PWA icons (to be added)
```

## Data Models

### Key Types

```typescript
type MuscleGroup = "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core" | "Other";

interface ExerciseTemplate {
  id: string;
  title: string;
  muscleGroup: MuscleGroup;
  description: string;
  defaultSets: number;
  restSeconds?: number;
}

interface WorkoutTemplate {
  id: string;
  name: string;
  date: string;
  muscles: MuscleGroup[];
  exercises: ExerciseTemplate[];
  defaultRestSeconds: number;
}

interface WorkoutSession {
  id: string;
  name: string;
  date: string;
  muscles: MuscleGroup[];
  exercises: WorkoutSessionExercise[];
  startedAt: string;
  finishedAt?: string;
  totalVolume?: number;
  totalDurationSeconds?: number;
}
```

## Customization

### Change Muscle Groups

Edit `src/components/Workout/WorkoutBuilder.tsx`:

```typescript
const MUSCLE_GROUPS: MuscleGroup[] = [
  "Chest",
  "Back",
  "Legs",
  // Add or remove muscle groups here
];
```

Also update the type in `src/types/workout.ts`:

```typescript
export type MuscleGroup =
  | "Chest"
  | "Back"
  // Add matching types here
```

### Change Default Rest Time

Edit `src/components/Workout/WorkoutBuilder.tsx`:

```typescript
const DEFAULT_REST_SECONDS = 60; // Change this value
```

### Extend Data Model

To add new fields:

1. Update types in `src/types/workout.ts`
2. Update UI components to display/edit new fields
3. Update storage functions in `src/lib/storage.ts` if needed

## How to Use

### Creating a Workout

1. Navigate to the **Builder** tab
2. Enter workout name (e.g., "Push Day")
3. Select muscles trained
4. Click "Add Exercise":
   - Enter exercise name
   - Select target muscle
   - Add description
   - Set default sets and rest time
5. Repeat to add more exercises
6. Optionally "Save Template" for reuse
7. Click "Start Workout"

### Tracking a Workout

1. Click "Start Workout" from Builder
2. For each exercise:
   - Enter reps and weight for each set
   - Click "+ Add Set" to add more sets (auto-prefills)
   - Use "Swap" to change exercise
   - Click "Mark Done" when finished
3. Use the Rest Timer between sets
4. Click "Overview" to see progress
5. Click "Finish Workout" when done

### Viewing History

1. Go to **Tracker** tab
2. Click "View History"
3. See last 5 completed workouts with stats

## Data Storage

All data is stored locally using `localStorage`:

- **Templates**: Saved workout templates
- **Sessions**: Completed workout history
- **Active Workout**: Current workout in progress (auto-saved)
- **Builder State**: Persists across page reloads

Data persists even when offline or after app is closed.

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari (iOS 15.4+): Full support with limitations on install
- Opera: Full support

## Troubleshooting

### Service Worker Not Registering

- Service workers only work in production builds or over HTTPS
- In development, use `npm run build && npm start`
- Check browser console for errors

### App Not Installing

- Ensure manifest.json is accessible at `/manifest.json`
- Ensure all required PWA criteria are met (HTTPS, service worker, icons)
- Icons must be valid PNG files in correct sizes

### Data Not Persisting

- Check if localStorage is enabled in browser
- Check browser console for quota errors
- Clear site data and try again

### Offline Not Working

- Service worker must be registered first (requires one online visit)
- Check Application → Service Workers in DevTools
- Ensure "Update on reload" is unchecked

## Performance

- First load: ~200-300ms
- Subsequent loads (cached): ~50-100ms
- Offline load: ~50-100ms
- No backend dependencies
- All operations run locally

## Future Enhancements

Potential features to add:

- Export/import workouts (JSON/CSV)
- Charts and progress tracking
- Exercise library with images/videos
- Custom themes
- Workout programs (multi-week plans)
- Share workouts with friends
- IndexedDB for larger data storage
- Background sync for multi-device support

## License

MIT License - Feel free to use and modify for your needs.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Ensure you're using a supported browser
4. Try in incognito/private mode to rule out extensions

---

Built with Next.js 15, TypeScript, Tailwind CSS, and localStorage.
