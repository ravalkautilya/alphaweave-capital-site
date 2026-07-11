# GitHub Pages Deployment

This site is a static GitHub Pages site served from `docs/site/`.

## Deploy

1. Commit and push the repository to GitHub.
2. Open the repository on GitHub.
3. Go to `Settings` -> `Pages`.
4. Under `Build and deployment`, set `Source` to `Deploy from a branch`.
5. Set `Branch` to `main`.
6. Set `Folder` to `/docs` and use `/site/` as the public path, or move `docs/site` contents to `docs` before publishing.
7. Click `Save`.

The root URL redirects to the site. The direct site URL will be:

```text
https://<github-user-or-org>.github.io/<repo-name>/site/
```

For a user or organization site repo named `<github-user-or-org>.github.io`, the URL is:

```text
https://<github-user-or-org>.github.io/site/
```

## Local Preview

From the repository root:

```powershell
python -m http.server 8000 --directory docs/site
```

Then open:

```text
http://localhost:8000/
```

## Custom Domain

In `Settings` -> `Pages`, enter the custom domain and follow GitHub's DNS instructions. Usually that means a `CNAME` record pointing to `<github-user-or-org>.github.io`.

