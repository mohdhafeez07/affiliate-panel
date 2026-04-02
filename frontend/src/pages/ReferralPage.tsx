import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { 
  Copy, 
  Check, 
  MousePointer2, 
  UserCheck, 
  ArrowRight,
  TrendingUp,
  BarChart3,
  Radio,
  Link2
} from 'lucide-react';
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 }
  };

  const regRate = funnel?.conversions?.registrationRate != null ? `${funnel.conversions.registrationRate}%` : '—';
  const depRate = funnel?.conversions?.depositRate != null ? `${funnel.conversions.depositRate}%` : '—';

  return (
    <div className="page-shell">
      <motion.div 
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio size={14} className="text-cyber-purple shrink-0" />
            <span className="page-header-kicker text-cyber-purple/90">Referrals</span>
          </div>
          <h2 className="page-title">Link & tracking</h2>
          <p className="page-desc">Share your referral link and review funnel performance.</p>
        </div>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
      >
        <motion.div variants={item} className="card flex flex-col border-l-2 border-l-cyber-blue">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 bg-cyber-blue/10 text-cyber-blue rounded-lg border border-cyber-blue/20 shrink-0">
                  <Link2 size={18} />
                </div>
                <h3 className="text-sm font-semibold font-outfit text-white">Your referral link</h3>
              </div>
              <span className="text-[10px] font-semibold text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-2 py-1 rounded-md uppercase tracking-wide shrink-0">
                Primary
              </span>
            </div>
            
            <p className="text-cyber-text-secondary text-sm mb-4 leading-relaxed">
              Use this link to attribute signups and deposits to your account.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-stretch">
              <div className="relative flex-1 min-w-0 rounded-lg border border-white/10 bg-cyber-black/50 px-3 py-2.5">
                <input 
                  type="text" 
                  readOnly 
                  value={referral?.referralLink || ''} 
                  placeholder={loading ? 'Loading…' : 'No link available'}
                  className="bg-transparent w-full text-xs text-white/90 focus:outline-none font-mono"
                />
              </div>
              <button 
                type="button"
                onClick={handleCopy}
                disabled={!referral?.referralLink}
                className={`shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors ${
                  copied 
                    ? 'bg-cyber-emerald text-cyber-black' 
                    : 'bg-cyber-blue text-cyber-black hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                {copied ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} strokeWidth={2} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="mt-5 p-4 bg-cyber-black/30 rounded-xl border border-white/5">
             <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold text-cyber-text-secondary uppercase tracking-wide">Referral code</span>
                <span className="text-xs font-mono font-semibold text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-2.5 py-1 rounded-md">
                  {referral?.referralCode || '—'}
                </span>
             </div>
             <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-3" />
             <p className="text-[10px] text-cyber-text-muted leading-relaxed">
               Attribution window: 30 days (standard). Contact support if you need a custom campaign link.
             </p>
          </div>
        </motion.div>

        <motion.div variants={item} className="card border-l-2 border-l-cyber-purple">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 bg-cyber-purple/10 text-cyber-purple rounded-lg border border-cyber-purple/20 shrink-0">
              <TrendingUp size={18} />
            </div>
            <h3 className="text-sm font-semibold font-outfit text-white">Funnel</h3>
          </div>

          {loading ? (
             <div className="space-y-3">
               {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 animate-pulse rounded-lg" />)}
             </div>
          ) : (
            <div className="space-y-6 relative">
              <div className="absolute left-[23px] top-4 bottom-4 w-px bg-gradient-to-b from-cyber-blue via-cyber-purple to-cyber-emerald opacity-25" />

              <div className="relative pl-10">
                <div className="absolute left-[18px] top-3 w-2.5 h-2.5 rounded-full bg-cyber-blue border-2 border-cyber-black shadow-[0_0_8px_rgba(34,211,238,0.6)] z-10" />
                <div className="flex justify-between gap-3 bg-white/[0.02] border border-white/5 p-3.5 rounded-lg">
                  <div className="min-w-0">
                    <p className="text-cyber-blue text-[10px] font-semibold uppercase tracking-wide mb-0.5">Clicks</p>
                    <p className="text-2xl font-bold font-outfit text-white tabular-nums">{(funnel?.clicks ?? 0).toLocaleString()}</p>
                    <p className="text-[10px] text-cyber-text-secondary mt-0.5">Traffic to your link</p>
                  </div>
                  <div className="p-2.5 bg-cyber-blue/10 text-cyber-blue rounded-lg border border-cyber-blue/20 shrink-0 self-start">
                    <MousePointer2 size={20} />
                  </div>
                </div>
              </div>

              <div className="flex justify-center -my-3 relative z-10">
                 <div className="bg-cyber-deep/90 backdrop-blur border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-medium text-white/90">
                    <ArrowRight className="rotate-90 text-cyber-purple" size={12} />
                    <span>{regRate} click → signup</span>
                 </div>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-[18px] top-3 w-2.5 h-2.5 rounded-full bg-cyber-purple border-2 border-cyber-black shadow-[0_0_8px_rgba(168,85,247,0.6)] z-10" />
                <div className="flex justify-between gap-3 bg-white/[0.02] border border-white/5 p-3.5 rounded-lg">
                  <div className="min-w-0">
                    <p className="text-cyber-purple text-[10px] font-semibold uppercase tracking-wide mb-0.5">Registrations</p>
                    <p className="text-2xl font-bold font-outfit text-white tabular-nums">{(funnel?.registrations ?? 0).toLocaleString()}</p>
                    <p className="text-[10px] text-cyber-text-secondary mt-0.5">Signups attributed</p>
                  </div>
                  <div className="p-2.5 bg-cyber-purple/10 text-cyber-purple rounded-lg border border-cyber-purple/20 shrink-0 self-start">
                    <UserCheck size={20} />
                  </div>
                </div>
              </div>

              <div className="flex justify-center -my-3 relative z-10">
                 <div className="bg-cyber-deep/90 backdrop-blur border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-medium text-white/90">
                    <ArrowRight className="rotate-90 text-cyber-emerald" size={12} />
                    <span>{depRate} signup → deposit</span>
                 </div>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-[18px] top-3 w-2.5 h-2.5 rounded-full bg-cyber-emerald border-2 border-cyber-black shadow-[0_0_8px_rgba(16,185,129,0.5)] z-10" />
                <div className="flex justify-between gap-3 bg-white/[0.02] border border-white/5 p-3.5 rounded-lg">
                  <div className="min-w-0">
                    <p className="text-cyber-emerald text-[10px] font-semibold uppercase tracking-wide mb-0.5">First deposits</p>
                    <p className="text-2xl font-bold font-outfit text-white tabular-nums">{(funnel?.deposits ?? 0).toLocaleString()}</p>
                    <p className="text-[10px] text-cyber-text-secondary mt-0.5">FTDs attributed</p>
                  </div>
                  <div className="p-2.5 bg-cyber-emerald/10 text-cyber-emerald rounded-lg border border-cyber-emerald/20 shrink-0 self-start">
                    <BarChart3 size={20} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ReferralPage;
