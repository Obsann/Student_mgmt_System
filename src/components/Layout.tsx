import { useState, ReactNode, useEffect } from "react";
import {
  GraduationCap,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface LayoutProps {
  children: (activePage: string) => ReactNode;
  navItems: NavItem[];
  roleLabel: string;
  roleColor?: string;
}

// ─── Avatar Component ────────────────────────────────────────────────────────
function Avatar({ name, size = 'md', className = '' }: { name?: string; size?: 'sm' | 'md' | 'lg'; className?: string; }) {
  const sizeClasses = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const initials = name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?';

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-extrabold shadow-sm ${className}`}>
      {initials}
    </div>
  );
}

export default function Layout({ children, navItems, roleLabel }: LayoutProps) {
  const { currentUser, logout } = useApp();
  const [activePage, setActivePage] = useState(navItems[0]?.id || "");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-indigo-500 selection:text-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Clean Modern Theme */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 border-r border-slate-100`}>
        <div className="p-6 h-full flex flex-col relative z-10">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900 font-extrabold text-xl leading-none tracking-tight">Kera</h1>
              <p className="text-indigo-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">High School</p>
            </div>
            <button className="ml-auto lg:hidden text-slate-400 hover:text-slate-900 bg-slate-50 p-1.5 rounded-lg" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info card */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
            <div className="flex items-center gap-3">
              <Avatar name={currentUser?.name} size="md" className="shadow-md shadow-indigo-200" />
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 font-extrabold text-sm truncate">{currentUser?.name}</p>
                <span className="inline-block mt-0.5 text-xs text-slate-500 font-semibold capitalize">
                  {roleLabel} Portal
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-2">Menu</div>

          {/* Nav Items */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Bottom actions */}
          <div className="pt-6 mt-6 border-t border-slate-100">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-bold"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-100">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border border-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:block animate-fade-in">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {navItems.find((n) => n.id === activePage)?.label || "Dashboard"}
                </h2>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              
              <div id="google_translate_header_target" className="hidden md:flex items-center"></div>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors relative border border-slate-100"
                >
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white animate-pulse" />
                </button>
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-fade-scale origin-top-right">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <h3 className="font-extrabold text-slate-900">Updates</h3>
                      <span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-widest bg-red-100 text-red-600">2 New</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <p className="text-sm text-slate-800 font-bold group-hover:text-indigo-600 transition-colors">Term 2 Grading Period Open</p>
                        <span className="text-xs text-slate-400 mt-1 block font-medium">1 hour ago</span>
                      </div>
                      <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <p className="text-sm text-slate-800 font-bold group-hover:text-indigo-600 transition-colors">New assignment posted in Biology</p>
                        <span className="text-xs text-slate-400 mt-1 block font-medium">3 hours ago</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="relative border-l border-slate-200 pl-2 sm:pl-4">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-50 transition-colors"
                >
                  <Avatar name={currentUser?.name} size="sm" />
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-extrabold text-slate-900 leading-none">{currentUser?.name}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block ml-1" />
                </button>
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-fade-scale origin-top-right">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                      <div className="font-extrabold text-slate-900">{currentUser?.name}</div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">{currentUser?.username}</div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setActivePage("profile");
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-2xl transition-colors font-bold"
                      >
                        <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600"><GraduationCap className="w-4 h-4" /></div>
                        My Profile
                      </button>
                      <div className="h-px bg-slate-100 my-1 mx-2" />
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-2xl transition-colors font-bold"
                      >
                        <div className="p-1.5 bg-red-100 rounded-lg text-red-600"><LogOut className="w-4 h-4" /></div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8 flex-1 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            {children(activePage)}
          </div>
        </main>
      </div>
    </div>
  );
}
