import { useState } from "react";
import {
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
} from "../../services/authService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Users,
  BedDouble,
  CreditCard,
  KeyRound,
  Sparkles,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState("email");
  const [isSendingForgotOtp, setIsSendingForgotOtp] = useState(false);
  const [isVerifyingForgotOtp, setIsVerifyingForgotOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendForgotOtp = async () => {
    if (!forgotEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setIsSendingForgotOtp(true);

      await sendForgotPasswordOtp(forgotEmail.trim());

      setForgotStep("otp");
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send password reset OTP"
      );
    } finally {
      setIsSendingForgotOtp(false);
    }
  };

  const handleVerifyForgotOtp = async () => {
    if (forgotOtp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    try {
      setIsVerifyingForgotOtp(true);

      await verifyForgotPasswordOtp(
        forgotEmail.trim(),
        forgotOtp
      );

      setForgotStep("password");
      toast.success("OTP verified successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Invalid OTP"
      );
    } finally {
      setIsVerifyingForgotOtp(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      toast.error("Please fill both password fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setIsResettingPassword(true);

      await resetPassword({
        email: forgotEmail.trim(),
        newPassword,
        confirmPassword: confirmNewPassword,
      });

      toast.success("Password reset successfully. Please login.");

      setShowForgotPassword(false);
      setForgotStep("email");
      setForgotEmail("");
      setForgotOtp("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password"
      );
    } finally {
      setIsResettingPassword(false);
    }
  };

  const openForgotPassword = () => {
    setForgotEmail(formData.email);
    setForgotOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    setForgotStep("email");
    setShowForgotPassword(true);
  };

  const closeForgotPassword = () => {
    if (
      isSendingForgotOtp ||
      isVerifyingForgotOtp ||
      isResettingPassword
    ) {
      return;
    }

    setShowForgotPassword(false);
    setForgotStep("email");
    setForgotOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const data = await login(formData);

      toast.success(data.message || "Login successful");

      if (data.hostel) {
        navigate("/dashboard");
      } else {
        navigate("/hostel-setup");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-dvh w-full overflow-hidden bg-[#aebff5] px-0 py-0 font-sans sm:px-3 sm:py-3 md:px-5 md:py-5 lg:flex lg:items-center lg:justify-center">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
      </div>

      {/* Main responsive card */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-295 overflow-hidden rounded-none bg-white shadow-none sm:h-[calc(100dvh-1.5rem)] sm:rounded-[24px] sm:shadow-[0_25px_70px_rgba(37,45,100,0.18)] md:h-[calc(100dvh-2.5rem)] md:rounded-[26px] lg:h-auto lg:min-h-0 lg:max-h-[calc(100dvh-2.5rem)] lg:rounded-[30px] lg:shadow-[0_25px_70px_rgba(37,45,100,0.18)]">

        {/* ================= LEFT / FORM ================= */}
        <section className="flex w-full min-w-0 flex-col bg-white px-4 py-3 sm:px-7 sm:py-6 md:px-10 md:py-7 lg:w-[52%] lg:px-12 lg:py-8 xl:px-16 xl:py-10">

          {/* Top */}
          <div className="flex items-center justify-between">
            <Link
              to="/"
              aria-label="Go back"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50 sm:h-9 sm:w-9"
            >
              <ArrowRight size={15} className="rotate-180" />
            </Link>
          </div>

          {/* Form content */}
          <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-2 sm:py-4 md:py-5 lg:py-3 xl:max-w-[460px]">

            {/* Brand */}
            <div className="mb-4 sm:mb-5 md:mb-6">
              <div className="mb-2.5 flex items-center gap-2.5 sm:mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-md sm:h-11 sm:w-11">
                  <Building2 size={20} />
                </div>

                <div>
                  <p className="text-[17px] font-extrabold tracking-tight text-slate-950 sm:text-[18px]">
                    HostelHub
                  </p>
                  <p className="text-[7px] font-bold tracking-[0.16em] text-slate-400 sm:text-[8px]">
                    RUN A BETTER RESIDENCE
                  </p>
                </div>
              </div>

              <h1 className="text-[25px] font-extrabold tracking-[-0.05em] text-slate-950 sm:text-[30px] md:text-[34px] lg:text-[38px]">
                Welcome back
              </h1>

              <p className="mt-1 max-w-[390px] text-[10px] leading-4 text-slate-500 sm:text-[12px] sm:leading-5 md:text-[13px]">
                Login to manage your hostel, residents and rooms.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 md:space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[11px] font-bold text-slate-700 sm:text-xs"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-[12px] text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:py-3.5 md:py-4 sm:text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[11px] font-bold text-slate-700 sm:text-xs"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={openForgotPassword}
                    className="min-h-8 px-1 text-[10px] font-semibold text-indigo-600 transition hover:text-indigo-800 sm:text-[11px]"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-11 text-[12px] text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:py-3.5 md:py-4 sm:text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <label className="flex cursor-pointer items-center gap-2 text-[10px] text-slate-500">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-slate-300 accent-indigo-600"
                />
                Remember me
              </label>

              {/* Login */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-[48px] sm:py-3.5 sm:text-sm"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-3 flex items-center gap-3 sm:my-4">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[9px] text-slate-300">OR</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="flex items-center justify-center gap-2 text-[9px] text-slate-400 sm:text-[10px]">
              <ShieldCheck size={13} className="text-emerald-500" />
              Secure & protected access
            </div>

            <p className="mt-2 text-center text-[9px] text-slate-500 sm:mt-3 sm:text-[11px]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-indigo-600 hover:text-indigo-800"
              >
                Create your account
              </Link>
            </p>
          </div>

          <p className="pt-1 text-center text-[7px] text-slate-300 sm:pt-2 sm:text-[9px]">
            © {new Date().getFullYear()} HostelHub. All rights reserved.
          </p>
        </section>

        {/* ================= RIGHT / VISUAL ================= */}
        <section className="relative hidden w-[48%] overflow-hidden bg-gradient-to-br from-[#4f46e5] via-[#5b5ff3] to-[#4b91ed] lg:block">

          {/* Decorative shapes */}
          <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-white/10 xl:h-80 xl:w-80" />
          <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-blue-300/20 xl:h-80 xl:w-80" />
          <div className="absolute right-[-100px] top-[18%] h-36 w-[420px] rotate-[-12deg] rounded-[35px] bg-[#373cae]/55 xl:h-44 xl:w-[470px]" />
          <div className="absolute -bottom-20 -right-20 h-56 w-56 rotate-45 rounded-[40px] bg-[#4b9af2]/70 xl:h-64 xl:w-64" />

          <div className="relative flex h-full min-h-[700px] flex-col justify-between p-8 lg:p-9 xl:p-11">

            {/* Brand */}
            <div className="flex items-center gap-2.5 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 md:h-10 md:w-10 xl:h-11 xl:w-11">
                <Building2 size={18} />
              </div>

              <div>
                <p className="text-base font-extrabold tracking-tight md:text-lg xl:text-xl">
                  HostelHub
                </p>

                <p className="text-[7px] font-bold tracking-[0.16em] text-white/50">
                  RUN A BETTER RESIDENCE
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="relative z-10 my-6">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-white/80 md:text-[8px]">
                <Sparkles size={10} />
                Calm operations
              </div>

              <h2 className="max-w-[390px] text-[29px] font-extrabold leading-[1.05] tracking-[-0.055em] text-white md:text-[32px] lg:text-[36px] xl:text-[42px]">
                Your hostel,
                <br />
                <span className="text-indigo-100">
                  beautifully in control.
                </span>
              </h2>

              <p className="mt-3 max-w-[350px] text-[10px] leading-5 text-white/60 md:text-[11px] xl:text-[12px]">
                Manage residents, rooms, payments and occupancy from one
                simple workspace.
              </p>
            </div>

            {/* Dashboard illustration */}
            <div className="relative mx-auto w-full max-w-[430px]">

              {/* Small top card */}
              <div className="absolute -left-2 -top-4 z-20 rounded-xl border border-white/70 bg-white px-2.5 py-2 shadow-xl md:-left-3 md:px-3 md:py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <CheckCircle2 size={13} />
                  </div>

                  <div>
                    <p className="text-[8px] font-bold text-slate-800 md:text-[9px]">
                      All organized
                    </p>
                    <p className="text-[6px] text-slate-400 md:text-[7px]">
                      Everything in one place
                    </p>
                  </div>
                </div>
              </div>

              {/* Dashboard */}
              <div className="rounded-[18px] border border-white/20 bg-[#191a2a]/95 p-1.5 shadow-2xl md:rounded-[20px] md:p-2">
                <div className="rounded-[14px] bg-[#222334] p-3 md:rounded-[16px] md:p-3.5 xl:p-4">

                  <div className="mb-3 flex items-center justify-between md:mb-4">
                    <div>
                      <p className="text-[6px] tracking-[0.15em] text-white/30 md:text-[7px]">
                        HOSTEL OVERVIEW
                      </p>

                      <p className="mt-1 text-[11px] font-bold text-white md:text-[13px] xl:text-[15px]">
                        Good morning, Aisha
                      </p>
                    </div>

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 md:h-8 md:w-8">
                      <Building2 size={12} className="text-white/50" />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                    <div className="rounded-lg bg-[#2a2b3d] p-2 md:rounded-xl md:p-2.5 xl:p-3">
                      <Users size={11} className="text-indigo-300 md:size-[13px]" />
                      <p className="mt-1.5 text-sm font-extrabold text-white md:text-base xl:text-lg">
                        128
                      </p>
                      <p className="text-[6px] text-white/35 md:text-[7px]">
                        Residents
                      </p>
                    </div>

                    <div className="rounded-lg bg-[#2a2b3d] p-2 md:rounded-xl md:p-2.5 xl:p-3">
                      <BedDouble size={11} className="text-blue-300 md:size-[13px]" />
                      <p className="mt-1.5 text-sm font-extrabold text-white md:text-base xl:text-lg">
                        82%
                      </p>
                      <p className="text-[6px] text-white/35 md:text-[7px]">
                        Occupancy
                      </p>
                    </div>

                    <div className="rounded-lg bg-[#2a2b3d] p-2 md:rounded-xl md:p-2.5 xl:p-3">
                      <CreditCard size={11} className="text-emerald-300 md:size-[13px]" />
                      <p className="mt-1.5 text-sm font-extrabold text-white md:text-base xl:text-lg">
                        ₹48.2k
                      </p>
                      <p className="text-[6px] text-white/35 md:text-[7px]">
                        Collected
                      </p>
                    </div>

                    <div className="rounded-lg bg-[#2a2b3d] p-2 md:rounded-xl md:p-2.5 xl:p-3">
                      <KeyRound size={11} className="text-violet-300 md:size-[13px]" />
                      <p className="mt-1.5 text-sm font-extrabold text-white md:text-base xl:text-lg">
                        7
                      </p>
                      <p className="text-[6px] text-white/35 md:text-[7px]">
                        Beds available
                      </p>
                    </div>
                  </div>

                  {/* Collection */}
                  <div className="mt-1.5 rounded-lg bg-[#2a2b3d] p-2 md:rounded-xl md:p-2.5 xl:p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[6px] text-white/35 md:text-[7px]">
                          Monthly collections
                        </p>
                        <p className="mt-0.5 text-[7px] font-bold text-emerald-400 md:text-[8px]">
                          +18.4%
                        </p>
                      </div>

                      <div className="flex items-end gap-0.5 md:gap-1">
                        {[16, 21, 19, 25, 22, 31, 27, 37].map(
                          (height, index) => (
                            <div
                              key={index}
                              className={`w-1 rounded-t-full md:w-1.5 ${
                                index === 7
                                  ? "bg-violet-400"
                                  : "bg-white/10"
                              }`}
                              style={{ height: `${height}px` }}
                            />
                          )
                        )}
                      </div>
                    </div>

                    <div className="mt-2 h-0.5 rounded-full bg-white/5 md:mt-2.5 md:h-1">
                      <div className="h-full w-[72%] rounded-full bg-violet-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue card */}
              <div className="absolute -bottom-3 -right-1 rounded-xl border border-white/70 bg-white px-2.5 py-2 shadow-xl md:px-3 md:py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <CreditCard size={13} />
                  </div>

                  <div>
                    <p className="text-[8px] font-bold text-slate-800 md:text-[9px]">
                      ₹48.2k
                    </p>
                    <p className="text-[6px] text-slate-400 md:text-[7px]">
                      Collected this month
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature row */}
            <div className="mt-5 grid grid-cols-3 gap-1.5 md:gap-2">
              <div className="rounded-lg border border-white/10 bg-white/10 p-2 md:rounded-xl md:p-2.5">
                <ShieldCheck size={12} className="text-white/80 md:size-[14px]" />
                <p className="mt-1 text-[6px] font-semibold text-white/60 md:text-[7px]">
                  Secure
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/10 p-2 md:rounded-xl md:p-2.5">
                <Users size={12} className="text-white/80 md:size-[14px]" />
                <p className="mt-1 text-[6px] font-semibold text-white/60 md:text-[7px]">
                  Residents
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/10 p-2 md:rounded-xl md:p-2.5">
                <CheckCircle2 size={12} className="text-white/80 md:size-[14px]" />
                <p className="mt-1 text-[6px] font-semibold text-white/60 md:text-[7px]">
                  Organized
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile-only bottom brand strip */}
        <div className="hidden">
          <span className="font-semibold text-slate-500">HostelHub</span>
          {" · "}
          Secure hostel management
        </div>
      </div>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 px-3 py-4 backdrop-blur-sm sm:px-5 sm:py-6">
          <div className="relative my-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            <button
              type="button"
              onClick={closeForgotPassword}
              disabled={
                isSendingForgotOtp ||
                isVerifyingForgotOtp ||
                isResettingPassword
              }
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close forgot password"
            >
              ×
            </button>

            <div className="pr-8">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Lock size={20} />
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-slate-950">
                Reset your password
              </h2>

              <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                {forgotStep === "email" &&
                  "Enter your registered email and we'll send you a verification OTP."}
                {forgotStep === "otp" &&
                  "Enter the 6-digit OTP sent to your email."}
                {forgotStep === "password" &&
                  "Create a new password for your HostelHub account."}
              </p>
            </div>

            {/* Step 1: Email */}
            {forgotStep === "email" && (
              <div className="mt-6">
                <label
                  htmlFor="forgotEmail"
                  className="mb-2 block text-[11px] font-bold text-slate-700 sm:text-xs"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="forgotEmail"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-[12px] text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:py-3.5 md:py-4 sm:text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendForgotOtp}
                  disabled={isSendingForgotOtp}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSendingForgotOtp ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            )}

            {/* Step 2: OTP */}
            {forgotStep === "otp" && (
              <div className="mt-6">
                <label
                  htmlFor="forgotOtp"
                  className="mb-2 block text-[11px] font-bold text-slate-700 sm:text-xs"
                >
                  Verification OTP
                </label>

                <input
                  id="forgotOtp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={forgotOtp}
                  onChange={(e) =>
                    setForgotOtp(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  placeholder="Enter 6-digit OTP"
                  autoComplete="one-time-code"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-sm font-bold tracking-[0.35em] text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:py-3.5"
                />

                <button
                  type="button"
                  onClick={handleVerifyForgotOtp}
                  disabled={
                    isVerifyingForgotOtp ||
                    forgotOtp.length !== 6
                  }
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isVerifyingForgotOtp ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendForgotOtp}
                  disabled={isSendingForgotOtp}
                  className="mt-3 w-full text-center text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                >
                  {isSendingForgotOtp
                    ? "Sending..."
                    : "Didn't receive OTP? Resend"}
                </button>
              </div>
            )}

            {/* Step 3: New password */}
            {forgotStep === "password" && (
              <div className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-2 block text-[11px] font-bold text-slate-700 sm:text-xs"
                  >
                    New password
                  </label>

                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      placeholder="Create a new password"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-11 text-[12px] text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:py-3.5 md:py-4 sm:text-sm"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword((prev) => !prev)
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showNewPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmNewPassword"
                    className="mb-2 block text-[11px] font-bold text-slate-700 sm:text-xs"
                  >
                    Confirm new password
                  </label>

                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="confirmNewPassword"
                      type={
                        showConfirmNewPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmNewPassword}
                      onChange={(e) =>
                        setConfirmNewPassword(e.target.value)
                      }
                      placeholder="Re-enter your new password"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-11 text-[12px] text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:py-3.5 md:py-4 sm:text-sm"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmNewPassword((prev) => !prev)
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showConfirmNewPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={isResettingPassword}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:py-3.5"
                >
                  {isResettingPassword ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Resetting password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            )}

            <div className="mt-5 flex items-center justify-center gap-2 text-[9px] text-slate-400">
              <ShieldCheck size={13} className="text-emerald-500" />
              Your password reset is securely verified
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
