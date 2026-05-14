import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ChevronRight size={14} className="text-slate-300 mx-1.5" />}

            {item.current ? (
              <span className="text-slate-900 font-extrabold px-2 py-1" aria-current="page">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                to={item.href}
                className="text-slate-400 hover:text-indigo-600 transition-colors font-bold px-2 py-1 rounded-lg hover:bg-indigo-50"
              >
                {index === 0 && <Home size={14} className="inline mr-1.5 -mt-0.5" />}
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-400 font-bold px-2 py-1">
                {index === 0 && <Home size={14} className="inline mr-1.5 -mt-0.5" />}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}