# AGENTS.md

## Project Overview

- This repository is a static academic homepage.
- Main entry page: `index.html`
- Global styles: `styles.css`
- Frontend behavior: `script.js`
- Structured content lives in `data/`
- Additional static pages live in `pages/`
- Paper landing pages live in `paper-pages/`

## Content Map

- Update homepage biography, education, research interests, services, and similar hand-written sections in `index.html`.
- Update news items in `data/news.json`.
- Update publication items in `data/publications.json`.
- Update profile metadata such as name, subtitle, social links, and avatar in `data/profile-info.json`.
- Update project or paper-specific landing pages inside `paper-pages/<paper-name>/`.

## Editing Rules

- Preserve the existing visual style and structure unless the user explicitly asks for a redesign.
- Prefer small, localized edits over broad rewrites.
- Keep wording concise and professional for academic content.
- When editing JSON content files, preserve valid JSON formatting and chronological ordering conventions already used in the file.
- When adding links to paper pages or homepage cards, reuse existing button/link patterns instead of inventing new markup.

## Preview Rule

- After any page-related change, always provide a local preview path for the user.
- First check whether the local preview server is already running.
- If the local preview server is not running, start it with `python3 -m http.server 8001` from the repository root.
- If the same page has already been opened during the current turn, do not open it again.
- Otherwise, open the relevant page in the browser so the user can review the change.

## Verification

- After editing `data/news.json`, `data/publications.json`, or `data/profile-info.json`, validate that the JSON is still parseable.
- After editing `index.html`, `styles.css`, `script.js`, or any file under `paper-pages/`, ensure the relevant page can still be previewed locally.

## Communication Style

- Use simplified Chinese for responses about this repository.
- Use short, concise wording, avoid filler and excessive politeness, keep tone direct.
- Prefer compact/archaic phrasing when possible, similar to Caveman Wenyan style.
- When this concise/文言风格 is needed, reference [caveman skill](~/.codex/skills/caveman/SKILL.md) (`wenyan-*` modes).
