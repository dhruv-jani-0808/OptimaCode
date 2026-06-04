# OptimaCode 🚀
> **Master the Art of Competitive Syntax**

OptimaCode is a modern, full-stack competitive programming platform designed to simulate the premium LeetCode experience. Built with a stunning dark-theme glassmorphism UI, it features a fully functional interactive workspace, real-time code execution, and algorithmic performance tracking.

## ✨ Features
- **LeetCode-Style Execution Engine:** Just write your core logic! Our custom backend AST wrapper automatically parses standard inputs and executes your code dynamically (No `int main()` boilerplate required).
- **Interactive IDE:** Integrated Monaco Editor with syntax highlighting, Fira Code ligatures, and an integrated console terminal.
- **Advanced Code Evaluation:** Real-time compilation via JDoodle API with strict enforcement for **Time Limit Exceeded (TLE)** and **Memory Limit Exceeded (MLE)**.
- **Editorial Hub:** Built-in multi-language editorial solutions featuring expected Time (O(n)) and Space complexity analysis.
- **Secure Authentication:** Robust JWT-based authentication flow with access/refresh token rotation and password hashing.
- **Premium UI/UX:** Ultra-modern dark slate aesthetics with crisp emerald accents and responsive flex/grid layouts.

## 📁 File Structure

```text
OptimaCode/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── problemController.js
│   │   └── submissionController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Problem.js
│   │   ├── Submission.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── problemRoutes.js
│   │   └── submissionRoutes.js
│   ├── scripts/
│   │   └── seedProblems.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── oc-favicon.svg
    ├── src/
    │   ├── components/
    │   │   ├── AuthLayout.jsx
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── About.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Problems.jsx
    │   │   ├── Register.jsx
    │   │   └── Workspace.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── vercel.json
    └── vite.config.js
```

## 🛠️ Tech Stack
**Frontend:**
- React 19 (Vite)
- Tailwind CSS
- React Router v7
- Monaco Editor (`@monaco-editor/react`)
- Axios

**Backend:**
- Node.js & Express.js
- MongoDB (Mongoose)
- JSON Web Tokens (JWT) & bcryptjs
- JDoodle Compiler API

## ⚙️ Environment Variables
To run this project, you will need to add the following environment variables to your `.env` files.

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/OptimaCode
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
JDOODLE_CLIENT_ID=your_jdoodle_client_id
JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret
```

### Frontend (`frontend/.env` - Optional)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Run Locally

1. **Clone the repository**
```bash
git clone https://github.com/your-username/OptimaCode.git
```

2. **Start the Backend**
```bash
cd backend
npm install
# Optional: Seed the database with algorithmic problems
node scripts/seedProblems.js 
npm start
```

3. **Start the Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Deployment
OptimaCode is architected as a decoupled monorepo, fully optimized for modern cloud deployments:
- **Frontend** is deployed on **Vercel** for lightning-fast global CDN delivery.
- **Backend** is hosted on **Render / Railway** with `0.0.0.0/0` whitelisted on MongoDB Atlas for dynamic cloud IP access.
