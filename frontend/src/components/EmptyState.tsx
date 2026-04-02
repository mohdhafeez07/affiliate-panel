import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon: Icon = Inbox }) => {
  return (
    <div className="card flex flex-col items-center justify-center py-12 px-4 text-center border-dashed">
      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-dark-muted mb-4 opacity-50">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-semibold text-dark-text tracking-tight">{title}</h3>
      <p className="text-dark-muted max-w-sm mt-2">{description}</p>
    </div>
  );
};

export default EmptyState;
