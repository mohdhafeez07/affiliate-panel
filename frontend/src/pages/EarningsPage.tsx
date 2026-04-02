import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Wallet, Filter, ChevronLeft, ChevronRight, FileDown, Activity, TrendingUp } from 'lucide-react';
import { TableSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const EarningsPage: React.FC = () => {
  const [earnings, setEarnings] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/earnings?page=${page}&limit=10`);
        setEarnings(response.data.data);
        setMeta(response.data.meta);
      } catch (error) {
        console.error('Failed to fetch earnings', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [page]);

  return (
    <div className="page-shell">
      <motion.div 
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity size={14} className="text-cyber-emerald shrink-0" />
            <span className="page-header-kicker text-cyber-emerald/90">Revenue</span>
          </div>
          <h2 className="page-title">Earnings</h2>
          <p className="page-desc">Commission history and verification status.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            type="button"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Filter size={16} className="text-cyber-blue" />
            <span>Filter</span>
          </button>
          <button 
            type="button"
            className="btn-primary inline-flex items-center gap-2"
          >
            <FileDown size={16} strokeWidth={2} />
            <span>Export</span>
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-0 overflow-hidden border-t border-t-cyber-blue/30"
      >
        <div className="overflow-x-auto -mx-px">
          {loading ? (
            <div className="p-4">
              <TableSkeleton rows={6} />
            </div>
          ) : earnings.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-cyber-deep/50 border-b border-white/5">
                  <th className="px-4 sm:px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-cyber-text-secondary">Date</th>
                  <th className="px-4 sm:px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-cyber-text-secondary">Amount</th>
                  <th className="px-4 sm:px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-cyber-text-secondary">Commission</th>
                  <th className="px-4 sm:px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-cyber-text-secondary">Type</th>
                  <th className="px-4 sm:px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-cyber-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                <AnimatePresence mode="popLayout">
                  {earnings.map((earning, idx) => (
                    <motion.tr 
                      key={earning.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 sm:px-5 py-3.5 align-top">
                        <span className="text-xs font-medium text-white/85 block">
                          {new Date(earning.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-cyber-text-muted mt-0.5 block">
                          {new Date(earning.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 align-top">
                        <div className="flex items-center gap-1.5">
                           <TrendingUp size={14} className="text-cyber-emerald shrink-0" />
                           <span className="text-base font-semibold font-outfit text-cyber-emerald tabular-nums">
                             ${Number(earning.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 align-top">
                        <span className="inline-flex items-center bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 text-[10px] font-semibold px-2 py-1 rounded-md">
                          {earning.commissionPercentage}%
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 align-top">
                        <span className="text-[10px] font-medium text-white/90 uppercase tracking-wide bg-white/5 border border-white/5 px-2 py-1 rounded-md inline-block max-w-[10rem] truncate" title={earning.revenueType}>
                          {earning.revenueType}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 align-top">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald shrink-0" />
                          <span className="text-[10px] font-medium text-cyber-emerald uppercase tracking-wide">Verified</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          ) : (
            <div className="py-12 px-4 bg-cyber-black/10">
              <EmptyState 
                title="No earnings yet" 
                description="Commissions will appear here once your referrals generate revenue." 
                icon={Wallet} 
              />
            </div>
          )}
        </div>

        {!loading && meta && meta.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-3 border-t border-white/5 bg-cyber-deep/25">
            <p className="text-[10px] font-medium text-cyber-text-secondary uppercase tracking-wide">Page {page} of {meta.totalPages}</p>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="p-2 bg-white/5 border border-white/10 hover:bg-cyber-blue/10 hover:text-cyber-blue disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                type="button"
                onClick={() => setPage(prev => Math.min(meta.totalPages, prev + 1))}
                disabled={page === meta.totalPages}
                className="p-2 bg-white/5 border border-white/10 hover:bg-cyber-blue/10 hover:text-cyber-blue disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EarningsPage;
