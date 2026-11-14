# 🚀 Deploying to Render (Complete Guide)

This project is pre-configured for **Render** ([render.com](https://render.com)). Both the **Unified Backend** and the **React Web App** can be deployed in just a few minutes.

---

## ⚡ Method 1: 1-Click Blueprint Deployment (Recommended)

Render supports automated infrastructure setup using the included [`render.yaml`](./render.yaml).

1. Push your repository to **GitHub** or **GitLab**.
2. Log in to [dashboard.render.com](https://dashboard.render.com).
3. Click **New +** ➡️ **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically detect [`render.yaml`](./render.yaml) and configure:
   - **`upsc-unified-backend`** (Node.js Web Service)
   - **`upsc-web-frontend`** (Static Site with SPA routing rewrites)
   - Pre-linked environment variables (connecting to your Supabase Cloud Database)
6. Click **Apply**. Both services will build and deploy automatically!

---

## 🛠️ Method 2: Manual Dashboard Setup (Step-by-Step)

If you prefer setting up the services manually via the Render Web Dashboard:

---

### Step 1: Deploy the Backend (Web Service)

1. On the Render Dashboard, click **New +** ➡️ **Web Service**.
2. Connect your repository.
3. Configure the settings:
   - **Name**: `upsc-unified-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Expand **Advanced** and set **Health Check Path** to `/api/health`.
5. Under **Environment Variables**, add:

| Key | Value |
| :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres` |
| `DB_SCHEMA` | `public` |
| `PORT` | `3000` |
| `JWT_SECRET` | `super_secret_upsc_key_2026_enterprise` |
| `JWT_EXPIRES_IN` | `7d` |
| `GROQ_API_KEY` | `your_groq_api_key_here` |
| `CORS_ORIGIN` | `*` |
| `EMAIL_USER` | `your_email@gmail.com` |
| `EMAIL_PASS` | `your_email_app_password` |
| `RAZORPAY_KEY_ID` | `rzp_test_xxxx` |
| `RAZORPAY_KEY_SECRET` | `your_razorpay_secret` |

6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL (e.g. `https://upsc-unified-backend.onrender.com`).

---

### Step 2: Deploy the Web Client (Static Site)

1. On the Render Dashboard, click **New +** ➡️ **Static Site**.
2. Connect the same repository.
3. Configure the settings:
   - **Name**: `upsc-web`
   - **Root Directory**: `web`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Environment Variables**, add:

| Key | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://upsc-unified-backend.onrender.com` *(paste your backend URL from Step 1)* |

5. **CRITICAL (Prevent 404 on page refresh)**:
   - In your Static Site settings, go to **Redirects/Rewrites**.
   - Click **Add Rule**:
     - **Type**: `Rewrite`
     - **Source**: `/*`
     - **Destination**: `/index.html`
   *(This ensures React Router routes like `/classroom`, `/login`, `/dashboard` load properly on refresh).*

6. Click **Save Changes** / **Deploy**.

---

## 📱 Mobile App (Flutter)

To connect your Flutter mobile app to your Render backend in production:
```bash
flutter run --dart-define=API_BASE_URL=https://upsc-unified-backend.onrender.com
```
Or build the production APK:
```bash
flutter build apk --release --dart-define=API_BASE_URL=https://upsc-unified-backend.onrender.com
```

---

## 🩺 Verifying Your Live Deployment

- **Backend Health Check**: Open `https://your-backend.onrender.com/api/health`
  - Expected response: `{"status": "online", "database": "connected"}`
- **Web App**: Open `https://your-web.onrender.com`
  - Test signing in with:
    - **Admin**: `admin@upscplatform.com` / `Admin@UPSC2026`
    - **Student**: `student@upscplatform.com` / `Student@2026`
