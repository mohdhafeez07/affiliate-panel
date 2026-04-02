import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  AlertCircle,
  Zap,
  Fingerprint,
  Key
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    phone: '', 
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user?.name) {
      setProfile((p) => ({ ...p, name: user.name }));
    }
  }, [user?.name]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await api.put('/settings/profile', profile);
      setMessage({ type: 'success', text: 'Profile updated.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not update profile.' });
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
      setMessage({ type: 'success', text: 'Password updated.' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not update password.' });
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-5xl page-shell">
      <motion.div 
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Fingerprint size={14} className="text-cyber-blue shrink-0" />
            <span className="page-header-kicker">Account</span>
          </div>
          <h2 className="page-title">Settings</h2>
          <p className="page-desc">Update your profile and manage password security.</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            className={`p-3 rounded-lg flex items-start gap-3 border text-xs font-medium ${
              message.type === 'success' 
                ? 'bg-cyber-emerald/10 border-cyber-emerald/25 text-cyber-emerald' 
                : 'bg-cyber-rose/10 border-cyber-rose/25 text-cyber-rose'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
      >
        <motion.div variants={item} className="card border-l-2 border-l-cyber-blue relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-cyber-blue/5 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none group-hover:bg-cyber-blue/10 transition-colors duration-500" />
          
          <div className="flex items-center gap-2.5 mb-5 relative z-10">
            <div className="p-2 bg-cyber-blue/10 text-cyber-blue rounded-lg border border-cyber-blue/20 shrink-0">
              <User size={18} />
            </div>
            <h3 className="text-sm font-semibold font-outfit text-white">Profile</h3>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <label htmlFor="profile-name" className="block text-[10px] font-semibold text-cyber-text-secondary uppercase tracking-wide ml-0.5">Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-text-muted group-focus-within:text-cyber-blue transition-colors pointer-events-none" size={16} />
                <input
                  id="profile-name"
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-cyber-black/40 border border-white/5 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 focus:border-cyber-blue/50 transition-all placeholder:text-cyber-text-muted/50"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-email" className="block text-[10px] font-semibold text-cyber-text-secondary uppercase tracking-wide ml-0.5">Email</label>
              <div className="relative opacity-60">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-text-muted pointer-events-none" size={16} />
                <input
                  id="profile-email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  readOnly
                  className="w-full bg-cyber-black/60 border border-white/5 rounded-lg py-2.5 pl-10 pr-3 text-sm text-cyber-text-muted font-medium cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
               <label htmlFor="profile-phone" className="block text-[10px] font-semibold text-cyber-text-secondary uppercase tracking-wide ml-0.5">Phone</label>
               <div className="relative group">
                 <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-text-muted group-focus-within:text-cyber-blue transition-colors pointer-events-none" size={16} />
                 <input
                   id="profile-phone"
                   type="tel"
                   value={profile.phone}
                   onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                   className="w-full bg-cyber-black/40 border border-white/5 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 focus:border-cyber-blue/50 transition-all"
                   placeholder="+1 (555) 000-0000"
                 />
               </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={16} /> <span>Save profile</span></>}
            </motion.button>
          </form>
        </motion.div>

        <motion.div variants={item} className="card border-l-2 border-l-cyber-purple relative overflow-hidden group">
          <div className="absolute bottom-0 right-0 w-28 h-28 bg-cyber-purple/5 rounded-full blur-3xl -mr-8 -mb-8 pointer-events-none group-hover:bg-cyber-purple/10 transition-colors duration-500" />
          
          <div className="flex items-center gap-2.5 mb-5 relative z-10">
            <div className="p-2 bg-cyber-purple/10 text-cyber-purple rounded-lg border border-cyber-purple/20 shrink-0">
              <ShieldCheck size={18} />
            </div>
            <h3 className="text-sm font-semibold font-outfit text-white">Security</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <label htmlFor="current-password" className="block text-[10px] font-semibold text-cyber-text-secondary uppercase tracking-wide ml-0.5">Current password</label>
              <div className="relative group">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-text-muted group-focus-within:text-cyber-purple transition-colors pointer-events-none" size={16} />
                <input
                  id="current-password"
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="w-full bg-cyber-black/40 border border-white/5 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyber-purple/20 focus:border-cyber-purple/50 transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            <div className="space-y-1.5">
              <label htmlFor="new-password" className="block text-[10px] font-semibold text-cyber-text-secondary uppercase tracking-wide ml-0.5">New password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-text-muted group-focus-within:text-cyber-purple transition-colors pointer-events-none" size={16} />
                <input
                  id="new-password"
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full bg-cyber-black/40 border border-white/5 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyber-purple/20 focus:border-cyber-purple/50 transition-all"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="block text-[10px] font-semibold text-cyber-text-secondary uppercase tracking-wide ml-0.5">Confirm new password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-text-muted group-focus-within:text-cyber-purple transition-colors pointer-events-none" size={16} />
                <input
                  id="confirm-password"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="w-full bg-cyber-black/40 border border-white/5 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyber-purple/20 focus:border-cyber-purple/50 transition-all"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <motion.button
               whileHover={{ scale: 1.01 }}
               whileTap={{ scale: 0.99 }}
               type="submit"
               disabled={loading}
               className="w-full btn-secondary text-white py-2.5 flex items-center justify-center gap-2 border-white/10 hover:bg-cyber-purple/10 hover:text-cyber-purple hover:border-cyber-purple/40 transition-colors duration-300"
            >
               {loading ? <Loader2 className="animate-spin" size={18} /> : <><Zap size={16} /> <span>Update password</span></>}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
