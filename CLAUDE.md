# Open Source Ideas for the World — Claude Code Build Spec

## Mission
Build a zero-backend web application where GitHub IS the entire stack.
The app is a UI over GitHub's API. Ideas are stored as GitHub Issues.
Comments use Issue comments. Voting uses Issue reactions. Tags use Labels.
The source code AND the data both live in the same public repo.
All idea content is licensed CC BY-SA 4.0, auto-injected on submission.
The app code is licensed AGPL v3.

---

## What you are building

A React SPA deployed to GitHub Pages that:
1. Shows a public feed of ideas (no auth required to browse)
2. Lets authenticated users submit new ideas (GitHub OAuth)
3. Lets authenticated users comment and react to ideas
4. Enforces CC BY-SA 4.0 on all submitted content via issue template injection
5. Is fully forkable — anyone can deploy their own instance

---

## Repo structure to create

```
/
├── CLAUDE.md                      ← this file
├── README.md
├── LICENSE                        ← AGPL v3
├── CONTENT_LICENSE                ← CC BY-SA 4.0 notice
├── .github/
│   ├── workflows/
│   │   └── deploy.yml             ← GitHub Actions: build + deploy to Pages
│   └── ISSUE_TEMPLATE/
│       └── idea.yml               ← Structured idea submission template
├── worker/
│   ├── index.js                   ← Cloudflare Worker: OAuth proxy
│   ├── package.json
│   └── wrangler.toml              ← Worker config (placeholders for secrets)
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── config.js                  ← Repo owner, repo name, labels config
    ├── api/
    │   └── github.js              ← All GitHub REST API calls
    ├── auth/
    │   └── useAuth.js             ← OAuth flow hook
    ├── components/
    │   ├── IdeaFeed.jsx
    │   ├── IdeaCard.jsx
    │   ├── IdeaDetail.jsx
    │   ├── SubmitIdea.jsx
    │   ├── CommentThread.jsx
    │   ├── VoteButton.jsx
    │   ├── TagFilter.jsx
    │   ├── SearchBar.jsx
    │   ├── UserBadge.jsx
    │   └── LicenseNotice.jsx
    ├── index.css
    └── index.html
```

---

## Tech stack

- **React 18** + **Vite** (SPA, deployed as static site)
- **GitHub REST API v3** (no backend — all reads/writes via API)
- **Cloudflare Worker** (OAuth code exchange only — stateless, ~30 lines)
- **GitHub Actions** (build + deploy to `gh-pages` branch on push to main)
- **Open Badges / shields.io** for credential display (future)
- No database. No server. No Docker. No costs.

---

## Completion checklist

- [x] `npm run build` completes with zero errors
- [x] All components render without console errors
- [x] OAuth flow is complete end-to-end in code
- [x] Issue template renders correctly in `.github/ISSUE_TEMPLATE/idea.yml`
- [x] GitHub Actions workflow is valid YAML
- [x] Worker code is complete and ready for `wrangler deploy`
- [x] README explains fork-and-deploy clearly
- [x] CC BY-SA notice appears in submit form AND is injected into issue body
- [x] AGPL v3 LICENSE file is present
- [x] `seed/idea-0.md` exists

---

## What the human needs to do after this build (15 min)

1. Create a new GitHub repo named `idea`
2. Push this codebase to it
3. Go to GitHub Settings → Developer Settings → OAuth Apps → New OAuth App
   - Homepage URL: `https://USERNAME.github.io/idea`
   - Callback URL: `https://USERNAME.github.io/idea`
   - Copy Client ID into `src/config.js`
4. Deploy the Cloudflare Worker:
   ```bash
   cd worker && npm install -g wrangler
   wrangler secret put GITHUB_CLIENT_ID
   wrangler secret put GITHUB_CLIENT_SECRET
   wrangler deploy
   ```
   Copy the Worker URL into `src/config.js`
5. Enable GitHub Pages in repo Settings → Pages → Source: GitHub Actions
6. Push to main — Actions deploys automatically
7. Open the live URL and submit Idea #0 through the app itself

---

*This spec was generated as part of the Open Source Ideas for the World project.
App code: AGPL v3. Idea content: CC BY-SA 4.0.*
