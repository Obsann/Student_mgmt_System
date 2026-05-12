import { useEffect } from 'react';
import { GraduationCap, BookOpen, Users, ArrowRight, Trophy, ShieldCheck, CheckCircle, ChevronRight } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();
  useEffect(() => {
    // Teleport the Google Translate widget from the body into the header
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 md:py-6 max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div>
            <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 block leading-none notranslate">Kera</span>
            <span className="text-[10px] md:text-xs font-bold text-indigo-500 tracking-wide notranslate">HIGH SCHOOL</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div id="google_translate_header_target" className="hidden sm:block"></div>
          <Link
            to="/login"
            className="hidden sm:flex px-5 py-2 md:px-6 md:py-2.5 bg-white text-indigo-600 text-sm font-bold rounded-xl shadow-sm border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all items-center gap-2"
          >
            Sign In
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
        {/* Playful Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-200/50 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-purple-200/50 rounded-full blur-[100px]"></div>
          <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-blue-200/30 rounded-full blur-[80px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-xs tracking-wide mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Welcome to the <span className="notranslate">2025/26</span> Year
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6">
              Your School Life, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">All in One Place.</span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-10 max-w-xl font-medium">
              Check your schedule, track your grades, and stay connected with your teachers in one easy-to-use platform. No more missing assignments!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-indigo-600 text-white text-base md:text-lg font-bold rounded-2xl shadow-lg shadow-indigo-600/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-600/40 active:translate-y-0 transition-all flex items-center justify-center gap-3 group"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-500 font-bold tracking-wide">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-slate-100"><ShieldCheck className="w-4 h-4 text-indigo-500" /></div> Secure
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-slate-100"><CheckCircle className="w-4 h-4 text-indigo-500" /></div> Fast & Easy
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative hidden lg:block">
            <div className="relative animate-fade-scale">
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200 border border-slate-100">
                <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">✨</span>
                  What's Inside?
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all cursor-default">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Your Classes & Grades</h4>
                      <p className="text-sm text-slate-500 mt-0.5 font-medium">See how you're doing in real-time.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md hover:border-purple-100 transition-all cursor-default">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Connect with Teachers</h4>
                      <p className="text-sm text-slate-500 mt-0.5 font-medium">Everything organized by subject.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md hover:border-emerald-100 transition-all cursor-default">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Attendance & Awards</h4>
                      <p className="text-sm text-slate-500 mt-0.5 font-medium">Track your daily progress easily.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative floating element */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl shadow-indigo-100 border border-slate-100 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-xl">A+</span>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold">Latest Grade</div>
                    <div className="text-sm font-extrabold text-slate-900 notranslate">Mathematics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
