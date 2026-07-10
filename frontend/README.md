ElevateHer Frontend

Modern React frontend for the ElevateHer platform. It provides a responsive user interface for learning, job discovery, marketplace, authentication, and user profile management while communicating with the Express backend through REST APIs.

Tech Stack
React 19
TypeScript
Vite
Tailwind CSS
TanStack Router
TanStack Query (React Query)
Shadcn/UI
ESLint
Prettier
npm
Setup

Install dependencies

npm install

Create a .env file

VITE_API_URL=http://localhost:5000

Start the development server

npm run dev

Frontend runs at

http://localhost:5173
Features
User Authentication
Onboarding Flow
Course Discovery & Learning
Job Listings & Applications
Marketplace
Resume Management
Profile Dashboard
Responsive UI
REST API Integration
JWT Authentication
Payment Integration Support
Project Structure
src/
 ├── components/
 ├── pages/
 ├── routes/
 ├── hooks/
 ├── services/
 ├── lib/
 ├── assets/
 └── styles/
Backend Integration

The frontend communicates with the Express backend using REST APIs.

Backend URL

http://localhost:5000

Example Environment Variable

VITE_API_URL=http://localhost:5000
Development

Run development server

npm run dev

Build production version

npm run build

Preview production build

npm run preview

Lint project

npm run lint
Connected Services
Express Backend
PostgreSQL Database (via Backend)
FastAPI ML Service
Razorpay Payment Gateway
JWT Authentication
