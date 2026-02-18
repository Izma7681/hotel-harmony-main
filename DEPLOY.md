# 🚀 One-Command Deployment Guide

## Quick Deploy

Once everything is set up, deploy with just one command:

```bash
npm run deploy
```

This will:
1. Build your production-ready app
2. Deploy to Firebase Hosting automatically

---

## 📋 First-Time Setup (One-Time Only)

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open your browser to authenticate with your Google account.

### Step 3: Initialize Firebase (if not already done)

If you haven't initialized Firebase in your project:

```bash
firebase init
```

Select:
- ✅ Hosting
- Choose your Firebase project
- Public directory: `dist`
- Single-page app: `Yes`
- Automatic builds: `No`

### Step 4: Verify firebase.json

Make sure your `firebase.json` looks like this:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 🎯 Deployment Commands

### Full Deployment (Recommended)
```bash
npm run deploy
```
Builds and deploys everything in one command.

### Build Only
```bash
npm run build
```
Creates production build in `dist` folder.

### Deploy Only (after build)
```bash
firebase deploy --only hosting
```
Deploys the existing `dist` folder.

### Preview Before Deploy
```bash
npm run preview
```
Test your production build locally before deploying.

---

## 🔧 Advanced Deployment Options

### Deploy to Specific Site
```bash
firebase deploy --only hosting:your-site-name
```

### Deploy with Message
```bash
firebase deploy --only hosting -m "Your deployment message"
```

### View Deployment History
```bash
firebase hosting:channel:list
```

---

## 📦 What Gets Deployed

When you run `npm run deploy`, the following happens:

1. **Build Process** (`npm run build`):
   - Compiles TypeScript to JavaScript
   - Bundles all React components
   - Optimizes assets (images, CSS, JS)
   - Minifies code for production
   - Creates `dist` folder with production files

2. **Deploy Process** (`firebase deploy --only hosting`):
   - Uploads `dist` folder to Firebase Hosting
   - Updates your live website
   - Provides deployment URL

---

## 🌐 After Deployment

### Your App URLs

**Production URL:**
```
https://your-project-id.web.app
```
or
```
https://your-project-id.firebaseapp.com
```

**Custom Domain (if configured):**
```
https://your-custom-domain.com
```

### View Deployment

```bash
firebase hosting:channel:open live
```

---

## ✅ Pre-Deployment Checklist

Before deploying, make sure:

- [ ] `.env` file has correct Firebase credentials
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] Firebase project is selected: `firebase use your-project-id`
- [ ] Build completes without errors: `npm run build`
- [ ] Preview works correctly: `npm run preview`

---

## 🔄 Continuous Deployment Workflow

### Development → Production

1. **Develop locally:**
   ```bash
   npm run dev
   ```

2. **Test your changes:**
   - Test all features
   - Check console for errors
   - Verify responsive design

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

5. **Deploy to production:**
   ```bash
   npm run deploy
   ```

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Command failed: vite build"**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Deploy Fails

**Error: "No project active"**
```bash
firebase use your-project-id
```

**Error: "Permission denied"**
```bash
firebase login --reauth
```

**Error: "Hosting site not found"**
```bash
firebase init hosting
```

### After Deploy, Site Shows Old Version

**Clear Firebase Hosting Cache:**
```bash
firebase hosting:channel:delete live
firebase deploy --only hosting
```

**Clear Browser Cache:**
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

---

## 📊 Deployment Monitoring

### View Deployment Logs
```bash
firebase hosting:channel:list
```

### Check Deployment Status
```bash
firebase hosting:channel:open live
```

### View Usage Statistics
Go to Firebase Console → Hosting → Usage

---

## 🔐 Environment Variables

Make sure your `.env` file is configured:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important:** Never commit `.env` to version control!

---

## 🎨 Custom Domain Setup

### Add Custom Domain

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for SSL certificate (can take up to 24 hours)

### Update DNS Records

Add these records to your domain provider:

```
Type: A
Name: @
Value: [Firebase IP addresses]

Type: TXT
Name: @
Value: [Verification code]
```

---

## 📱 Multiple Environments

### Deploy to Staging

```bash
firebase hosting:channel:deploy staging
```

### Deploy to Production

```bash
npm run deploy
```

---

## 🚨 Rollback Deployment

If something goes wrong:

```bash
# View previous deployments
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:rollback
```

---

## 💡 Pro Tips

1. **Always test locally first:**
   ```bash
   npm run preview
   ```

2. **Use deployment messages:**
   ```bash
   firebase deploy -m "Added new booking feature"
   ```

3. **Monitor after deployment:**
   - Check Firebase Console for errors
   - Test all critical features
   - Monitor user feedback

4. **Keep dependencies updated:**
   ```bash
   npm update
   ```

5. **Regular backups:**
   - Export Firestore data regularly
   - Keep `.env` file backed up securely

---

## 📞 Support

If you encounter issues:

1. Check Firebase Console for errors
2. Review deployment logs
3. Verify Firebase configuration
4. Check browser console for errors
5. Ensure all environment variables are set

---

## 🎉 Success!

Once deployed, your hotel management system will be live at:
```
https://your-project-id.web.app
```

Share this URL with your team and start managing your hotel! 🏨

---

**Last Updated:** February 2026
**Version:** 2.0
