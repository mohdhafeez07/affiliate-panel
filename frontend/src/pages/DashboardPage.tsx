// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import StatCard from '../components/StatCard';
import { 
  MousePointer2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ChartSkeleton } from '../components/LoadingSkeleton';

interface DashboardStats {
  totalClicks?: number;
  totalRegistrations?: number;
  totalFirstDeposits?: number;
  totalEarnings?: number;
  pendingPayouts?: number;
  approvedPayouts?: number;
  balance?: number;
}

interface ChartRow {
  date: string;
  clicks?: number;
  deposits?: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/chart')
        ]);
        setStats(statsRes.data.data);
        setChartData(Array.isArray(chartRes.data.data) ? chartRes.data.data : []);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const kpis = [
    { title: 'Total clicks', value: stats?.totalClicks ?? 0, icon: MousePointer2, color: 'blue' as const },
    { title: 'Registrations', value: stats?.totalRegistrations ?? 0, icon: Users, color: 'purple' as const },
    { title: 'First deposits', value: stats?.totalFirstDeposits ?? 0, icon: TrendingUp, color: 'emerald' as const },
    { title: 'Total earnings', value: `$${(stats?.totalEarnings ?? 0).toLocaleString()}`, icon: DollarSign, color: 'amber' as const },
    { title: 'Pending payouts', value: `$${(stats?.pendingPayouts ?? 0).toLocaleString()}`, icon: Clock, color: 'rose' as const },
    { title: 'Approved payouts', value: `$${(stats?.approvedPayouts ?? 0).toLocaleString()}`, icon: CheckCircle2, color: 'emerald' as const },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  return (
    <div className="page-shell">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-cyber-blue shrink-0" />
            <span className="page-header-kicker">Overview</span>
          </div>
          <h2 className="page-title">Performance</h2>
          <p className="page-desc">Key metrics and trends for your affiliate activity.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 bg-cyber-deep/50 border border-white/5 py-2 px-3 rounded-lg text-xs text-cyber-emerald/90 font-medium shrink-0"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-emerald opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-emerald" />
          </span>
          Live data
        </motion.div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4"
      >
        {kpis.map((kpi, idx) => (
          <StatCard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            color={kpi.color}
            isLoading={loading}
          />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 min-w-0"
        >
          <div className="card h-full flex flex-col min-h-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-semibold font-outfit text-white">Conversion trend</h3>
                <p className="text-xs text-cyber-text-secondary mt-0.5">Last 7 days — clicks vs. deposits</p>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.03] px-2.5 py-1.5 rounded-lg border border-white/5 text-[10px] font-medium uppercase tracking-wide shrink-0">
                <span className="flex items-center gap-1.5 text-cyber-blue">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue shadow-[0_0_6px_rgba(34,211,238,0.6)]" /> 
                  Clicks
                </span>
                <span className="flex items-center gap-1.5 text-cyber-emerald">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald shadow-[0_0_6px_rgba(16,185,129,0.6)]" /> 
                  Deposits
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex-1 min-h-[260px]">
                <ChartSkeleton />
              </div>
            ) : (
              <div className="flex-1 w-full min-h-[260px] h-[280px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.35} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      dy={6}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      width={36}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        borderColor: 'rgba(34, 211, 238, 0.2)', 
                        borderRadius: '10px', 
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 12px 24px -8px rgba(0, 0, 0, 0.5)',
                        borderWidth: '1px',
                        fontSize: '12px',
                      }}
                      labelStyle={{ color: '#94a3b8', fontSize: '11px' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                      cursor={{ stroke: '#22d3ee', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="#22d3ee" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorClicks)"
                      animationDuration={900}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="deposits" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorDeposits)"
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 min-w-0"
        >
          <div className="card flex flex-col border-t border-t-cyber-blue/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-cyber-blue/5 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-cyber-blue shrink-0" />
                <h3 className="text-sm font-semibold font-outfit text-white">Account balance</h3>
              </div>

              <div className="bg-cyber-deep/50 border border-white/5 p-4 rounded-xl">
                <p className="text-[10px] font-semibold text-cyber-text-secondary uppercase tracking-wide">Available</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-cyber-blue text-lg font-bold">$</span>
                  <p className="text-3xl sm:text-4xl font-bold font-outfit text-white tracking-tight tabular-nums">
                    {(stats?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <button 
                  type="button"
                  className="w-full btn-primary flex items-center justify-center gap-2 py-2.5"
                  onClick={() => navigate('/payouts')}
                >
                  <span>Request payout</span>
                  <ChevronRight size={16} strokeWidth={2} />
                </button>
                <button 
                  type="button"
                  className="w-full btn-secondary flex items-center justify-center gap-2 py-2.5 border-white/10"
                  onClick={() => navigate('/referral')}
                >
                  <span>Referral link</span>
                  <ChevronRight size={16} strokeWidth={2} />
                </button>
              </div>

              <div className="pt-4 border-t border-white/5">
                 <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[10px] font-semibold text-cyber-text-secondary uppercase tracking-wide">Tier progress</h4>
                    <span className="text-[10px] font-semibold text-cyber-emerald">Level 2</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="bg-gradient-to-r from-cyber-blue to-cyber-purple h-full rounded-full"
                      />
                   </div>
                   <span className="text-xs font-medium text-white/90 tabular-nums w-8 text-right">85%</span>
                 </div>
                 <p className="text-[10px] text-cyber-text-muted mt-2 leading-snug">Next tier unlocks a higher revenue share.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
