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
  Search,
  CalendarDays,
  IndianRupee,
  FileText,
} from "lucide-react";

import {
  createPayment,
  getPayments,
  updatePayment,
  deletePayment,
} from "../services/paymentService.js";

import { getStudents } from "../services/studentService.js";

const emptyForm = {
  student: "",
  amount: "",
  paymentDate: "",
  month: "",
  year: "",
  status: "Paid",
  description: "",
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Payments = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState(emptyForm);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // =====================================================
  // FETCH PAYMENTS
  // =====================================================

  useEffect(() => {
    fetchPayments();
    fetchStudents();
  }, []);

  const fetchPayments = async () => {
    const token = localStorage.getItem("token");

    try {
      const data = await getPayments(token);

      setPayments(data.payments || []);
    } catch (error) {
      console.error("Error fetching payments:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch payments"
      );
    }
  };

  // =====================================================
  // FETCH STUDENTS
  // =====================================================

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

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const openAddForm = () => {
    const today = new Date().toISOString().split("T")[0];

    setEditingPayment(null);

    setFormData({
      ...emptyForm,
      paymentDate: today,
      year: new Date().getFullYear(),
    });

    setIsFormOpen(true);
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const openEditForm = (payment) => {
    setEditingPayment(payment);

    const paymentDate = payment.paymentDate
      ? new Date(payment.paymentDate)
          .toISOString()
          .split("T")[0]
      : "";

    setFormData({
      student: payment.student?._id || "",
      amount: payment.amount || "",
      paymentDate,
      month: payment.month || "",
      year: payment.year || "",
      status: payment.status || "Paid",
      description: payment.description || "",
    });

    setIsFormOpen(true);
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPayment(null);
    setFormData(emptyForm);
  };

  // =====================================================
  // SUBMIT PAYMENT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!formData.student) {
      toast.error("Please select a student");
      return;
    }

    if (!formData.amount || Number(formData.amount) < 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!formData.paymentDate) {
      toast.error("Please select payment date");
      return;
    }

    if (!formData.month) {
      toast.error("Please select payment month");
      return;
    }

    if (!formData.year) {
      toast.error("Please enter payment year");
      return;
    }

    setSubmitting(true);

    const paymentData = {
      student: formData.student,
      amount: Number(formData.amount),
      paymentDate: formData.paymentDate,
      month: formData.month,
      year: Number(formData.year),
      status: formData.status,
      description: formData.description.trim(),
    };

    try {
      if (editingPayment) {
        const data = await updatePayment(
          editingPayment._id,
          paymentData,
          token
        );

        toast.success(
          data.message ||
            "Payment updated successfully"
        );

        await fetchPayments();
      } else {
        const data = await createPayment(
          paymentData,
          token
        );

        toast.success(
          data.message ||
            "Payment created successfully"
        );

        await fetchPayments();
      }

      closeForm();
    } catch (error) {
      console.error("Payment save error:", error);

      toast.error(
        error.response?.data?.message ||
          (editingPayment
            ? "Failed to update payment"
            : "Failed to create payment")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // DELETE PAYMENT
  // =====================================================

  const handleDelete = async (paymentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    setDeletingId(paymentId);

    try {
      const data = await deletePayment(
        paymentId,
        token
      );

      toast.success(
        data.message ||
          "Payment deleted successfully"
      );

      setPayments((prevPayments) =>
        prevPayments.filter(
          (payment) => payment._id !== paymentId
        )
      );
    } catch (error) {
      console.error(
        "Payment deletion error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete payment"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // FILTER PAYMENTS
  // =====================================================

  const filteredPayments = payments.filter(
    (payment) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const studentName =
        payment.student?.name?.toLowerCase() || "";

      const studentEmail =
        payment.student?.email?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        studentName.includes(searchText) ||
        studentEmail.includes(searchText);

      const matchesMonth =
        !monthFilter ||
        payment.month === monthFilter;

      const matchesYear =
        !yearFilter ||
        String(payment.year) === String(yearFilter);

      const matchesStatus =
        !statusFilter ||
        payment.status === statusFilter;

      return (
        matchesSearch &&
        matchesMonth &&
        matchesYear &&
        matchesStatus
      );
    }
  );

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalPayments = payments.length;

  const paidPayments = payments.filter(
    (payment) => payment.status === "Paid"
  );

  const pendingPayments = payments.filter(
    (payment) => payment.status === "Pending"
  );

  const totalPaidAmount = paidPayments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
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

          {/* Payments ACTIVE */}

          <Link
            to="/api/payment"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
          >
            <CreditCard size={19} />

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
                  Payments
                </h1>

                <p className="text-gray-500 mt-1">
                  Track and manage student payments.
                </p>

              </div>

              <button
                onClick={openAddForm}
                className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition"
              >
                <Plus size={19} />

                Add Payment
              </button>

            </div>

          </div>

          {/* ================= SUMMARY ================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">

            {/* Total */}

            <div className="bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-sm p-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                  <CreditCard
                    className="text-blue-600"
                    size={21}
                  />
                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Total Payments
                  </p>

                  <p className="text-2xl font-bold text-gray-800">
                    {totalPayments}
                  </p>

                </div>

              </div>

            </div>

            {/* Paid */}

            <div className="bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-sm p-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                  <IndianRupee
                    className="text-green-600"
                    size={21}
                  />
                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Paid Amount
                  </p>

                  <p className="text-2xl font-bold text-gray-800">
                    ₹{totalPaidAmount.toLocaleString("en-IN")}
                  </p>

                </div>

              </div>

            </div>

            {/* Paid Records */}

            <div className="bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-sm p-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <CalendarDays
                    className="text-indigo-600"
                    size={21}
                  />
                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Paid Records
                  </p>

                  <p className="text-2xl font-bold text-gray-800">
                    {paidPayments.length}
                  </p>

                </div>

              </div>

            </div>

            {/* Pending */}

            <div className="bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-sm p-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <CreditCard
                    className="text-yellow-600"
                    size={21}
                  />
                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Pending Records
                  </p>

                  <p className="text-2xl font-bold text-gray-800">
                    {pendingPayments.length}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ================= FILTERS ================= */}

          <div className="mt-6 bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-sm p-5">

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

              {/* Search */}

              <div className="relative">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search student..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Month */}

              <select
                value={monthFilter}
                onChange={(e) =>
                  setMonthFilter(e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">
                  All Months
                </option>

                {months.map((month) => (
                  <option
                    key={month}
                    value={month}
                  >
                    {month}
                  </option>
                ))}

              </select>

              {/* Year */}

              <input
                type="number"
                value={yearFilter}
                onChange={(e) =>
                  setYearFilter(e.target.value)
                }
                placeholder="Filter by year"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Status */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">
                  All Status
                </option>

                <option value="Paid">
                  Paid
                </option>

                <option value="Pending">
                  Pending
                </option>

              </select>

            </div>

          </div>

          {/* ================= PAYMENT LIST ================= */}

          <div className="mt-6 bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-sm overflow-hidden">

            <div className="p-6 border-b border-gray-100">

              <h2 className="text-xl font-bold text-gray-800">
                Payment List
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {filteredPayments.length}{" "}
                {filteredPayments.length === 1
                  ? "payment"
                  : "payments"}{" "}
                found
              </p>

            </div>

            {filteredPayments.length === 0 ? (

              <div className="p-12 text-center">

                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center">

                  <CreditCard
                    className="text-blue-600"
                    size={30}
                  />

                </div>

                <h3 className="text-lg font-bold text-gray-800 mt-5">
                  No payments found
                </h3>

                <p className="text-gray-500 mt-2">
                  {payments.length === 0
                    ? 'Click "Add Payment" to create a payment record.'
                    : "Try changing your filters."}
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1100px]">

                  <thead className="bg-gray-50/80">

                    <tr>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Student
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Amount
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Payment Date
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Month / Year
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Status
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Description
                      </th>

                      <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {filteredPayments.map(
                      (payment) => (

                        <tr
                          key={payment._id}
                          className="hover:bg-blue-50/40 transition"
                        >

                          {/* Student */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">

                                <Users
                                  className="text-blue-600"
                                  size={18}
                                />

                              </div>

                              <div>

                                <p className="font-semibold text-gray-800">
                                  {payment.student?.name ||
                                    "Unknown Student"}
                                </p>

                                <p className="text-sm text-gray-500">
                                  {payment.student?.email ||
                                    "-"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Amount */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-1 font-bold text-gray-800">

                              <IndianRupee size={15} />

                              {Number(
                                payment.amount || 0
                              ).toLocaleString("en-IN")}

                            </div>

                          </td>

                          {/* Payment Date */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-2 text-gray-600">

                              <CalendarDays
                                size={15}
                                className="text-gray-400"
                              />

                              {payment.paymentDate
                                ? new Date(
                                    payment.paymentDate
                                  ).toLocaleDateString(
                                    "en-IN"
                                  )
                                : "-"}

                            </div>

                          </td>

                          {/* Month / Year */}

                          <td className="px-6 py-5">

                            <div>

                              <p className="font-semibold text-gray-800">
                                {payment.month}
                              </p>

                              <p className="text-sm text-gray-500">
                                {payment.year}
                              </p>

                            </div>

                          </td>

                          {/* Status */}

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-semibold ${
                                payment.status ===
                                "Paid"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-yellow-50 text-yellow-600"
                              }`}
                            >
                              {payment.status}
                            </span>

                          </td>

                          {/* Description */}

                          <td className="px-6 py-5 max-w-[220px]">

                            <div className="flex items-start gap-2 text-gray-600">

                              <FileText
                                size={15}
                                className="text-gray-400 mt-0.5 shrink-0"
                              />

                              <span className="truncate">
                                {payment.description ||
                                  "No description"}
                              </span>

                            </div>

                          </td>

                          {/* Actions */}

                          <td className="px-6 py-5">

                            <div className="flex justify-end gap-2">

                              <button
                                onClick={() =>
                                  openEditForm(
                                    payment
                                  )
                                }
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-sm transition"
                              >
                                <Pencil size={15} />
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    payment._id
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  payment._id
                                }
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm transition disabled:opacity-50"
                              >
                                <Trash2 size={15} />

                                {deletingId ===
                                payment._id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </main>

      {/* =====================================================
          ADD / EDIT PAYMENT MODAL
      ====================================================== */}

      {isFormOpen && (

        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}

            <div className="flex items-center justify-between p-6 border-b border-gray-100">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">

                  {editingPayment ? (
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
                    {editingPayment
                      ? "Edit Payment"
                      : "Add Payment"}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Enter payment details.
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
              className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6"
            >

              {/* Student */}

              <div className="md:col-span-2">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Student
                </label>

                <select
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    Select Student
                  </option>

                  {students.map((student) => (

                    <option
                      key={student._id}
                      value={student._id}
                    >
                      {student.name} -{" "}
                      {student.email}
                    </option>

                  ))}

                </select>

              </div>

              {/* Amount */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount
                </label>

                <div className="relative">

                  <IndianRupee
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    min="0"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>

              {/* Payment Date */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Date
                </label>

                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Month */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Month
                </label>

                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    Select Month
                  </option>

                  {months.map((month) => (

                    <option
                      key={month}
                      value={month}
                    >
                      {month}
                    </option>

                  ))}

                </select>

              </div>

              {/* Year */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Year
                </label>

                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g. 2026"
                  min="2000"
                  max="2100"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Status */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="Paid">
                    Paid
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                </select>

              </div>

              {/* Description */}

              <div className="md:col-span-2">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Optional payment description"
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />

              </div>

              {/* Buttons */}

              <div className="md:col-span-2 flex gap-3 pt-2">

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
                    ? editingPayment
                      ? "Updating..."
                      : "Adding..."
                    : editingPayment
                    ? "Update Payment"
                    : "Add Payment"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Payments;