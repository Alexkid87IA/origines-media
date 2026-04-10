// src/components/sidebar/SidebarRelated.tsx
import { Link } from 'react-router-dom';
import { BookOpen, Play } from 'lucide-react';
import { RelatedArticle } from '../article/types';

type ContentType = 'article' | 'video';

interface Props {
  items: RelatedArticle[];
  contentType?: ContentType;
}

export default function SidebarRelated({ items, contentType = 'article' }: Props) {
  const validItems = items.filter(r => r && r.slug?.current);
  if (validItems.length === 0) return null;

  const basePath = contentType === 'video' ? '/video' : '/article';
  const label = contentType === 'video' ? 'À voir aussi' : 'À lire aussi';
  const altLabel = contentType === 'video' ? 'Vidéo connexe' : 'Article connexe';
  const Icon = contentType === 'video' ? Play : BookOpen;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
      <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2 text-sm">
        <Icon className="w-4 h-4 text-violet-500" />
        {label}
      </h4>
      <div className="space-y-3">
        {validItems.slice(0, 3).map((related) => (
          <Link
            key={related._id}
            to={`${basePath}/${related.slug.current}`}
            className="group flex gap-3"
          >
            <img
              src={related.imageUrl || '/placeholder.svg'}
              alt={related.titre || related.title || altLabel}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-100"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <h5 className="text-gray-900 text-xs font-medium line-clamp-2 group-hover:text-violet-600 transition-colors">
                {related.titre || related.title}
              </h5>
              {related.verticale && (
                <span className="text-[10px] text-gray-500 mt-0.5 block">{related.verticale.nom}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
