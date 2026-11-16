# makeupweb-

💄 **GlamLab Studio** - a makeup website with a product catalog and makeup games, gated behind a login page.

## Pages

| Page | What it does |
|---|---|
| `login.html` | Log in or create an account (username + password, no email). Blocks access to the rest of the app. |
| `index.html` | Home page (requires login). |
| `catalog.html` | Makeup product catalog with live search (requires login). |
| `games.html` | Games hub (requires login). |
| `shadematch.html` | Shade Match: pick the swatch identical to the target shade (requires login). |
| `memory.html` | Match the Shade: 3-round memory card game, wrong pairs flip back over (requires login). |

## How login works

- Sign up creates an account saved in `localStorage` (`glamUsers`); logging in sets a `glamSession` key.
- Every protected page calls `requireLogin()` from `auth.js`, which redirects to `login.html` if you are not logged in.
- Note: localStorage accounts are fine for a class project but are not secure for real users.

## Run it

Open `login.html` in a browser (or host the folder on Replit / GitHub Pages).
