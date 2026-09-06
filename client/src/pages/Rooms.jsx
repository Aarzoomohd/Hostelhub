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
  Plus,
  Pencil,
  Trash2,
  X,
  BedDouble,
} from "lucide-react";

import {
  createRoom,
  getRooms,
  deleteRoom,
  updateRoom,
} from "../services/roomService.js";

const emptyForm = {
  roomNumber: "",
  capacity: "",
};

const Rooms = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ================= FETCH ROOMS =================

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const token = localStorage.getItem("token");

    try {
      const data = await getRooms(token);

      setRooms(data.rooms || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch rooms"
      );
    }
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= OPEN ADD =================

  const openAddForm = () => {
    setEditingRoom(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  // ================= OPEN EDIT =================

  const openEditForm = (room) => {
    setEditingRoom(room);

    setFormData({
      roomNumber: room.roomNumber || "",
      capacity: room.capacity || "",
    });

    setIsFormOpen(true);
  };

  // ================= CLOSE FORM =================

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingRoom(null);
    setFormData(emptyForm);
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!formData.roomNumber.trim()) {
      toast.error("Please enter room number");
      return;
    }

    if (!formData.capacity || Number(formData.capacity) < 1) {
      toast.error("Capacity must be at least 1");
      return;
    }

    setSubmitting(true);

    try {
      if (editingRoom) {
        const data = await updateRoom(
          editingRoom._id,
          {
            roomNumber: formData.roomNumber.trim(),
            capacity: Number(formData.capacity),
          },
          token
        );

        toast.success(
          data.message || "Room updated successfully"
        );

        await fetchRooms();
      } else {
        const data = await createRoom(
          {
            roomNumber: formData.roomNumber.trim(),
            capacity: Number(formData.capacity),
          },
          token
        );

        toast.success(
          data.message || "Room created successfully"
        );

        await fetchRooms();
      }

      closeForm();
    } catch (error) {
      console.error("Room save error:", error);

      toast.error(
        error.response?.data?.message ||
          (editingRoom
            ? "Failed to update room"
            : "Failed to create room")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE =================

  const handleDelete = async (roomId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    setDeletingId(roomId);

    try {
      const data = await deleteRoom(roomId, token);

      toast.success(
        data.message || "Room deleted successfully"
      );

      setRooms((prevRooms) =>
        prevRooms.filter((room) => room._id !== roomId)
      );
    } catch (error) {
      console.error("Room deletion error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete room"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ================= CALCULATIONS =================

  const totalRooms = rooms.length;

  const totalCapacity = rooms.reduce(
    (total, room) => total + Number(room.capacity || 0),
    0
  );

  return (
    <div className="h-screen overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 flex">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

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


          {/* Rooms - ACTIVE */}

          <Link
            to="/api/room"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
          >
            <DoorOpen size={19} />

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


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="flex-1 h-screen overflow-y-auto">

        <div className="p-4 md:p-8">

          {/* ================= HEADER ================= */}

          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-sm p-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>

                <p className="text-sm text-blue-600 font-semibold mb-1">
                  Hostel Management
                </p>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Rooms
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage your hostel rooms and their capacity.
                </p>

              </div>


              <button
                onClick={openAddForm}
                className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition"
              >
                <Plus size={19} />

                Add Room
              </button>

            </div>

          </div>


          {/* ================= SUMMARY ================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

            {/* Total Rooms */}

            <div className="bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-sm p-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                  <DoorOpen
                    className="text-blue-600"
                    size={21}
                  />
                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Total Rooms
                  </p>

                  <p className="text-2xl font-bold text-gray-800">
                    {totalRooms}
                  </p>

                </div>

              </div>

            </div>


            {/* Total Capacity */}

            <div className="bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-sm p-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <BedDouble
                    className="text-indigo-600"
                    size={21}
                  />
                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Total Bed Capacity
                  </p>

                  <p className="text-2xl font-bold text-gray-800">
                    {totalCapacity}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ================= ROOMS ================= */}

          <div className="mt-6">

            <div className="flex items-center justify-between mb-4">

              <div>

                <h2 className="text-xl font-bold text-gray-800">
                  Room List
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {rooms.length}{" "}
                  {rooms.length === 1
                    ? "room"
                    : "rooms"}{" "}
                  available
                </p>

              </div>

            </div>


            {rooms.length === 0 ? (

              /* Empty State */

              <div className="bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-sm p-12 text-center">

                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center">

                  <DoorOpen
                    className="text-blue-600"
                    size={30}
                  />

                </div>

                <h3 className="text-lg font-bold text-gray-800 mt-5">
                  No rooms found
                </h3>

                <p className="text-gray-500 mt-2">
                  Add your first room to start managing room assignments.
                </p>

                <button
                  onClick={openAddForm}
                  className="mt-5 inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold px-5 py-3 rounded-xl shadow-md"
                >
                  <Plus size={18} />

                  Add Room
                </button>

              </div>

            ) : (

              /* Room Cards */

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

                {rooms.map((room) => (

                  <div
                    key={room._id}
                    className="bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-5"
                  >

                    {/* Card Header */}

                    <div className="flex items-start justify-between gap-3">

                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center">

                        <DoorOpen
                          className="text-blue-600"
                          size={23}
                        />

                      </div>


                      <div className="flex gap-1">

                        <button
                          onClick={() =>
                            openEditForm(room)
                          }
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Edit room"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(room._id)
                          }
                          disabled={
                            deletingId === room._id
                          }
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                          title="Delete room"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </div>


                    {/* Room Number */}

                    <div className="mt-5">

                      <p className="text-sm text-gray-500">
                        Room Number
                      </p>

                      <h3 className="text-2xl font-bold text-gray-800 mt-1">
                        {room.roomNumber}
                      </h3>

                    </div>


                    {/* Capacity */}

                    <div className="mt-5 pt-4 border-t border-gray-100">

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2 text-gray-500">

                          <BedDouble size={17} />

                          <span className="text-sm">
                            Capacity
                          </span>

                        </div>

                        <span className="font-bold text-gray-800">
                          {room.capacity}
                        </span>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </main>


      {/* =====================================================
          ADD / EDIT ROOM MODAL
      ====================================================== */}

      {isFormOpen && (

        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

            {/* Modal Header */}

            <div className="flex items-center justify-between p-6 border-b border-gray-100">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">

                  {editingRoom ? (
                    <Pencil
                      className="text-blue-600"
                      size={21}
                    />
                  ) : (
                    <Plus
                      className="text-blue-600"
                      size={22}
                    />
                  )}

                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    {editingRoom
                      ? "Edit Room"
                      : "Add New Room"}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {editingRoom
                      ? "Update room information."
                      : "Enter room number and capacity."}
                  </p>

                </div>

              </div>


              <button
                onClick={closeForm}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* Room Number */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Room Number
                </label>

                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  placeholder="e.g. 101"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

              </div>


              {/* Capacity */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capacity
                </label>

                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  min="1"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

              </div>


              {/* Buttons */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md transition disabled:opacity-60"
                >
                  {submitting
                    ? editingRoom
                      ? "Updating..."
                      : "Adding..."
                    : editingRoom
                    ? "Update Room"
                    : "Add Room"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Rooms;