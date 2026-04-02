// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatCard from '../components/StatCard';
import { 
  MousePointer2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  ChevronRight
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

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
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
        setChartData(chartRes.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const kpis = [
    { title: 'Total Clicks', value: stats?.totalClicks || 0, icon: MousePointer2, color: 'blue' },
    { title: 'Registrations', value: stats?.totalRegistrations || 0, icon: Users, color: 'indigo' },
    { title: 'First Deposits', value: stats?.totalFirstDeposits || 0, icon: TrendingUp, color: 'green' },
    { title: 'Total Earnings', value: `$${stats?.totalEarnings?.toLocaleString() || 0}`, icon: DollarSign, color: 'yellow' },
    { title: 'Pending Payouts', value: `$${stats?.pendingPayouts?.toLocaleString() || 0}`, icon: Clock, color: 'red' },
    { title: 'Approved Payouts', value: `$${stats?.approvedPayouts?.toLocaleString() || 0}`, icon: CheckCircle2, color: 'emerald' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit tracking-tight">Overview</h2>
          <p className="text-dark-muted mt-1 font-medium italic">Track your performance and earnings at a glance</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-dark-card border border-dark-border py-2 px-4 rounded-xl shadow-lg">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500/80">Live Performance</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <StatCard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            isLoading={loading}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card h-full min-h-[450px]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold font-outfit">Conversion Trend</h3>
                <p className="text-sm text-dark-muted">Daily performance for the last 7 days</p>
              </div>
              <div className="flex items-center space-x-2 text-xs font-medium">
                <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-primary-500"></span> <span>Clicks</span></span>
                <span className="flex items-center space-x-1 ml-3"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> <span>Deposits</span></span>
              </div>
            </div>

            {loading ? (
              <ChartSkeleton />
            ) : (
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                      itemStyle={{ fontSize: '13px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="#0ea5e9" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorClicks)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="deposits" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorDeposits)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Recent Funnel Stats */}
        <div className="space-y-6">
          <div className="card h-full flex flex-col">
            <h3 className="text-xl font-bold font-outfit mb-6">Available Balance</h3>
            <div className="bg-slate-900/50 border border-dark-border p-6 rounded-2xl mb-6">
              <p className="text-dark-muted text-sm uppercase tracking-widest font-semibold">Total Funds</p>
              <p className="text-4xl font-bold font-outfit mt-2 text-primary-500">${stats?.balance?.toLocaleString() || '0.00'}</p>
            </div>
            
            <div className="space-y-4 flex-1">
              <button 
                className="w-full btn-primary py-4 text-center text-lg shadow-xl"
                onClick={() => navigate('/payouts')}
              >
                Request Payout
              </button>
              <button 
                className="w-full btn-secondary py-4 text-center text-lg"
                onClick={() => navigate('/referral')}
              >
                Generate Link
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-dark-border">
               <h4 className="font-bold text-sm text-dark-muted uppercase tracking-widest mb-4">Account Health</h4>
               <div className="flex items-center space-x-3 mb-2">
                 <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[85%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                 </div>
                 <span className="text-xs font-bold text-emerald-500">85%</span>
               </div>
               <p className="text-[10px] text-dark-muted italic">Tier 2 Affiliate • Commission: 10% Flat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
