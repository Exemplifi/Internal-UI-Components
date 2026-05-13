# Versioning and releases

**Context:** This file belongs to [Internal UI Components](../README.md). For what the repo is and how to build it, read the root README; for every UI demo and file mapping, see [docs/components.md](./docs/components.md).

---

## Why version this kit?

Versioning labels a specific state of the tree so teams can **pin** `src/assets/dist/`, **bisect** regressions, and **reference** fixes in tickets or audits—even if nothing is published to npm.

## Semantic versioning (SemVer)

**MAJOR.MINOR.PATCH** in `package.json` → `"version"`:

| Bump | When |
|------|------|
| **MAJOR** | Breaking changes to documented markup, classes, or bundle behavior that consumers rely on |
| **MINOR** | New demos, variants, or additive behavior that does not break existing demos |
| **PATCH** | Bug fixes, visual or a11y tweaks, dependency bumps with the same outward behavior |

If unsure between MINOR and PATCH: **PATCH** when the same HTML behaves the same; otherwise **MINOR**.

## Source of truth

| Item | Location |
|------|----------|
| Version number | `package.json` → `"version"` |
| Human-readable history | [CHANGELOG.md](./CHANGELOG.md) |
| Optional Git tag | `vX.Y.Z` on the release commit |

Keep tag (if used), `CHANGELOG` section header, and `package.json` version aligned for each release.

## Day-to-day workflow

1. During work: add bullets under `## [Unreleased]` in [CHANGELOG.md](./CHANGELOG.md).  
2. Before merge: Unreleased reflects the PR.  
3. When releasing: move Unreleased into `## [X.Y.Z] - YYYY-MM-DD`, bump `package.json`, commit (e.g. `chore(release): vX.Y.Z`), tag if your team uses tags.

You may use `npm version patch|minor|major`; still edit `CHANGELOG.md` by hand to match.

## Builds

A release should pass **`npm run build:all`** on a clean checkout. If `src/assets/dist/` is committed, include updated dist in the release commit.

## package.json name

The `"name"` field may differ from the folder name; for an internal kit, **`version`** is what matters for releases.
