import React from "react";

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-color)]";
  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-gradient-to-r from-[var(--secondary-color)] via-[var(--accent-color)] to-[var(--highlight-color)] text-white shadow-lg hover:opacity-90 hover:shadow-[var(--accent-color)]/50 disabled:opacity-50",
    secondary: "bg-transparent border-2 border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-white shadow-sm disabled:opacity-50",
    ghost: "hover:bg-[var(--accent-color)]/10 hover:text-[var(--accent-color)] text-[var(--text-color)]",
    link: "text-[var(--accent-color)] underline-offset-4 hover:underline",
  };
  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-xs md:text-sm",
    md: "px-6 py-3 text-sm md:text-base",
    lg: "px-8 py-3 text-base md:text-lg",
    icon: "h-10 w-10 p-0 flex items-center justify-center",
  };
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  if (href) {
    return (
      <a href={href} className={combinedClassName} {...(props as any)}>
        {children}
      </a>
    );
  }
  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
