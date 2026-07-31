## GoalPilot AI — Finalize Build Plan

### Current situation
The TanStack Start app for GoalPilot AI is implemented with landing page, auth, dashboard, AI planner (Lovable AI Gateway), calendar, tasks, habits, analytics, and settings. State is client-side localStorage with demo seed data.

### What this plan will do
1. **Verify build integrity**
   - Run the dev build/typecheck and check the preview renders without hydration or runtime errors.
   - Inspect console logs and route navigation across `/`, `/auth`, and `/app/*`.

2. **Export code path**
   - Confirm GitHub connection option is available and explain repo cloning (already answered above).

3. **Fix any discovered issues**
   - Hydration: gate localStorage/demo-data renders until hydrated.
   - Any broken links, missing route head metadata per page, or UI regressions.

4. **Polish for publish**
   - Ensure each route has a unique `head()` with title/description/og/twitter metadata.
   - Add responsive/mobile checks for the dashboard sidebar and landing page.

5. **Publish guidance**
   - Provide the publish/update steps and note that frontend changes require clicking **Update** in the publish dialog.

### Deliverables
- Clean running build with no console errors.
- All routes have proper SEO head metadata.
- Clear instructions for exporting code and publishing live.