import { useState } from 'react';
import { Copy, CheckCircle, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { buildShareUrl, buildOgImageUrl } from '../utils/formatters';

/* Inline brand SVGs — lucide-react does not export brand icons */
const TwitterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

/**
 * SharePanel
 *
 * A self-contained share widget that shows:
 *  1. A live thumbnail of the dynamic OG image
 *  2. The public share URL in a copyable input
 *  3. Copy-to-clipboard button
 *  4. Twitter / LinkedIn one-click share buttons
 *  5. Web Share API button (mobile native sheet) when available
 *
 * Props:
 *   shareId        {string}  — nanoid share ID from the audit
 *   monthlySavings {number}  — used to compose the tweet copy
 *   toolCount      {number}  — "X tools audited" tweet copy
 *   className      {string}  — optional extra class on the wrapper card
 */
export default function SharePanel({ shareId, monthlySavings, toolCount, className = '' }) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const shareUrl  = buildShareUrl(shareId);
  const ogImgUrl  = buildOgImageUrl(shareId);

  // ── Tweet copy ──────────────────────────────────────────────────────────────
  const savingsStr = monthlySavings
    ? `$${monthlySavings >= 1000 ? (monthlySavings / 1000).toFixed(1) + 'k' : monthlySavings}`
    : '';

  const tweetText = encodeURIComponent(
    `Just ran an AI spend audit on our stack — found ${savingsStr}/mo in potential savings across ${toolCount} tools 🤯\n\nCheck it out →`
  );
  const twitterUrl  = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Share link copied!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Could not copy to clipboard.');
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: 'Credex AI Spend Audit Results',
        text: `I found ${savingsStr}/mo in AI spend savings — see my audit results.`,
        url: shareUrl,
      });
    } catch {
      // User cancelled or browser doesn't support — silently ignore
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className={`glass-card p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-4 h-4 text-brand-400" />
        <span className="text-sm font-semibold text-white">Share This Audit</span>
      </div>

      {/* OG Image Preview */}
      {!imgError && (
        <div className="mb-4 rounded-lg overflow-hidden border border-white/10">
          <img
            src={ogImgUrl}
            alt="Audit share preview"
            className="w-full h-auto"
            style={{ aspectRatio: '1200/630', objectFit: 'cover' }}
            onError={() => setImgError(true)}
          />
          <p className="text-xs text-slate-500 text-center py-1 bg-black/20">
            Preview — what others see when you share this link
          </p>
        </div>
      )}

      {/* URL display + copy */}
      <p className="text-xs text-slate-500 mb-2">
        Public link · personal details stripped
      </p>
      <div className="flex items-center gap-2 bg-black/30 rounded-lg p-2 text-xs text-slate-400 font-mono mb-3 break-all">
        <span className="flex-1 truncate">{shareUrl}</span>
      </div>

      <button
        id="share-copy-btn"
        onClick={handleCopy}
        className="btn-ghost w-full text-sm py-2.5 mb-3"
      >
        {copied
          ? <><CheckCircle className="w-4 h-4 text-emerald-400" /> Copied!</>
          : <><Copy className="w-4 h-4" /> Copy Share Link</>}
      </button>

      {/* Social share buttons */}
      <div className="flex flex-wrap gap-2" style={{ overflow: 'hidden' }}>
        <a
          id="share-twitter-btn"
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-sm py-2 justify-center"
          style={{ flex: '1 1 0%', minWidth: 0 }}
          aria-label="Share on Twitter / X"
        >
          <TwitterIcon className="w-4 h-4" />
          Tweet
        </a>

        <a
          id="share-linkedin-btn"
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-sm py-2 justify-center"
          style={{ flex: '1 1 0%', minWidth: 0 }}
          aria-label="Share on LinkedIn"
        >
          <LinkedInIcon className="w-4 h-4" />
          LinkedIn
        </a>

        {hasNativeShare && (
          <button
            id="share-native-btn"
            onClick={handleNativeShare}
            className="btn-ghost text-sm py-2 justify-center"
            style={{ flex: '1 1 0%', minWidth: 0 }}
            aria-label="Share via device share sheet"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        )}
      </div>
    </div>
  );
}
