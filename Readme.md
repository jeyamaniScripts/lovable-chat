# Microservices Chat Application (MERN + gRPC + Docker)

A full-stack real-time chat application built using a **microservices architecture**.  
Authentication is handled by a dedicated **gRPC Auth Service**, chat and messaging by an **Express + Socket.IO Chat Service**, and the frontend is built using **React**.  
Backend services are containerized using **Docker** and orchestrated with **Docker Compose**.

---

## 🏗 Architecture Overview


Frontend (React)
|
| REST APIs + Socket.IO
v
Chat Service (Express + Socket.IO)
|
| gRPC
v
Auth Service (gRPC)
|
v
MongoDB


---

## 🧩 Services Overview

### 🔐 Auth Service (gRPC)
- Handles authentication and authorization
- Validates JWT tokens
- Fetches user details from MongoDB
- Exposes gRPC method: `ValidateToken`
- Used only for internal service-to-service communication

### 💬 Chat Service (REST + Socket.IO)
- Handles users, chats, groups, and messages
- Real-time messaging using Socket.IO
- REST APIs for chat and message management
- Calls Auth Service via gRPC to validate tokens

### 🌐 Frontend (React)
- Built using React
- Communicates with Chat Service via REST APIs
- Uses Socket.IO for real-time messaging
- Not containerized (focus of assignment is backend microservices)

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- gRPC
- Socket.IO
- JWT Authentication

### Frontend
- React
- Axios
- Socket.IO Client

### DevOps
- Docker
- Docker Compose

---

## 📁 Project Structure

lovable/
│
├── frontend/
│ └── (React application)
│
├── auth-service/
│ ├── proto/auth.proto
│ ├── grpcServer.js
│ ├── Dockerfile
│ ├── .dockerignore
│ └── package.json
│
├── chat-service/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ ├── server.js
│ ├── Dockerfile
│ ├── .dockerignore
│ └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md



---

## 🚀 Running the Backend with Docker

### Prerequisites
- Docker Desktop (WSL 2 enabled on Windows)

### ▶ Start All Backend Services

```bash
docker compose up --build

This will start:

MongoDB

Auth Service (gRPC) → localhost:50051

Chat Service (REST + Socket.IO) → localhost:4000

🌐 Running the Frontend (Development)

cd frontend
npm install
npm run dev

Frontend runs at:
http://localhost:5173
