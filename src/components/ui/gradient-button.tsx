import React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

const GradientButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, variant = "primary", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary:
        "bg-linear-to-r from-primary to-primary/50 text-white hover:shadow-lg hover:scale-105 hover:shadow-blue-500/25 border-0",
      secondary:
        "bg-white text-blue-900 hover:bg-gray-50 hover:shadow-lg hover:scale-105 border border-blue-100",
      outline:
        "border-2 border-white/30 bg-transparent text-white hover:bg-white/10",
    };

    return (
      <Comp
        className={cn(
          baseStyles,
          variants[variant],
          "px-8 py-4 cursor-pointer",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
GradientButton.displayName = "GradientButton";

export { GradientButton };
