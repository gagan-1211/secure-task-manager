# Secure Task Manager

A full-stack task management application built with security and performance in mind. It features robust authentication, role-based access control (RBAC), and a modern, responsive user interface.

## 🚀 Features

-   **Secure Authentication**:
    -   JWT-based authentication (Access & Refresh Tokens).
    -   Secure password hashing using `bcrypt`.
    -   Token rotation and revocation strategies.
-   **Role-Based Access Control (RBAC)**:
    -   **User**: Can manage their own tasks.
    -   **Admin**: Can view system-wide statistics and manage all data.
-   **Task Management**:
    -   Create, Read, Update, and Delete (CRUD) tasks.
    -   Soft delete functionality.
-   **Security**:
    -   Rate limiting to prevent abuse.
    -   HTTP headers security with `helmet`.
    -   Input validation.
-   **Modern UI**: Built with React and Tailwind CSS v4.
-   **API Documentation**: Integrated Swagger UI.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: React (Vite)
-   **Styling**: Tailwind CSS v4
-   **State/Data**: React Hooks
-   **HTTP Client**: Axios

### Backend
-   **Runtime**: Node.js & Express.js
-   **Database**: PostgreSQL
-   **ORM**: Prisma
-   **Documentation**: Swagger / OpenAPI
-   **Security**: Helmet, Express-Rate-Limit, BCrypt, JSON Web Token

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
-   **Node.js** (v18 or higher)
-   **PostgreSQL** (running locally or a cloud instance)

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd secure-task-manager
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    ```
    -   Create a `.env` file in the `backend` directory (refer to `.env.example` if available, or set `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `PORT`).
    -   Run database migrations:
        ```bash
        npx prisma migrate dev
        ```
    -   Start the backend server:
        ```bash
        npm run dev
        ```
    -   Server will run on `http://localhost:5000`.

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    # Note: Requires @tailwindcss/postcss for Tailwind v4 support
    ```
    -   Start the frontend development server:
        ```bash
        npm run dev
        ```
    -   App will be available at `http://localhost:5173`.

## 📖 API Documentation

The backend includes Swagger UI documentation.
Once the backend is running, visit:
**[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

### Key Endpoints
-   `POST /api/v1/auth/register` - Register a new user
-   `POST /api/v1/auth/login` - Login and receive tokens
-   `POST /api/v1/auth/refresh` - Refresh access token
-   `GET /api/v1/tasks` - Get all tasks
-   `POST /api/v1/tasks` - Create a new task

## 🛡️ Security Best Practices Implemented
-   **No Cleartext Passwords**: All passwords are hashed.
-   **Token Expiry**: Short-lived access tokens (15m) and rotatable refresh tokens (7d).
-   **Brute Force Protection**: Rate limiting on API endpoints.
-   **Protected Headers**: Helmet.js guards against common web vulnerabilities.

---
Developed for the Secure Task Manager Project.
