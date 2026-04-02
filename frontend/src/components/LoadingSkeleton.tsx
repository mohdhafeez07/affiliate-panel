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

const CHART_BAR_HEIGHTS = [45, 62, 38, 72, 55, 88, 48, 66, 52, 78, 42, 58];

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse h-full min-h-[240px] w-full bg-slate-800/15 rounded-lg flex items-end justify-around p-3 gap-1.5">
      {CHART_BAR_HEIGHTS.map((pct, i) => (
        <div key={i} className="bg-slate-800/45 w-full rounded-t-md" style={{ height: `${pct}%` }} />
      ))}
    </div>
  );
};
