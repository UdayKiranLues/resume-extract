# Resume Extractor - MERN Stack

A full-stack web application built with MERN (MongoDB, Express, React, Node.js) that extracts information from PDF and DOCX resumes, stores them in a database, and exports data to Excel.

## Features

✅ **User Authentication** - Secure signup/login with JWT and email validation  
✅ **Bulk Upload** - Upload up to 500 resumes at once (PDF and DOCX formats)  
✅ **AI-Powered Extraction** - Extracts Name, Email, Phone, Location, Skills, Education, and Experience  
✅ **Database Storage** - Stores uploaded files and extracted data in MongoDB  
✅ **Excel Export** - Export single or all resumes to Excel format  
✅ **Batch Processing** - Process multiple files simultaneously with detailed results  
✅ **Modern UI** - Beautiful, responsive interface with Tailwind CSS  
✅ **Vercel Ready** - Configured for easy deployment on Vercel  

## Tech Stack

### Backend
- Node.js & Express
- MongoDB (Mongoose)
- JWT Authentication
- Multer (File Upload)
- pdf-parse & mammoth (Resume Parsing)
- exceljs (Excel Export)

### Frontend
- React 18 with Vite
- React Router v6
- Axios
- Tailwind CSS
- Lucide React Icons
- React Hot Toast

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Resume-extractor
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Variables
The `.env` file is already configured with your MongoDB credentials:
```
MONGODB_URI=mongodb+srv://jiouday7:luesuday@cluster0.mq3refo.mongodb.net/resume_extractor?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a strong secret key in production!

### 5. Run the Application

#### Development Mode (Run both servers):

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

The backend will run on `http://localhost:5000`  
The frontend will run on `http://localhost:3000`

## Deployment to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Build the Frontend
```bash
cd client
npm run build
cd ..
```

### Step 4: Deploy
```bash
vercel
```

Follow the prompts:
- Set up and deploy: **Y**
- Which scope: Select your account
- Link to existing project: **N**
- Project name: **resume-extractor** (or your choice)
- In which directory is your code located: **.**
- Want to override settings: **N**

### Step 5: Add Environment Variables in Vercel

Go to your Vercel dashboard → Project Settings → Environment Variables

Add these variables:
```
MONGODB_URI = mongodb+srv://jiouday7:luesuday@cluster0.mq3refo.mongodb.net/resume_extractor?retryWrites=true&w=majority
JWT_SECRET = your_super_secret_jwt_key_change_this_in_production
NODE_ENV = production
```

### Step 6: Redeploy
```bash
vercel --prod
```

Your application is now live! 🚀

## Project Structure

```
Resume-extractor/
├── api/                      # Backend code
│   ├── index.js             # Express server
│   ├── models/              # MongoDB models
│   │   ├── User.js
│   │   └── Resume.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   └── resume.js
│   ├── middleware/          # Auth middleware
│   │   └── auth.js
│   └── utils/               # Utility functions
│       ├── resumeParser.js
│       └── excelExporter.js
├── client/                   # Frontend code
│   ├── src/
│   │   ├── api/             # API calls
│   │   ├── components/      # React components
│   │   ├── context/         # Auth context
│   │   ├── pages/           # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── .env                      # Environment variables
├── vercel.json              # Vercel configuration
└── package.json             # Backend dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Resume Management
- `POST /api/resume/upload` - Upload and parse resume
- `GET /api/resume/list` - Get all resumes
- `GET /api/resume/:id` - Get single resume
- `GET /api/resume/download/:id` - Download original resume
- `GET /api/resume/export/excel` - Export all resumes to Excel
- `GET /api/resume/export/excel/:id` - Export single resume to Excel
- `DELETE /api/resume/:id` - Delete resume

## Usage

1. **Sign Up/Login** - Create an account or login
2. **Upload Resume** - Go to Upload page and select a PDF or DOCX file
3. **View Extracted Data** - See the extracted information
4. **Manage Resumes** - View all resumes in "My Resumes" page
5. **Export to Excel** - Download individual or all resumes as Excel file
6. **Download Original** - Download the original uploaded file

## Notes

- Maximum file size: 10MB
- Supported formats: PDF, DOCX
- The resume parser uses pattern matching and may not be 100% accurate
- For better results, use well-formatted resumes with clear sections

## Troubleshooting

### MongoDB Connection Issues
- Ensure your MongoDB Atlas cluster is running
- Check if your IP is whitelisted in MongoDB Atlas
- Verify the connection string in `.env`

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
