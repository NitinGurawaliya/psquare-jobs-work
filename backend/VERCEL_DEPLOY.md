# Vercel Deployment Guide (हिंदी में)

## Backend Deployment Steps

### 1. Vercel Account Setup
1. [Vercel](https://vercel.com) पर account बनाएं
2. GitHub/GitLab/Bitbucket से project connect करें

### 2. Backend Project Deploy करें
1. Vercel dashboard में **"Add New Project"** click करें
2. Backend folder select करें
3. **Root Directory** set करें: `backend`
4. **Framework Preset**: "Other" select करें
5. **Build Command**: (खाली छोड़ें - not needed for Node.js)
6. **Output Directory**: (खाली छोड़ें)
7. **Install Command**: `npm install` (auto-detected from vercel.json)

### 3. Environment Variables Add करें
Vercel dashboard में **Settings** → **Environment Variables** में add करें:

```env
# Required Variables
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Brevo Email Configuration
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_email@example.com
BREVO_SENDER_NAME=Job Bank
MAIL_FROM=your_verified_email@example.com

# Optional
PORT=4000
NODE_ENV=production
```

### 4. Deploy करें
1. **Deploy** button click करें
2. Deployment complete होने के बाद, आपको backend URL मिलेगा
   - Example: `https://your-backend.vercel.app`

## Frontend Deployment Steps

### 1. Frontend Project Deploy करें
1. Vercel dashboard में **"Add New Project"** click करें
2. Frontend folder select करें
3. **Root Directory** set करें: `frontend`
4. **Framework Preset**: "Vite" automatically detect होगा
5. **Build Command**: `npm run build` (auto-detect)
6. **Output Directory**: `dist` (auto-detect)
7. **Install Command**: `npm install`

### 2. Environment Variables Add करें
Frontend के लिए:

```env
# Backend API URL (Backend deployment के बाद मिलेगा)
VITE_API_URL=https://your-backend.vercel.app/api
```

**Important**: Backend URL में `/api` suffix add करें क्योंकि सभी routes `/api` prefix के साथ हैं।

### 3. Deploy करें
1. **Deploy** button click करें
2. Frontend URL मिलेगा: `https://your-frontend.vercel.app`

## Important Notes

### Backend URL Update
Frontend deploy होने के बाद:
1. Frontend project के **Settings** → **Environment Variables** में जाएं
2. `VITE_API_URL` को actual backend URL से update करें
3. **Redeploy** करें

### CORS Configuration
Backend में CORS already configured है (`origin: true`), इसलिए किसी भी frontend domain से requests accept होगी।

### Database Connection
- MongoDB Atlas use करें production के लिए
- Connection string properly set करें
- Serverless functions में connection caching automatically handle होता है

### Email Service
- Brevo API key properly set करें
- Sender email verify करें Brevo dashboard में

## Troubleshooting

### Backend Issues
- **Database Connection Error**: Check `MONGO_URI` environment variable
- **JWT Error**: Check `JWT_SECRET` is set
- **Email Not Sending**: Check Brevo API key and sender email

### Frontend Issues
- **API Calls Failing**: Check `VITE_API_URL` is correct
- **Build Errors**: Check Node version (Vercel auto-detects)
- **404 on Routes**: Vercel rewrites already configured in `vercel.json`

## Deployment Checklist

- [ ] Backend environment variables set
- [ ] Frontend `VITE_API_URL` set to backend URL
- [ ] MongoDB connection working
- [ ] Brevo email service configured
- [ ] Test signup/login flow
- [ ] Test companies/jobs CRUD operations

## URLs Structure

After deployment:
- **Backend API**: `https://your-backend.vercel.app/api`
- **Frontend**: `https://your-frontend.vercel.app`

All API routes:
- `/api/auth/*` - Authentication
- `/api/companies/*` - Companies
- `/api/jobs/*` - Jobs
- `/api/health` - Health check

