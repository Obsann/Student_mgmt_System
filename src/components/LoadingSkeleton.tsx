import { ReactNode } from "react";

interface LoadingSkeletonProps {
  className?: string;
  children?: ReactNode;
}

export function LoadingSkeleton({ className = "", children }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {children || (
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      )}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="w-7 h-7 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="flex-1 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  );
}