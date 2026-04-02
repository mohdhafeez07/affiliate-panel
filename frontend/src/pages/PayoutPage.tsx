import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { 
  CreditCard, 
  History, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { TableSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const PayoutPage: React.FC = () => {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [payoutsRes, statsRes] = await Promise.all([
        api.get(`/payout/history?page=${page}&limit=5`),
        api.get('/dashboard/stats')
      ]);
      setPayouts(payoutsRes.data.data);
      setMeta(payoutsRes.data.meta);
      setBalance(statsRes.data.data.balance);
    } catch (error) {
      console.error('Failed to fetch payout data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    if (Number(amount) > balance) {
      setError('Amount exceeds your available balance.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/payout/request', { amount: Number(amount) });
      setSuccess('Payout request submitted.');
      setAmount('');
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not submit payout request.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusMap = {
    'APPROVED': { color: 'text-cyber-emerald', bg: 'bg-cyber-emerald/10', border: 'border-cyber-emerald/20', icon: CheckCircle2, text: 'Approved' },
    'REJECTED': { color: 'text-cyber-rose', bg: 'bg-cyber-rose/10', border: 'border-cyber-rose/20', icon: XCircle, text: 'Rejected' },
    'PENDING': { color: 'text-cyber-amber', bg: 'bg-cyber-amber/10', border: 'border-cyber-amber/20', icon: Clock, text: 'Pending' },
  };

  const getStatusBadge = (status: string) => {
    const config = statusMap[status as keyof typeof statusMap] || statusMap['PENDING'];
    const Icon = config.icon;
    return (
      <div className={`inline-flex items-center gap-1.5 ${config.color} ${config.bg} border ${config.border} px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide`}>
        <Icon size={12} strokeWidth={2.5} />
        <span>{config.text}</span>
      </div>
    );
  };

  return (
    <div className="page-shell">
      <motion.div 
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={14} className="text-cyber-blue shrink-0" />
            <span className="page-header-kicker">Payouts</span>
          </div>
          <h2 className="page-title">Withdrawals</h2>
          <p className="page-desc">Request a payout and review past transfers.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-1 min-w-0"
        >
          <div className="card border-t border-t-cyber-blue/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-blue/5 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="p-2 bg-cyber-blue/10 text-cyber-blue rounded-lg border border-cyber-blue/20 shrink-0">
                  <ArrowUpRight size={18} />
                </div>
                <h3 className="text-sm font-semibold font-outfit text-white">New request</h3>
              </div>

              <div className="bg-cyber-deep/50 border border-white/5 p-4 rounded-xl mb-5">
                <p className="text-[10px] font-semibold text-cyber-text-secondary uppercase tracking-wide">Available balance</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-cyber-blue text-lg font-bold">$</span>
                  <p className="text-3xl font-bold font-outfit text-white tracking-tight tabular-nums">
                    {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-cyber-rose/10 border border-cyber-rose/20 rounded-lg text-cyber-rose text-xs font-medium flex items-start gap-2"
                    >
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-cyber-emerald/10 border border-cyber-emerald/20 rounded-lg text-cyber-emerald text-xs font-medium flex items-start gap-2"
                    >
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                      <span>{success}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1.5">
                  <label htmlFor="payout-amount" className="block text-[10px] font-semibold text-cyber-text-secondary uppercase tracking-wide ml-0.5">Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-blue font-bold text-sm">$</span>
                    <input
                      id="payout-amount"
                      type="number"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-cyber-black/40 border border-white/5 rounded-lg py-2.5 pl-8 pr-3 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 focus:border-cyber-blue/50 transition-all font-outfit text-lg tabular-nums"
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={submitting || balance <= 0}
                  className="w-full btn-primary py-2.5 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Zap size={16} className="fill-current" />
                      <span>Submit request</span>
                    </>
                  )}
                </motion.button>
              </form>
              
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-[10px] text-cyber-text-muted text-center leading-relaxed">
                  Typical processing: 24–48 business hours · Minimum withdrawal $50
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 min-w-0"
        >
          <div className="card h-full flex flex-col border-t border-t-cyber-purple/40 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-cyber-purple/5 rounded-full blur-3xl -mb-24 -mr-24 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-4 flex-1 min-h-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-cyber-purple/10 text-cyber-purple rounded-lg border border-cyber-purple/20 shrink-0">
                  <History size={18} />
                </div>
                <h3 className="text-sm font-semibold font-outfit text-white">History</h3>
              </div>

              <div className="flex-1 space-y-2.5 min-h-0">
                {loading ? (
                  <TableSkeleton rows={4} />
                ) : payouts.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    {payouts.map((payout, idx) => (
                      <motion.div 
                        key={payout.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${payout.status === 'APPROVED' ? 'bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20' : 'bg-white/5 text-cyber-text-muted border border-white/5'}`}>
                            <CreditCard size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-lg font-semibold font-outfit text-white tabular-nums">
                              ${Number(payout.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-[10px] text-cyber-text-secondary font-medium uppercase tracking-wide mt-0.5">
                              Requested {new Date(payout.requestedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-1.5">
                          {getStatusBadge(payout.status)}
                          {payout.approvedAt && (
                            <p className="text-[9px] text-cyber-text-muted font-medium uppercase tracking-wide">
                              Settled {new Date(payout.approvedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="py-8 flex items-center justify-center">
                    <EmptyState 
                      title="No payouts yet" 
                      description="Your withdrawal requests will appear here." 
                      icon={History} 
                    />
                  </div>
                )}
              </div>

              {!loading && meta && meta.totalPages > 1 && (
                <div className="mt-auto pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                   <p className="text-[10px] font-medium text-cyber-text-secondary uppercase tracking-wide">Page {page} of {meta.totalPages}</p>
                   <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        disabled={page === 1}
                        className="p-2 bg-white/5 border border-white/10 hover:bg-cyber-purple/10 hover:text-cyber-purple disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPage(prev => Math.min(meta.totalPages, prev + 1))}
                        disabled={page === meta.totalPages}
                        className="p-2 bg-white/5 border border-white/10 hover:bg-cyber-purple/10 hover:text-cyber-purple disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                        aria-label="Next page"
                      >
                        <ChevronRight size={18} />
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PayoutPage;
