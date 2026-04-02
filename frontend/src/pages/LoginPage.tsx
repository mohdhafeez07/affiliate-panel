import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2, Gamepad2, Zap, ShieldCheck } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('affiliate@test.com');
  const [password, setPassword] = useState('Password@123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-cyber-black relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 -right-16 w-[min(420px,90vw)] h-[min(420px,90vw)] bg-cyber-blue/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 -left-16 w-[min(420px,90vw)] h-[min(420px,90vw)] bg-cyber-purple/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.45)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_45%,#000_72%,transparent_100%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-[400px] w-full relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-flex relative group mb-5"
          >
            <div className="absolute -inset-1.5 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300" />
            <div className="relative p-4 rounded-xl bg-cyber-deep border border-cyber-blue/30 text-cyber-blue shadow-lg">
              <Gamepad2 size={36} className="drop-shadow-[0_0_8px_rgba(34,211,238,0.45)]" />
            </div>
          </motion.div>
          
          <h1 className="text-2xl sm:text-3xl font-bold font-outfit tracking-tight text-white">
            Affiliate<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-cyber-purple">Panel</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
             <Zap size={12} className="text-cyber-blue shrink-0" />
             <p className="text-[11px] font-medium uppercase tracking-widest text-cyber-text-secondary">Sign in</p>
          </div>
        </div>

        <div className="card border-white/5 bg-cyber-deep/50 backdrop-blur-xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-blue/40 to-transparent" />
          
          <div className="flex items-center justify-between gap-3 mb-6">
            <h2 className="text-sm font-semibold text-white/95">Welcome back</h2>
            <ShieldCheck size={18} className="text-cyber-emerald shrink-0" aria-hidden />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-cyber-rose/10 border border-cyber-rose/20 rounded-lg text-cyber-rose text-xs font-medium text-center"
                  role="alert"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-[10px] font-semibold text-cyber-text-secondary uppercase tracking-wide ml-0.5">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-text-muted group-focus-within:text-cyber-blue transition-colors pointer-events-none" size={16} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cyber-black/40 border border-white/5 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 focus:border-cyber-blue/45 transition-all placeholder:text-cyber-text-muted/45"
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-[10px] font-semibold text-cyber-text-secondary uppercase tracking-wide ml-0.5">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-text-muted group-focus-within:text-cyber-blue transition-colors pointer-events-none" size={16} />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-cyber-black/40 border border-white/5 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 focus:border-cyber-blue/45 transition-all placeholder:text-cyber-text-muted/45"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-2.5 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Zap size={16} className="fill-current" />
                  <span>Sign in</span>
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-[10px] font-medium text-cyber-text-muted uppercase tracking-wide">
            Need access?{' '}
            <a href="#" className="text-cyber-blue hover:text-white transition-colors">Contact your manager</a>
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[10px] text-cyber-text-muted/80"
        >
           <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md font-medium">Secure session</span>
           <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md font-medium">18+</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
