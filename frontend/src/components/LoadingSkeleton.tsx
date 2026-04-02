import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-slate-800 rounded w-full"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <div className="h-12 bg-slate-800/50 rounded flex-1"></div>
          <div className="h-12 bg-slate-800/50 rounded flex-1"></div>
          <div className="h-12 bg-slate-800/50 rounded flex-1"></div>
          <div className="h-12 bg-slate-800/50 rounded flex-1"></div>
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse h-[300px] w-full bg-slate-800/20 rounded-xl flex items-end justify-around p-4 space-x-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bg-slate-800/40 w-full rounded-t-lg" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
      ))}
    </div>
  );
};
