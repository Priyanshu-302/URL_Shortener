# 🔒 SecureLink — Privacy-Focused URL Shortener

**SecureLink** is a modern, privacy-first URL shortener built to give you complete control over who accesses your shared resources. Instead of simple forwarding, SecureLink allows you to lock links behind email-based magic link verification. 

It is a full-stack application built with **React + TypeScript + Vite + Express + MongoDB** and integrates with **Brevo** for HTTP-based email delivery.

---

## 🚀 Key Features

* **Control Who Clicks**: Toggle links between **Public** (instant redirection) and **Protected** (requires email validation).
* **Granular Email Access Lists**: Add specific authorized email addresses (as chips) when creating or editing a protected link. If no specific emails are added, anyone with a valid email can request a magic link.
* **Passwordless magic link entry**: Visitors enter their email, receive a secure, single-use, 15-minute token link in their inbox, click it, and automatically get redirected.
* **Modern Dashboard & Analytics**: Track total links, click rates, public vs. protected links, and created dates.
* **Fluid UI & Micro-interactions**: Staggered card fade-ins, floating drift card background animations, slide tab auth swapping, and backdrop blur models built with **Framer Motion**.
* **Solid Authentication**: JWT authorization system featuring sliding access tokens in memory and refresh tokens in secure localStorage, automatically handling token updates and 401 retries.

---

## 🛠️ Technology Stack

### Frontend Client
* **Framework**: React 18 + Vite + TypeScript
* **Routing**: React Router DOM v6
* **Data Fetching & Cache**: TanStack Query (React Query)
* **API Client**: Axios (with custom request/response refresh token interceptors)
* **Form Validation**: Zod
* **Styling**: Tailwind CSS v4 (responsive utility grids)
* **Animations**: Framer Motion
* **Icons**: Lucide React

### Backend Server
* **Runtime**: Node.js + Express
* **Database**: MongoDB + Mongoose ORM
* **Security & Tokens**: JWT (JSON Web Tokens) & Bcrypt hashing
* **Email Client**: Brevo SMTP HTTP REST API (bypasses Render SMTP port restrictions)

---

## 📁 Directory Structure

```
URL_Shortener/
├── src/                      # Express Backend
│   ├── config/               # DB connection & Brevo setup
│   ├── controllers/          # Request handler functions (auth, url, access)
│   ├── middlewares/          # JWT auth validation & error handlers
│   ├── models/               # MongoDB models (User, ShortUrl, AccessToken, RefreshToken)
│   ├── routes/               # API route maps
│   ├── services/             # Database queries & email triggers
│   ├── utils/                # Helper tools (asyncHandler, token generators)
│   ├── app.js                # CORS config & app router mounting
│   └── server.js             # Local server boot listener
├── frontend/                 # Vite Frontend SPA
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Global elements (Navbar, ProtectedRoute, Toast, UrlCard)
│   │   ├── context/          # Auth state provider
│   │   ├── hooks/            # TanStack Query bindings & auth contexts
│   │   ├── lib/              # Axios config, interceptors, and Zod schemas
│   │   ├── pages/            # Application views (Landing, Auth, Dashboard, Access portals)
│   │   ├── App.tsx           # Page router and wildcard check redirector
│   │   └── main.tsx          # Client app boot wrapper
│   └── package.json
├── package.json              # Backend package configs
└── README.md
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory to run the backend:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
CLIENT_URL=https://url-shortener-rouge-pi.vercel.app/
ACCESS_TOKEN=your_secure_access_token_secret
REFRESH_TOKEN=your_secure_refresh_token_secret
BREVO_API_KEY=xkeysib-your_brevo_v3_rest_api_key
BREVO_SENDER_EMAIL=your_verified_brevo_sender_email@domain.com
```

---

## 📖 API Documentation Reference

All API responses follow the standard format:
`{ statusCode, success, message, data }`

### Authentication API (`/api/auth`)
* `POST /signup` — Register a new account. Body: `{ name, email, password }`
* `POST /login` — Log in. Returns `safeData` (user info, accessToken, refreshToken). Body: `{ email, password }`
* `POST /logout` — Invalidate the session. Body: `{ refreshToken }`
* `POST /refresh-token` — Regenerate access tokens. Body: `{ refreshToken }`
* `GET /me` — Retrieve the profile of the current authenticated user. *Header: Authorization Bearer*
* `PATCH /profile` — Update username, email, or change password. *Header: Authorization Bearer*. Body: `{ name, email, currentPassword, newPassword }`

### Short URL API (`/api/url`)
* `POST /create` — Generate a public/protected short link. *Header: Authorization Bearer*. Body: `{ originalUrl, isProtected, authorizedEmails[] }`
* `GET /my-urls` — Fetch all URLs created by the current user. *Header: Authorization Bearer*
* `PATCH /:id` — Update target URL or permitted access lists. *Header: Authorization Bearer*. Body: `{ originalUrl, isProtected, authorizedEmails[] }`
* `DELETE /:id` — Remove a shortened link. *Header: Authorization Bearer*
* `GET /check/:shortCode` — Public status check. Returns whether a short code exists, its destination, and privacy locks.

### Magic Redirections & Access Control (`/api/access` & redirects)
* `GET /:shortCode` — Direct public redirect path. If public, automatically forwards the browser and registers click analytics. If protected, redirects browser to frontend request portal.
* `POST /api/access/request` — Request access to a protected short link. Body: `{ shortCode, email }`
* `GET /api/access/verify/:token` — Validate verification tokens. Marks token used, registers click, and returns redirect destination.

---

## 🏁 Installation & Setup

### 📦 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/Priyanshu-302/URL_Shortener.git
cd URL_Shortener

# Install Backend dependencies
npm install

# Install Frontend dependencies
cd frontend
npm install
```

### 🖥️ 2. Run the Express Backend
From the root directory:
```bash
node server.js
```
The server will run on `http://localhost:5000` (connecting to your MongoDB Atlas cluster).

### 🌐 3. Run the React Client
From the `frontend/` directory:
```bash
npm run dev
```
Open `http://localhost:5173` to explore locally.

### 🌎 4. Production Build (Frontend)
To compile a minimized production build:
```bash
cd frontend
npm run build
```
The production bundle will be outputted to the `dist/` directory, ready to deploy to Vercel or Netlify.
