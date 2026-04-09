# InternDash - Issue Tracker

**Timeline:** 3-4 hours
**Goal:** Fix bugs, improve performance, reduce bundle size, refactor code quality
**Setup:** npm install && npm run dev

---

## P0 - Critical & Security Bugs

### ISSUE-001: Open Redirect via URL Parameters
A URL query parameter is read on page load and used directly in window.location.href without any origin or domain validation, enabling phishing attacks.

### ISSUE-002: Plaintext Credentials Stored in localStorage and Leaked in DOM
User credentials are stored in plaintext in localStorage and cookies, and the auth token is rendered in hidden input fields visible to any DOM-reading script or extension.

### ISSUE-003: Arbitrary Code Execution via URL Parameters
URL query parameters are passed to eval() and new Function() on page load allowing any visitor to execute arbitrary JavaScript in the user's browser session.

### ISSUE-004: Prototype Pollution via postMessage
Incoming postMessage events are deep-merged into app state without origin validation or key sanitization, allowing any cross-origin page to pollute Object.prototype.

### ISSUE-005: XSS via dangerouslySetInnerHTML
Multiple components render user-controlled and API-sourced text as raw HTML, allowing script injection through form inputs and API responses.

### ISSUE-006: Infinite Re-renders & Memory Leaks
Multiple setInterval and useEffect hooks missing cleanup cause unbounded memory growth and the entire component tree re-renders every second.

### ISSUE-007: State Mutations Don't Trigger UI Updates
Direct array/object mutations (.push, .splice, bracket assignment) before setState calls cause the UI to not reflect actual state changes.

### ISSUE-008: Stale Closures in Async Handlers
Callbacks inside setTimeout and event listeners capture stale state values, causing operations to use outdated data.

### ISSUE-009: Broken Pagination
Off-by-one errors show extra items per page and the last page is unreachable due to Math.floor instead of Math.ceil.

### ISSUE-010: Broken ErrorBoundary
The ErrorBoundary class uses direct state mutation in componentDidCatch and its render method falls through to children even when an error was caught.

### ISSUE-011: Form Submission Reloads Page
A comment form uses onSubmit without e.preventDefault(), causing a full page reload when the user submits.

### ISSUE-012: Global Error & Warning Handlers Overridden
window.onerror is overridden to swallow all errors, and console.warn is patched to hide all React warnings, making debugging nearly impossible.

---

## P1 - Performance & Bundle Size

### ISSUE-013: 5.4MB JavaScript Bundle
Full imports of lodash, moment, d3, Three.js, mathjs, faker, xlsx, pdf-lib, crypto-js, and jszip are all loaded eagerly at the entry point.

### ISSUE-014: No Code Splitting or Lazy Loading
All 15+ route components are eagerly imported in the root file with no React.lazy or dynamic import() usage.

### ISSUE-015: 5000 DOM Elements Rendered Without Virtualization
An image gallery renders all 5000 photos as img tags simultaneously and preloads them all via new Image() on every tick.

### ISSUE-016: Fibonacci O(2^n) in Render Path
A recursive fib(35) call runs synchronously during every render cycle, blocking the main thread for 100ms+.

### ISSUE-017: Chart Instances Destroyed and Recreated Every Second
Chart.js canvas instances and D3 SVG elements are torn down and rebuilt on every counter tick, leaking GPU/canvas memory.

### ISSUE-018: No React.memo and Inline Functions Everywhere
Every child component receives a counter prop that changes every second, and all callback props are inline arrow functions recreated each render.

### ISSUE-019: O(n²) and O(n) Heavy Loops Every Second
Multiple components run matrix multiplications, million-iteration loops, 10K fake record generation, and force simulations on every tick.

### ISSUE-020: Synchronous Startup Computation Blocks First Paint
The entry point generates 5000 fake records, computes a 100x100 matrix multiplication, and runs MD5 hashing before React mounts.

### ISSUE-021: localStorage & sessionStorage Written Every Second
Eight or more locations write JSON-serialized state to storage on every counter tick, filling quotas and degrading performance.

### ISSUE-022: Deep Clone of 5000-Item Array Every Second
A full JSON.parse(JSON.stringify(...)) deep clone of 5000 photo objects runs on every counter tick for no functional purpose.

