# Employee Leave & Attendance Management System

## 📌 Project Overview

The Employee Leave & Attendance Management System is a mini HR tool designed to help organizations manage employee records, leave requests, and attendance efficiently.

This system provides role-based access for **Admin** and **Employees**, ensuring secure and structured management of HR operations.

---

## 🚀 Features

### 👨‍💼 Admin

* View all employee leave requests
* Approve or reject leave applications
* View attendance records of employees
* Secure admin-only routes

### 👨‍💻 Employee

* Apply for leave
* Cancel pending leave requests
* View personal leave history
* Mark daily attendance

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt (Password Hashing)

---

## 🔐 Authentication & Security

* Passwords are securely hashed using **bcrypt**
* Authentication handled via **JWT tokens**
* Protected routes using middleware
* Role-based authorization for Admin access

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone <your-repo-link>
cd project-folder
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file in the root directory and add:

```
MONGODB_URL=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
```

---

### 4️⃣ Run the server

```bash
npm start
```

Frontend:

```bash
npm run dev
```

---

## 👤 Default Admin Credentials

(Seeded manually for testing)

```
Email: hr@test.com
Password: hrmanager
```

---

## 📡 API Endpoints

### Auth

* POST `/api/auth/register` → Register user
* POST `/api/auth/login` → Login user

### Leave

* POST `/api/leave/apply` → Apply for leave
* GET `/api/leave/my` → Get logged-in user leaves
* GET `/api/leave/all` → Admin only
* PATCH `/api/leave/admin/:id` → Approve/Reject leave
* DELETE `/api/leave/:id` → Cancel leave

### Attendance

* Mark attendance
* View attendance (Admin)

---

## 🧠 Design Decisions

* Implemented **role-based authorization** to separate admin and employee privileges.
* Used **MongoDB population** to fetch employee details in leave records.
* Followed **MVC architecture** for backend structure.
* Built reusable middleware for authentication.

---

## 🔮 Future Improvements

* Dashboard analytics
* Leave balance tracker UI
* Email notifications
* Pagination for large datasets
* Deployment (AWS / Render)

---



