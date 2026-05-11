import { useState, useEffect } from "react";
import { GraduationCap, Eye, EyeOff, LogIn, ArrowLeft, ShieldCheck, UserCheck } from "lucide-react";
import { useApp } from "../contexts/AppContext";

interface LoginProps {
  onBack: () => void;
}

export default function Login({ onBack }: LoginProps) {
  const { login } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const translateWidget = document.getElementById('google_translate_element');
    const headerTarget = document.getElementById('google_translate_header_target');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(async () => {
      const err = await login(username, password);
      if (err) {
        setError(err);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative font-sans selection:bg-indigo-500 selection:text-white">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        <div id="google_translate_header_target"></div>
      </div>
      
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-0 relative z-10 animate-fade-scale rounded-3xl overflow-hidden bg-white shadow-xl border border-slate-100">
        
        {/* Left Side: Friendly Graphic / Branding */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-indigo-600 text-white relative overflow-hidden">
          {/* Soft background circles for a modern, engaging feel */}
          <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-48 h-48 bg-purple-500 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10">
            <button onClick={onBack} className="text-indigo-200 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors mb-12">
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight leading-tight">Welcome to Kera</h1>
            <p className="text-indigo-100 text-lg leading-relaxed font-medium max-w-sm">
              Your central hub for classes, grades, and everything happening on campus. Let's get started!
            </p>
          </div>
          
          <div className="relative z-10 pt-8 border-t border-indigo-500/50">
            <p className="text-xs text-indigo-200 font-medium">
              Jimma University IoT • CBTP Phase 2
            </p>
          </div>
        </div>

        {/* Right Side: Universal Form */}
        <div className="p-8 md:p-12 relative bg-white flex flex-col justify-center">
          <button onClick={onBack} className="md:hidden absolute top-6 left-6 text-slate-400 hover:text-slate-900 flex items-center gap-1 text-sm font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          <div className="mb-10 mt-6 md:mt-0 animate-fade-up">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Sign In</h2>
            <p className="text-slate-500 text-sm font-medium">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-sm">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" /> {error}
              </div>
            )}

            <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserCheck className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-900 font-medium"
                  placeholder="e.g. student.1@keraschool.et"
                  required
                />
              </div>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-900 font-medium pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2 animate-fade-up"
              style={{ animationDelay: '0.3s' }}
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> <span>Signing In...</span></>
              ) : (
                <><LogIn className="w-5 h-5" /> <span>Sign In</span></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
