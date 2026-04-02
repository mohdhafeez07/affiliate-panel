import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color = 'primary', isLoading }) => {
  if (isLoading) {
    return (
      <div className="stat-card animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-slate-800 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-800 rounded w-1/4"></div>
      </div>
    );
  }

  const getBorderColor = () => {
    switch(color) {
      case 'green': return 'hover:border-emerald-500/50';
      case 'red': return 'hover:border-rose-500/50';
      case 'yellow': return 'hover:border-amber-500/50';
      default: return 'hover:border-primary-500/50';
    }
  };

  const getIconBg = () => {
    switch(color) {
      case 'green': return 'bg-emerald-500/10 text-emerald-500';
      case 'red': return 'bg-rose-500/10 text-rose-500';
      case 'yellow': return 'bg-amber-500/10 text-amber-500';
      default: return 'bg-primary-500/10 text-primary-500';
    }
  };

  return (
    <div className={`stat-card ${getBorderColor()}`}>
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${getIconBg()}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${trend.isUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {trend.isUp ? '+' : '-'}{trend.value}%
          </span>
        )}
      </div>
      <div>
        <p className="text-dark-muted font-medium text-sm mt-4 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold font-outfit mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
