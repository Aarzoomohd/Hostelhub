import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  DoorOpen,
  CreditCard,
  LogOut,
  Building2,
  MapPin,
  Mail,
  UserRound,
  BedDouble,
  Wallet,
} from "lucide-react";

import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService.js";

const Dashboard = () => {
  const { owner, logout } = useAuth();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalRooms: 0,
    totalStudents: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const data = await getDashboardStats(token);

        setStats(data.stats);
      } catch (error) {
        console.error("Dashboard stats error:", error);
      }
    };

    if (token) {
      fetchDashboardStats();
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const hostel = JSON.parse(
    localStorage.getItem("hostel") || "null"
  );

  return (
    <div className="h-screen overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 flex">

      {/* ================= SIDEBAR ================= */}

      <aside className="w-64 h-screen shrink-0 bg-white/90 backdrop-blur-xl border-r border-white shadow-xl p-6 hidden md:flex md:flex-col">

        {/* Logo */}

        <div className="flex items-center gap-3 mb-10 group cursor-default">

          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Building2
              className="text-white"
              size={23}
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              HostelHub
            </h2>

            <p className="text-xs text-gray-500">
              Management System
            </p>
          </div>

        </div>


        {/* Navigation */}

        <nav className="space-y-2">

          {/* Dashboard */}

          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
          >
            <LayoutDashboard
              size={19}
              className="transition-transform duration-300"
            />

            Dashboard
          </Link>


          {/* Students */}

          <Link
            to="/dashboard/students"
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:translate-x-1"
          >
            <Users
              size={19}
              className="transition-transform duration-300 group-hover:scale-110"
            />

            Students
          </Link>


          {/* Rooms */}

          <Link
            to="/api/room"
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:translate-x-1"
          >
            <DoorOpen
              size={19}
              className="transition-transform duration-300 group-hover:scale-110"
            />

            Rooms
          </Link>


          {/* Payments */}

          <Link
            to="/api/payment"
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:translate-x-1"
          >
            <CreditCard
              size={19}
              className="transition-transform duration-300 group-hover:scale-110"
            />

            Payments
          </Link>


          {/* Hostel Details */}

          <Link
            to="/api/hostel"
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:translate-x-1"
          >
            <Building2
              size={19}
              className="transition-transform duration-300 group-hover:scale-110"
            />

            Hostel details
          </Link>

        </nav>


        {/* Logout */}

        <div className="mt-auto">

          <button
            onClick={handleLogout}
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300 font-medium active:scale-[0.98]"
          >
            <LogOut
              size={19}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />

            Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white transition-shadow duration-300 hover:shadow-md">

          <div>

            <p className="text-sm text-blue-600 font-semibold mb-1">
              Hostel Dashboard
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Welcome back, {owner?.name}{" "}
              <span className="inline-block animate-wave">
                👋
              </span>
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your hostel, students, rooms and payments.
            </p>

          </div>


          {/* Owner Profile */}

          <div className="flex items-center gap-3 group cursor-default">

            <div className="w-11 h-11 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">

              <UserRound
                className="text-white"
                size={21}
              />

            </div>

            <div>

              <p className="font-semibold text-gray-800">
                {owner?.name}
              </p>

              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Mail size={13} />
                {owner?.email}
              </p>

            </div>

          </div>

        </div>


  


        {/* ================= OVERVIEW ================= */}

        <div className="mt-6">

          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Hostel Overview
          </h2>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

            {/* Total Students */}

            <div className="group bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-white hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-1.5 cursor-default">

              <div className="flex items-center justify-between">

                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">

                  <Users
                    className="text-blue-600"
                    size={20}
                  />

                </div>

              </div>

              <p className="text-sm text-gray-500 mt-4">
                Total Students
              </p>

              <h3 className="text-3xl font-bold text-gray-800 mt-1 transition-colors duration-300 group-hover:text-blue-600">
                {stats.totalStudents}
              </h3>

            </div>


            {/* Total Rooms */}

            <div className="group bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-white hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 hover:-translate-y-1.5 cursor-default">

              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">

                <DoorOpen
                  className="text-indigo-600"
                  size={20}
                />

              </div>

              <p className="text-sm text-gray-500 mt-4">
                Total Rooms
              </p>

              <h3 className="text-3xl font-bold text-gray-800 mt-1 transition-colors duration-300 group-hover:text-indigo-600">
                {stats.totalRooms}
              </h3>

            </div>


            {/* Occupied Beds */}

            <div className="group bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-white hover:shadow-xl hover:shadow-purple-100 transition-all duration-300 hover:-translate-y-1.5 cursor-default">

              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">

                <BedDouble
                  className="text-purple-600"
                  size={20}
                />

              </div>

              <p className="text-sm text-gray-500 mt-4">
                Occupied Beds
              </p>

              <h3 className="text-3xl font-bold text-gray-800 mt-1 transition-colors duration-300 group-hover:text-purple-600">
                {stats.occupiedBeds}
              </h3>

            </div>


            {/* Empty Beds */}

            <div className="group bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-white hover:shadow-xl hover:shadow-green-100 transition-all duration-300 hover:-translate-y-1.5 cursor-default">

              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">

                <BedDouble
                  className="text-green-600"
                  size={20}
                />

              </div>

              <p className="text-sm text-gray-500 mt-4">
                Empty Beds
              </p>

              <h3 className="text-3xl font-bold text-gray-800 mt-1 transition-colors duration-300 group-hover:text-green-600">
                {stats.availableBeds}
              </h3>

            </div>


            {/* Total Beds */}

            <div className="group bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-white hover:shadow-xl hover:shadow-orange-100 transition-all duration-300 hover:-translate-y-1.5 cursor-default">

              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">

                <Wallet
                  className="text-orange-600"
                  size={20}
                />

              </div>

              <p className="text-sm text-gray-500 mt-4">
                Total Beds
              </p>

              <h3 className="text-3xl font-bold text-gray-800 mt-1 transition-colors duration-300 group-hover:text-orange-600">
                {stats.totalBeds}
              </h3>

            </div>

          </div>

        </div>


        {/* ================= QUICK ACTIONS ================= */}

        <div className="mt-6 bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white transition-shadow duration-300 hover:shadow-md">

          <h2 className="text-xl font-bold text-gray-800">
            Quick Actions
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage your hostel quickly.
          </p>


          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">

            {/* Students */}

            <Link
              to="/dashboard/students"
              className="group flex items-center gap-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-[0.98]"
            >

              <Users className="text-blue-600 transition-transform duration-300 group-hover:scale-110" />

              <div>

                <p className="font-semibold text-gray-800">
                  Manage Students
                </p>

                <p className="text-xs text-gray-500">
                  Add and manage students
                </p>

              </div>

            </Link>


            {/* Rooms */}

            <Link
              to="/api/room"
              className="group flex items-center gap-3 p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-[0.98]"
            >

              <DoorOpen className="text-indigo-600 transition-transform duration-300 group-hover:scale-110" />

              <div>

                <p className="font-semibold text-gray-800">
                  Manage Rooms
                </p>

                <p className="text-xs text-gray-500">
                  Manage room capacity
                </p>

              </div>

            </Link>


            {/* Payments */}

            <Link
              to="/api/payment"
              className="group flex items-center gap-3 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-[0.98]"
            >

              <CreditCard className="text-purple-600 transition-transform duration-300 group-hover:scale-110" />

              <div>

                <p className="font-semibold text-gray-800">
                  Manage Payments
                </p>

                <p className="text-xs text-gray-500">
                  Track student payments
                </p>

              </div>

            </Link>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Dashboard;