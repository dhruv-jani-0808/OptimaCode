# OptimaCode 🚀

OptimaCode is a modern, full-stack coding platform (similar to LeetCode) designed for developers to hone their problem-solving skills, submit algorithmic solutions, and track performance. The platform features an interactive, highly responsive React frontend and a powerful, secure Express/Node.js backend with sandboxed code execution.

---

## ✨ Key Features

* **Interactive Code Workspace**: An elegant, responsive web code editor equipped with syntax highlighting, language selection, and instant feedback.
* **Curated Algorithmic Catalog**: A vast collection of programming challenges categorized by difficulty (`Easy`, `Medium`, `Hard`), topic tags, and optimal time/space complexity analysis.
* **Multi-Language Sandboxed Compiler**: Secure, cloud-based execution supporting **Python**, **JavaScript**, **Java**, **C++**, and **C** via seamless JDoodle API integration.
* **Automated Verification Engine**: Instant evaluation of submitted code against standard test cases, reporting precise statuses (`Accepted`, `Wrong Answer`, `Compilation Error`) along with execution runtime and memory usage.
* **Secure Session Management**: Robust authentication system using hashed passwords (`bcryptjs`) and a secure JWT token rotation flow (Access and Refresh tokens).
* **Detailed Submission History**: Personalized dashboard where users can review all past code submissions, evaluate execution logs, and analyze their learning path.

---

## 🛠️ Tech Stack

### Frontend
* **Core**: [React](https://react.dev/) (SPA)
* **Styling**: Vanilla CSS / [Tailwind CSS](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)

### Backend
* **Runtime**: [Node.js](https://nodejs.org/)
* **Framework**: [Express.js](https://expressjs.com/)
* **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database) with [Mongoose](https://mongoosejs.com/)
* **API Integration**: [Axios](https://axios-http.com/) (JDoodle Sandbox Execution API)
* **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
* **Package Manager**: [pnpm](https://pnpm.io/)

---

## 📂 Project Structure

```text
OptimaCode/
├── backend/            # Express.js Server & Database Engine (Current Folder)
│   ├── config/         # Database and server configs
│   ├── controllers/    # Request handlers (auth, problems, submissions)
│   ├── models/         # Mongoose schemas (User, Problem, Submission)
│   ├── routes/         # Express routers
│   ├── scripts/        # Seeding and utility scripts
│   └── server.js       # Main server entrypoint
└── frontend/           # React Single Page Application
    ├── src/
    │   ├── components/ # Reusable UI components (Editor, Header, Cards)
    │   ├── pages/      # Views (Home, ProblemList, Dashboard, Login)
    │   └── App.jsx     # Main React routes
    └── package.json
```

---

## ⚡ Installation & Setup

### 1. Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18+)
* [pnpm](https://pnpm.io/) (`npm i -g pnpm`)
* A MongoDB database instance
* Credentials for the [JDoodle Compiler API](https://www.jdoodle.com/compiler-api/)

---

### 2. Backend Setup
1. Open your terminal in the `backend/` directory.
2. Install the server dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file in the root of the `backend/` directory and configure the environment:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_jwt_access_secret_key
   REFRESH_TOKEN_SECRET=your_jwt_refresh_secret_key
   JDOODLE_CLIENT_ID=your_jdoodle_client_id
   JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret
   ```
4. Run the seed script to populate starter problems (e.g. *Two Sum*, *Longest Substring*):
   ```bash
   node scripts/seedProblems.js
   ```
5. Start the backend server:
   ```bash
   node server.js
   ```

---

### 3. Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install frontend packages:
   ```bash
   pnpm install
   ```
3. Boot up the Vite / React development server:
   ```bash
   pnpm run dev
   ```
4. Open the development link (usually `http://localhost:5173`) in your browser to experience the platform.

---

## 🔌 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/register` | Sign up a new user | No |
| **POST** | `/login` | Log in and receive tokens | No |
| **POST** | `/refresh-token` | Obtain a new access token using a refresh token | No |

### 📚 Problems (`/api/problems`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Fetch all problems (returns summary details) | No |
| **GET** | `/:id` | Fetch details of a specific problem by ID | No |

### 🚀 Submissions (`/api/submissions`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/` | Submit a code solution for compilation & evaluation | Yes (Bearer Token) |
| **GET** | `/user` | Get all submissions made by the authenticated user | Yes (Bearer Token) |

---

## 📝 License
Distributed under the **ISC** License.
