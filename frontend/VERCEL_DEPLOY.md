# Frontend Vercel Deployment Guide

## Quick Steps

1. **Connect Repository** to Vercel
2. **Set Root Directory**: `frontend`
3. **Framework**: Vite (auto-detected)
4. **Environment Variable**:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```
5. **Deploy**

## Important

- Backend URL में `/api` suffix add करें
- Build automatically होगा (`npm run build`)
- Output directory: `dist`
- All routes properly configured with rewrites

See `../backend/VERCEL_DEPLOY.md` for complete guide.

