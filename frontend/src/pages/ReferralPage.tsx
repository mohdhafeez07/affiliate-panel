import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  MousePointer2, 
  UserCheck, 
  ArrowRight,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

const ReferralPage: React.FC = () => {
  const [referral, setReferral] = useState<any>(null);
  const [funnel, setFunnel] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [refRes, funnelRes] = await Promise.all([
          api.get('/referral/link'),
          api.get('/referral/funnel')
        ]);
        setReferral(refRes.data.data);
        setFunnel(funnelRes.data.data);
      } catch (error) {
        console.error('Failed to fetch referral data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCopy = () => {
    if (referral?.referralLink) {
      navigator.clipboard.writeText(referral.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit tracking-tight">Referral Tracking</h2>
          <p className="text-dark-muted mt-1 font-medium italic">Manage your unique links and track conversion funnel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Referral Link Card */}
        <div className="card h-fit flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-primary-600/10 text-primary-500 rounded-xl">
                <ExternalLink size={24} />
              </div>
              <h3 className="text-xl font-bold font-outfit tracking-tight">Your Referral Link</h3>
            </div>
            
            <p className="text-dark-muted mb-6">
              Share this link with your audience to track clicks, registrations, and deposits.
            </p>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative flex items-center bg-slate-900 border border-dark-border rounded-xl p-1 shadow-2xl">
                <input 
                  type="text" 
                  readOnly 
                  value={referral?.referralLink || 'Generating link...'} 
                  className="bg-transparent flex-1 px-4 py-3 text-sm text-slate-200 focus:outline-none font-mono"
                />
                <button 
                  onClick={handleCopy}
                  className={`px-6 py-3 rounded-lg flex items-center space-x-2 font-bold transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/20'}`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 bg-slate-900/50 rounded-2xl border border-dark-border">
             <div className="flex justify-between items-center mb-4">
               <span className="text-xs font-bold text-dark-muted uppercase tracking-widest">Active Promo Code</span>
               <span className="text-xs font-bold text-primary-500 bg-primary-500/10 px-2.5 py-1 rounded-full">{referral?.referralCode || '...'}</span>
             </div>
             <p className="text-xs text-dark-muted italic">Tracking: 30-day Post-Click Attribution • Auto-Refresh Enabled</p>
          </div>
        </div>

        {/* Funnel Stats Card */}
        <div className="card h-fit">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold font-outfit tracking-tight">Conversion Funnel</h3>
          </div>

          {loading ? (
             <div className="space-y-8">
               {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-800 animate-pulse rounded-xl"></div>)}
             </div>
          ) : (
            <div className="space-y-10">
              {/* Funnel Step 1: Clicks */}
              <div className="relative pl-8 border-l-2 border-slate-800">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-dark-muted text-xs uppercase tracking-widest font-bold mb-1">Step 1: Traffic</p>
                    <p className="text-3xl font-bold font-outfit">{(funnel?.clicks || 0).toLocaleString()}</p>
                    <p className="text-sm font-medium text-dark-muted mt-1 italic">Total Link Clicks</p>
                  </div>
                  <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl">
                    <MousePointer2 size={24} />
                  </div>
                </div>
              </div>

              {/* Conversion Arrow 1 */}
              <div className="flex items-center justify-center -my-6 opacity-30">
                 <ArrowRight className="rotate-90" size={24} />
                 <span className="text-xs font-bold mx-2 uppercase tracking-tighter">{funnel?.conversions?.registrationRate}% Conversion</span>
              </div>

              {/* Funnel Step 2: Registrations */}
              <div className="relative pl-8 border-l-2 border-slate-800">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-dark-muted text-xs uppercase tracking-widest font-bold mb-1">Step 2: Signups</p>
                    <p className="text-3xl font-bold font-outfit">{(funnel?.registrations || 0).toLocaleString()}</p>
                    <p className="text-sm font-medium text-dark-muted mt-1 italic">Account Registrations</p>
                  </div>
                  <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                    <UserCheck size={24} />
                  </div>
                </div>
              </div>

              {/* Conversion Arrow 2 */}
              <div className="flex items-center justify-center -my-6 opacity-30">
                 <ArrowRight className="rotate-90" size={24} />
                 <span className="text-xs font-bold mx-2 uppercase tracking-tighter">{funnel?.conversions?.depositRate}% Conversion</span>
              </div>

              {/* Funnel Step 3: FTDs */}
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-dark-muted text-xs uppercase tracking-widest font-bold mb-1">Step 3: Deposits</p>
                    <p className="text-3xl font-bold font-outfit">{(funnel?.deposits || 0).toLocaleString()}</p>
                    <p className="text-sm font-medium text-dark-muted mt-1 italic">First Time Depositors (FTD)</p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                    <BarChart3 size={24} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;
