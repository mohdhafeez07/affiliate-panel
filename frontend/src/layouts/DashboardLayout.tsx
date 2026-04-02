import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  UserPlus, 
  Wallet, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Menu, 
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Referral & Funnel', path: '/referral', icon: UserPlus },
    { name: 'Earnings', path: '/earnings', icon: Wallet },
    { name: 'Payouts', path: '/payouts', icon: CreditCard },
    { name: 'Marketing Assets', path: '/assets', icon: ImageIcon },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-text-primary flex font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[min(100%,17rem)] sm:w-64 bg-cyber-deep/80 backdrop-blur-2xl border-r border-cyber-border/50 transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col min-h-0">
          {/* Logo Section */}
          <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-cyber-border/30">
            <div className="relative group shrink-0">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 bg-cyber-black border border-cyber-blue/30 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-lg sm:text-xl font-bold font-outfit bg-clip-text text-transparent bg-gradient-to-br from-cyber-blue to-cyber-purple">AG</span>
              </div>
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-lg font-bold font-outfit tracking-tight block leading-tight truncate">Affiliate</span>
              <span className="text-[10px] font-semibold text-cyber-blue uppercase tracking-wider mt-0.5 block">Panel</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto min-h-0">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  group relative flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20' 
                    : 'text-cyber-text-secondary hover:bg-white/5 hover:text-cyber-text-primary border border-transparent'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <item.icon size={18} className={`shrink-0 transition-transform duration-200 ${isActive ? 'text-cyber-blue' : ''}`} />
                      <span className="font-medium text-xs sm:text-sm truncate">{item.name}</span>
                    </div>
                    {isActive && (
                      <motion.div layoutId="active-nav" className="absolute right-0 w-1 h-6 bg-cyber-blue rounded-l-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                    )}
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-50 transition-all transform group-hover:translate-x-1" />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Section / Bottom */}
          <div className="p-3 sm:p-4 border-t border-cyber-border/30 bg-cyber-black/20">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-cyber-rose hover:bg-cyber-rose/10 rounded-lg transition-all duration-200 group text-xs font-semibold uppercase tracking-wide border border-transparent hover:border-cyber-rose/20"
            >
              <div className="flex items-center gap-2 min-w-0">
                <LogOut size={16} className="shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                <span className="truncate">Log out</span>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 h-screen relative">
        {/* Header */}
        <header className="h-14 sm:h-16 shrink-0 bg-cyber-black/40 backdrop-blur-xl border-b border-cyber-border/30 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              type="button"
              aria-label="Open menu"
              className="lg:hidden p-2 bg-white/5 border border-white/10 rounded-lg text-cyber-text-primary hover:bg-cyber-blue/10 hover:text-cyber-blue transition-colors shrink-0" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0 hidden lg:block">
              <span className="text-[10px] font-semibold text-cyber-blue uppercase tracking-wider opacity-80">Dashboard</span>
              <h1 className="text-base sm:text-lg font-bold font-outfit tracking-tight truncate">
                Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
              </h1>
            </div>
            <div className="lg:hidden min-w-0 flex-1">
              <p className="text-sm font-semibold font-outfit truncate">Affiliate Panel</p>
              <p className="text-[10px] text-cyber-text-secondary truncate">{user?.name ?? ' '}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="hidden sm:flex flex-col items-end min-w-0">
              <span className="text-[10px] font-medium uppercase tracking-wide text-cyber-text-secondary">Signed in</span>
              <span className="text-sm font-semibold text-cyber-text-primary truncate max-w-[10rem]">{user?.name ?? '—'}</span>
            </div>
            <div
              className="relative rounded-full bg-cyber-deep border border-cyber-blue/25 flex items-center justify-center font-semibold text-cyber-blue text-sm w-9 h-9 sm:w-10 sm:h-10"
              title={user?.name ?? undefined}
            >
              {(user?.name?.charAt(0) ?? '?').toUpperCase()}
            </div>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10 min-h-0">
          <div className="p-4 sm:p-6 lg:px-8 lg:py-6 max-w-6xl xl:max-w-7xl mx-auto w-full min-h-full">
            <Outlet />
          </div>
        </div>

        {/* Global UI Decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      </main>
    </div>
  );
};

export default DashboardLayout;
