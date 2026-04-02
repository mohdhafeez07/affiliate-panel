import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Wallet, Filter, ChevronLeft, ChevronRight, FileDown } from 'lucide-react';
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit tracking-tight">Earnings History</h2>
          <p className="text-dark-muted mt-1 font-medium italic">Monitor your commission logs and revenue performance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="btn-secondary flex items-center space-x-2 py-2.5">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="btn-primary flex items-center space-x-2 py-2.5 shadow-xl">
            <FileDown size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <TableSkeleton rows={8} />
          ) : earnings.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-border bg-slate-800/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-dark-muted">Date</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-dark-muted">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-dark-muted">Commission %</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-dark-muted">Type</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-dark-muted">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {earnings.map((earning) => (
                  <tr key={earning.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 font-medium text-sm text-slate-300">
                      {new Date(earning.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-500 text-lg">
                      ${Number(earning.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-300">
                      <span className="bg-primary-500/10 text-primary-500 px-2.5 py-1 rounded-full">{earning.commissionPercentage}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-900 border border-dark-border rounded-lg text-xs font-bold tracking-tight uppercase">{earning.revenueType}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,1)]"></div>
                        <span className="text-sm font-bold text-emerald-500">Credited</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState 
              title="No earnings found" 
              description="You haven't generated any commissions yet. Start sharing your link to earn!" 
              icon={Wallet} 
            />
          )}
        </div>

        {/* Pagination Pagination */}
        {!loading && meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-dark-border bg-slate-800/30">
            <p className="text-xs text-dark-muted italic">Showing page {page} of {meta.totalPages}</p>
            <div className="flex space-x-2">
              <button 
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="p-2 bg-dark-border hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setPage(prev => Math.min(meta.totalPages, prev + 1))}
                disabled={page === meta.totalPages}
                className="p-2 bg-dark-border hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsPage;
