import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon: Icon = Inbox }) => {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center py-10 sm:py-12 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-cyber-text-muted mb-3">
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <h3 className="text-sm font-semibold text-cyber-text-primary tracking-tight">{title}</h3>
      <p className="text-cyber-text-secondary text-sm max-w-sm mt-1.5 leading-relaxed">{description}</p>
    </div>
  );
};

export default EmptyState;
