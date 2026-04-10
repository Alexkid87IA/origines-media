// src/components/sidebar/SidebarShare.tsx
import { Share2, Link2, Check } from 'lucide-react';
import { ShareButton } from '../article/types';

interface Props {
  shareButtons: ShareButton[];
  onShare: (id: string) => void;
  title: string;
  copySuccess: boolean;
}

export default function SidebarShare({ shareButtons, onShare, title, copySuccess }: Props) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
      <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2 text-sm">
        <Share2 className="w-4 h-4 text-violet-500" />
        Partager
      </h4>
      <div className="grid grid-cols-4 gap-2">
        {shareButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => onShare(btn.id)}
            className="flex items-center justify-center w-full aspect-square rounded-xl bg-white border border-gray-200 text-gray-500 transition-all duration-300 hover:border-transparent hover:text-white hover:scale-105"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = btn.color;
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'transparent';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#6B7280';
              e.currentTarget.style.borderColor = '#E5E7EB';
            }}
            title={btn.label}
          >
            <btn.icon />
          </button>
        ))}
        {/* Threads */}
        <button
          onClick={() => window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(title)} ${encodeURIComponent(window.location.href)}`, '_blank')}
          className="flex items-center justify-center w-full aspect-square rounded-xl bg-white border border-gray-200 text-gray-500 transition-all duration-300 hover:bg-black hover:text-white hover:border-transparent hover:scale-105"
          title="Threads"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.022.942-.783 2.264-1.217 3.727-1.223h.036c1.26.005 2.378.296 3.322.864.376.226.706.493.99.796.03-.317.043-.636.036-.957-.05-2.358-.756-4.022-2.098-4.942-1.135-.778-2.704-1.18-4.663-1.194-.964.008-1.87.1-2.694.28l-.485-1.947c.985-.216 2.07-.326 3.227-.334 2.431.018 4.396.567 5.844 1.632 1.72 1.266 2.614 3.394 2.674 6.33.003.165.003.33-.001.495.404.252.773.546 1.106.88 1.01 1.016 1.674 2.37 1.885 3.878.257 1.838-.168 3.878-1.282 5.28-1.692 2.131-4.381 3.31-7.57 3.322zm-1.25-8.063c-.06 0-.12.001-.18.003-1.347.06-2.28.537-2.547 1.303-.13.372-.12.784.028 1.16.242.615.857 1.108 1.739 1.392.525.168 1.09.244 1.678.224 1.073-.057 1.896-.453 2.449-1.178.476-.625.78-1.487.902-2.565-.724-.383-1.578-.586-2.534-.59h-.036c-.51.001-1.003.083-1.5.25z"/>
          </svg>
        </button>
        {/* Copy Link */}
        <button
          onClick={() => onShare('copy')}
          className="flex items-center justify-center w-full aspect-square rounded-xl bg-white border border-gray-200 text-gray-500 transition-all duration-300 hover:bg-violet-500 hover:text-white hover:border-transparent hover:scale-105"
          title="Copier le lien"
        >
          {copySuccess ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
