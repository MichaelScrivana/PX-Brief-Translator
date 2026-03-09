# PX Brief Translator — Deployment Guide

## Quick Overview

| Method | What it does | Who can access |
|--------|-------------|----------------|
| **Azure Static Web Apps** | Hosts the app at a URL | Anyone with the link (or Azure AD restricted) |
| **Teams Tab** | Embeds the app inside Microsoft Teams | Teams users who install the app |
| **PWA** | Makes the hosted app installable as a desktop/mobile app | Anyone who visits the URL |

All three work together: Azure hosts the app → Teams embeds the hosted URL → PWA makes the hosted URL installable.

---

## 1. Azure Static Web Apps (Hosting)

### Prerequisites
- An Azure subscription (Bayer should provide one)
- A GitHub or Azure DevOps repo with this code

### Steps

1. **Push this project to a GitHub repo**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-org/px-brief-translator.git
   git push -u origin main
   ```

2. **Create the Azure Static Web App**
   - Go to [Azure Portal](https://portal.azure.com)
   - Search for "Static Web Apps" → Click **Create**
   - Fill in:
     - **Resource Group**: Create or pick one (e.g., `rg-px-tools`)
     - **Name**: `px-brief-translator` (this becomes your URL)
     - **Plan type**: Free (perfect for internal tools)
     - **Source**: GitHub → authorize and select your repo
     - **Branch**: `main`
     - **Build Preset**: Custom
     - **App location**: `/`
     - **Output location**: `dist`
   - Click **Review + Create** → **Create**

3. **Get the deployment token**
   - Once created, go to your Static Web App → **Settings** → **Deployment token**
   - Copy it

4. **Add as a GitHub Secret**
   - Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
   - Create new secret: `AZURE_STATIC_WEB_APPS_API_TOKEN` → paste the token

5. **Push to deploy**
   - Every push to `main` now auto-deploys via the GitHub Action in `.github/workflows/`
   - Your app will be live at: `https://px-brief-translator.azurestaticapps.net`

### Optional: Add Azure AD Authentication
To restrict access to Bayer employees only:
- Go to your Static Web App → **Settings** → **Authentication**
- Add **Azure Active Directory** as a provider
- Follow the prompts to register an Azure AD app
- This adds SSO — users sign in with their Bayer credentials

---

## 2. Microsoft Teams Tab

### Prerequisites
- The app must be hosted (complete Step 1 first)
- Access to Teams Developer Portal or Teams Admin Center

### Steps

1. **Update the manifest**
   - Open `teams-app/manifest.json`
   - Replace all `{{YOUR-APP-NAME}}` with your actual Azure app name (e.g., `px-brief-translator`)
   - Replace `{{MICROSOFT-APP-ID}}` with a new GUID (generate one at https://www.guidgenerator.com)

2. **Create the Teams app package**
   ```bash
   cd teams-app
   zip -r ../px-brief-translator-teams.zip manifest.json color-192x192.png outline-32x32.png
   ```

3. **Upload to Teams**

   **Option A: Personal/team sideload (for testing)**
   - Open Teams → Apps → **Manage your apps** → **Upload a custom app**
   - Select the `.zip` file
   - Click **Add** to install as a personal tab

   **Option B: Organization-wide (requires admin)**
   - Go to [Teams Admin Center](https://admin.teams.microsoft.com)
   - **Teams apps** → **Manage apps** → **Upload new app**
   - Upload the `.zip` file
   - Go to **Setup policies** to push it to specific users/groups

4. **The app will appear as a tab** in Teams where users can interact with it directly

---

## 3. Progressive Web App (PWA)

### Already configured! Here's how users install it:

Once the app is hosted (Step 1), users can install it as a desktop app:

1. Visit the app URL in **Chrome** or **Edge**
2. Look for the **install icon** in the address bar (or the three-dot menu → "Install app")
3. Click **Install**
4. The app now appears as a standalone window with its own icon in the taskbar/dock

**On mobile (iOS/Android):**
1. Visit the URL in the browser
2. Tap **Share** → **Add to Home Screen**
3. The app gets its own icon on the home screen

No app store submission needed — it just works from the hosted URL.

---

## Quick Deployment Checklist

- [ ] Push code to GitHub repo
- [ ] Create Azure Static Web App in Azure Portal
- [ ] Add deployment token as GitHub secret
- [ ] Verify the deployed URL works
- [ ] Update Teams manifest with your URL and app ID
- [ ] Zip and upload Teams app package
- [ ] Test Teams tab loading
- [ ] Test PWA install from Chrome/Edge
- [ ] (Optional) Add Azure AD authentication for org-only access
