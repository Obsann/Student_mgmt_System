import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, ArrowRight, Mail, Lock, User, UserSquare2 } from "lucide-react";
import { cn } from "../lib/utils";
import { api } from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "student" as "student" | "teacher" | "admin",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.register(form.username, form.password, form.name, form.email, form.role);
      navigate("/login", { state: { message: "Registration successful! Please log in." }});
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 relative items-center justify-center overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-teal-300/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-lg px-12 text-white animate-fade-up">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-5xl font-black mb-6 leading-tight">Join the Future of Education.</h1>
          <p className="text-xl text-emerald-100 font-medium opacity-90 leading-relaxed">
            A comprehensive, premium platform designed to elevate the experience for students, teachers, and administrators.
          </p>
          
          <div className="mt-16 grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <h3 className="font-bold text-xl mb-1">Seamless</h3>
              <p className="text-emerald-100 text-sm">Lightning fast with real-time updates.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <h3 className="font-bold text-xl mb-1">Intuitive</h3>
              <p className="text-emerald-100 text-sm">Designed for ease of use and clarity.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-white">
        
        {/* Mobile Header Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-3 lg:hidden">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-gray-900">Kera<span className="text-emerald-600">SMS</span></span>
        </div>

        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Create an account</h2>
            <p className="text-gray-500 font-medium">Enter your details to register for KeraSMS.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-100 flex items-center gap-3 shadow-sm animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="grid grid-cols-3 gap-3">
              {(["student", "teacher", "admin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  className={cn(
                    "py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-2 flex flex-col items-center gap-2",
                    form.role === r 
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm" 
                      : "border-gray-100 bg-white text-gray-400 hover:border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {r === "student" && <GraduationCap size={18} />}
                  {r === "teacher" && <UserSquare2 size={18} />}
                  {r === "admin" && <User size={18} />}
                  {r}
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-6 bg-gray-900 hover:bg-emerald-600 text-white rounded-2xl text-sm font-bold tracking-wide transition-all shadow-xl shadow-gray-900/10 hover:shadow-emerald-600/30 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center lg:text-left">
            <p className="text-gray-500 font-medium text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
