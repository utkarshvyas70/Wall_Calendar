## Architectural Decisions & Philosophy

This project was built to test how close web technologies can emulate the tactile, premium feel of physical print design, without sacrificing performance.

* **Why Cormorant Garamond?** Typography dictates the weight of an interface. I needed a high-contrast serif to mimic premium editorial stationery. Cormorant Garamond provides extreme contrast in its weight transitions, giving the headers an "ink-pressed" feel that generic sans-serifs simply cannot achieve.
* **Why no Date Libraries?** Libraries like `date-fns` or `moment.js` are massive overkill for generating a 42-cell grid. I opted to build a custom `useCalendar` hook using the native JavaScript `Date` object (specifically leveraging `new Date(year, month, 0)` to calculate month boundaries). This keeps the logic precise, the dependencies at zero, and the bundle size microscopic.
* **Why `localStorage` over a Backend?** For a personal utility like a physical wall calendar, latency is the enemy. By utilizing `localStorage` to persist the Notes and the Base64 custom Hero Images, the app achieves absolute zero-latency updates. It feels like an instant, native application.
* **Animations & Performance:** I strictly avoided heavy animation libraries like Framer Motion. Every micro-interaction (the `popIn` selection, the staggered `inkSpread` range band, the `slideIn` transitions) is powered by vanilla CSS keyframes and `requestAnimationFrame` hooks. This ensures consistent 60fps rendering even on lower-end mobile devices.

#### What I'd Build Next (Given another week)
1.  **IndexedDB Image Storage:** Base64 strings chew through the `localStorage` 5MB quota quickly. I'd migrate the image blobs to IndexedDB to allow high-res photo uploads without ceiling limits.
2.  **iCal Parsing Web Worker:** I would write a web worker to ingest standard `.ics` feeds (from Google/Apple Calendar) and map real user events onto the UI grid without blocking the main render thread.
3.  **Drag-to-Select:** Upgrading the 3-click date range architecture to allow fluid, mouse-down/drag highlighting across the grid cells.
## Engineering Process & Architecture

Before writing a single line of React, I mapped out the state flow and component responsibilities. My primary constraint was to build complex date-range logic without relying on heavy libraries like `date-fns` or `moment.js`.

![Architecture Sketch](./public/Assets/architecture-sketch.png)

By isolating the business logic into custom hooks (`useCalendar` and `useNotes`), the main UI component remains purely declarative and focused on rendering the CSS animations.
## How to run locally
1. Install Dependencies
Bash
npm install

2. Verify Assets
Ensure your local month images are placed in the following directory:
public/Assets/
Required files: January.png, February.png, ..., December.png.

3. Run the Development Server
Bash
npm run dev
Open http://localhost:3000 in your browser to see the result.
