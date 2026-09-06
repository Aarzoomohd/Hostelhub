import { Routes, Route, Navigate } from "react-router-dom";

import MainPage from "./pages/MainPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/register";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Rooms from "./pages/Rooms";
import Payments from "./pages/Payment.jsx";
import HostelDetails from "./pages/HostelDetails";

const App = () => {
  return (
    <Routes>
      {/* FIRST PAGE */}
      <Route path="/" element={<MainPage />} />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* APP */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/students" element={<Students />} />
      <Route path="/api/room" element={<Rooms />} />
      <Route path="/api/payment" element={<Payments />} />
      <Route path="/api/hostel" element={<HostelDetails />} />

      {/* INVALID URL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;