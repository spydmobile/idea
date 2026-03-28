# Ideas for the World

A zero-backend web application where GitHub IS the entire stack. Ideas are stored as GitHub Issues, comments use issue comments, voting uses reactions, and tags use labels. The source code and data live in the same public repo. All idea content is licensed CC BY-SA 4.0. The app code is licensed AGPL v3.

## How it works

- **Browse** — Anyone can view the idea feed without signing in
- **Sign in** — Authenticate with GitHub to contribute
- **Submit** — Post new ideas (automatically licensed CC BY-SA 4.0)
- **Discuss** — Comment on ideas using GitHub issue comments
- **Vote** — React with thumbs up, heart, rocket, or eyes

## Licenses

| What | License |
|------|---------|
| Idea content (titles, summaries, comments) | [CC BY-SA 4.0](CONTENT_LICENSE) |
| Application source code | [AGPL v3](LICENSE) |

## Fork & deploy your own instance

1. **Fork this repo** and clone it locally
2. **Update `src/config.js`** — set `owner` and `repo` to your GitHub username and repo name
3. **Create a GitHub OAuth App** — Go to GitHub Settings > Developer Settings > OAuth Apps > New OAuth App
   - Homepage URL: `https://YOUR_USERNAME.github.io/idea`
   - Callback URL: `https://YOUR_USERNAME.github.io/idea`
   - Copy the Client ID into `src/config.js`
4. **Deploy the Cloudflare Worker** (handles OAuth token exchange):
   ```bash
   cd worker
   npm install -g wrangler
   wrangler secret put GITHUB_CLIENT_ID
   wrangler secret put GITHUB_CLIENT_SECRET
   wrangler deploy
   ```
   Copy the Worker URL into `src/config.js` as `oauthProxyUrl`
5. **Enable GitHub Pages** — Go to repo Settings > Pages > Source: GitHub Actions, then push to `main`

## Local development

```bash
npm install
npm run dev
```

The feed will load using unauthenticated GitHub API calls. OAuth requires a deployed Worker and configured OAuth App.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

All contributions to the app code are under AGPL v3. All idea content submitted through the platform is released under CC BY-SA 4.0.
