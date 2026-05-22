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
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden bg-slate-950">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950"></div>
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Top bar: back arrow + language dropdown */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10 backdrop-blur-md">
            <ArrowLeft size={18} />
          </div>
        </button>

        {/* Language dropdown - top right */}
        <div id="login_translate_target" className="flex items-center"></div>
      </div>

      <div className="w-full max-w-[1000px] flex flex-col lg:flex-row items-stretch z-10 mx-4 lg:mx-8 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Left Panel - Branding */}
        <div className="w-full lg:w-5/12 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden bg-indigo-600/10 border-r border-white/5">
          <div className="relative z-10 text-white">
            <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/30">
              <GraduationCap size={28} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight tracking-tight">
              Welcome to <span className="text-indigo-400 notranslate">KeraSMS</span>
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              Sign in to your account to access your school dashboard, manage academic records, and stay connected.
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-7/12 p-8 sm:p-12 lg:p-16 flex items-center justify-center relative">
          <div className="w-full max-w-sm">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Sign in</h2>
              <p className="text-slate-400 text-sm">Enter your credentials to continue.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-center gap-3 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 animate-pulse"></div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-slate-900/80 transition-all notranslate shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-950/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-slate-900/80 transition-all notranslate shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end pt-1">
                <Link to="/forgot-password" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed border border-indigo-500/50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 text-xs font-medium">
                Contact your school administrator for access credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
