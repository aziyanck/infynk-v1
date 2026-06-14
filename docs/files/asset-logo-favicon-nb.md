# `src/assets/logo favicon-nb.svg`

**Location**: `src/assets/logo favicon-nb.svg` (20 lines, 100 × 116 viewBox)

## File Purpose

A "no background" variant of the stacked-cards logo (just the white path on a transparent background). Slightly cropped compared to the wide wordmark — only the four rotated rounded cards, no wordmark glyphs.

## Used By

Nothing in the current source — appears to be a leftover asset from an earlier design system. The Vite bundler will warn about a space in the filename; if the asset is never imported, the warning is suppressed because the file is excluded from the build.

## Risks

* Space in the filename. If you import it as `import nb from '../assets/logo favicon-nb.svg'` in the future, Vite resolves it but the build output will rename it. Use kebab-case (`logo-favicon-nb.svg`) to be safe.
* Asset is unused.
