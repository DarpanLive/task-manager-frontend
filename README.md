// README.txt
TEAM TASK MANAGER - FRONTEND APPLICATION
=========================================

PROJECT OVERVIEW
----------------
A professional, production-ready team task management application with:
- JWT Authentication
- Role-based access (Admin/Member)
- Full CRUD operations for projects and tasks
- Responsive design for all devices (mobile, tablet, desktop)
- Dark/Light theme support
- Smooth animations using Framer Motion

SETUP INSTRUCTIONS
------------------

1. Install dependencies:
   npm install

2. Start development server:
   npm run dev

3. Build for production:
   npm run build

4. Preview production build:
   npm run preview

BACKEND CONNECTION
------------------
The frontend expects the backend API at: http://localhost:8080/api

Required API Endpoints:
- POST   /api/auth/signup
- POST   /api/auth/login
- GET    /api/users (Admin only)
- GET    /api/projects
- POST   /api/projects
- PUT    /api/projects/:id
- DELETE /api/projects/:id
- GET    /api/tasks
- POST   /api/tasks
- PUT    /api/tasks/:id
- DELETE /api/tasks/:id
- GET    /api/dashboard

RESPONSIVE BREAKPOINTS
----------------------
- Desktop: > 1024px (full sidebar)
- Tablet: 768px - 1024px (adjusted grid layout)
- Mobile: < 768px (collapsible hamburger menu)

TECHNOLOGY STACK
----------------
- React 18
- Vite (Build tool)
- React Router DOM v6
- Axios (API calls)
- Framer Motion (Animations)
- Plain CSS (No Tailwind)

FEATURES
--------
✅ Authentication (Login/Signup)
✅ Role-based Access Control
✅ Dashboard with Stats
✅ Project Management
✅ Task Management with Status Updates
✅ User Management (Admin only)
✅ Dark/Light Theme Toggle
✅ Responsive Mobile Navigation
✅ Toast Notifications
✅ Loading Skeletons
✅ Form Validations
✅ Protected Routes

TROUBLESHOOTING
---------------
1. Make sure backend is running on port 8080
2. Check CORS settings on backend
3. Clear localStorage if having auth issues
4. Check browser console for errors

DEPLOYMENT
----------
To deploy on Railway:
1. Push code to GitHub
2. Connect Railway to GitHub
3. Set build command: npm run build
4. Set start command: npm run preview

VIDEO DEMO LINK: [Insert your video link here]
LIVE URL: [Insert your live URL here]
GITHUB REPO: [Insert your GitHub repo link here]