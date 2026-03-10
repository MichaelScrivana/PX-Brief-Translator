# Azure Static Web Apps — Deployment Playbook

> Reference guide for deploying Vite + React apps to Azure Static Web Apps with GitHub Actions.
> Created from real deployment issues encountered during the PX Brief Translator launch (March 2026).

---

## Initializing a Git Repo & Pushing to GitHub

### First-Time Setup (New Project)

```bash
# 1. Navigate to your project's PARENT folder (the one that will be your repo root)
cd ~/path-to/your-project-parent

# 2. Initialize git
git init

# 3. Create .gitignore BEFORE your first commit (critical!)
cat > .gitignore << 'EOF'
node_modules
dist
.DS_Store
*.local
.env
.env.*
EOF

# 4. Stage all files
git add .

# 5. Verify what's being committed (node_modules should NOT appear)
git status

# 6. First commit
git commit -m "initial commit"

# 7. Create the GitHub repo (using GitHub CLI)
#    Replace "my-app-name" with your actual project name
#    This creates it under YOUR GitHub account (e.g. MichaelScrivana/my-app-name)
gh repo create my-app-name --private --source=. --push

#    To create under an ORGANIZATION (you need org write access):
#    gh repo create MyOrgName/my-app-name --private --source=. --push

# OR if you already created the repo on github.com manually:
git remote add origin https://github.com/YourUsername/my-app-name.git
git branch -M main
git push -u origin main
```

### If the Repo Already Exists on GitHub

```bash
# Clone it
git clone https://github.com/YourUsername/your-repo-name.git
cd YourRepoName

# Copy your app folder into it, then:
git add .
git commit -m "add app"
git push
```

### Day-to-Day: Pushing Changes

```bash
git add .
git commit -m "describe what changed"
git push
```

> **First push on a new branch?** Git will ask you to set upstream:
> ```bash
> git push --set-upstream origin main
> ```
> After that, `git push` works on its own.

### Installing the CLIs (if you don't have them)

```bash
# GitHub CLI (for gh commands)
brew install gh
gh auth login

# Azure CLI (for az commands)
brew install azure-cli
az login
```

---

## Pre-Flight Checklist

Before pushing to GitHub or creating the Azure resource, verify all of the following:

### 1. Folder Structure

**Critical rule:** Vite only copies files from `public/` into the `dist/` build output. Any static assets (images, fonts, JSON configs) outside of `public/` will work in dev mode but **disappear in production**.

```
your-repo/
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml    ← MUST be at repo root
├── .gitignore                           ← MUST exist
├── your-app-folder/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   └── ...
│   └── public/
│       ├── img/                         ← all images HERE
│       ├── icons/                       ← PWA icons HERE
│       ├── manifest.json                ← PWA manifest HERE
│       ├── sw.js                        ← service worker HERE
│       └── staticwebapp.config.json     ← Azure SWA config HERE
└── teams-app/                           ← Teams manifest (not deployed)
```

**Common mistake:** Putting `img/` at the project root instead of inside `public/`. Images load in `npm run dev` but break in production.

**Common mistake:** Putting `staticwebapp.config.json` at the project root. It must be inside `public/` so Vite copies it to `dist/`.

### 2. .gitignore

**Must exist before first commit.** Without it, `node_modules/` (hundreds of MBs) gets pushed to GitHub.

```gitignore
node_modules
dist
.DS_Store
*.local
.env
.env.*
```

### 3. package.json Scripts

Azure's Oryx build system looks for a `build` script. Verify it exists:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**If Oryx can't find `build` or `build:azure`**, the deploy will fail with:
> `Error: Could not find either 'build' or 'build:azure' node under 'scripts' in package.json.`

---

## Azure Static Web App Setup

### Step 1: Create the Resource

1. Azure Portal → search "Static Web Apps" → **Create**
2. Fill in:
   - **Name**: your-app-name (becomes `your-app-name.azurestaticapps.net`)
   - **Plan type**: Free
   - **Source**: GitHub → authorize → select repo + branch
   - **Build Preset**: Custom
   - **App location**: `/your-app-folder` (the subfolder containing `package.json`)
   - **Output location**: `dist`
3. Click **Create**

### Step 2: What Azure Does Automatically

When you link a GitHub repo, Azure **auto-generates a workflow file** and pushes it to your repo at:
```
.github/workflows/azure-static-web-apps-<random-name>.yml
```

