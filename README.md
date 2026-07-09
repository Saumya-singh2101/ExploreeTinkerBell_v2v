# 🌸 ElevateHer

## 💡 The Idea

ElevateHer is an AI-powered platform designed to empower women by providing a unified ecosystem for learning, employment, entrepreneurship, and career growth. Instead of relying on multiple disconnected platforms, users can upskill, discover job opportunities, build AI-assisted resumes, sell handmade products, and receive personalized AI recommendations from a single application.

The platform combines modern web technologies with Machine Learning to create an intelligent, scalable, and user-centric experience that supports women throughout their professional journey.

---

# 🔗 Important Links

### 🌐 Live Deployment
Coming Soon

### 🎥 Demo Video
Coming Soon

### 📑 Backend Documentation
`/elevateher-backend/README.md`

### 🤖 ML Service Documentation
`/elevateher-ml/README.md`

---

# ✨ Features

## 📚 Learn

- Browse and enroll in courses
- Interactive quizzes
- Progress tracking
- Course completion certificates
- Course reviews and ratings

---

## 💼 Earn

- Browse job opportunities
- Apply for jobs
- Employer dashboard
- Interview scheduling
- Applicant management
- User review system

---

## 🛍️ Flourish Marketplace

- Product listings
- Shopping cart
- Order management
- Seller dashboard
- Product reviews
- Secure payment workflow

---

## 📄 Resume Builder

- Resume creation
- Resume management
- File uploads
- Resume retrieval

---

## 🤖 AI Features

- Resume skill extraction
- Product price prediction
- AI-generated product descriptions
- Review sentiment analysis
- Text moderation
- Image moderation
- At-risk learner prediction
- Intelligent recommendation engine

---

# 🛠 Tech Stack & Tools

## Frontend

- React
- TypeScript
- Tailwind CSS
- Vite

---

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt.js
- Multer
- Morgan
- CORS

---

## Machine Learning

- Python
- FastAPI
- Scikit-learn
- Sentence Transformers
- Pandas
- NumPy

---

## DevOps

- Docker
- Docker Compose
- GitHub Actions
- Git
- GitHub

---

# 📖 Documentation

## 🏗 Overall Architecture

ElevateHer follows a modular microservice-inspired architecture where each layer has a dedicated responsibility.

```
                          React Frontend
                                 │
                                 │ REST APIs
                                 ▼
                   Node.js + Express Backend
                                 │
          ┌──────────────┬───────────────┬──────────────┐
          │              │               │              │
      Authentication   Business Logic   Prisma ORM   File Uploads
                                               │
                                               ▼
                                         PostgreSQL
                                               │
                                               ▼
                                   FastAPI ML Service
                                               │
                           AI Models & Recommendation Engine
```

---

## 🔄 Request Flow

```
User

   │

Frontend (React)

   │

HTTP Request

   │

Express Router

   │

Authentication Middleware

   │

Controller

   │

Business Logic

   │

Prisma ORM

   │

PostgreSQL

   │

(Optional AI Request)

FastAPI ML Service

   │

JSON Response

   │

Frontend
```

---

## 📂 Repository Structure

```
ElevateHer/
│
├── elevateher-backend/
│   ├── src/
│   ├── prisma/
│   ├── public/
│   ├── uploads/
│   ├── Dockerfile
│   └── README.md
│
├── elevateher-ml/
│   ├── models/
│   ├── services/
│   ├── main.py
│   └── README.md
│
└── README.md
```

---

## ⚙ Backend

The backend is developed using **Node.js**, **Express.js**, and **Prisma ORM**, exposing modular REST APIs for:

- Authentication & Onboarding
- Learning Management
- Job Portal
- Marketplace
- Resume Management
- File Uploads
- ML Integration

Authentication is implemented using **JWT**, passwords are securely hashed using **bcrypt.js**, and data is managed through **PostgreSQL** with **Prisma ORM**.

---

## 🤖 Machine Learning Service

The ML service is built independently using **FastAPI** and communicates with the backend through REST APIs.

It currently provides:

- Resume Skill Extraction
- AI Product Description Generation
- Product Pricing Recommendation
- Sentiment Analysis
- Content Moderation
- At-Risk Learner Prediction

Keeping the ML service independent allows the AI models to evolve without affecting the backend architecture.

---

## 🐳 DevOps & Deployment

The project supports containerized development using **Docker** and **Docker Compose**, allowing the backend, database, and ML service to run consistently across different environments.

GitHub Actions provides Continuous Integration by automatically validating backend changes whenever new commits are pushed.

---

# 🚀 Future Scope

- AI Career Mentor
- Personalized Learning Roadmaps
- AI Interview Preparation
- Community Forums
- Mobile Application
- Real-time Notifications
- Cloud Deployment
- Advanced Recommendation System

---

# ❤️ Team ElevateHer

Empowering women through technology, AI, education, employment, and entrepreneurship.
