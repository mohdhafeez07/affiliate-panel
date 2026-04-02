import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  CreditCard, 
  History, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight
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
      setError('Insufficient balance for this withdrawal.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/payout/request', { amount: Number(amount) });
      setSuccess('Payout request submitted successfully!');
      setAmount('');
      fetchData(); // Refresh balance and history
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit payout request.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <div className="flex items-center space-x-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 size={14} />
            <span>Approved</span>
          </div>
        );
      case 'REJECTED':
        return (
          <div className="flex items-center space-x-2 text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <XCircle size={14} />
            <span>Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Clock size={14} />
            <span>Pending</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit tracking-tight">Payout Requests</h2>
          <p className="text-dark-muted mt-1 font-medium italic">Withdraw your earnings securely to your preferred method</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Form */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2.5 bg-primary-600/10 text-primary-500 rounded-xl">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-bold font-outfit">Withdraw Funds</h3>
            </div>

            <div className="bg-slate-900/50 border border-dark-border p-6 rounded-2xl mb-8">
              <p className="text-dark-muted text-xs uppercase tracking-widest font-bold">Available Balance</p>
              <p className="text-4xl font-bold font-outfit mt-2 text-primary-500">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm flex items-center space-x-2">
                  <AlertCircle size={18} />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-sm flex items-center space-x-2">
                  <CheckCircle2 size={18} />
                  <span className="font-medium">{success}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-2 ml-1">Withdrawal Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted font-bold">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-dark-border rounded-xl py-4 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-outfit text-xl"
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || balance <= 0}
                className="w-full btn-primary py-4 flex items-center justify-center space-x-2 text-lg shadow-xl"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <Send size={20} />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </form>
            
            <p className="mt-6 text-xs text-dark-muted italic text-center">
              Processing time: 24-48 Business Hours • Min. withdrawal: $50.00
            </p>
          </div>
        </div>

        {/* Payout History */}
        <div className="lg:col-span-2">
          <div className="card h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
                  <History size={24} />
                </div>
                <h3 className="text-xl font-bold font-outfit">Transaction History</h3>
              </div>
            </div>

            <div className="flex-1">
              {loading ? (
                <TableSkeleton rows={5} />
              ) : payouts.length > 0 ? (
                <div className="space-y-4">
                  {payouts.map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-4 bg-slate-900/30 border border-dark-border rounded-2xl hover:border-slate-700 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${payout.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-dark-muted'}`}>
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-lg font-outfit">${Number(payout.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                          <p className="text-xs text-dark-muted font-medium">Requested: {new Date(payout.requestedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(payout.status)}
                        {payout.approvedAt && (
                          <p className="text-[10px] text-dark-muted mt-1 uppercase font-bold tracking-tighter">Paid on {new Date(payout.approvedAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  title="No payout history" 
                  description="Your withdrawal requests will appear here once submitted." 
                  icon={History} 
                />
              )}
            </div>

            {/* Pagination Pagination */}
            {!loading && meta && meta.totalPages > 1 && (
              <div className="mt-8 pt-6 border-t border-dark-border flex items-center justify-between">
                 <p className="text-xs text-dark-muted italic">Page {page} of {meta.totalPages}</p>
                 <div className="flex space-x-2">
                    <button 
                      onClick={() => setPage(prev => Math.max(1, prev - 1))}
                      disabled={page === 1}
                      className="p-2 bg-dark-border hover:bg-slate-700 disabled:opacity-30 rounded-lg transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={() => setPage(prev => Math.min(meta.totalPages, prev + 1))}
                      disabled={page === meta.totalPages}
                      className="p-2 bg-dark-border hover:bg-slate-700 disabled:opacity-30 rounded-lg transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutPage;
