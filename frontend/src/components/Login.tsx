import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, ArrowRight, ArrowLeft, User, Lock, Eye, EyeOff } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { cn } from "../lib/utils";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [username, setUsername] = useState("admin@keraschool.et");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"admin" | "teacher" | "student">("admin");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const err = await login(username, password);
      if (err) {
        setError(err);
      } else {
        navigate("/dashboard");
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const loadDemo = (type: "admin" | "teacher" | "student") => {
    setRole(type);
    if (type === "admin") { setUsername("admin@keraschool.et"); setPassword("admin123"); }
    if (type === "teacher") { setUsername("ephrem.worku"); setPassword("teacher123"); }
    if (type === "student") { setUsername("mekdes.tsegaye"); setPassword("student123"); }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 relative items-center justify-center overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-lg px-12 text-white animate-fade-up">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-5xl font-black mb-6 leading-tight">Welcome back to <span className="notranslate">KeraSMS</span>.</h1>
          <p className="text-xl text-indigo-100 font-medium opacity-90 leading-relaxed">
            Your centralized hub for school administration, academic tracking, and interactive learning.
          </p>
          
          {/* Demo Users Quick Select */}
          <div className="mt-12">
            <p className="text-sm font-bold text-indigo-200 uppercase tracking-wider mb-4">Quick Demo Access</p>
            <div className="flex gap-3">
              {(["admin", "teacher", "student"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => loadDemo(r)}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border",
                    role === r
                      ? "bg-white text-indigo-700 border-white shadow-lg shadow-white/20"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  )}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-white">
        
        {/* Back Arrow — top left */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-bold hidden sm:inline lg:hidden xl:inline">Back</span>
        </button>

        {/* Mobile Header Logo */}
        <div className="absolute top-8 right-8 flex items-center gap-3 lg:hidden">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-gray-900 notranslate">Kera<span className="text-indigo-600">SMS</span></span>
        </div>

        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Sign in</h2>
            <p className="text-gray-500 font-medium">Please enter your credentials to continue.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-100 flex items-center gap-3 shadow-sm animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              {error}
            </div>
          )}

          {/* Mobile Demo Selector */}
          <div className="mb-6 lg:hidden">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Demo Access</p>
            <div className="flex gap-2">
              {(["admin", "teacher", "student"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => loadDemo(r)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border-2",
                    role === r
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-100 bg-white text-gray-400 hover:border-gray-200"
                  )}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Username or Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm notranslate"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm notranslate"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold tracking-wide transition-all shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center lg:text-left">
            <p className="text-gray-400 font-medium text-xs">
              Contact your school administrator if you need access credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
