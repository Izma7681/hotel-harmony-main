# 🚀 Quick Deployment Guide

## One-Command Deployment

### Option 1: NPM Script (Recommended)
```bash
npm run deploy
```

### Option 2: Windows Batch Script
```bash
deploy.bat
```

### Option 3: Linux/Mac Shell Script
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## First-Time Setup (5 Minutes)

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Select Your Project
```bash
firebase use your-project-id
```

### 4. Deploy!
```bash
npm run deploy
```

---

## What Happens When You Deploy?

1. ✅ Builds your app (`npm run build`)
2. ✅ Creates optimized production files in `dist/`
3. ✅ Uploads to Firebase Hosting
4. ✅ Your app goes live!

---

## Your Live URLs

After deployment, your app will be available at:

- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

---

## Quick Commands

| Command | Description |
|---------|-------------|
| `npm run deploy` | Build and deploy in one command |
| `npm run build` | Build production version only |
| `npm run preview` | Test production build locally |
| `firebase deploy --only hosting` | Deploy without rebuilding |

---

## Troubleshooting

### "No project active"
```bash
firebase use your-project-id
```

### "Permission denied"
```bash
firebase login --reauth
```

### Build fails
```bash
rm -rf node_modules dist
npm install
npm run build
```

---

## Need Help?

See [DEPLOY.md](./DEPLOY.md) for detailed instructions.

---

**Ready to deploy? Run:** `npm run deploy`
