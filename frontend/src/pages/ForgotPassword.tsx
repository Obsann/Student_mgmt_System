import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, ArrowLeft, Mail, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

type Step = "email" | "sent";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset email");
      setStep("sent");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 relative items-center justify-center overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-orange-300/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-lg px-12 text-white animate-fade-up">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-5xl font-black mb-6 leading-tight">Account Recovery</h1>
          <p className="text-xl text-orange-100 font-medium opacity-90 leading-relaxed">
            Don't worry — it happens to the best of us. We'll help you get back into your <span className="notranslate">KeraSMS</span> account safely.
          </p>
          
          <div className="mt-16 grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <h3 className="font-bold text-xl mb-1">Secure</h3>
              <p className="text-orange-100 text-sm">Reset link sent only to verified email.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <h3 className="font-bold text-xl mb-1">Quick</h3>
              <p className="text-orange-100 text-sm">Get back in within minutes.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-white">
        
        {/* Back Arrow */}
        <button
          onClick={() => navigate("/login")}
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-bold hidden sm:inline lg:hidden xl:inline">Back to Login</span>
        </button>

        {/* Mobile Logo */}
        <div className="absolute top-8 right-8 flex items-center gap-3 lg:hidden">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-gray-900 notranslate">Kera<span className="text-orange-600">SMS</span></span>
        </div>

        <div className="w-full max-w-md animate-fade-in">
          {step === "email" && (
            <>
              <div className="mb-10 text-center lg:text-left">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 mx-auto lg:mx-0">
                  <Mail size={28} className="text-orange-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Forgot your password?</h2>
                <p className="text-gray-500 font-medium">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-100 flex items-center gap-3 shadow-sm animate-fade-in">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-sm notranslate"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-2 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-sm font-bold tracking-wide transition-all shadow-xl shadow-orange-600/20 hover:shadow-orange-600/30 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Reset Instructions
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 text-center lg:text-left">
                <p className="text-gray-500 font-medium text-sm">
                  Remember your password?{" "}
                  <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}

          {step === "sent" && (
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Check your email</h2>
              <p className="text-gray-500 font-medium mb-2">
                We've sent password reset instructions to:
              </p>
              <p className="text-indigo-600 font-bold text-lg mb-8 notranslate">{email}</p>
              
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-8 text-left">
                <p className="text-sm text-amber-800 font-medium leading-relaxed">
                  <strong>Didn't receive the email?</strong> Check your spam folder. If you still don't see it, contact your school administrator for assistance.
                </p>
              </div>

              <button
                onClick={() => navigate("/login")}
                className="w-full py-4 bg-gray-900 hover:bg-indigo-600 text-white rounded-2xl text-sm font-bold tracking-wide transition-all shadow-xl flex items-center justify-center gap-2 group"
              >
                Back to Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
