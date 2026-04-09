# Contributing to InterDash

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/InterDash.git
   cd InterDash
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Run the dev server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173).

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

Every commit message must follow this format:

```
<type>(optional scope): <description>
```

### Allowed types

| Type       | Description                                       |
| ---------- | ------------------------------------------------- |
| `feat`     | A new feature                                     |
| `fix`      | A bug fix                                         |
| `docs`     | Documentation-only changes                        |
| `style`    | Code style (formatting, missing semicolons, etc.) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf`     | Performance improvement                           |
| `test`     | Adding or updating tests                          |
| `build`    | Changes to the build system or dependencies       |
| `ci`       | CI configuration changes                          |
| `chore`    | Other changes that don't modify src or test files |
| `revert`   | Revert a previous commit                          |

### Examples

```bash
git commit -m "fix: resolve infinite re-render loop in Dashboard"
git commit -m "perf: lazy load Three.js scene component"
git commit -m "refactor(auth): sanitize URL parameters before use"
```

> Bad commits like `"fixed stuff"` or `"updates"` will be rejected.

## Branch Naming

Use descriptive branch names:

```
fix/memory-leak-dashboard
perf/lazy-load-heavy-components
fix/xss-vulnerability-search
```

## Pull Request Process

1. Create a new branch from `main`:
   ```bash
   git checkout -b fix/your-fix-name
   ```
2. Make your changes and commit using the convention above.
3. Push to your fork:
   ```bash
   git push origin fix/your-fix-name
   ```
4. Open a **Pull Request** against the `main` branch of [testorg-mindfire/InterDash](https://github.com/testorg-mindfire/InterDash).
5. Fill in the PR description explaining **what** you changed and **why**.
6. Reference the relevant ISSUE number from [ISSUES.md](ISSUES.md) (e.g., "Fixes ISSUE-014").
7. Wait for review — a maintainer will review and merge.

## Project Structure

```
src/
├── components/     # React components (Dashboard, Header, Footer, etc.)
│   └── ui/         # shadcn/ui primitives (Button, Card, Input, etc.)
├── lib/            # Utility libraries (cn helper)
├── utils/          # Constants and helper functions
├── App.tsx         # Root component with routing
├── main.tsx        # Entry point
└── index.css       # Tailwind CSS setup
```

## Code Guidelines

- **TypeScript** — all new code should be properly typed (no `any`).
- **Tailwind CSS** — use Tailwind utility classes, avoid inline styles.
- **No console.log** in production code — remove after debugging.
- **Keep PRs focused** — one fix or improvement per PR.
- **Test your changes** — run `npm run build` before submitting.

## Reporting Issues

- Use GitHub Issues to report bugs or request features.
- Include steps to reproduce, expected behavior, and screenshots if applicable.
- Reference the issue number from [ISSUES.md](ISSUES.md) if applicable.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