---

## P2 - Duplicate Fetching & API Misuse

### ISSUE-023: Same API Endpoints Fetched 2-3x Redundantly
Parent and child components both independently fetch the same data from the same endpoints.

### ISSUE-024: API Calls Fire Every Second
Data fetching depends on a counter that increments every second, hammering APIs continuously and triggering rate limits.

### ISSUE-025: Sequential Fetches That Should Be Parallel
Eight or more API requests are awaited sequentially instead of using Promise.allSettled for parallel execution.

### ISSUE-026: No Fetch Cancellation - Race Conditions
No AbortController is used anywhere, so stale responses from slow requests overwrite fresh state.

### ISSUE-027: Feed Data Grows Unbounded From Polling
A component fetches and appends 50 items to its list on every counter tick without deduplication, growing the array infinitely.

### ISSUE-028: Polling Intervals Continue After Unmount
Background polling setIntervals have no cleanup and continue firing after the component unmounts.

---

## P3 - Accessibility & UX

### ISSUE-029: Modals Have No Focus Trap or Keyboard Handling
Modal and lightbox overlays lack role="dialog", aria-modal, focus trapping, Escape key handling, and scroll locking.

### ISSUE-030: Missing ARIA Labels and Keyboard Navigation
Interactive elements like selects, clickable divs, and image grid items have no ARIA labels, roles, or tabIndex.

### ISSUE-031: Z-Index Stacking Conflicts
Search dropdown, notification panel, dashboard modal, and image lightbox all compete with overlapping z-index values.

### ISSUE-032: Dark Mode Broken on Dropdowns
A notification dropdown uses hardcoded white background colors that make text invisible when dark mode is active.

### ISSUE-033: Anchor Tags Used Instead of Buttons and Router Links
Navigation uses anchor tags instead of router links causing full page reloads, and clickable text uses href="#" instead of buttons.

### ISSUE-034: No 404 Route
Unknown URLs render a blank page because there is no catch-all route defined in the router.

### ISSUE-035: Input Focus Stolen on Every Render
A component forces focus to its input on every render cycle, stealing focus away from whatever the user is currently typing in.

### ISSUE-036: Edit Mode Gets Stuck With No Exit
A double-click-to-edit feature has no save, cancel, blur, or Escape handler, permanently trapping the item in edit mode.

### ISSUE-037: Add Button Doesn't Clear Input
The add button successfully creates the item but forgets to clear the input field afterward.

---

## P3 - Code Quality

### ISSUE-038: God Component With 20+ useState Hooks
A single 400+ line component manages all dashboard state with no extraction into custom hooks or sub-components.

### ISSUE-039: Prop Drilling 4+ Levels Deep
State and callbacks are passed through 4+ component layers instead of using context or state management.

### ISSUE-040: 50+ Console.log Statements
Logging is scattered throughout the entire codebase with no log levels, conditionals, or production stripping.

### ISSUE-041: Dead Code and Unused Utility Files
Utility and constant files exist but are never imported anywhere in the application.

### ISSUE-042: No Debounce on Search
Search inputs fire API calls and filter computations on every single keystroke with no debounce or throttle.

### ISSUE-043: Unbounded History Arrays in State
Multiple components accumulate history arrays in state that grow without limit and are never pruned.

### ISSUE-044: TypeScript Types Are All `any`
Props, state, API responses, and function parameters are typed as any throughout with no proper interfaces defined.

### ISSUE-045: Global Window Namespace Pollution
Heavy library instances are assigned to window properties at startup, polluting the global namespace.

### ISSUE-046: Context Value Recreated Every Render
The context provider value object is not memoized, causing all context consumers to re-render on every tick.

