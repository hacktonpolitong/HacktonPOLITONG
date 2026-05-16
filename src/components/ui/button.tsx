import { cloneElement, isValidElement } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "default" | "secondary" | "ghost" | "outline" | "destructive" | "link";
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  asChild?: boolean;
};

export function Button({ className, variant = "primary", size = "default", asChild = false, children, ...props }: ButtonProps) {
  const buttonClassName = cn(
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    size === "default" && "px-4 py-2",
    size === "xs" && "px-2 py-1 text-xs",
    size === "sm" && "px-3 py-1.5 text-xs",
    size === "lg" && "px-5 py-2.5",
    size === "icon" && "size-9",
    size === "icon-xs" && "size-6",
    size === "icon-sm" && "size-7",
    size === "icon-lg" && "size-10",
    (variant === "primary" || variant === "default") && "bg-accent text-white hover:bg-[#1d4b3a]",
    (variant === "secondary" || variant === "outline") && "border border-border bg-panel text-foreground hover:bg-[#eef2ec]",
    variant === "ghost" && "text-foreground hover:bg-[#e8ede6]",
    variant === "destructive" && "bg-danger text-white hover:bg-[#862e24]",
    variant === "link" && "p-0 text-accent underline-offset-4 hover:underline",
    className
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<HTMLAttributes<HTMLElement>>;

    return cloneElement(child, {
      className: cn(buttonClassName, child.props.className)
    });
  }

  return (
    <button
      className={buttonClassName}
      {...props}
    >
      {children}
    </button>
  );
}
