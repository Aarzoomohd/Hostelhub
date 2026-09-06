import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

import {
  LayoutDashboard,
  Users,
  DoorOpen,
  CreditCard,
  LogOut,
  Building2,
  UserPlus,
  X,
  Trash2,
  Pencil,
  Search,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} from "../services/studentService.js";

import { getRooms } from "../services/roomService.js";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  room: "",
};

const Students = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyForm);

  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [deletingId, setDeletingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [roomFilter, setRoomFilter] = useState("");

  // ================= FETCH STUDENTS =================

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");

      try {
        const data = await getStudents(token);
        setStudents(data.students || []);
      } catch (error) {
        console.error("Error fetching students:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to fetch students"
        );
      }
    };

    fetchStudents();
  }, []);

  // ================= FETCH ROOMS =================

  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem("token");

      try {
        const data = await getRooms(token);
        setRooms(data.rooms || []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  // ================= LOGOUT =================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ================= FORM CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= ADD =================

  const openAddForm = () => {
    setEditingStudent(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  // ================= EDIT =================

  const openEditForm = (student) => {
    setEditingStudent(student);

    setFormData({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      address: student.address || "",
      room: student.room?._id || "",
    });

    setIsFormOpen(true);
  };

  // ================= CLOSE FORM =================

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingStudent(null);
    setFormData(emptyForm);
  };

  // ================= CREATE / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    setSubmitting(true);

    try {
      if (editingStudent) {
        const data = await updateStudent(
          editingStudent._id,
          formData,
          token
        );

        toast.success(
          data.message || "Student updated successfully"
        );

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === editingStudent._id
              ? data.student
              : student
          )
        );
      } else {
        const data = await createStudent(
          formData,
          token
        );

        toast.success(
          data.message || "Student created successfully"
        );

        setStudents((prevStudents) => [
          data.student,
          ...prevStudents,
        ]);
      }

      closeForm();
    } catch (error) {
      console.error("Student save error:", error);

      toast.error(
        error.response?.data?.message ||
          (editingStudent
            ? "Student update failed"
            : "Student creation failed")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE =================

  const handleDelete = async (studentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    setDeletingId(studentId);

    try {
      const data = await deleteStudent(
        studentId,
        token
      );

      toast.success(
        data.message || "Student deleted successfully"
      );

      setStudents((prevStudents) =>
        prevStudents.filter(
          (student) => student._id !== studentId
        )
      );
    } catch (error) {
      console.error("Student deletion error:", error);

      toast.error(
        error.response?.data?.message ||
          "Student deletion failed"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ================= FILTER =================

  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      student.name?.toLowerCase().includes(searchText) ||
      student.email?.toLowerCase().includes(searchText) ||
      student.phone?.toLowerCase().includes(searchText);

    const matchesRoom =
      !roomFilter ||
      student.room?._id === roomFilter;

    return matchesSearch && matchesRoom;
  });

  // ================= SIDEBAR =================

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
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:translate-x-1"
          >
            <LayoutDashboard
              size={19}
              className="transition-transform duration-300 group-hover:scale-110"
            />

            Dashboard
          </Link>


          {/* Students - ACTIVE */}

          <Link
            to="/dashboard/students"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
          >
            <Users
              size={19}
              className="transition-transform duration-300"
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

      <main className="flex-1 h-screen overflow-y-auto">

        <div className="p-4 md:p-8">

          {/* ================= HEADER ================= */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white">

            <div>

              <p className="text-sm text-blue-600 font-semibold mb-1">
                Hostel Management
              </p>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Students
              </h1>

              <p className="text-gray-500 mt-1">
                Manage students and their room assignments.
              </p>

            </div>


            <button
              onClick={openAddForm}
              className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition"
            >
              <UserPlus size={19} />

              New Student
            </button>

          </div>


          {/* ================= SUMMARY ================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

            <div className="bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-white">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">

                  <Users
                    className="text-blue-600"
                    size={21}
                  />

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Total Students
                  </p>

                  <p className="text-2xl font-bold text-gray-800">
                    {students.length}
                  </p>

                </div>

              </div>

            </div>


            <div className="bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-white">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">

                  <DoorOpen
                    className="text-indigo-600"
                    size={21}
                  />

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Total Rooms
                  </p>

                  <p className="text-2xl font-bold text-gray-800">
                    {rooms.length}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ================= FILTERS ================= */}

          <div className="mt-6 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-white">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Search */}

              <div className="relative">

                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search by name, email or phone..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>


              {/* Room Filter */}

              <select
                value={roomFilter}
                onChange={(e) =>
                  setRoomFilter(e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">
                  All Rooms
                </option>

                {rooms.map((room) => (
                  <option
                    key={room._id}
                    value={room._id}
                  >
                    Room {room.roomNumber}
                  </option>
                ))}

              </select>

            </div>

          </div>


          {/* ================= STUDENTS TABLE ================= */}

          <div className="mt-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-white overflow-hidden">

            <div className="p-6 border-b border-gray-100">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    Student List
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {filteredStudents.length}{" "}
                    {filteredStudents.length === 1
                      ? "student"
                      : "students"}{" "}
                    found
                  </p>

                </div>

              </div>

            </div>


            {filteredStudents.length === 0 ? (

              <div className="p-12 text-center">

                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center">

                  <Users
                    className="text-blue-600"
                    size={30}
                  />

                </div>

                <h3 className="text-lg font-bold text-gray-800 mt-5">
                  No students found
                </h3>

                <p className="text-gray-500 mt-2">
                  {students.length === 0
                    ? 'Click "New Student" to add your first student.'
                    : "Try changing your search or room filter."}
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead className="bg-gray-50/80">

                    <tr>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Student
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Phone
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Address
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Room
                      </th>

                      <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Actions
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-gray-100">

                    {filteredStudents.map((student) => (

                      <tr
                        key={student._id}
                        className="hover:bg-blue-50/40 transition"
                      >

                        {/* Student */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">

                              <Users
                                className="text-blue-600"
                                size={20}
                              />

                            </div>

                            <div className="min-w-0">

                              <p className="font-semibold text-gray-800">
                                {student.name}
                              </p>

                              <p className="text-sm text-gray-500 flex items-center gap-1 truncate">

                                <Mail size={13} />

                                {student.email}

                              </p>

                            </div>

                          </div>

                        </td>


                        {/* Phone */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2 text-gray-600">

                            <Phone
                              size={15}
                              className="text-gray-400"
                            />

                            {student.phone}

                          </div>

                        </td>


                        {/* Address */}

                        <td className="px-6 py-5 max-w-[240px]">

                          <div className="flex items-start gap-2 text-gray-600">

                            <MapPin
                              size={15}
                              className="text-gray-400 mt-0.5 shrink-0"
                            />

                            <span className="truncate">
                              {student.address}
                            </span>

                          </div>

                        </td>


                        {/* Room */}

                        <td className="px-6 py-5">

                          <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-semibold">

                            <DoorOpen size={15} />

                            Room{" "}
                            {student.room?.roomNumber ||
                              "Not assigned"}

                          </span>

                        </td>


                        {/* Actions */}

                        <td className="px-6 py-5">

                          <div className="flex justify-end items-center gap-2">

                            <button
                              onClick={() =>
                                openEditForm(student)
                              }
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-sm transition"
                            >

                              <Pencil size={15} />

                              Edit

                            </button>


                            <button
                              onClick={() =>
                                handleDelete(student._id)
                              }
                              disabled={
                                deletingId ===
                                student._id
                              }
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm transition disabled:opacity-50"
                            >

                              <Trash2 size={15} />

                              {deletingId ===
                              student._id
                                ? "Deleting..."
                                : "Delete"}

                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </main>


      {/* ================= ADD / EDIT MODAL ================= */}

      {isFormOpen && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}

            <div className="flex items-center justify-between p-6 border-b border-gray-100">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">

                  {editingStudent ? (

                    <Pencil
                      className="text-blue-600"
                      size={22}
                    />

                  ) : (

                    <UserPlus
                      className="text-blue-600"
                      size={22}
                    />

                  )}

                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    {editingStudent
                      ? "Edit Student"
                      : "Add New Student"}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {editingStudent
                      ? "Update student details and room."
                      : "Add a student and assign a room."}
                  </p>

                </div>

              </div>


              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={22} />
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6"
            >

              {/* Name */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Student Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Student name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>


              {/* Email */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="student@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>


              {/* Phone */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>


              {/* Room */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assign Room
                </label>

                <select
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    Select Room
                  </option>

                  {rooms.map((room) => (

                    <option
                      key={room._id}
                      value={room._id}
                    >
                      Room {room.roomNumber}{" "}
                      (Capacity: {room.capacity})
                    </option>

                  ))}

                </select>

              </div>


              {/* Address */}

              <div className="md:col-span-2">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>

                <textarea
                  name="address"
                  placeholder="Student address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>


              {/* Buttons */}

              <div className="md:col-span-2 flex gap-3">

                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
                >

                  {editingStudent ? (
                    <Pencil size={19} />
                  ) : (
                    <UserPlus size={19} />
                  )}

                  {submitting
                    ? editingStudent
                      ? "Updating..."
                      : "Adding..."
                    : editingStudent
                    ? "Update Student"
                    : "Add Student"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Students;