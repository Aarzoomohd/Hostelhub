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
  MapPin,
  Mail,
  Pencil,
  X,
  Save,
  Map,
} from "lucide-react";

import {
  getHostelDetails,
  updateHostel,
} from "../services/hostelService.js";

const emptyForm = {
  hostelName: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const HostelDetails = () => {
  const { logout, owner } = useAuth();
  const navigate = useNavigate();

  const [hostel, setHostel] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // FETCH HOSTEL DETAILS
  // =====================================================

  useEffect(() => {
    fetchHostelDetails();
  }, []);

  const fetchHostelDetails = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const data = await getHostelDetails(token);

      const hostelData = data.hostel || data;

      setHostel(hostelData);

      setFormData({
        hostelName: hostelData?.hostelName || "",
        address: hostelData?.address || "",
        city: hostelData?.city || "",
        state: hostelData?.state || "",
        pincode: hostelData?.pincode || "",
      });
    } catch (error) {
      console.error(
        "Error fetching hostel details:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch hostel details"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // START EDITING
  // =====================================================

  const handleEdit = () => {
    setFormData({
      hostelName: hostel?.hostelName || "",
      address: hostel?.address || "",
      city: hostel?.city || "",
      state: hostel?.state || "",
      pincode: hostel?.pincode || "",
    });

    setIsEditing(true);
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancel = () => {
    setFormData({
      hostelName: hostel?.hostelName || "",
      address: hostel?.address || "",
      city: hostel?.city || "",
      state: hostel?.state || "",
      pincode: hostel?.pincode || "",
    });

    setIsEditing(false);
  };

  // =====================================================
  // UPDATE HOSTEL
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!formData.hostelName.trim()) {
      toast.error("Please enter hostel name");
      return;
    }

    if (!formData.address.trim()) {
      toast.error("Please enter hostel address");
      return;
    }

    if (!formData.city.trim()) {
      toast.error("Please enter city");
      return;
    }

    if (!formData.state.trim()) {
      toast.error("Please enter state");
      return;
    }

    if (!formData.pincode.trim()) {
      toast.error("Please enter pincode");
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      toast.error("Pincode must be 6 digits");
      return;
    }

    setSaving(true);

    try {
      const data = await updateHostel(
        {
          hostelName: formData.hostelName.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
        token
      );

      const updatedHostel =
        data.hostel || data;

      setHostel(updatedHostel);

      setFormData({
        hostelName:
          updatedHostel.hostelName || "",
        address:
          updatedHostel.address || "",
        city:
          updatedHostel.city || "",
        state:
          updatedHostel.state || "",
        pincode:
          updatedHostel.pincode || "",
      });

      // Keep localStorage hostel data updated
      localStorage.setItem(
        "hostel",
        JSON.stringify(updatedHostel)
      );

      toast.success(
        data.message ||
          "Hostel details updated successfully"
      );

      setIsEditing(false);
    } catch (error) {
      console.error(
        "Hostel update error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update hostel details"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-8 text-center">

          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="text-gray-600 mt-4 font-medium">
            Loading hostel details...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

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


          {/* Hostel Details - ACTIVE */}

          <Link
            to="/api/hostel"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
          >

            <Building2 size={19} />

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
                  Hostel Details
                </h1>

                <p className="text-gray-500 mt-1">
                  View and manage your hostel information.
                </p>

              </div>


              {!isEditing && hostel && (

                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition"
                >

                  <Pencil size={18} />

                  Edit Details

                </button>

              )}

            </div>

          </div>


          {/* ================= HOSTEL CARD ================= */}

          {!hostel ? (

            <div className="mt-6 bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-sm p-12 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center">

                <Building2
                  className="text-blue-600"
                  size={30}
                />

              </div>

              <h2 className="text-xl font-bold text-gray-800 mt-5">
                Hostel details not found
              </h2>

              <p className="text-gray-500 mt-2">
                Please complete your hostel setup first.
              </p>

            </div>

          ) : (

            <form
              onSubmit={handleSubmit}
              className="mt-6 bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-sm overflow-hidden"
            >

              {/* Card Header */}

              <div className="p-6 border-b border-gray-100">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center">

                    <Building2
                      className="text-blue-600"
                      size={27}
                    />

                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-gray-800">
                      {hostel.hostelName}
                    </h2>

                    <p className="text-sm text-gray-500">
                      Hostel information
                    </p>

                  </div>

                </div>

              </div>


              {/* Details */}

              <div className="p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Hostel Name */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hostel Name
                    </label>

                    <div className="relative">

                      <Building2
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="hostelName"
                        value={formData.hostelName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition ${
                          isEditing
                            ? "border-gray-200 bg-white focus:ring-2 focus:ring-blue-500"
                            : "border-gray-100 bg-gray-50 text-gray-700 cursor-not-allowed"
                        }`}
                      />

                    </div>

                  </div>


                  {/* City */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>

                    <div className="relative">

                      <MapPin
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition ${
                          isEditing
                            ? "border-gray-200 bg-white focus:ring-2 focus:ring-blue-500"
                            : "border-gray-100 bg-gray-50 text-gray-700 cursor-not-allowed"
                        }`}
                      />

                    </div>

                  </div>


                  {/* State */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State
                    </label>

                    <div className="relative">

                      <Map
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition ${
                          isEditing
                            ? "border-gray-200 bg-white focus:ring-2 focus:ring-blue-500"
                            : "border-gray-100 bg-gray-50 text-gray-700 cursor-not-allowed"
                        }`}
                      />

                    </div>

                  </div>


                  {/* Pincode */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      maxLength={6}
                      inputMode="numeric"
                      className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                        isEditing
                          ? "border-gray-200 bg-white focus:ring-2 focus:ring-blue-500"
                          : "border-gray-100 bg-gray-50 text-gray-700 cursor-not-allowed"
                      }`}
                    />

                  </div>


                  {/* Address */}

                  <div className="md:col-span-2">

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>

                    <div className="relative">

                      <MapPin
                        size={18}
                        className="absolute left-4 top-4 text-gray-400"
                      />

                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows="4"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition resize-none ${
                          isEditing
                            ? "border-gray-200 bg-white focus:ring-2 focus:ring-blue-500"
                            : "border-gray-100 bg-gray-50 text-gray-700 cursor-not-allowed"
                        }`}
                      />

                    </div>

                  </div>

                </div>


                {/* ================= OWNER INFO ================= */}

                <div className="mt-8 pt-6 border-t border-gray-100">

                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Owner Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div className="bg-gray-50 rounded-xl p-4">

                      <p className="text-xs text-gray-500 mb-1">
                        Owner Name
                      </p>

                      <p className="font-semibold text-gray-800">
                        {owner?.name || "-"}
                      </p>

                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">

                      <div className="flex items-center gap-2">

                        <Mail
                          size={15}
                          className="text-gray-400"
                        />

                        <p className="text-xs text-gray-500">
                          Owner Email
                        </p>

                      </div>

                      <p className="font-semibold text-gray-800 mt-1">
                        {owner?.email || "-"}
                      </p>

                    </div>

                  </div>

                </div>


                {/* ================= ACTION BUTTONS ================= */}

                {isEditing && (

                  <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-100">

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                    >

                      <X size={18} />

                      Cancel

                    </button>


                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md transition disabled:opacity-60"
                    >

                      <Save size={18} />

                      {saving
                        ? "Saving..."
                        : "Save Changes"}

                    </button>

                  </div>

                )}

              </div>

            </form>

          )}

        </div>

      </main>

    </div>
  );
};

export default HostelDetails;