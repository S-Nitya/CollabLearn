# CollabLearn
 Collaborative learning platform (full-stack): connect learners and instructors, schedule skill sessions, chat in real-time, post & discover skills.

Overview
--------
CollabLearn is a full-stack platform for connecting learners and instructors. It includes a React (Vite) frontend and an Express + MongoDB backend with Socket.IO for real-time chat.

Quick start
-----------
1. Copy or create `server/.env` with at least:

	 MONGODB_URI=your-mongodb-uri
	 JWT_SECRET=your-secret

2. Install dependencies and run both servers:

```powershell
cd server; npm install; npm run dev
cd ../client; npm install; npm run dev
```

Notes
-----
- Backend default MongoDB: `mongodb://localhost:27017/collablearn` if `MONGODB_URI` is not set.
- Dev server ports: backend default 5000, Vite default 5173. CORS is configured for `http://localhost:5173`.

Main features 
---------------------
- Auth (register/login, JWT)
- Profiles & avatars
- Posts (create, like, comment)
- Skill listings (offerings/seeking) and recommendations
- Booking & session management, document uploads
- Ratings & reviews
- Real-time chat (Socket.IO)
- Admin moderation endpoints

API quick pointers
------------------
- Auth: `/api/auth` (register, login, me, profile)
- Posts: `/api/posts`
- Skills: `/api/skills`
- Booking: `/api/booking`
- Dashboard: `/api/dashboard`
- Admin: `/api/admin`

----------------
_Developed by Nitya Singh, Shubham Upadhyay, Siddhi Sushir_
