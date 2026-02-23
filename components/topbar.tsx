"use client";

import { Phone, Mail } from "lucide-react";

export function Topbar() {
  return (
    <div className="w-full bg-slate-900 py-2.5 text-slate-300 border-b border-slate-800 hidden sm:block">
      <div className="mx-auto flex max-w-7xl items-center justify-end px-4 sm:px-6 lg:px-8 gap-6 text-[11px] font-medium tracking-wide">
        <div className="flex items-center gap-2 group transition-colors hover:text-white cursor-pointer">
          <Phone className="h-3 w-3 text-primary/80 group-hover:text-primary transition-colors" />
          <span>008802226618453</span>
        </div>
        
        <div className="flex items-center gap-2 group transition-colors hover:text-white cursor-pointer">
          <Phone className="h-3 w-3 text-primary/80 group-hover:text-primary transition-colors" />
          <span>(+88) 01678000334/35/37</span>
        </div>

        <div className="flex items-center gap-2 group transition-colors hover:text-white cursor-pointer">
          <Mail className="h-3 w-3 text-primary/80 group-hover:text-primary transition-colors" />
          <a href="mailto:hr@yespvt.com">hr@yespvt.com</a>
        </div>

        <div className="flex items-center gap-2 group transition-colors hover:text-white cursor-pointer">
          <Mail className="h-3 w-3 text-primary/80 group-hover:text-primary transition-colors" />
          <a href="mailto:yestoall20@yahoo.com">yestoall20@yahoo.com</a>
        </div>
      </div>
    </div>
  );
}
