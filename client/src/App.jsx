import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // apna sahi path daalo

import MainPage from "./pages/MainPage.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/register.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/Students.jsx";
import Rooms from "./pages/Rooms.jsx";
import Payments from "./pages/Payment.jsx";
import HostelDetails from "./pages/HostelDetails.jsx";

const App = () => {
  return (
    <Routes>
      {/* FIRST PAGE */}
      <Route path="/" element={<MainPage />} />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED APP ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/students" element={<Students />} />
        <Route path="/api/room" element={<Rooms />} />
        <Route path="/api/payment" element={<Payments />} />
        <Route path="/api/hostel" element={<HostelDetails />} />
      </Route>

      {/* INVALID URL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;