import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserPlus, 
  Wallet, 
  History, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  CreditCard
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
    <div className="min-h-screen bg-dark-bg flex">
      {/* Sidebar Sidebar Mobile */}
      <div className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-card border-r border-dark-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-900/40">
              <span className="text-xl font-bold font-outfit">AG</span>
            </div>
            <span className="text-xl font-bold font-outfit uppercase tracking-tight">Affiliate<span className="text-primary-500">Panel</span></span>
          </div>

          <nav className="flex-1 px-4 space-y-1 mt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary-600/10 text-primary-500 border border-primary-500/20 shadow-inner' : 'text-dark-muted hover:bg-slate-800 hover:text-slate-200'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-dark-border">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header Header */}
        <header className="h-16 bg-dark-card/50 backdrop-blur-xl border-b border-dark-border px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center">
            <button className="lg:hidden p-2 text-dark-muted" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold lg:block hidden">Welcome back, {user?.name}!</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-dark-muted">{user?.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-primary-500/20 flex items-center justify-center font-bold text-primary-500 shadow-inner">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
