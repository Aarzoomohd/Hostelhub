import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  Check,
  CreditCard,
  DoorOpen,
  Menu,
  Users,
  X,
  TrendingUp,
  BedDouble,
} from "lucide-react";
import { useEffect, useState } from "react";

const MainPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#about", label: "Why HostelHub" },
  ];

  const stats = [
    { label: "Residents", value: "128", change: "+12 this month", icon: Users },
    { label: "Occupancy", value: "82%", change: "7 beds available", icon: DoorOpen },
    { label: "Collected", value: "₹48.2k", change: "94% on time", icon: CreditCard },
    { label: "Satisfaction", value: "4.8/5", change: "+8% this quarter", icon: BarChart3 },
  ];

  const features = [
    {
      icon: Users,
      title: "Manage students",
      desc: "Keep resident details, room assignments and records organized.",
    },
    {
      icon: DoorOpen,
      title: "Organize rooms",
      desc: "See capacity, availability and occupancy at a glance.",
    },
    {
      icon: CreditCard,
      title: "Track payments",
      desc: "Stay on top of collections, due payments and payment history.",
    },
    {
      icon: BarChart3,
      title: "Better insights",
      desc: "Turn everyday hostel data into simple, useful insights.",
    },
  ];

  return (
    <div className="hostel-page min-h-screen overflow-x-hidden bg-[#fafaff] text-[#11121a]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap');

        .hostel-page {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }

        .hostel-display {
          font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif;
        }

        html {
          scroll-behavior: smooth;
        }

        /* =====================================================
           STRONG PREMIUM BACKGROUND
        ====================================================== */

        .hero-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .hero-background::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 16% 20%, rgba(124, 92, 255, .24), transparent 25%),
            radial-gradient(circle at 84% 24%, rgba(99, 102, 241, .23), transparent 27%),
            radial-gradient(circle at 54% 54%, rgba(192, 132, 252, .16), transparent 25%),
            linear-gradient(135deg, #fbfaff 0%, #f6f3ff 48%, #f9faff 100%);
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          opacity: .55;
          background-image:
            linear-gradient(rgba(91, 80, 180, .045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91, 80, 180, .045) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: linear-gradient(to bottom, black 0%, black 52%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 0%, black 52%, transparent 100%);
        }

        .glow-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(55px);
          will-change: transform;
        }

        .orb-one {
          width: 430px;
          height: 430px;
          left: -150px;
          top: 120px;
          background: rgba(139, 92, 246, .24);
          animation: orbFloatOne 12s ease-in-out infinite;
        }

        .orb-two {
          width: 500px;
          height: 500px;
          right: -190px;
          top: 70px;
          background: rgba(99, 102, 241, .22);
          animation: orbFloatTwo 15s ease-in-out infinite;
        }

        .orb-three {
          width: 360px;
          height: 360px;
          left: 38%;
          top: 300px;
          background: rgba(217, 70, 239, .12);
          animation: orbFloatThree 13s ease-in-out infinite;
        }

        .orb-four {
          width: 300px;
          height: 300px;
          left: 8%;
          bottom: -180px;
          background: rgba(124, 58, 237, .15);
          animation: orbFloatFour 16s ease-in-out infinite;
        }

        .dot-pattern {
          position: absolute;
          width: 130px;
          height: 180px;
          opacity: .55;
          background-image: radial-gradient(#a78bfa 2px, transparent 2px);
          background-size: 22px 22px;
        }

        .dot-left {
          left: 10px;
          top: 150px;
        }

        .dot-right {
          right: 10px;
          top: 110px;
        }

        @keyframes orbFloatOne {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(35px, -25px, 0) scale(1.08); }
        }

        @keyframes orbFloatTwo {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-35px, 30px, 0) scale(1.07); }
        }

        @keyframes orbFloatThree {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: .7; }
          50% { transform: translate3d(-25px, -35px, 0); opacity: 1; }
        }

        @keyframes orbFloatFour {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(45px, -20px, 0); }
        }

        /* =====================================================
           CONTENT ANIMATIONS
        ====================================================== */

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dashboardIn {
          from {
            opacity: 0;
            transform: translateX(35px) rotate(1.5deg) scale(.97);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(0deg) scale(1);
          }
        }

        @keyframes floatCard {
          0%, 100% {
            transform: translateY(0) rotate(-1deg);
          }
          50% {
            transform: translateY(-11px) rotate(1deg);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }

        @keyframes barGrow {
          from { transform: scaleY(.15); }
          to { transform: scaleY(1); }
        }

        .hero-in {
          animation: fadeUp .8s cubic-bezier(.16, 1, .3, 1) both;
        }

        .hero-delay-1 { animation-delay: .08s; }
        .hero-delay-2 { animation-delay: .18s; }
        .hero-delay-3 { animation-delay: .30s; }
        .hero-delay-4 { animation-delay: .42s; }

        .dashboard-in {
          animation: dashboardIn 1s cubic-bezier(.16, 1, .3, 1) .2s both;
        }

        .float-card {
          animation: floatCard 6s ease-in-out infinite;
        }

        .bar {
          transform-origin: bottom;
          animation: barGrow .9s cubic-bezier(.16, 1, .3, 1) both;
        }

        .shimmer {
          position: relative;
          overflow: hidden;
        }

        .shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 45%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.14),
            transparent
          );
          transform: translateX(-120%);
          animation: shimmer 5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* =====================================================
          HERO BACKGROUND
      ====================================================== */}
      <div className="hero-background">
        <div className="hero-grid" />
        <div className="glow-orb orb-one" />
        <div className="glow-orb orb-two" />
        <div className="glow-orb orb-three" />
        <div className="glow-orb orb-four" />
        <div className="dot-pattern dot-left" />
        <div className="dot-pattern dot-right" />
      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 px-3 sm:px-5 transition-all duration-300 ${
          scrolled ? "pt-2" : "pt-2"
        }`}
      >
        <div
          className={`mx-auto max-w-[1410px] rounded-[22px] border border-black/[.055] bg-white/90 px-4 backdrop-blur-2xl sm:px-6 ${
            scrolled
              ? "shadow-[0_18px_50px_-30px_rgba(20,20,40,.45)]"
              : "shadow-[0_10px_35px_-30px_rgba(20,20,40,.35)]"
          }`}
        >
          <div className="flex h-[62px] items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#11121a] text-white shadow-[0_7px_18px_-9px_rgba(17,18,26,.7)]">
                <Building2 size={21} strokeWidth={2.2} />
              </div>

              <div>
                <div className="hostel-display text-[18px] font-extrabold leading-none tracking-[-.045em]">
                  HostelHub
                </div>
                <div className="mt-1 text-[9px] font-semibold tracking-[.14em] text-slate-400">
                  RUN A BETTER RESIDENCE
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-10 lg:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[14px] font-medium text-slate-600 transition hover:text-[#11121a]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                to="/login"
                className="px-4 py-2.5 text-[14px] font-semibold text-slate-700 transition hover:text-[#11121a]"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-[15px] bg-[#5146e5] px-5 py-3 text-[14px] font-bold text-white shadow-[0_12px_25px_-12px_rgba(81,70,229,.85)] transition hover:-translate-y-0.5 hover:bg-[#4338ca]"
              >
                Start free
                <ArrowUpRight
                  size={17}
                  className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <button
              onClick={() => setMenuOpen((value) => !value)}
              className="rounded-xl p-2 md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 md:hidden ${
              menuOpen ? "max-h-80 pb-4 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-slate-100 pt-3">
              <nav className="flex flex-col">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="mt-2 flex gap-2">
                <Link
                  to="/login"
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 rounded-xl bg-[#5146e5] py-2.5 text-center text-sm font-semibold text-white"
                >
                  Start free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}
      <main>
        <section className="relative min-h-[760px] overflow-hidden px-5 pb-20 pt-36 sm:pt-40 lg:px-8 lg:pb-28 lg:pt-48">
          <div className="relative z-10 mx-auto max-w-[1410px]">
            <div className="grid items-center gap-14 lg:grid-cols-[.86fr_1.14fr] lg:gap-12 xl:gap-16">
              {/* LEFT */}
              <div className="max-w-[650px]">
                <div className="hero-in hero-delay-1 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/65 px-3.5 py-2 text-[11px] font-bold tracking-[.12em] text-[#5146e5] shadow-[0_8px_25px_-20px_rgba(81,70,229,.7)] backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-[#5146e5] shadow-[0_0_0_4px_rgba(81,70,229,.08)]" />
                  CALM OPERATIONS. HAPPIER RESIDENTS.
                </div>

                <h1 className="hostel-display hero-in hero-delay-2 mt-7 text-[52px] font-extrabold leading-[.98] tracking-[-.065em] text-[#11121a] sm:text-[68px] lg:text-[76px] xl:text-[82px]">
                  Your hostel,
                  <br />
                  <span className="bg-gradient-to-r from-[#5146e5] via-[#6547e8] to-[#7c3aed] bg-clip-text text-transparent">
                    beautifully
                  </span>{" "}
                  in
                  <br />
                  control.
                </h1>

                <p className="hero-in hero-delay-3 mt-8 max-w-[630px] text-[17px] leading-8 text-slate-500 sm:text-[18px]">
                  HostelHub replaces scattered spreadsheets and daily guesswork
                  with one clear workspace for residents, rooms, and revenue.
                </p>

                <div className="hero-in hero-delay-4 mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/register"
                    className="group inline-flex items-center justify-center gap-2 rounded-[15px] bg-[#11121a] px-6 py-4 text-[14px] font-bold text-white shadow-[0_20px_35px_-20px_rgba(17,18,26,.7)] transition hover:-translate-y-1 hover:shadow-[0_25px_40px_-20px_rgba(17,18,26,.75)]"
                  >
                    Create your free workspace
                    <ArrowUpRight
                      size={18}
                      className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>

                  <a
                    href="#features"
                    className="inline-flex items-center justify-center gap-2 rounded-[15px] border border-slate-200 bg-white/75 px-6 py-4 text-[14px] font-semibold text-slate-600 shadow-sm transition hover:-translate-y-1 hover:bg-white"
                  >
                    Explore the experience
                    <span className="text-violet-400">⌄</span>
                  </a>
                </div>

                <div className="hero-in hero-delay-4 mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[12px] font-medium text-slate-500">
                  {[
                    "Quick to set up",
                    "Made for owners",
                    "Less admin, daily",
                  ].map((item) => (
                    <span key={item} className="flex items-center gap-2">
                      <Check size={15} className="text-emerald-500" strokeWidth={3} />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* RIGHT DASHBOARD */}
              <div className="dashboard-in relative mx-auto w-full max-w-[760px] lg:ml-auto">
                {/* dashboard ambient glow */}
                <div className="absolute -inset-10 rounded-[70px] bg-violet-300/20 blur-[70px]" />

                {/* top resident floating card */}
                <div className="float-card absolute -left-8 top-8 z-20 hidden w-48 rounded-2xl border border-white bg-white/95 p-3.5 shadow-[0_25px_50px_-25px_rgba(81,70,229,.5)] backdrop-blur md:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-[#5146e5]">
                      <Users size={19} />
                    </div>
                    <div>
                      <p className="hostel-display text-lg font-extrabold tracking-[-.04em]">
                        128
                      </p>
                      <p className="text-[10px] text-slate-400">Happy Residents</p>
                    </div>
                  </div>
                </div>

                {/* dashboard */}
                <div className="relative rotate-[.3deg] rounded-[31px] border border-white/80 bg-[#151624] p-2.5 shadow-[0_55px_100px_-45px_rgba(50,39,130,.65),0_25px_60px_-30px_rgba(17,18,26,.4)]">
                  <div className="overflow-hidden rounded-[24px] bg-[#1c1d2d] p-4 sm:p-5 lg:p-6">
                    {/* browser bar */}
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-white/20" />
                        <span className="h-3 w-3 rounded-full bg-white/20" />
                        <span className="h-3 w-3 rounded-full bg-white/20" />
                      </div>

                      <div className="rounded-lg bg-white/[.06] px-3 py-1.5 text-[9px] font-medium tracking-wide text-white/40">
                        HOSTELHUB
                      </div>
                    </div>

                    {/* greeting */}
                    <div className="mb-5 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-semibold tracking-[.18em] text-white/35">
                          MONDAY, 24 JUNE
                        </p>
                        <h2 className="hostel-display mt-2 text-[22px] font-extrabold tracking-[-.04em] text-white sm:text-[25px]">
                          Good morning, Aisha
                        </h2>
                      </div>

                      <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-white/[.06] sm:flex">
                        <Building2 size={19} className="text-white/55" />
                      </div>
                    </div>

                    {/* stat cards */}
                    <div className="grid grid-cols-2 gap-3">
                      {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                          <div
                            key={stat.label}
                            className="shimmer rounded-[19px] border border-white/[.035] bg-[#27283a] p-4 sm:p-5"
                          >
                            <div className="mb-4 flex items-center justify-between">
                              <span className="text-[10px] text-white/40">
                                {stat.label}
                              </span>
                              <Icon size={15} className="text-white/25" />
                            </div>

                            <div className="hostel-display text-[27px] font-extrabold tracking-[-.05em] text-white">
                              {stat.value}
                            </div>

                            <div className="mt-1.5 text-[9px] font-medium text-emerald-400">
                              {stat.change}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* collection chart */}
                    <div className="mt-3 rounded-[19px] border border-white/[.035] bg-[#27283a] p-4 sm:p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-white/40">
                            Monthly collections
                          </p>
                          <p className="mt-1.5 text-[10px] font-semibold text-emerald-400">
                            +18.4%
                          </p>
                        </div>

                        <div className="flex h-14 items-end gap-1.5">
                          {[25, 34, 29, 42, 37, 51, 45, 62, 55, 76].map(
                            (height, index) => (
                              <div
                                key={index}
                                className={`bar w-2 rounded-t-full ${
                                  index === 9
                                    ? "bg-violet-400"
                                    : "bg-white/[.11]"
                                }`}
                                style={{
                                  height: `${height * 0.7}px`,
                                  animationDelay: `${index * 70}ms`,
                                }}
                              />
                            )
                          )}
                        </div>
                      </div>

                      <div className="mt-5 h-1.5 rounded-full bg-white/[.06]">
                        <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-500 to-indigo-400" />
                      </div>
                    </div>

                    {/* mini metrics */}
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {[
                        ["12", "New residents", Users],
                        ["08", "Payments due", CreditCard],
                        ["03", "Beds open", BedDouble],
                      ].map(([number, label, Icon]) => (
                        <div
                          key={label}
                          className="rounded-[18px] border border-white/[.025] bg-[#27283a] p-3.5 sm:p-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="hostel-display text-xl font-extrabold text-white">
                              {number}
                            </span>
                            <Icon size={13} className="text-white/25" />
                          </div>
                          <p className="mt-1 text-[8px] text-white/35">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* occupancy floating card */}
                <div className="float-card absolute -right-7 top-[37%] z-20 hidden w-48 rounded-2xl border border-white bg-white/95 p-3.5 shadow-[0_25px_50px_-25px_rgba(81,70,229,.5)] backdrop-blur md:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                      <BedDouble size={19} />
                    </div>
                    <div>
                      <p className="hostel-display text-lg font-extrabold tracking-[-.04em]">
                        82%
                      </p>
                      <p className="text-[10px] text-slate-400">Occupancy Rate</p>
                    </div>
                    <TrendingUp size={17} className="ml-auto text-violet-500" />
                  </div>
                </div>

                {/* revenue floating card */}
                <div className="float-card absolute -bottom-8 left-5 z-20 hidden w-52 rounded-2xl border border-white bg-white/95 p-3.5 shadow-[0_25px_50px_-25px_rgba(81,70,229,.5)] backdrop-blur sm:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <p className="hostel-display text-lg font-extrabold tracking-[-.04em]">
                        ₹48.2k
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Revenue Collected
                      </p>
                    </div>
                  </div>
                </div>

                {/* decorative line */}
                <div className="absolute -bottom-10 -right-6 hidden h-20 w-40 rotate-[-18deg] rounded-full border-t-2 border-violet-300/60 md:block" />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURES
        ====================================================== */}
        <section
          id="features"
          className="relative border-y border-slate-200/70 bg-white/75 px-5 py-24 backdrop-blur-sm lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#5146e5]">
                Everything in one place
              </p>

              <h2 className="hostel-display mt-4 text-3xl font-extrabold tracking-[-.05em] sm:text-4xl">
                Four tools. One calm workspace.
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-slate-500">
                Everything you need to run your hostel without switching between
                notebooks, spreadsheets and different apps.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="group rounded-[21px] border border-slate-200/80 bg-white p-6 transition duration-300 hover:-translate-y-1.5 hover:border-violet-200 hover:shadow-[0_25px_50px_-35px_rgba(81,70,229,.55)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-[#5146e5] transition duration-300 group-hover:bg-[#5146e5] group-hover:text-white">
                      <Icon size={20} />
                    </div>

                    <h3 className="hostel-display mt-5 text-lg font-bold tracking-[-.025em]">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {feature.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ====================================================== */}
        <section
          id="how-it-works"
          className="relative overflow-hidden px-5 py-24 lg:px-8"
        >
          <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-200/30 blur-[110px]" />

          <div className="relative mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#5146e5]">
                How it works
              </p>

              <h2 className="hostel-display mt-4 text-3xl font-extrabold tracking-[-.05em] sm:text-4xl">
                From setup to smooth operations.
              </h2>
            </div>

            <div className="relative mt-14 grid gap-10 md:grid-cols-3">
              <div className="absolute left-[18%] right-[18%] top-7 hidden h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent md:block" />

              {[
                ["01", "Create your account", "Register and securely access your HostelHub workspace."],
                ["02", "Set up your hostel", "Add rooms, residents and the information your team needs."],
                ["03", "Manage everything", "Keep daily operations, payments and occupancy in one view."],
              ].map(([number, title, desc]) => (
                <div key={number} className="relative text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200 bg-white text-sm font-bold text-[#5146e5] shadow-[0_10px_30px_-20px_rgba(81,70,229,.5)]">
                    {number}
                  </div>

                  <h3 className="hostel-display mt-5 text-lg font-bold">
                    {title}
                  </h3>

                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            ABOUT
        ====================================================== */}
        <section id="about" className="px-5 pb-24 lg:px-8">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-violet-100 bg-gradient-to-br from-violet-100/80 via-white to-indigo-100/70 p-7 sm:p-10 lg:p-14">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-[#5146e5]">
                  Why HostelHub?
                </p>

                <h2 className="hostel-display mt-4 text-3xl font-extrabold tracking-[-.05em] sm:text-4xl">
                  Less admin. More time for your residents.
                </h2>

                <p className="mt-5 leading-7 text-slate-500">
                  HostelHub keeps your most important hostel information
                  together, so everyday management feels clear instead of
                  complicated.
                </p>

                <div className="mt-8 space-y-5">
                  {[
                    ["Simple & easy to use", "Clean workflows designed for everyday hostel management."],
                    ["Secure data", "Keep hostel and resident information protected and organized."],
                    ["Save time", "Reduce repetitive manual work and get a clearer daily overview."],
                  ].map(([title, desc]) => (
                    <div key={title} className="flex gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-emerald-500 shadow-sm">
                        <Check size={15} strokeWidth={3} />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold">{title}</h3>
                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-8 rounded-full bg-violet-300/20 blur-3xl" />

                <div className="relative rounded-[25px] border border-white bg-white/80 p-5 shadow-[0_30px_70px_-45px_rgba(81,70,229,.55)] backdrop-blur">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      [Users, "Students", "Easy resident management"],
                      [DoorOpen, "Rooms", "Simple room management"],
                      [CreditCard, "Payments", "Organized payment records"],
                      [BarChart3, "Dashboard", "Everything in one place"],
                    ].map(([Icon, label, desc]) => (
                      <div
                        key={label}
                        className="rounded-[20px] border border-slate-100 bg-slate-50/80 p-5"
                      >
                        <Icon size={20} className="text-[#5146e5]" />

                        <div className="hostel-display mt-4 text-base font-bold">
                          {label}
                        </div>

                        <div className="mt-1 text-[11px] leading-5 text-slate-400">
                          {desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CTA
        ====================================================== */}
        <section className="px-5 pb-24 lg:px-8">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[30px] bg-[#11121a] px-6 py-16 text-center sm:px-10">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-violet-600/25 blur-[80px]" />
            <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-[90px]" />

            <div className="relative mx-auto max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-violet-300">
                Ready when you are
              </p>

              <h2 className="hostel-display mt-4 text-3xl font-extrabold tracking-[-.05em] text-white sm:text-4xl">
                Ready to simplify your hostel management?
              </h2>

              <p className="mt-4 leading-7 text-white/55">
                Create your account and start running your hostel from one
                beautiful, organized workspace.
              </p>

              <Link
                to="/register"
                className="group mt-8 inline-flex items-center gap-2 rounded-[15px] bg-white px-6 py-4 text-sm font-bold text-[#11121a] transition hover:-translate-y-1 hover:bg-violet-50"
              >
                Create your free workspace
                <ArrowUpRight
                  size={18}
                  className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-slate-200 bg-white px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#11121a] text-white">
              <Building2 size={18} />
            </div>

            <div>
              <div className="hostel-display text-sm font-extrabold tracking-[-.03em]">
                HostelHub
              </div>
              <div className="text-[9px] font-semibold tracking-[.12em] text-slate-400">
                MANAGEMENT SYSTEM
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 text-xs font-medium text-slate-400">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition hover:text-slate-700"
              >
                {link.label}
              </a>
            ))}

            <Link to="/login" className="transition hover:text-slate-700">
              Login
            </Link>

            <Link to="/register" className="transition hover:text-slate-700">
              Register
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} HostelHub
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
