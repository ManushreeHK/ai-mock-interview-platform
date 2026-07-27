import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "hero";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",

        // Sizes
        {
          "px-3 py-2 text-sm": size === "sm",
          "px-5 py-2.5 text-sm": size === "md",
          "px-6 py-3 text-base": size === "lg",
        },

        // Variants
        {
          "bg-blue-600 text-white hover:bg-blue-700":
            variant === "primary",

          "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100":
            variant === "secondary",

          "text-slate-700 hover:bg-slate-100":
            variant === "ghost",

          "bg-red-600 text-white hover:bg-red-700":
            variant === "danger",
            "bg-white text-blue-700 hover:bg-blue-700 hover:text-white shadow-lg hover:shadow-xl hover:scale-105":
  variant === "hero",
        },

        fullWidth && "w-full",

        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}

      {!isLoading && leftIcon}

      {children}

      {!isLoading && rightIcon}
    </button>
  );
}