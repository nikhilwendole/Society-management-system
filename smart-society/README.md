# Smart Society Management System

A full-stack MERN society management platform with JWT auth, role-based access
(Admin / Member / Security Guard), and 4 practical AI features powered by the
Gemini API.

---

## 1. Tech stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Multer + Cloudinary, Nodemailer
- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Context API
- **AI:** Google Gemini API (`gemini-1.5-flash`) via plain `fetch` — no extra SDK

## 2. Folder structure

```
smart-society/
├── server/                  # Express API (MVC)
│   ├── config/               # db.js, cloudinary.js
│   ├── controllers/          # business logic per resource
│   ├── models/                # Mongoose schemas
│   ├── routes/                 # route definitions -> controllers
│   ├── middlewares/           # auth, role guard, error handler, upload
│   ├── utils/                  # generateToken, cloudinary upload, email, gemini client
│   ├── server.js               # app entry point
│   └── .env.example
└── client/                  # React (Vite) app
    └── src/
        ├── components/        # Sidebar, Navbar, Table, Modal, Card, form elements...
        ├── pages/              # one file per route/screen
        ├── context/            # AuthContext (login/register/logout/session)
        ├── services/           # api.js (axios instance) + resourceService.js
        └── App.jsx             # route definitions
```

## 3. Setup

### Backend

```bash
cd server
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, CLOUDINARY_*, GEMINI_API_KEY, SMTP_*
npm install
npm run dev                # nodemon on http://localhost:5000
```


- A MongoDB connection string (local `mongodb://127.0.0.1:27017/smart-society` or Atlas)
- A free [Cloudinary](https://cloudinary.com) account (for complaint photos + profile images)
- A [Gemini API key](https://ai.google.dev) (free tier is enough for all 4 AI features)
- SMTP creds for forgot-password emails (a Gmail App Password works fine)

### Frontend

```bash
cd client
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # http://localhost:5173
```

### First admin account

There's no seed script yet — the register page can only create `member` or
`guard` accounts (by design, so nobody can self-promote to admin). Easiest
path: register a normal account, then manually flip its `role` field to
`"admin"` in MongoDB (Compass, Atlas UI, or `mongosh`), e.g.:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

## 4. How auth + roles work 

- Register/Login return a JWT signed with the user's `_id`, stored in
  `localStorage` on the client.
- `authMiddleware.protect` verifies the token on every request and attaches
  `req.user`.
- `authMiddleware.authorize("admin", "guard")` is a second middleware that
  checks `req.user.role` against an allow-list — this is the entire RBAC
  system, no external library needed.
- On the frontend, `ProtectedRoute` reads the same role off `AuthContext` and
  redirects if it doesn't match, and the Axios interceptor auto-logs-out on a
  401 response.

## 5. The 4 AI features (all Gemini-powered)

| Feature | Where | What it does |
|---|---|---|
| Complaint Assistant | Complaints page → "Improve with AI" | Resident types a rough sentence; Gemini returns a structured `{title, description, category, priority}` JSON, which pre-fills the form. |
| Notice Generator | Notice Board page → "Generate with AI" | Admin types a short instruction; Gemini drafts a polished title + body. |
| Society Chatbot | Settings page | Answers questions using the resident's own recent notices/bills/complaints as context — a simple form of retrieval-augmented prompting, not a general chatbot. |
| Meeting Summary | Settings page (admin only) | Admin pastes raw notes; Gemini returns summary + decisions + action items as JSON. |

All 4 use the same pattern: build a prompt string, ask Gemini for **JSON only**,
parse it server-side (`utils/geminiClient.js`). That's a good, simple story to
tell in an interview: "I designed a single reusable AI client, and every
feature is just a different prompt template."

## 6. What's fully built vs. what to extend

Everything listed in the original spec has a working backend endpoint. On the
frontend, every page is functional: Login/Register/Forgot/Reset password,
role-aware Dashboard, Residents, Flats, Complaints (with image upload + AI),
Maintenance, Notice Board (with AI), Visitors (invite → approve/reject → guard
entry/exit), Profile (with photo upload), and Settings (Chatbot + Meeting
Summary).

