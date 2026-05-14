import { ReactNode } from "react";

interface LoadingSkeletonProps {
  className?: string;
  children?: ReactNode;
}

export function LoadingSkeleton({ className = "", children }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {children || (
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded-full w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded-full w-1/2"></div>
          <div className="h-4 bg-slate-200 rounded-full w-5/6"></div>
        </div>
      )}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-6 rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-3 bg-slate-200 rounded-full w-20"></div>
          <div className="h-7 bg-slate-200 rounded-full w-14"></div>
        </div>
        <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-4 p-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4" style={{ opacity: 1 - i * 0.15 }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="flex-1 h-4 bg-slate-200 rounded-full"></div>
          ))}
        </div>
      ))}
    </div>
  );
}