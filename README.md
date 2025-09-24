# Gramin Swasthya - Telemedicine Platform for Rural India

**Gramin Swasthya** is a comprehensive telemedicine solution designed to bridge the healthcare gap in rural India. It connects patients with doctors via a robust digital platform, facilitates online appointment booking, provides AI-driven health insights, and enables access to remedies and medicines.

## 🚀 Startup Manual

### Prerequisites
- **Docker** and **Docker Compose** must be installed on your system.

### Quick Start
This project is fully containerized. To start the entire stack (Backend, Patient Frontend, Doctor Portal, Database):

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/gramin-swasthya.git
    cd gramin-swasthya
    ```

2.  Build and Run with Docker Compose:
    ```bash
    docker-compose up --build -d
    ```

3.  Access the Applications:
    - **Patient Frontend:** [http://localhost:5173](http://localhost:5173)
    - **Doctor Portal:** [http://localhost:3001](http://localhost:3001)
    - **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

### Stopping the Services
To stop the containers:
```bash
docker-compose down
```

---

## 📂 Project Structure

The project is organized into a monorepo structure:

```
/
├── backend/                # FastAPI Backend
│   ├── app/
│   │   ├── api/            # API Endpoints (Auth, Appointments, Shop)
│   │   ├── core/           # Security & Config (JWT, CORS)
│   │   ├── db/             # Database connection & Session
│   │   ├── models/         # SQLAlchemy Database Models
│   │   └── schemas/        # Pydantic Schemas for Validation
│   ├── data/               # Seed data (Doctors, Remedies, Products)
│   └── main.py             # Application Entrypoint
│
├── frontend/               # Patient Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # Dashboard, Login, Shop Pages
│   │   └── context/        # Auth Context
│   └── public/             # Assets & Images
│
├── doctor-frontend/        # Doctor Portal (React + Vite)
│   ├── src/
│   │   ├── pages/          # Doctor Dashboard, Appointments
│   │   └── services/       # API Integration services
│
├── nginx.conf              # Nginx Configuration for Reverse Proxy
└── docker-compose.yml      # Container Orchestration
```

---

## 🎨 Design & UI System

Designed with accessibility and rural usability in mind.

- **Color Palette:** Calming earthy tones (Greens, Browns) mixed with clinical Whites/Blues to evoke trust and nature.
- **Typography:** Clear, legible sans-serif fonts optimized for low-resolution mobile screens common in rural areas.
- **Responsive Design:** Mobile-first approach, ensuring full functionality on smartphones.
- **Accessibility:** High contrast modes and intuitive navigation for users with low digital literacy.

**Key Design Features:**
- **Visual Remedy Cards:** Easy-to-understand cards for home remedies.
- **Simple Appointment Flow:** 3-step booking process.
- **Bilingual Support (Planned):** UI prepared for multi-language toggles (Hindi/English).

---

## 🛠 Functionality

### 1. Patient Portal
- **User Authentication:** Secure Signup/Login using JWT.
- **Dashboard:** View health records, upcoming appointments, and daily health tips.
- **Book Appointments:** Browse doctors by specialization and book slots.
- **AI Health Assistant:** Chat with an AI bot for preliminary symptom analysis.
- **Shop & Remedies:** Purchase medicines or view natural home remedies.

### 2. Doctor Portal
- **Appointment Management:** View and manage patient bookings.
- **Patient History:** Access patient health records securely.
- **Availability:** Manage visiting hours and consultation slots.

### 3. Backend (API)
- **FastAPI:** High-performance async API.
- **PostgreSQL:** Robust relational database for data integrity.
- **Security:** OAuth2 password flow with Bearer tokens.
- **Dockerized:** Fully isolated environment for reliability.

---

## 👥 Contributors

- **TarunaJ2006:**
    - Lead Designer (UI/UX, Assets, CSS Systems)
    - Database Architect (Schema Design, SQL Models)
    - Backend Integration & Data Logic
    - Project Documentation & Manuals

- **hasan72341:**
    - Full Stack Developer (React Logic, FastAPI Core)
    - DevOps (Docker, Nginx, CI/CD Removal)
    - System Architecture
