import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full rounded-lg bg-blue-600 px-6 py-3
        font-semibold text-white
        transition-all duration-200

        ${
          disabled
            ? "cursor-not-allowed bg-gray-400"
            : "hover:bg-blue-700 active:scale-95"
        }

        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;