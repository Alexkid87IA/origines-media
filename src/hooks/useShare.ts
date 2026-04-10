// src/hooks/useShare.ts
// Hook partagé pour le partage social (Article, Video, Portrait)

import { useState, useCallback } from 'react';

interface UseShareReturn {
  copySuccess: boolean;
  handleShare: (platform: string) => Promise<void>;
  handleCopyLink: () => Promise<void>;
}

export function useShare(title: string): UseShareReturn {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = useCallback(async (platform: string) => {
    const url = window.location.href;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Je voulais partager cet article avec toi : ' + url)}`;
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        break;
    }
  }, [title]);

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  }, []);

  return { copySuccess, handleShare, handleCopyLink };
}
