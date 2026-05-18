import { useState, ReactNode, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { useApp } from "../contexts/AppContext";

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
}

interface LayoutProps {
  navItems: NavItem[];
  roleLabel: string;
  roleColor?: string;
}

// ─── Avatar Component ────────────────────────────────────────────────────────
function Avatar({ name, src, size = 'md', className = '' }: { name?: string; src?: string; size?: 'sm' | 'md' | 'lg'; className?: string; }) {
  const sizeClasses = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const initials = name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?';

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-extrabold shadow-sm overflow-hidden shrink-0 ${className}`}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

export default function Layout({ navItems, roleLabel }: LayoutProps) {
  const gradientClass = "from-indigo-600 to-indigo-700";
  const textClass = "text-indigo-600";
  const bgClass = "bg-indigo-50";
  const borderClass = "border-indigo-100";

  const { currentUser, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
      <aside className={`fixed top-0 left-0 h-full bg-white z-50 transform transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'} ${isCollapsed ? 'lg:w-20' : 'lg:w-72'} lg:translate-x-0 border-r border-slate-100`}>
        <div className="p-4 sm:p-6 h-full flex flex-col relative z-10 overflow-hidden">
          
          {/* Logo */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} mb-8 transition-all`}>
            <div className={`w-10 h-10 shrink-0 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center shadow-lg`}>
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in whitespace-nowrap">
                <h1 className="text-slate-900 font-extrabold text-xl leading-none tracking-tight notranslate">Kera</h1>
                <p className={`${textClass} text-[10px] font-bold uppercase tracking-widest mt-0.5 notranslate`}>High School</p>
              </div>
            )}
            <button className="ml-auto lg:hidden text-slate-400 hover:text-slate-900 bg-slate-50 p-1.5 rounded-lg shrink-0" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info card */}
          <div className={`bg-slate-50 rounded-2xl ${isCollapsed ? 'p-2 flex justify-center' : 'p-4'} mb-6 border border-slate-100 transition-all`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar name={currentUser?.name} src={currentUser?.avatar} size="md" className="shadow-md shadow-indigo-200" />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0 animate-fade-in whitespace-nowrap">
                  <p className="text-slate-900 font-extrabold text-sm truncate notranslate">{currentUser?.name}</p>
                  <span className={`inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest ${bgClass} ${textClass} border ${borderClass}`}>
                    {roleLabel}
                  </span>
                </div>
              )}
            </div>
          </div>

          {!isCollapsed && <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-2">Menu</div>}

          {/* Nav Items */}
          <nav className={`flex-1 space-y-1.5 overflow-y-auto ${isCollapsed ? 'px-0' : 'pr-2'} custom-scrollbar`}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/dashboard');
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} rounded-2xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-br ${gradientClass} text-white shadow-md shadow-indigo-200`
                      : `text-slate-500 hover:${bgClass} hover:${textClass}`
                  }`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {!isCollapsed && <span className="whitespace-nowrap animate-fade-in">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-4">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className={`hidden lg:flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} w-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors`}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen className="w-5 h-5"/> : <PanelLeftClose className="w-5 h-5"/>}
              {!isCollapsed && <span className="text-xs font-bold whitespace-nowrap">Collapse Menu</span>}
            </button>
            {!isCollapsed && (
              <div className="text-center animate-fade-in">
                <p className="text-xs text-slate-400 font-medium">Powered by OBN</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 flex flex-col min-h-screen ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
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
                  {navItems.find((n) => location.pathname === n.path || (location.pathname === '/' && n.path === '/dashboard'))?.label || "Dashboard"}
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
                      <span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-widest bg-gray-100 text-gray-600">0 New</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto p-8 text-center">
                      <p className="text-sm text-slate-500 font-medium">No new notifications</p>
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
                  <Avatar name={currentUser?.name} src={currentUser?.avatar} size="sm" />
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
                           navigate("/profile");
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
        <main className="p-4 md:p-6 lg:p-8 flex-1 animate-fade-in pb-16">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Footer Status Bar */}
        <div className={`h-10 bg-white border-t border-slate-200 text-[10px] sm:text-xs flex items-center px-4 sm:px-8 text-slate-400 font-mono justify-between fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${isCollapsed ? 'lg:left-20' : 'lg:left-72'}`}>
          <div className="hidden sm:block">KERA HIGH SCHOOL • JIMMA • 2025</div>
          <div className="font-bold text-slate-500">{roleLabel.toUpperCase()} PORTAL v4.2.1</div>
          <div>ETHIOPIAN MINISTRY OF EDUCATION</div>
        </div>
      </div>
    </div>
  );
}
