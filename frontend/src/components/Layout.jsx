import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  UserRound, 
  Calendar, 
  FileText, 
  Sparkles, 
  ShoppingBag, 
  LogOut,
  Bell,
  Search,
  Globe
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Specialists', path: '/doctors', icon: UserRound },
    { name: 'Timeline', path: '/appointments', icon: Calendar },
    { name: 'Health Vault', path: '/health-records', icon: FileText },
    { name: 'AI Assistant', path: '/ai-remedies', icon: Sparkles },
    { name: 'Medical Shop', path: '/shop', icon: ShoppingBag },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans">
      {/* Left Sidebar - Premium Design */}
      <aside className="w-72 border-r border-slate-200/60 bg-white flex flex-col shrink-0 hidden lg:flex z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-10 group cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-800">Gramin<span className="text-blue-600">Swasthya</span></span>
          </div>
          
          <nav className="space-y-1.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Main Menu</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 font-bold' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'group-hover:text-blue-600'} />
                  <span className="text-sm tracking-wide">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-50">
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 font-bold text-sm transition-all duration-300 group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar - Glassmorphism */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-10 shrink-0 z-20">
          <div className="flex-1 max-w-xl relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search health records, doctors..." 
              className="w-full pl-12 pr-4 py-2.5 bg-slate-100/50 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full cursor-pointer hover:bg-slate-200 transition-colors">
              <Globe size={14} className="text-slate-500" />
              <select 
                className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer"
                defaultValue={localStorage.getItem('lang') || 'en'}
                onChange={(e) => {
                  localStorage.setItem('lang', e.target.value);
                  window.location.reload();
                }}
              >
                <option value="en">EN</option>
                <option value="hi">HI</option>
                <option value="pa">PA</option>
              </select>
            </div>

            <div className="relative cursor-pointer text-slate-400 hover:text-blue-600 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-slate-800 tracking-tight">{user?.full_name}</div>
                <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Premium Patient</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-200 ring-4 ring-white">
                {user?.full_name?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-slide-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
