"use client";

import { useState } from "react";
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Check,
  X,
  MessageCircle,
} from "lucide-react";

interface ShareCourseButtonProps {
  title: string;
  className?: string;
}

export function ShareCourseButton({ title, className }: ShareCourseButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-[#1877F2] hover:bg-[#166FE5]",
      onClick: () => {
        const url = getShareUrl();
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
          "width=600,height=400"
        );
      },
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-[#1DA1F2] hover:bg-[#1A91DA]",
      onClick: () => {
        const url = getShareUrl();
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          "_blank",
          "width=600,height=400"
        );
      },
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-[#0A66C2] hover:bg-[#095BB5]",
      onClick: () => {
        const url = getShareUrl();
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
          "_blank",
          "width=600,height=400"
        );
      },
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-[#25D366] hover:bg-[#20BD5A]",
      onClick: () => {
        const url = getShareUrl();
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
          "_blank"
        );
      },
    },
  ];

  const copyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-6 py-3.5 cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center gap-2 ${className}`}
      >
        <Share2 className="w-5 h-5" />
        Share Course
      </button>

      {/* Share Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown - opens upward to avoid being cut off */}
          <div className="absolute bottom-full mb-2 left-0 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 min-w-[280px] animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Share this course</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => {
                    option.onClick();
                    setIsOpen(false);
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl ${option.color} text-white transition-all hover:scale-105`}
                  title={option.name}
                >
                  <option.icon className="w-5 h-5" />
 
                </button>
              ))}
            </div>

            {/* Copy Link */}
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={copyLink}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-medium text-slate-700"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
