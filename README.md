# Sleeple

Build Phase 1 of a sleek, dark-mode web application called "Sleeple" that normalizes sleep data across different wearables (Fitbit, Garmin, Apple Health, Oura, Google Pixel Watch) so friends can fairly compare their sleep metrics.

---

### UI & Aesthetic Foundation

- **Visual Vibe:** Futuristic, glassmorphic dark mode (`#0B0F19` deep midnight background, `#1E293B` translucent glass cards, cyan and neon purple glowing accents).

- **Typography:** Modern sans-serif (Inter or Plus Jakarta Sans).

- **Navigation Shell:** Header with "SleepSync" logo (glowing moon icon) and tab navigation: "Dashboard", "Formula Builder", "Leaderboard & Challenges", "Chronotypes & Social", "Devices & Settings".

- **User Profile Pill:** Displays active level, XP bar, chronotype, and current device badge in top right (e.g., "Level 5 • 🦁 Lion • Apple Watch").

---

### Key Features for Phase 1 (Dashboard View)

1. **Normalization Info Banner:** Brief banner explaining how raw metrics across devices are normalized to a standardized 0–100 Unified Sleep Score.

2. **Unified Score Hero Card:** Circular progress ring with total score (e.g., 88/100) and key metric cards (Total Duration, Deep Sleep %, REM Sleep %, Efficiency, Resting HR).

3. **Cross-Device Comparison Chart:** Interactive line/bar chart showing daily sleep scores over time with options to filter by 7 Days / 30 Days.

4. **Side-by-Side Device Comparison Widget:** A card allowing the user to select two friends with different devices (e.g., Sarah on Garmin vs. Marcus on Fitbit) and compare their deep sleep %, REM %, and resting heart rate.

---

### Mock Data (Include 6 Sample Users):

- You (User • Apple Watch • Level 5)

- Alex (Garmin • Lion • Level 12)

- Sarah (Fitbit • Bear • Level 9)

- Marcus (Apple Watch • Wolf • Level 15)

- Elena (Oura Ring • Dolphin • Level 7)

- David (Google Pixel Watch • Bear • Level 4)

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7672b4e1-44d0-4fc5-b866-3e2c4174fb46).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