### ISSUE-047: Regex Crash on Special Characters
User search input is used directly as a RegExp pattern without escaping, causing crashes on characters like [ or (.

### ISSUE-048: No StrictMode
The app renders without React.StrictMode, hiding issues like missing cleanup functions and impure component renders.

---

## P3 - Critical UI Bugs

### ISSUE-049: Hardcoded Pixel Widths Cause Horizontal Overflow on Mobile
Multiple container components use fixed `width: 900px` and `minWidth: 800px` inline styles instead of responsive units, causing horizontal scrollbars and clipped content on viewports narrower than 900px. Sidebar, table wrapper, and card grid all need max-width with overflow handling.

### ISSUE-050: Form Validation Errors Computed But Never Rendered
`validateForm()` runs on submit and populates an `errors` state object, but the JSX for every input field is missing the conditional error message element beneath it. Users see no feedback when submitting invalid data and the form silently rejects submission.

### ISSUE-051: Dropdown Menus Don't Close on Outside Click
Dropdown open/close state is toggled only by the trigger button. There is no `document.addEventListener('mousedown', ...)` handler to close the dropdown when the user clicks elsewhere, so once opened a dropdown can only be closed by clicking its own toggle again.

### ISSUE-052: Low Color Contrast Fails WCAG AA Across Multiple Components
Badge, tag, and caption elements use hardcoded color pairs (`#aaa` on `#fff`, `#ccc` on `#f5f5f5`, `#999` on `#eee`) that fall below the 4.5:1 contrast ratio required for normal text. Each affected component needs its foreground and background values updated together.

### ISSUE-053: Drag-and-Drop Broken — Missing preventDefault on dragover
Draggable list items fire `onDragStart` and `onDrop` handlers but `onDragOver` does not call `e.preventDefault()`. Without this, the browser treats the target as non-droppable and the drop event never fires. All draggable containers are affected.

### ISSUE-054: Tab Component Ignores Arrow Key Navigation
The `Tabs` component handles `onClick` to switch tabs but has no `onKeyDown` handler. The ARIA tabs pattern requires `ArrowLeft` and `ArrowRight` to move focus between tabs, `Home`/`End` to jump to first/last, and `Enter`/`Space` to activate. Keyboard-only users cannot switch tabs.

### ISSUE-055: Toast Notifications Stack Infinitely With No Auto-Dismiss
Every action pushes a new entry into the toasts array with no maximum length cap and no `setTimeout` to remove it. After a few minutes of normal use, dozens of stale toasts stack on screen. Both a TTL-based removal and a max-count eviction need to be added.

### ISSUE-056: Highlighted Row Resets After Sort or Filter
The selected item is stored as an array index (`selectedIndex`). When the list is sorted or filtered the underlying array reorders, causing the highlight to jump to a different row or disappear. Selection must be keyed to a stable item `id` and the highlighted item looked up by that id after every data change.

### ISSUE-057: Tooltip Position Ignores Viewport Boundaries
Tooltip position is calculated as a fixed offset below and to the right of the trigger element with no viewport edge detection. Tooltips for elements near the right or bottom edge are clipped outside the visible area. The component needs to measure `getBoundingClientRect()` and flip or shift the tooltip when it would overflow.

### ISSUE-058: Controlled Input Cursor Jumps to End on Every Keystroke
A search input is a controlled component whose `value` is set from a state variable that is updated inside a `setTimeout`. The async state update causes React to re-render with the cursor forcibly moved to the end of the string on every character typed mid-word. The debounce and state update pattern need to be restructured.

### ISSUE-059: CSS Keyframe Animation Runs Continuously Off-Screen
A progress ring and a skeleton shimmer component use `@keyframes` animations with no `animation-play-state` check. Both continue consuming CPU/GPU cycles even when the components are scrolled entirely out of the viewport. An `IntersectionObserver` or `prefers-reduced-motion` media query needs to pause them when not visible.

### ISSUE-060: List Virtualization Scroll Position Resets on Every Data Update
The virtualized list recalculates from `scrollTop = 0` whenever its data prop changes, snapping the user back to the top of the list on every poll cycle. The current scroll offset must be captured before the update and restored after, and items should be identified by stable keys rather than indices to avoid remounting visible rows.

---

## Verification
After fixing, validate with:
1. Bundle analyzer - run the analyzer script
2. React DevTools Profiler - minimal re-renders at idle
3. Chrome Performance tab - no long tasks at idle
4. Network tab - no continuous API calls
5. Console - clean at idle
6. Lighthouse audit - performance and accessibility scores
7. Application tab - storage not growing over time
8. Keyboard navigation - all interactive elements reachable
9. Dark mode toggle - all panels render correctly
10. Try injecting HTML in inputs - should be escaped
