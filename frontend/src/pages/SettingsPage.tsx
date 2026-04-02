import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Lock, 
  Phone, 
  Mail, 
  Save, 
  Loader2, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: '', // Phone isn't in user object yet, usually fetched via profile
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await api.put('/settings/profile', profile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Change failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-bold font-outfit tracking-tight">Account Settings</h2>
        <p className="text-dark-muted mt-1 font-medium italic">Manage your profile information and security preferences</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center space-x-3 border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'} font-medium`}>
          {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="card h-fit">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2.5 bg-primary-600/10 text-primary-500 rounded-xl">
              <User size={24} />
            </div>
            <h3 className="text-xl font-bold font-outfit">Personal Profile</h3>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-900 border border-dark-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-2 ml-1">Email Address (Read Only)</label>
              <div className="relative opacity-60">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-slate-900 border border-dark-border rounded-xl py-3 pl-12 pr-4 text-slate-400 font-medium cursor-not-allowed"
                />
              </div>
            </div>

            <div>
               <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-2 ml-1">Phone Number</label>
               <div className="relative">
                 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
                 <input
                   type="tel"
                   value={profile.phone}
                   onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                   className="w-full bg-slate-900 border border-dark-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
                   placeholder="+1 (555) 000-0000"
                 />
               </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 flex items-center justify-center space-x-2 shadow-xl"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> <span>Save Changes</span></>}
            </button>
          </form>
        </div>

        {/* Security Card */}
        <div className="card h-fit">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold font-outfit">Security & Password</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-2 ml-1">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="w-full bg-slate-900 border border-dark-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-2 ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full bg-slate-900 border border-dark-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-2 ml-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="w-full bg-slate-900 border border-dark-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <button
               type="submit"
               disabled={loading}
               className="w-full btn-secondary py-3.5 flex items-center justify-center space-x-2 border border-dark-border hover:bg-indigo-600/10 hover:text-indigo-400 hover:border-indigo-500/20"
            >
               {loading ? <Loader2 className="animate-spin" size={20} /> : <><Lock size={20} /> <span>Update Password</span></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
