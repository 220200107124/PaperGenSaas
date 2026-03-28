# Deployment Implementation Plan

This plan outlines the steps needed to deploy the backend to Render and the frontend to Netlify.

## Backend Deployment (Render)

1. **GitHub Connection**:
   - Create a GitHub repository and push your project to it.
   - Go to [dashboard.render.com](https://dashboard.render.com).
   - Create a **New > Web Service**.
   - Connect your GitHub repository.

2. **Configuration**:
   - **Name**: `paper-generation-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

3. **Environment Variables**:
   - Create a **PostgreSQL Database** on Render (New > PostgreSQL).
   - Once the database is created, copy the **Internal Database URL**.
   - Back in your Web Service configuration, add the following Environment Variables:
     - `DATABASE_URL`: (Paste your database URL)
     - `JWT_SECRET`: (Use a strong random string)
     - `NODE_ENV`: `production`
     - `GEMINI_API_KEY`: (Your Google Gemini API key)
     - Any other variables from your `.env` file.

## Frontend Deployment (Netlify)

1. **GitHub Connection**:
   - Go to [app.netlify.com](https://app.netlify.com).
   - Click **Add new site > Import an existing project**.
   - Connect your GitHub repository.

2. **Configuration**:
   - **Base directory**: `Frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist` (This is the default for Vite)

3. **Environment Variables**:
   - Go to **Site settings > Build & deploy > Environment variables**.
   - Add:
     - `VITE_API_URL`: (The URL of your live Render backend, e.g., `https://paper-generation-backend.onrender.com`)

4. **Routing**:
   - I have already created a `Frontend/public/_redirects` file which handles React Router routes on Netlify.

## Post-Deployment Sync

- Once both services are live, ensure the `Frontend`'s `VITE_API_URL` environment variable points to the live backend URL.
- If you use specific CORS origins, you might need to update the backend to allow your Netlify URL (though currently, it is set to allow all origins via `app.enableCors()`).
