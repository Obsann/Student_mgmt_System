import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, User } from "lucide-react";
import { api } from "../services/api";

type Step = "username" | "verify" | "sent";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("username");
  const [username, setUsername] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await api.getVerificationQuestions(username);
      setQuestions(res.questions);
      setAnswers(Array(res.questions.length).fill(""));
      setStep("verify");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (answers.some(a => !a.trim())) {
      setError("Please answer all verification questions.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.forgotPassword(username, answers);
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
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-900 via-slate-900 to-black relative items-center justify-center overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-lg px-12 text-white animate-fade-up">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
            <ShieldCheck size={32} className="text-indigo-400" />
          </div>
          <h1 className="text-5xl font-black mb-6 leading-tight">Account Recovery</h1>
          <p className="text-xl text-slate-300 font-medium opacity-90 leading-relaxed">
            Don't worry — it happens to the best of us. Answer your security questions to get back into your <span className="notranslate">KeraSMS</span> account safely.
          </p>
          
          <div className="mt-16 grid grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <h3 className="font-bold text-xl mb-1 text-indigo-400">Secure</h3>
              <p className="text-slate-400 text-sm">Identity verified automatically.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <h3 className="font-bold text-xl mb-1 text-indigo-400">Quick</h3>
              <p className="text-slate-400 text-sm">Get back in within minutes.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-white">
        
        {/* Back Arrow */}
        <button
          onClick={() => {
            if (step === "verify") setStep("username");
            else navigate("/login");
          }}
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-bold hidden sm:inline lg:hidden xl:inline">Back</span>
        </button>

        {/* Mobile Logo */}
        <div className="absolute top-8 right-8 flex items-center gap-3 lg:hidden">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-gray-900 notranslate">Kera<span className="text-indigo-600">SMS</span></span>
        </div>

        <div className="w-full max-w-md animate-fade-in">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-100 flex items-center gap-3 shadow-sm animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              {error}
            </div>
          )}

          {step === "username" && (
            <>
              <div className="mb-10 text-center lg:text-left">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 mx-auto lg:mx-0">
                  <User size={28} className="text-indigo-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Forgot your password?</h2>
                <p className="text-gray-500 font-medium">
                  Enter your username and we'll verify your identity.
                </p>
              </div>

              <form onSubmit={handleFetchQuestions} className="space-y-5">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm notranslate"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !username}
                  className="w-full py-4 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold tracking-wide transition-all shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue</span>
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

          {step === "verify" && (
            <>
              <div className="mb-10 text-center lg:text-left">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 mx-auto lg:mx-0">
                  <ShieldCheck size={28} className="text-indigo-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Verify Identity</h2>
                <p className="text-gray-500 font-medium">
                  Please answer your security questions to reset your password.
                </p>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-6">
                {questions.map((q, i) => (
                  <div key={i}>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{q}</label>
                    <input
                      type="text"
                      required
                      placeholder="Your answer"
                      value={answers[i] || ""}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold tracking-wide transition-all shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Reset Password</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === "sent" && (
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Check your email</h2>
              <p className="text-gray-500 font-medium mb-2">
                We've verified your identity and sent a new, temporary password to your email address.
              </p>
              
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-8 text-left">
                <p className="text-sm text-amber-800 font-medium leading-relaxed">
                  <strong>Didn't receive the email?</strong> Check your spam folder. If you still don't see it, contact your school administrator for assistance.
                </p>
              </div>

              <button
                onClick={() => navigate("/login")}
                className="w-full py-4 bg-gray-900 hover:bg-indigo-600 text-white rounded-2xl text-sm font-bold tracking-wide transition-all shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>Back to Sign In</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
