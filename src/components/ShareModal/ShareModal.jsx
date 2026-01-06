// components/ShareModal.jsx
import { Check, Copy, X } from "lucide-react";
import { useState } from "react";

const ShareModal = ({ isOpen, onClose, product }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const shareText = product?.productName
    ? `Check out ${product.productName}!`
    : "Check out this product!";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy link");
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      currentUrl
    )}&text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      shareText + " " + currentUrl
    )}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      currentUrl
    )}&text=${encodeURIComponent(shareText)}`,
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            Share Product
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <X size={22} />
          </button>
        </div>

        {/* Social Links */}
        <div className="space-y-3 mb-4">
          {/* Facebook */}
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-500 transition-all group"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              f
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-blue-600">
              Share on Facebook
            </span>
          </a>

          {/* X / Twitter */}
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-100 transition-all group"
          >
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
              𝕏
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-black">
              Share on X
            </span>
          </a>

          {/* WhatsApp */}
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-500 transition-all group"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              W
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-green-600">
              Share on WhatsApp
            </span>
          </a>

          {/* Telegram */}
          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all group"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              T
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-blue-500">
              Share on Telegram
            </span>
          </a>
        </div>

        {/* Copy Link */}
        <div className="border-t pt-4">
          <button
            onClick={handleCopyLink}
            disabled={copied}
            className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-70"
          >
            {copied ? (
              <>
                <Check size={18} className="text-green-600" />
                <span className="text-green-600">Link Copied</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Product Info */}
        {product && (
          <div className="mt-4 p-3 bg-gray-50 rounded-xl border">
            <p className="text-sm font-medium truncate">
              {product.productName}
            </p>
            <p className="text-xs text-gray-500">
              {product.mainCategory} • ${product.newPrice}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
