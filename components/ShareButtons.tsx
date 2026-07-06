'use client';

import React from 'react';
import { Twitter, Facebook, Linkedin, Link2 } from 'lucide-react';

interface ShareButtonsProps {
  postUrl: string;
  postTitle: string;
}

export function ShareButtons({ postUrl, postTitle }: ShareButtonsProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="mt-12 border-t border-zinc-100 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans text-xs">
      <span className="font-semibold uppercase tracking-wider text-zinc-400">Share this article:</span>
      <div className="flex gap-2">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 text-zinc-500 hover:text-zinc-800 transition-all flex items-center gap-1"
        >
          <Twitter className="h-3.5 w-3.5" />
          <span>X</span>
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 text-zinc-500 hover:text-zinc-800 transition-all flex items-center gap-1"
        >
          <Facebook className="h-3.5 w-3.5" />
          <span>Facebook</span>
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 text-zinc-500 hover:text-zinc-800 transition-all flex items-center gap-1"
        >
          <Linkedin className="h-3.5 w-3.5" />
          <span>LinkedIn</span>
        </a>
        <button
          onClick={handleCopyLink}
          className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 text-zinc-500 hover:text-zinc-800 transition-all flex items-center gap-1"
        >
          <Link2 className="h-3.5 w-3.5" />
          <span>Copy Link</span>
        </button>
      </div>
    </div>
  );
}
export default ShareButtons;
