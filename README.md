# 🛠️ Support Ticketing System

## 📌 Project Overview
A web-based support system that enables customers to raise tickets, support agents to resolve them, and admins to manage everything.  
Built to simulate real-world ticketing flows with GitHub issue integration.  
Useful for internal IT teams, SaaS platforms, or open-source project support workflows.

---

## 🚀 Features
- Customer registration and login  
- Ticket creation with GitHub issue sync  
- Admin dashboard with ticket assignment and status control  
- Agent dashboard with reply and status update capability  
- Role-based access control  
- GitHub API integration for real-time issue tracking

---

## 🧰 Technologies Used
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB + Mongoose  
- **Templating Engine**: EJS  
- **GitHub API**: Octokit  
- **Session Management**: express-session  
- **Password Hashing**: bcrypt

---

## 📋 Prerequisites
- **Node.js**: v18+  
- **MongoDB**: Atlas cloud or local  
- **GitHub Account**: Personal Access Token (PAT) with `repo` permissions

---

## ⚙️ Setup Instructions

### Create GitHub Repository
- Create a private or public GitHub repository (e.g., `support-ticket-test`).

### Create GitHub Personal Access Token
- Go to [GitHub Settings > Developer Settings > Tokens](https://github.com/settings/tokens)
- Generate a token with `repo` access (for creating/updating issues)
- Copy the token

### Clone the project and configure environment variables
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd support-ticket-system
cp .env.example .env
```
### Paste your GitHub token in .env
```bash
GITHUB_TOKEN=your_token_here
```
###  Install dependencies
```bash
npm install
```
###  Start the development server
```bash
npm run dev
```
Server runs on: http://localhost:3000

## 🚀 Deployment

Live Demo: [Support Ticket System on Render](https://ticket-system-1-srwd.onrender.com/users/register)

---

### 👤 Demo Credentials

#### 🧑‍💻 Customer Login
- **Email:** h@123.com  
- **Password:** 12345

#### 👨‍💼 Admin Login
- **Email:** admin@gmail.com  
- **Password:** 12345

#### 🎧 Agent 1 Login
- **Email:** a1@gmail.com  
- **Password:** 12345

#### 🎧 Agent 2 Login
- **Email:** a2@gmail.com  
- **Password:** 12345

Loom Video [Link](https://www.loom.com/share/885556dc3d1c44e7a5042aa8b2b46947?sid=b7e65dde-8b09-4cfb-9ad0-a624d59ed2fd)