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
- When adding a new publication item, or changing an existing preprint to an accepted paper, move it to the front of the relevant/top publication group unless the user says otherwise.
- When adding links to paper pages or homepage cards, reuse existing button/link patterns instead of inventing new markup.
- When updating a paper project page venue/status, follow existing paper-page nav style: place the venue/status text in the center of the nav bar when needed. Do not add extra badge-like buttons under the title unless the user explicitly asks.
- Keep paper project page nav bars visually consistent with the homepage nav color and treatment.
- Keep paper project page nav bars minimal: only include `Home`, the centered publication venue/status when available, and `Related Work` when the page has related-work links. Do not add section anchors such as Abstract, Method, Results, or BibTeX unless explicitly requested.
- When building paper project pages from source files, use only figures that are actually referenced or used in the paper text. Do not add figures just because they exist in the source repository.
- Preserve figure grouping from the source paper. If the paper uses one caption for a multi-panel figure, the project page should also use one group caption instead of separate captions for each subfigure.
- Keep figure captions visually close to their figures, especially for grouped figures. Avoid large vertical gaps between a figure group and its caption.

## Preview Rule

- Do not automatically open previews after page-related changes.
- Only preview when the user explicitly asks for preview.
- When preview is requested, first check whether the local preview server is already running.
- If the local preview server is not running, start it with `python3 -m http.server 8001` from the repository root.
- If the same page has already been opened during the current turn, do not open it again.
- Otherwise, open the relevant page in the browser so the user can review the change.

## Verification

- After editing `data/news.json`, `data/publications.json`, or `data/profile-info.json`, validate that the JSON is still parseable.
- After editing `index.html`, `styles.css`, `script.js`, or any file under `paper-pages/`, preview locally only if the user explicitly asks.

## Communication Style

- Use simplified Chinese for responses about this repository.
- Use short, concise wording, avoid filler and excessive politeness, keep tone direct.
- Prefer compact/archaic phrasing when possible, similar to Caveman Wenyan style.
- When this concise/文言风格 is needed, reference [caveman skill](~/.codex/skills/caveman/SKILL.md) (`wenyan-*` modes).
- Default response style in this repository: `wenyan-ultra`.
