import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, ArrowRight, ArrowLeft, User, Lock, Eye, EyeOff } from "lucide-react";
import { useApp } from "../contexts/AppContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const translateWidget = document.getElementById('google_translate_element');
    const headerTarget = document.getElementById('login_translate_target');
    if (translateWidget && headerTarget) {
      translateWidget.style.position = 'static';
      headerTarget.appendChild(translateWidget);
    }
    return () => {
      if (translateWidget) {
        translateWidget.style.position = 'fixed';
        translateWidget.style.bottom = '16px';
        translateWidget.style.left = '16px';
        document.body.appendChild(translateWidget);
      }
    };
  }, []);

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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-gray-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 via-slate-900 to-slate-950"></div>
        <div className="absolute top-[20%] right-[-5%] w-[350px] h-[350px] bg-indigo-500/8 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[250px] h-[250px] bg-indigo-400/6 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 max-w-md px-12 text-white">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-8 border border-white/10">
            <GraduationCap size={24} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight tracking-tight">
            Welcome back.
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            Sign in to your account to access your school dashboard, manage academic records, and stay connected.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative bg-white">
        
        {/* Top bar: back arrow + language dropdown */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-gray-50 group-hover:bg-gray-100 flex items-center justify-center transition-colors border border-gray-100">
              <ArrowLeft size={16} />
            </div>
          </button>

          {/* Language dropdown - top right */}
          <div id="login_translate_target" className="flex items-center"></div>
        </div>

        {/* Mobile Header Logo */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-900 notranslate">Kera<span className="text-indigo-600">SMS</span></span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Sign in</h2>
            <p className="text-gray-400 text-sm">Enter your credentials to continue.</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-gray-500 transition-colors">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-all notranslate"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-gray-500 transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-all notranslate"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-300 hover:text-gray-500 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end pt-1">
              <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-xs">
              Contact your school administrator for access credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
