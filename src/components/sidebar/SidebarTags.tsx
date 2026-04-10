// src/components/sidebar/SidebarTags.tsx
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import { ArticleTag } from '../article/types';

interface Props {
  tags: ArticleTag[];
}

export default function SidebarTags({ tags }: Props) {
  const validTags = tags.filter(t => t && t.title);
  if (validTags.length === 0) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
      <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2 text-sm">
        <Tag className="w-4 h-4 text-violet-500" />
        Thématiques
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {validTags.map((tag) => (
          <Link
            key={tag._id}
            to={`/bibliotheque?tag=${tag.slug || tag._id}`}
            className="px-2.5 py-1 text-[10px] font-medium rounded-full transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: tag.color ? `${tag.color}15` : '#F3F4F6',
              color: tag.color || '#6B7280',
              border: `1px solid ${tag.color ? `${tag.color}30` : '#E5E7EB'}`
            }}
          >
            {tag.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
