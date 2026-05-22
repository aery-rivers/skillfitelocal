# Deploy to Render

## Quick Start

1. **Create a Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Connect Your Repository**
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select `aery-rivers/skillfitelocal` repo

3. **Configure Settings**
   - **Name**: `skillfite-backend` (or your choice)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free (or Starter for always-on)

4. **Set Environment Variables**
   - Click "Advanced" → "Add Environment Variable"
   - Add these variables:
     - `NODE_ENV` = `production`
     - `PORT` = `3000`
     - `CORS_ORIGIN` = Your frontend URL (e.g., `https://skillfite.netlify.app`)
     - Any other API keys/secrets

5. **Deploy**
   - Click "Create Web Service"
   - Render will auto-deploy when you push to `main` branch

## After Deployment

Your backend will be available at:
```
https://skillfite-backend.onrender.com
```

Update your **config.js** in your frontend:
```javascript
API_URL: 'https://skillfite-backend.onrender.com'
```

## Auto-Deploy on Push

Every time you push to GitHub, Render will automatically rebuild and deploy your app.

## Free Tier Limitations

- ⏸️ App spins down after 15 minutes of inactivity
- 📈 Wakes up on first request (5-30 sec delay)
- 💾 0.5 GB RAM

**Upgrade to Starter ($7/month)** for:
- ✅ Always-on hosting
- ✅ 1 GB RAM
- ✅ Better performance

## Database Setup (Optional)

1. In Render dashboard, create a new PostgreSQL database
2. Get the `DATABASE_URL` connection string
3. Add it as an environment variable in your web service
4. Your backend can now connect to the database

## Troubleshooting

**App won't deploy?**
- Check build logs in Render dashboard
- Make sure `package.json` exists
- Verify `server.js` uses `process.env.PORT`

**Getting 502 errors?**
- Wait 30 seconds (app is spinning up)
- Check server logs in Render dashboard
- Verify your backend is listening on port 3000

**CORS errors?**
- Update `CORS_ORIGIN` env variable to match your frontend URL
- Ensure backend has CORS middleware configured
