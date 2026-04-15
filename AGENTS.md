# AGENTS.md

## Preview Rule

- After any page-related change, always open a local preview for the user.
- First check whether the local preview server is already running.
- If the local preview server is not running, start it with `python3 -m http.server 8001` from the repository root.
- If the same page has already been opened during the current turn, do not open it again.
- Otherwise, open the relevant page in the browser so the user can review the change.