**This is the workflow that actually runs.** Any other `.yml` files you create manually in `.github/workflows/` will also run but are redundant and can cause confusion.

### Step 3: The Deployment Token

The auto-generated workflow uses `${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}`.

**To add the secret:**
1. Azure Portal → your Static Web App → **Manage deployment token** → copy
2. GitHub → repo **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: paste token

**Alternative via CLI:**
```bash
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --repo YourOrg/YourRepo
```
> Note: Requires `gh auth login --scopes "repo,admin:repo_hook"` — the default GitHub CLI scopes don't have permission to write secrets.

---

## Troubleshooting Reference

### Error: "Bad credentials"
**Cause:** The `AZURE_STATIC_WEB_APPS_API_TOKEN` GitHub secret is missing or empty.
**Fix:** Add the deployment token as a GitHub secret (see Step 3 above).

### Error: "Could not find 'build' or 'build:azure' in package.json"
**Cause:** The `app_location` in the workflow is pointing to the wrong directory — one that doesn't contain `package.json`.
**Fix:** Set `app_location` to the subfolder containing your `package.json`. If your app is at `my-repo/my-app/package.json`, set `app_location: "/my-app"`.

### Error: "Unable to determine the location of the app artifacts"
**Cause:** `output_location` is empty or wrong. Oryx built the app but doesn't know where the output went.
**Fix:** Set `output_location: "dist"` (for Vite projects). This is relative to the `app_location`.

### Azure shows "Congratulations on your new site!" placeholder
**Cause:** The Azure resource exists but no successful deployment has happened yet.
**Fix:** Check the GitHub Actions tab for failed runs. Fix the workflow and re-push.

### `.github/workflows/` not detected by GitHub
**Cause:** The `.github` folder is inside a subfolder instead of at the repo root.
**Fix:** Move it to repo root:
```bash
mv your-app-folder/.github .github
```
> **Watch out for double-nesting:** If `.github` was already inside a `.github` folder, you'll get `.github/.github/workflows/` which GitHub ignores. Always verify with:
> ```bash
> find . -name "*.yml" -not -path "./node_modules/*"
> ```

### Two workflow files running
**Cause:** You created a workflow manually AND Azure auto-generated one when linking the repo.
**Fix:** Delete the manual one. Use the Azure-generated file (it already has the deployment token wired up). Just edit its `app_location` and `output_location` if needed.

### GitHub CLI secret permission denied (HTTP 403)
**Cause:** Default `gh auth` scopes don't include repo secret access.
**Fix:** Re-authenticate with expanded scopes:
```bash
gh auth login --scopes "repo,admin:repo_hook"
```
Or just use the GitHub web UI: repo → Settings → Secrets → Actions.

---

## Workflow File Template

For a Vite + React app living in a subfolder:

```yaml
name: Deploy to Azure Static Web Apps

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches: [main]

jobs:
  build_and_deploy:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: upload
          app_location: "/your-app-subfolder"  # where package.json lives
          output_location: "dist"               # Vite build output

  close_pull_request:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      - name: Close staging
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: close
```

> **Important:** If Azure auto-generates a workflow when you link the repo, edit THAT file instead of creating a new one.

---

## Quick Reference Commands

```bash
# Check what workflow files exist and where
find . -name "*.yml" -not -path "./node_modules/*"

# Verify .gitignore is working (should NOT show node_modules)
git status

# Check what's in public/ (these will be in the deployed build)
ls public/

# Test the build locally before pushing
npm run build && ls dist/

# Check GitHub Actions status
gh run list --repo YourOrg/YourRepo

# Re-run a failed workflow
gh run rerun --failed --repo YourOrg/YourRepo

# Set GitHub secret from CLI
gh auth login --scopes "repo,admin:repo_hook"
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --repo YourOrg/YourRepo
```

---

## Teams Tab & PWA Notes

### Teams Tab
- The hosted app URL must allow iframe embedding: `X-Frame-Options: ALLOWALL`
- This is set in `staticwebapp.config.json` (inside `public/`)
- The `teams-app/` folder stays in the repo but isn't deployed — it's a separate package you zip and upload to Teams Admin Center

### PWA
- Requires `public/manifest.json` and `public/sw.js`
- Icons in `public/icons/` at sizes: 72, 96, 128, 144, 152, 192, 384, 512
- Users install from the browser address bar — no app store needed
- Service worker caches static assets for offline use

---

*Last updated: March 2026 — PX Brief Translator launch*
