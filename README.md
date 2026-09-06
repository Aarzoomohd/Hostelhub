# 🏨 HostelHub – Hostel Management System

HostelHub is a full-stack **Hostel Management System** designed to help hostel owners manage their hostel operations from a single platform.

The system provides a centralized dashboard for managing hostels, rooms, students/residents, payments, authentication, and other day-to-day hostel operations.

---

## 🚀 Features

### 🔐 Authentication & Security

- Owner registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Email verification using OTP
- Forgot password functionality
- Password reset using email OTP
- Protected routes
- Secure authentication flow
- Logout functionality

### 🏢 Hostel Management

- Create hostel details
- View hostel information
- Update hostel details
- Manage hostel information from the dashboard

### 🛏️ Room Management

- Add hostel rooms
- Manage room information
- Track room availability
- Manage room occupancy

### 👨‍🎓 Student / Resident Management

- Add students/residents
- View resident information
- Manage resident records
- Assign residents to rooms

### 💰 Payment Management

- Manage hostel payments
- Track payment information
- View payment records

### 📊 Dashboard

The dashboard provides an overview of hostel operations including:

- Total residents
- Room occupancy
- Available beds
- Payment/collection information
- Hostel overview

### 📱 Responsive Design

HostelHub is designed to work across different screen sizes:

- 📱 Mobile
- 💻 Laptop
- 🖥️ Desktop
- 📟 Tablet

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router
- Tailwind CSS
- Axios
- Lucide React
- React Hot Toast
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Nodemailer

### Database

- MongoDB

### Email Service

- Nodemailer
- Gmail SMTP
- OTP-based email verification and password reset

---

## 📂 Project Structure

```text
HostelHub/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── register.jsx
│   │   │   │
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── Rooms.jsx
│   │   │   ├── Payment.jsx
│   │   │   └── HostelDetails.jsx
│   │   │
│   │   └── services/
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json