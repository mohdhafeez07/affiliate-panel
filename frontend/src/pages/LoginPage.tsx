import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2, Gamepad2 } from 'lucide-react';

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
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -right-20 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 -left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-2xl bg-primary-600/10 text-primary-500 mb-6 shadow-xl shadow-primary-900/20 border border-primary-500/20">
            <Gamepad2 size={40} />
          </div>
          <h1 className="text-3xl font-bold font-outfit uppercase tracking-tight">Affiliate<span className="text-primary-500">Panel</span></h1>
          <p className="text-dark-muted mt-2 font-medium">Online Gaming platform affiliate ecosystem</p>
        </div>

        <div className="card shadow-2xl border-white/5 bg-white/[0.02] backdrop-blur-xl">
          <h2 className="text-xl font-bold mb-6 text-center">Secure Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark-muted mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-dark-border rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all placeholder:text-slate-600"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-muted mb-1.5 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-dark-border rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3.5 flex items-center justify-center space-x-2 text-lg shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-dark-muted">
            Don't have an affiliate account?{' '}
            <a href="#" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">Contact Support</a>
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center space-x-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
           {/* Placeholder for legal/gaming logos */}
           <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center font-bold text-xs">18+</div>
           <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center font-bold text-xs uppercase tracking-tighter">Secure</div>
           <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center font-bold text-xs uppercase tracking-tighter">Global</div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
