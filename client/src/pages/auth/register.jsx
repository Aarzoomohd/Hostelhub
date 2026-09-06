import { useState } from "react";
import {
  registerUser,
  sendVerificationOtp,
  verifyVerificationOtp,
} from "../../services/authService.js";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Building2,
  User,
  Mail,
  Phone,
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

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email verification
  const [emailVerified, setEmailVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // If email is changed after verification, verify the new email again
    if (e.target.name === "email") {
      setEmailVerified(false);
      setOtp("");
    }
  };

  const handleSendOtp = async () => {
    const email = formData.email.trim();

    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    try {
      setIsSendingOtp(true);

      await sendVerificationOtp(email);

      setOtp("");
      setShowOtpModal(true);
      toast.success("OTP sent to your email");
    } catch (error) {
      // Existing registered email will come here.
      // Modal will not open because it only opens after a successful response.
      toast.error(
        error.response?.data?.message || "Failed to send OTP"
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    try {
      setIsVerifyingOtp(true);

      await verifyVerificationOtp(formData.email.trim(), otp.trim());

      setEmailVerified(true);
      setShowOtpModal(false);
      setOtp("");

      toast.success("Email verified successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid OTP"
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      toast.error("Please verify your email first");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const { confirmPassword, ...ownerData } = formData;

      const data = await registerUser(ownerData);

      toast.success(data.message || "Registration successful");
      navigate("/login");
    } catch (error) {
      console.error("Error registering owner:", error);

      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      id: "name",
      label: "Full name",
      type: "text",
      icon: User,
      placeholder: "Your full name",
      autoComplete: "name",
    },
    {
      id: "email",
      label: "Email address",
      type: "email",
      icon: Mail,
      placeholder: "you@example.com",
      autoComplete: "email",
    },
    {
      id: "phone",
      label: "Phone number",
      type: "tel",
      icon: Phone,
      placeholder: "Your phone number",
      autoComplete: "tel",
    },
  ];

  return (
    <div className="min-h-dvh w-full overflow-x-hidden bg-[#aebff5] px-0 py-0 font-sans sm:px-3 sm:py-3 md:px-5 md:py-5 lg:flex lg:min-h-dvh lg:items-center lg:justify-center">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
      </div>

      {/* Main responsive card */}
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1120px] overflow-hidden bg-white shadow-none sm:min-h-0 sm:rounded-[22px] sm:shadow-[0_25px_70px_rgba(37,45,100,0.18)] md:rounded-[26px] lg:max-h-[calc(100dvh-40px)] lg:min-h-[650px] lg:rounded-[28px]">

        {/* ================= LEFT / FORM ================= */}
        <section className="flex min-h-dvh w-full flex-col bg-white px-4 py-3 sm:min-h-0 sm:px-7 sm:py-6 md:px-9 md:py-7 lg:min-h-0 lg:w-[53%] lg:px-12 lg:py-8 xl:px-16">

          {/* Top */}
          <div className="flex min-h-8 items-center justify-between sm:min-h-9">
            <Link
              to="/"
              aria-label="Go back"
              className="flex mr-100h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50 sm:h-9 sm:w-9"
            >
              <ArrowRight size={15} className="rotate-180" />
            </Link>

            {/* <p className="ml-3 text-right text-[9px] leading-4 text-slate-500 sm:text-[11px]">
              Already a member?{" "}
              <Link
                to="/login"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                className="relative z-20 cursor-pointer font-bold text-indigo-600 hover:text-indigo-800"
              >
                Sign in
              </Link>
            </p> */}
          </div>

          {/* Form content */}
          <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col justify-start py-3 sm:justify-center sm:py-5 md:py-6 lg:max-h-[600px] lg:py-3">

            {/* Brand + heading */}
            <div className="mb-3 sm:mb-5">
              {/* <div className="mb-2.5 flex items-center gap-2.5 sm:mb-3.5">
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
              </div> */}

              <h1 className="text-[22px] font-extrabold leading-tight tracking-[-0.05em] text-slate-950 sm:text-[31px] lg:text-[33px]">
                Create your account
              </h1>

              <p className="mt-1 max-w-[340px] text-[10px] leading-4 text-slate-500 sm:mt-1.5 sm:text-[12px] sm:leading-5">
                Set up HostelHub and manage your entire hostel in one place.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-4">
              {fields.map((field) => {
                const Icon = field.icon;

                return (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="mb-1.5 block text-[10px] font-bold text-slate-700 sm:text-[11px]"
                    >
                      {field.label}
                    </label>

                    {field.id === "email" ? (
                      <div className="flex min-w-0 items-stretch gap-1.5 sm:gap-2">
                        <div className="relative min-w-0 flex-1">
                          <Icon
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            id={field.id}
                            name={field.id}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formData[field.id]}
                            onChange={handleChange}
                            required
                            autoComplete={field.autoComplete}
                            className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-3 text-[11px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 sm:py-3.5 ${
                              emailVerified
                                ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-100"
                                : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                            }`}
                          />

                          {emailVerified && (
                            <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[9px] font-bold text-emerald-600 sm:text-[10px]">
                              <CheckCircle2 size={13} />
                              Verified
                            </div>
                          )}
                        </div>

                        {!emailVerified && (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isSendingOtp || !formData.email.trim()}
                            className="shrink-0 rounded-xl bg-indigo-600 px-2.5 text-[8px] font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 xs:px-3 xs:text-[9px] sm:px-4 sm:text-[10px]"
                          >
                            {isSendingOtp ? "Sending..." : "Verify Email"}
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <Icon
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          id={field.id}
                          name={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.id]}
                          onChange={handleChange}
                          required
                          autoComplete={field.autoComplete}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-[11px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:py-3.5"
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-[10px] font-bold text-slate-700 sm:text-[11px]"
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-[11px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:py-3.5"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-[10px] font-bold text-slate-700 sm:text-[11px]"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-10 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 sm:py-3.5 ${
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : formData.confirmPassword &&
                          formData.password === formData.confirmPassword
                        ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <div className="mt-1.5 flex items-center gap-1 text-[9px] font-semibold text-emerald-600">
                      <CheckCircle2 size={11} />
                      Passwords match
                    </div>
                  )}
              </div>

              {/* Register */}
              <button
                type="submit"
                disabled={isSubmitting || !emailVerified}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-[12px] font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:py-3.5"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Security */}
            {/* <div className="mt-2 flex items-center justify-center gap-2 text-[8px] text-slate-400 sm:mt-5 sm:text-[10px]">
              <ShieldCheck size={13} className="text-emerald-500" />
              Your information is secure and protected
            </div> */}

            <p className="mt-2 text-center text-[9px] text-slate-500 sm:text-[11px]">
              Already have an account?{" "}
              <Link
                to="/login"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                className="relative z-10 text-sm cursor-pointer font-bold text-indigo-600 hover:text-indigo-800"
              >
                Login
              </Link>
            </p>
          </div>

          <p className="pt-1 text-center text-[7px] text-slate-300 sm:pt-3 sm:text-[9px]">
            © {new Date().getFullYear()} HostelHub. All rights reserved.
          </p>
        </section>

        {/* ================= RIGHT / VISUAL ================= */}
        <section className="relative hidden w-[47%] overflow-hidden bg-linear-to-br from-[#4f46e5] via-[#5b5ff3] to-[#4b91ed] lg:block lg:w-[47%]">

          {/* Decorative shapes */}
          <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-white/10 xl:h-80 xl:w-80" />
          <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-blue-300/20 xl:h-80 xl:w-80" />
          <div className="absolute -right-25 top-[18%] h-36 w-105 -rotate-12 rounded-[35px] bg-[#373cae]/55 xl:h-44 xl:w-[470px]" />
          <div className="absolute -bottom-20 -right-20 h-56 w-56 rotate-45 rounded-[40px] bg-[#4b9af2]/70 xl:h-64 xl:w-64" />

          <div className="relative flex h-full min-h-125 flex-col justify-between p-6 md:p-7 lg:p-8 xl:p-10">

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

            {/* Dashboard illustration */}
            <div className="relative mx-auto w-full max-w-[430px]">

              {/* Floating card */}
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

                  {/* Progress */}
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
                      Ready to grow
                    </p>
                    <p className="text-[6px] text-slate-400 md:text-[7px]">
                      One workspace, less admin
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

          {/* ================= OTP MODAL ================= */}
          {showOtpModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 px-3 py-4 backdrop-blur-sm sm:px-4">
              <div className="relative my-auto w-full max-w-[390px] rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close OTP verification"
                >
                  <span className="text-xl leading-none">×</span>
                </button>

                <div className="pr-8">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Mail size={20} />
                  </div>

                  <h2 className="text-lg font-extrabold tracking-tight text-slate-950">
                    Verify your email
                  </h2>

                  <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                    We sent a 6-digit OTP to{" "}
                    <span className="font-semibold text-slate-700 break-all">
                      {formData.email}
                    </span>
                  </p>
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="email-otp"
                    className="mb-1.5 block text-[10px] font-bold text-slate-700"
                  >
                    Enter OTP
                  </label>

                  <input
                    id="email-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-lg font-bold tracking-[0.45em] text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifyingOtp || otp.length !== 6}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify OTP
                        <CheckCircle2 size={14} />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="mt-3 w-full text-[10px] font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                  >
                    {isSendingOtp ? "Sending OTP..." : "Didn't receive it? Resend OTP"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Mobile footer strip */}
        <div className="absolute bottom-0 left-0 right-0 hidden bg-white/90 px-4 py-2 text-center text-[8px] text-slate-400 backdrop-blur md:hidden">
          <span className="font-semibold text-slate-500">HostelHub</span>
          {" · "}
          Secure hostel management
        </div>
      </div>
    </div>
  );
};

export default Register;
