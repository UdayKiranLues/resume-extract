# Vercel Deployment Guide - Resume Extractor

## Quick Deploy to Vercel (5 Minutes)

### Step 1: Prepare Your Code

1. **Make sure all files are saved**

2. **Initialize Git Repository** (if not already done):
```powershell
git init
git add .
git commit -m "Initial commit - Resume Extractor"
```

3. **Push to GitHub** (create a new repository on GitHub first):
```powershell
git remote add origin https://github.com/YOUR_USERNAME/resume-extractor.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Website (Easiest)

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Click "Add New" → "Project"**

3. **Import your GitHub repository** (resume-extractor)

4. **Configure Project:**
   - Framework Preset: **Other**
   - Root Directory: `./` (leave as default)
   - Build Command: Leave empty or use: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

5. **Add Environment Variables** (CRITICAL - Click "Environment Variables"):
   ```
   MONGODB_URI = mongodb+srv://jiouday7:luesuday@cluster0.mq3refo.mongodb.net/resume_extractor?retryWrites=true&w=majority
   JWT_SECRET = your_super_secret_jwt_key_production_2025
   NODE_ENV = production
   ```

6. **Click "Deploy"** 🚀

---

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
```powershell
npm install -g vercel
```

2. **Login to Vercel:**
```powershell
vercel login
```

3. **Build Frontend:**
```powershell
cd client
npm install
npm run build
cd ..
```

4. **Deploy:**
```powershell
vercel
```

Follow the prompts:
- Set up and deploy: **Y**
- Which scope: Select your account
- Link to existing project: **N**
- Project name: **resume-extractor**
- In which directory is your code: **./**
- Override settings: **N**

5. **Add Environment Variables:**
```powershell
vercel env add MONGODB_URI
# Paste: mongodb+srv://jiouday7:luesuday@cluster0.mq3refo.mongodb.net/resume_extractor?retryWrites=true&w=majority

vercel env add JWT_SECRET
# Enter a strong secret key

vercel env add NODE_ENV
# Enter: production
```

6. **Deploy to Production:**
```powershell
vercel --prod
```

---

### Step 3: Verify Deployment

1. **Visit your deployment URL** (e.g., `https://resume-extractor.vercel.app`)

2. **Test the application:**
   - Sign up with a new account
   - Upload a test resume
   - Check if data extraction works
   - Try exporting to Excel

---

## Important Notes

### MongoDB Atlas Setup (If Not Done)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Network Access → Add IP Address → **Allow Access from Anywhere** (0.0.0.0/0)
   - This is important for Vercel to connect
3. Database Access → Verify user credentials are correct

### Vercel Configuration File

Your `vercel.json` is already configured:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/$1"
    }
  ]
}
```

### Troubleshooting

**Issue: Build fails**
- Solution: Make sure `client/package.json` has `"build": "vite build"` script

**Issue: API not working**
- Solution: Check environment variables are set correctly in Vercel dashboard
- Go to Project Settings → Environment Variables

**Issue: MongoDB connection fails**
- Solution: Whitelist all IPs (0.0.0.0/0) in MongoDB Atlas Network Access

**Issue: Routes not working**
- Solution: Vercel automatically handles routing via `vercel.json`

---

## Update Deployment

After making changes:

```powershell
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will **automatically redeploy** on every push to main branch! 🎉

---

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

---

## Your Live URLs

After deployment, you'll get:
- **Production:** `https://resume-extractor.vercel.app`
- **Preview:** Automatic preview URLs for each commit

---

## Environment Variables Reference

| Variable | Value | Description |
|----------|-------|-------------|
| MONGODB_URI | mongodb+srv://jiouday7:... | MongoDB connection string |
| JWT_SECRET | strong-secret-key-here | Secret for JWT tokens |
| NODE_ENV | production | Environment mode |

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **Check deployment logs** in Vercel dashboard for errors

---

🎉 **Your Resume Extractor is now live!**
