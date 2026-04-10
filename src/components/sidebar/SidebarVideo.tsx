// src/components/sidebar/SidebarVideo.tsx
import { Play } from 'lucide-react';

interface Props {
  videoUrl: string;
  imageUrl: string;
  title: string;
}

export default function SidebarVideo({ videoUrl, imageUrl, title }: Props) {
  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      <div className="relative aspect-video">
        <img
          src={imageUrl || '/placeholder.svg'}
          alt={`Miniature vidéo : ${title}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
          >
            <Play className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" />
          </a>
        </div>
      </div>
      <div className="p-3">
        <p className="text-white/70 text-[10px] font-medium">Voir en vidéo</p>
        <p className="text-white text-xs font-bold mt-0.5 line-clamp-1">{title}</p>
      </div>
    </div>
  );
}
