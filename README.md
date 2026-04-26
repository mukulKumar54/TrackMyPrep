# 🚀 TrackMyPrep

**TrackMyPrep** is a comprehensive, AI-powered interview preparation dashboard designed to help students and job seekers manage their preparation journey efficiently. Get personalized coaching tips, track your tasks, and visualize your progress—all in one soothing, light-themed workspace.

![TrackMyPrep Dashboard](https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000)

## ✨ Key Features

- **🤖 AI Prep Coach:** Get personalized study tips, resume improvements, and skill-gap analysis powered by **Google Gemini AI**.
- **📊 Progress Analytics:** Visualize your interview rounds and preparation status with interactive charts.
- **✅ Task Management:** Organize your study schedule with a clean, easy-to-use task tracker.
- **📅 Interview Tracker:** Log your interview rounds, status (Pending, Offered, Rejected), and feedback.
- **🎨 Premium UI:** A beautiful "Light Study Mode" design featuring glassmorphism, smooth animations, and a focus-friendly color palette.

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS** (Modern styling)
- **Recharts** (Data visualization)
- **React Router 7** (Navigation)
- **React Hot Toast** (User notifications)

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose** (Database)
- **JWT** (Secure authentication)
- **Google Generative AI SDK** (Gemini 2.5 Flash)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mukulKumar54/TrackMyPrep.git
   cd TrackMyPrep
   ```

2. **Setup Backend:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_key
   CLIENT_URL=http://localhost:5173
   ```

3. **Setup Frontend:**
   ```bash
   cd ../client
   npm install
   ```

### Running Locally

1. **Start Backend Server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start Frontend Client:**
   ```bash
   cd client
   npm run dev
   ```

The app will be available at `http://localhost:5173`.

## 🌐 Deployment

The project is configured for easy deployment:
- **Frontend:** Optimized for Vercel with `vercel.json` rewrite rules.
- **Backend:** Can be deployed to Render, Railway, or Heroku.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by Mukul Kumar
