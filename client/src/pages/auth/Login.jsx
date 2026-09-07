import { useState } from "react";
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

import { loginUser } from "../../services/authService.js";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ================= VALIDATION =================

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) {
          return "Email is required";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return "Please enter a valid email address";
        }

        return "";

      case "password":
        if (!value) {
          return "Password is required";
        }

        if (value.length < 6) {
          return "Password must be at least 6 characters";
        }

        return "";

      default:
        return "";
    }
  };

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  // ================= HANDLE BLUR =================

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  // ================= FORM VALIDATION =================

  const validateForm = () => {
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);

    return Object.values(newErrors).every(
      (error) => error === ""
    );
  };

  // ================= LOGIN =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Save token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Save owner data
      if (data.owner) {
        localStorage.setItem(
          "owner",
          JSON.stringify(data.owner)
        );
      }

      toast.success(
        data.message || "Login successful"
      );

      // Existing hostel → dashboard
      // No hostel → hostel setup
      if (data.hostel) {
        navigate("/dashboard");
      } else {
        navigate("/hostel-setup");
      }
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        error.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh w-full overflow-x-hidden bg-[#aebff5] px-0 py-0 font-sans sm:px-3 sm:py-3 md:px-5 md:py-5 lg:flex lg:min-h-dvh lg:items-center lg:justify-center">

      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-white/20 blur-3xl" />

        <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
      </div>

      {/* ================= MAIN CONTAINER ================= */}

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1120px] overflow-hidden bg-white shadow-none sm:min-h-0 sm:rounded-[22px] sm:shadow-[0_25px_70px_rgba(37,45,100,0.18)] md:rounded-[26px] lg:max-h-[calc(100dvh-40px)] lg:min-h-[650px] lg:rounded-[28px]">

        {/* ================= LEFT / LOGIN ================= */}

        <section className="flex min-h-dvh w-full flex-col bg-white px-4 py-3 sm:min-h-0 sm:px-7 sm:py-6 md:px-9 md:py-7 lg:min-h-0 lg:w-[53%] lg:px-12 lg:py-8 xl:px-16">

          {/* Back Button */}

          <div className="flex min-h-8 items-center justify-between sm:min-h-9">
            <Link
              to="/"
              aria-label="Go back"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50 sm:h-9 sm:w-9"
            >
              <ArrowRight
                size={15}
                className="rotate-180"
              />
            </Link>
          </div>

          {/* ================= FORM AREA ================= */}

          <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col justify-start py-3 sm:justify-center sm:py-5 md:py-6 lg:max-h-[600px] lg:py-3">

            {/* Heading */}

            <div className="mb-5 sm:mb-7">
              <h1 className="text-[22px] font-extrabold leading-tight tracking-[-0.05em] text-slate-950 sm:text-[31px] lg:text-[33px]">
                Welcome back
              </h1>

              <p className="mt-1 max-w-[340px] text-[10px] leading-4 text-slate-500 sm:mt-1.5 sm:text-[12px] sm:leading-5">
                Login to your HostelHub account and manage your hostel with ease.
              </p>
            </div>

            {/* ================= FORM ================= */}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-4 sm:space-y-5"
            >

              {/* ================= EMAIL ================= */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-[10px] font-bold text-slate-700 sm:text-[11px]"
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
                    onBlur={handleBlur}
                    required
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email
                        ? "email-error"
                        : undefined
                    }
                    className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-3 text-[11px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 sm:py-3.5 ${
                      errors.email
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }`}
                  />

                </div>

                <p
                  id="email-error"
                  className={`mt-1 min-h-[11px] text-[9px] font-semibold leading-[11px] text-red-500 ${
                    errors.email
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  {errors.email || "\u00A0"}
                </p>
              </div>

              {/* ================= PASSWORD ================= */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-[10px] font-bold text-slate-700 sm:text-[11px]"
                >
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    autoComplete="current-password"
                    aria-invalid={Boolean(
                      errors.password
                    )}
                    aria-describedby={
                      errors.password
                        ? "password-error"
                        : undefined
                    }
                    className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-10 text-[11px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 sm:py-3.5 ${
                      errors.password
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }`}
                  />

                  {/* Show / Hide Password */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

                <p
                  id="password-error"
                  className={`mt-1 min-h-[11px] text-[9px] font-semibold leading-[11px] text-red-500 ${
                    errors.password
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  {errors.password || "\u00A0"}
                </p>
              </div>

              {/* ================= LOGIN BUTTON ================= */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-[12px] font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:py-3.5"
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

            {/* ================= REGISTER LINK ================= */}

            <p className="mt-5 text-center text-[9px] text-slate-500 sm:mt-6 sm:text-[11px]">
              Don't have an account?{" "}

              <Link
                to="/register"
                className="relative z-10 cursor-pointer text-sm font-bold text-indigo-600 hover:text-indigo-800"
              >
                Create account
              </Link>
            </p>

          </div>

          {/* ================= FOOTER ================= */}

          <p className="pt-1 text-center text-[7px] text-slate-300 sm:pt-2 sm:text-[9px]">
            © {new Date().getFullYear()} HostelHub. All rights reserved.
          </p>

        </section>

        {/* ================= RIGHT / VISUAL ================= */}

        <section className="relative hidden w-[47%] overflow-hidden bg-linear-to-br from-[#4f46e5] via-[#5b5ff3] to-[#4b91ed] lg:block">

          {/* Background Shapes */}

          <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-white/10 xl:h-80 xl:w-80" />

          <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-blue-300/20 xl:h-80 xl:w-80" />

          <div className="absolute -right-25 top-[18%] h-36 w-105 -rotate-12 rounded-[35px] bg-[#373cae]/55 xl:h-44 xl:w-[470px]" />

          <div className="absolute -bottom-20 -right-20 h-56 w-56 rotate-45 rounded-[40px] bg-[#4b9af2]/70 xl:h-64 xl:w-64" />

          {/* Content */}

          <div className="relative flex h-full min-h-125 flex-col justify-between p-6 md:p-7 lg:p-8 xl:p-10">

            {/* Logo */}

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

            {/* Main Text */}

            <div className="relative z-10 my-5">

              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-white/80 md:text-[8px]">
                <Sparkles size={10} />
                Built for hostel owners
              </div>

              <h2 className="max-w-[390px] text-[29px] font-extrabold leading-[1.05] tracking-[-0.055em] text-white md:text-[32px] lg:text-[36px] xl:text-[42px]">
                Everything your
                <br />

                <span className="text-indigo-100">
                  hostel needs.
                </span>
              </h2>

              <p className="mt-3 max-w-[350px] text-[10px] leading-5 text-white/60 md:text-[11px] xl:text-[12px]">
                Bring residents, rooms, payments and daily operations
                together in one beautiful workspace.
              </p>

            </div>

            {/* Dashboard Preview */}

            <div className="relative mx-auto w-full max-w-[430px]">

              {/* Easy Setup Card */}

              <div className="absolute -left-2 -top-4 z-20 rounded-xl border border-white/70 bg-white px-2.5 py-2 shadow-xl md:-left-3 md:px-3 md:py-2.5">

                <div className="flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <CheckCircle2 size={13} />
                  </div>

                  <div>

                    <p className="text-[8px] font-bold text-slate-800 md:text-[9px]">
                      Easy setup
                    </p>

                    <p className="text-[6px] text-slate-400 md:text-[7px]">
                      Get started in minutes
                    </p>

                  </div>

                </div>

              </div>

              {/* Dashboard */}

              <div className="rounded-[18px] border border-white/20 bg-[#191a2a]/95 p-1.5 shadow-2xl md:rounded-[20px] md:p-2">

                <div className="rounded-[14px] bg-[#222334] p-3 md:rounded-[16px] md:p-3.5 xl:p-4">

                  {/* Dashboard Header */}

                  <div className="mb-3 flex items-center justify-between md:mb-4">

                    <div>

                      <p className="text-[6px] tracking-[0.15em] text-white/30 md:text-[7px]">
                        HOSTEL OVERVIEW
                      </p>

                      <p className="mt-1 text-[11px] font-bold text-white md:text-[13px] xl:text-[15px]">
                        Your workspace
                      </p>

                    </div>

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 md:h-8 md:w-8">

                      <Building2
                        size={12}
                        className="text-white/50"
                      />

                    </div>

                  </div>

                  {/* Stats */}

                  <div className="grid grid-cols-2 gap-1.5 md:gap-2">

                    {/* Residents */}

                    <div className="rounded-lg bg-[#2a2b3d] p-2 md:rounded-xl md:p-2.5 xl:p-3">

                      <Users
                        size={11}
                        className="text-indigo-300 md:size-[13px]"
                      />

                      <p className="mt-1.5 text-sm font-extrabold text-white md:text-base xl:text-lg">
                        128
                      </p>

                      <p className="text-[6px] text-white/35 md:text-[7px]">
                        Residents
                      </p>

                    </div>

                    {/* Occupancy */}

                    <div className="rounded-lg bg-[#2a2b3d] p-2 md:rounded-xl md:p-2.5 xl:p-3">

                      <BedDouble
                        size={11}
                        className="text-blue-300 md:size-[13px]"
                      />

                      <p className="mt-1.5 text-sm font-extrabold text-white md:text-base xl:text-lg">
                        82%
                      </p>

                      <p className="text-[6px] text-white/35 md:text-[7px]">
                        Occupancy
                      </p>

                    </div>

                    {/* Collections */}

                    <div className="rounded-lg bg-[#2a2b3d] p-2 md:rounded-xl md:p-2.5 xl:p-3">

                      <CreditCard
                        size={11}
                        className="text-emerald-300 md:size-[13px]"
                      />

                      <p className="mt-1.5 text-sm font-extrabold text-white md:text-base xl:text-lg">
                        ₹48.2k
                      </p>

                      <p className="text-[6px] text-white/35 md:text-[7px]">
                        Collected
                      </p>

                    </div>

                    {/* Beds */}

                    <div className="rounded-lg bg-[#2a2b3d] p-2 md:rounded-xl md:p-2.5 xl:p-3">

                      <KeyRound
                        size={11}
                        className="text-violet-300 md:size-[13px]"
                      />

                      <p className="mt-1.5 text-sm font-extrabold text-white md:text-base xl:text-lg">
                        7
                      </p>

                      <p className="text-[6px] text-white/35 md:text-[7px]">
                        Beds available
                      </p>

                    </div>

                  </div>

                  {/* Monthly Collections */}

                  <div className="mt-1.5 rounded-lg bg-[#2a2b3d] p-2 md:rounded-xl md:p-2.5 xl:p-3">

                    <div className="flex min-h-8 items-center justify-between sm:min-h-9">

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
                              style={{
                                height: `${height}px`,
                              }}
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

              {/* Ready To Grow */}

              <div className="absolute -bottom-3 -right-1 rounded-xl border border-white/70 bg-white px-2.5 py-2 shadow-xl md:px-3 md:py-2.5">

                <div className="flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <CreditCard size={13} />
                  </div>

                  <div>

                    <p className="text-[8px] font-bold text-slate-800 md:text-[9px]">
                      Ready to grow
                    </p>

                    <p className="text-[6px] text-slate-400 md:text-[7px]">
                      One workspace, less admin
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Feature Cards */}

            <div className="mt-5 grid grid-cols-3 gap-1.5 md:gap-2">

              <div className="rounded-lg border border-white/10 bg-white/10 p-2 md:rounded-xl md:p-2.5">

                <ShieldCheck
                  size={12}
                  className="text-white/80 md:size-[14px]"
                />

                <p className="mt-1 text-[6px] font-semibold text-white/60 md:text-[7px]">
                  Secure
                </p>

              </div>

              <div className="rounded-lg border border-white/10 bg-white/10 p-2 md:rounded-xl md:p-2.5">

                <Users
                  size={12}
                  className="text-white/80 md:size-[14px]"
                />

                <p className="mt-1 text-[6px] font-semibold text-white/60 md:text-[7px]">
                  Residents
                </p>

              </div>

              <div className="rounded-lg border border-white/10 bg-white/10 p-2 md:rounded-xl md:p-2.5">

                <CheckCircle2
                  size={12}
                  className="text-white/80 md:size-[14px]"
                />

                <p className="mt-1 text-[6px] font-semibold text-white/60 md:text-[7px]">
                  Organized
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* Mobile Footer */}

        <div className="absolute bottom-0 left-0 right-0 hidden bg-white/90 px-4 py-2 text-center text-[8px] text-slate-400 backdrop-blur md:hidden">
          <span className="font-semibold text-slate-500">
            HostelHub
          </span>

          {" · "}

          Secure hostel management
        </div>

      </div>
    </div>
  );
};

export default Login;