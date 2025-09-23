import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  FolderSearch, 
  Activity, 
  Clock, 
  LogOut,
  Bell,
  Settings
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/appointments', icon: CalendarCheck },
    { name: 'Patient Directory', path: '/patients', icon: Users },
    { name: 'Case Review', path: '/health-records', icon: FolderSearch },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f1f5f9] font-sans selection:bg-indigo-100">
      {/* Sidebar - Professional Industrial Design */}
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0 hidden md:flex z-30 shadow-2xl">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Activity className="text-white" size={18} />
            </div>
            <span className="font-black text-sm tracking-[0.1em] text-white uppercase">Gramin<span className="text-indigo-400">Swasthya</span></span>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-bold' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-indigo-300'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                  <span className="text-xs tracking-wide uppercase font-bold">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5 space-y-4">
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 font-bold text-xs uppercase tracking-widest transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar - Clean and High Density */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
              Region: South Asia / IND
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Shift</span>
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="text-right">
                <div className="text-xs font-black text-slate-900 uppercase tracking-tighter">Dr. {user?.full_name}</div>
                <div className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Certified Specialist</div>
              </div>
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xl ring-2 ring-indigo-50 shadow-indigo-100">
                {user?.full_name?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Main Work Area */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-8 custom-scrollbar">
          <div className="max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
