## Updating to 2026

- [x] Run `mms update-scouting-version 2026.0.1`
- [x] In `scouting/common/types`, create a `2026` folder. In the folder, copy in contents from `scouting/common/types/2025`
- [] Update type names to 2026, update event structure and enum values as needed.
- [x] Update `scouting/common/helpers/yearConfig` to have a case for 2026.
- [] At this point the **Overseer** application is updated for 2026, **Sentinel** will require significant re-work on the UI components for the 2026 game
  - [] Will need to update the `LogContext`'s `useLog` hook to include 2026 event logic
  - [] Will need to update the `prematch` screen
  - [] Will need to update the `teleop` screen
  - [] Will need to update the `endGame` screen
