# Deploy Frontend and Backend Separately

## Frontend Deployment (Vercel)

### Option 1: Deploy Client Folder Directly

1. **Go to [vercel.com](https://vercel.com)** → New Project

2. **Import your GitHub repo:** `https://github.com/UdayKiranLues/resume-extract`

3. **Configure:**
   - Framework Preset: **Vite**
   - Root Directory: **`client`** ← Important!
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.vercel.app/api` (We'll get this after backend deployment)

5. **Deploy** 🚀

---

## Backend Deployment (Vercel)

### Step 1: Create Backend Root package.json

We need to move backend files to work as standalone:

Create a new file `api/package.json`:

```json
{
  "name": "resume-extractor-api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "pdf-parse": "^1.1.1",
    "mammoth": "^1.6.0",
    "exceljs": "^4.4.0",
    "nodemailer": "^6.9.7",
    "express-validator": "^7.0.1"
  }
}
```

### Step 2: Create Backend vercel.json

Create `api/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

### Step 3: Deploy Backend

1. **Go to [vercel.com](https://vercel.com)** → New Project

2. **Import the same GitHub repo again**

3. **Configure:**
   - Framework Preset: **Other**
   - Root Directory: **`api`** ← Important!
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

4. **Add Environment Variables:**
   - `MONGODB_URI` = `mongodb+srv://jiouday7:luesuday@cluster0.mq3refo.mongodb.net/resume_extractor?retryWrites=true&w=majority`
   - `JWT_SECRET` = `resume_extractor_secret_2025`
   - `NODE_ENV` = `production`

5. **Deploy** 🚀

6. **Copy the deployment URL** (e.g., `https://resume-extractor-api.vercel.app`)

### Step 4: Update Frontend Environment Variable

1. Go to your **Frontend Vercel Project** → Settings → Environment Variables

2. Update `VITE_API_URL`:
   - Value: `https://your-backend-url.vercel.app/api`

3. Redeploy frontend

---

## Files to Create

Run these commands in your project root:

```powershell
# Create backend package.json
New-Item -Path "api/package.json" -ItemType File -Force
```

Then paste the backend package.json content above.

```powershell
# Create backend vercel.json
New-Item -Path "api/vercel.json" -ItemType File -Force
```

Then paste the backend vercel.json content above.

---

## Summary

**Frontend (Client):**
- Deploy from `client` folder
- Set `VITE_API_URL` to backend URL

**Backend (API):**
- Deploy from `api` folder
- Set MongoDB and JWT environment variables

**Result:**
- Frontend: `https://resume-extractor-client.vercel.app`
- Backend: `https://resume-extractor-api.vercel.app`

Both deployed separately and connected via API URL! 🎉
