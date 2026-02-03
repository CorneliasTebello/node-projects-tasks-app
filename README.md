# Project & Ticket Management Demo App

A full‑stack project and ticket management application built to
demonstrate modern web development practices, clean API design, and
scalable architecture.

This project showcases:

-   ⚙️ **Node.js + Express** REST API
-   🗄️ **MySQL / MariaDB** database
-   ⚛️ **React + Next.js** frontend
-   🔐 **JWT authentication**
-   🧩 Modular, production‑style structure

It's designed as a **portfolio‑ready demo** that simulates real‑world
workflows such as project tracking, ticket management, and user
authentication.

------------------------------------------------------------------------

## ✨ Features

-   User authentication (JWT)
-   Projects & tickets CRUD operations
-   RESTful API architecture
-   Database seeding with demo data
-   Next.js frontend consuming the API
-   Environment‑based configuration
-   Easy local setup

------------------------------------------------------------------------

## 🏗 Tech Stack

**Backend** - Node.js - Express - MySQL / MariaDB - JWT Authentication

**Frontend** - React - Next.js - TypeScript (config)

------------------------------------------------------------------------

## 📁 Project Structure

    root/
    │
    ├── index.js            # Express API entry point
    ├── db/
    │   └── createDB.js     # DB creation + seed script
    ├── react_app/          # Next.js frontend
    ├── .env                # Environment variables (not committed)
    └── README.md

------------------------------------------------------------------------

## 🚀 Getting Started (Local Setup)

### 1️⃣ Install dependencies

From the project root:

    npm install

------------------------------------------------------------------------

### 2️⃣ Environment Variables

Create a `.env` file in the **Node.js root directory**:

    DB_HOST=your_db_host
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_DATABASE=node_projects_app
    DB_PORT=3307
    JWT_SECRET=your_generated_secret
    CLIENT_ORIGIN=http://localhost:3000

Generate a JWT secret at: https://jwtsecrets.com/

------------------------------------------------------------------------

### 3️⃣ Configure Frontend API URL

Inside:

    react_app/next.config.ts

Update:

    NEXT_PUBLIC_API_URL=http://localhost:3001

(or your API server URL)

------------------------------------------------------------------------

### 4️⃣ Create Database & Seed Data

    node ./db/createDB.js

This will:

-   Create the database
-   Create tables
-   Seed demo users and sample data

------------------------------------------------------------------------

### 5️⃣ Run the API Server

    node ./index.js

------------------------------------------------------------------------

### 6️⃣ Run the Frontend

In a new terminal:

    cd react_app
    npm run dev

Open:

    http://localhost:3000

------------------------------------------------------------------------

## 🔑 Demo Login Accounts

  Username    Password
  ----------- ----------
  moneymike   12345
  janelane    12345
  john        12345

------------------------------------------------------------------------

## 📸 Use Case

This app demonstrates:

-   Building a REST API with Express
-   Authentication with JWT
-   Database schema design
-   Frontend/backend integration
-   Clean project organization
-   Real‑world CRUD operations

Ideal as:

-   Portfolio project
-   Full‑stack starter template
-   Learning reference

------------------------------------------------------------------------

## 🛠 Development Notes

-   Uses environment variables for security
-   DB setup automated via script
-   Easily extendable with roles, permissions, or notifications
-   Designed for clarity and maintainability

------------------------------------------------------------------------

## 📄 License

MIT --- free to use, modify, and extend.

------------------------------------------------------------------------

## 👨‍💻 Author

Built as a full‑stack demo application for showcasing Node.js + React
architecture and practical API development skills.
