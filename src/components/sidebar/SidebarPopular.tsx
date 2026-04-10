// src/components/sidebar/SidebarPopular.tsx
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { PopularArticle } from '../article/types';

type ContentType = 'article' | 'video';

interface Props {
  items: PopularArticle[];
  contentType?: ContentType;
}

export default function SidebarPopular({ items, contentType = 'article' }: Props) {
  const validItems = items.filter(p => p && p.title);
  if (validItems.length === 0) return null;

  const basePath = contentType === 'video' ? '/video' : '/article';
  const altLabel = contentType === 'video' ? 'Vidéo populaire' : 'Article populaire';

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
      <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2 text-sm">
        <TrendingUp className="w-4 h-4 text-rose-500" />
        Les plus lus
      </h4>
      <div className="space-y-3">
        {validItems.slice(0, 4).map((pop, idx) => (
          <Link
            key={pop._id}
            to={`${basePath}/${pop.slug?.current || pop._id}`}
            className="group flex items-center gap-3"
          >
            <div className="relative flex-shrink-0">
              <img
                src={pop.imageUrl || '/placeholder.svg'}
                alt={pop.title || altLabel}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white text-[9px] font-bold shadow-sm">
                {idx + 1}
              </span>
            </div>
            <span className="text-gray-700 text-xs font-medium line-clamp-2 group-hover:text-rose-600 transition-colors flex-1">
              {pop.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
