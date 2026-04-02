import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: 'blue' | 'purple' | 'emerald' | 'rose' | 'amber';
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color = 'blue', isLoading }) => {
  if (isLoading) {
    return (
      <div className="stat-card animate-pulse bg-white/5 border-white/10">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 bg-white/5 rounded-lg"></div>
          <div className="w-14 h-5 bg-white/5 rounded-full"></div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <div className="h-3 bg-white/5 rounded w-2/5"></div>
          <div className="h-8 bg-white/5 rounded w-3/5"></div>
        </div>
      </div>
    );
  }

  const getColorClasses = () => {
    switch (color) {
      case 'purple': return { text: 'text-cyber-purple', bg: 'bg-cyber-purple/10', border: 'hover:border-cyber-purple/50', icon: 'text-cyber-purple', glow: 'shadow-cyber-purple' };
      case 'emerald': return { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'hover:border-emerald-400/50', icon: 'text-emerald-400', glow: 'shadow-[0_0_20px_-5px_rgba(52,211,153,0.3)]' };
      case 'rose': return { text: 'text-rose-400', bg: 'bg-rose-400/10', border: 'hover:border-rose-400/50', icon: 'text-rose-400', glow: 'shadow-[0_0_20px_-5px_rgba(251,113,133,0.3)]' };
      case 'amber': return { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'hover:border-amber-400/50', icon: 'text-amber-400', glow: 'shadow-[0_0_20px_-5px_rgba(251,191,36,0.3)]' };
      default: return { text: 'text-cyber-blue', bg: 'bg-cyber-blue/10', border: 'hover:border-cyber-blue/50', icon: 'text-cyber-blue', glow: 'shadow-cyber-blue' };
    }
  };

  const palette = getColorClasses();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`stat-card relative overflow-hidden group ${palette.border}`}
    >
      <div className={`absolute -right-3 -top-3 w-20 h-20 rounded-full opacity-[0.08] blur-2xl transition-opacity group-hover:opacity-[0.14] ${palette.bg.replace('/10', '')}`} />
      
      <div className="flex justify-between items-start relative z-10 gap-2">
        <div className={`p-2.5 rounded-lg ${palette.bg} border border-white/5 ${palette.glow} transition-transform duration-300 group-hover:scale-[1.03]`}>
          <Icon size={20} className={palette.icon} strokeWidth={2} />
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md backdrop-blur-md border text-[10px] font-semibold uppercase tracking-wide ${trend.isUp ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
            <span>{trend.isUp ? '↑' : '↓'}</span>
            <span>{trend.value}%</span>
          </div>
        )}
      </div>

      <div className="mt-4 relative z-10">
        <h3 className="text-[10px] sm:text-xs font-semibold text-cyber-text-secondary uppercase tracking-wide mb-1">{title}</h3>
        <p className="text-xl sm:text-2xl font-bold font-outfit tracking-tight text-white tabular-nums">{value}</p>
      </div>

      <div className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 ${palette.bg.replace('/10', '')}`} />
    </motion.div>
  );
};

export default StatCard;
