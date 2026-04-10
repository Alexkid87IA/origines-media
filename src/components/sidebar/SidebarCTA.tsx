// src/components/sidebar/SidebarCTA.tsx
import { Link } from 'react-router-dom';
import { PenLine, ArrowRight } from 'lucide-react';

export default function SidebarCTA() {
  return (
    <Link
      to="/racontez-votre-histoire"
      className="group block border border-gray-200 bg-white rounded-2xl p-4 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center group-hover:bg-violet-500 transition-colors">
          <PenLine className="w-5 h-5 text-violet-600 group-hover:text-white transition-colors" />
        </div>
        <div className="flex-1">
          <p className="text-gray-900 font-bold text-sm group-hover:text-violet-600 transition-colors">
            Racontez votre histoire
          </p>
          <p className="text-gray-500 text-[10px]">
            Partagez et inspirez
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}
