"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WizardTriggerProps {
  onClick: () => void;
  className?: string;
}

export function WizardTrigger({ onClick, className }: WizardTriggerProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "h-14 px-8 text-lg font-semibold",
        "bg-linear-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500",
        "text-white shadow-lg hover:shadow-xl transition-all",
        className
      )}
    >
      <Sparkles className="h-5 w-5 mr-2" />
      Find Your Perfect Course
    </Button>
  );
}
