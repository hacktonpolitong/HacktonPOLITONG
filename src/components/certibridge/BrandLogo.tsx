import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "mark" | "lockup";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const markSizes = {
  sm: "size-9",
  md: "size-12",
  lg: "size-20"
};

const lockupSizes = {
  sm: { width: 154, height: 39, className: "h-8 w-auto" },
  md: { width: 208, height: 52, className: "h-10 w-auto" },
  lg: { width: 282, height: 71, className: "h-14 w-auto" }
};

export function BrandLogo({ variant = "lockup", size = "md", className }: BrandLogoProps) {
  if (variant === "mark") {
    return (
      <span
        className={cn(
          "inline-grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#020617] shadow-[0_0_28px_rgba(37,99,235,0.28)]",
          markSizes[size],
          className
        )}
      >
        <Image
          src="/brand/pilotops-mark.png"
          alt="PilotOps AI logo"
          width={96}
          height={96}
          className="h-full w-full object-cover"
          priority={size === "lg"}
        />
      </span>
    );
  }

  const dimensions = lockupSizes[size];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-2xl border border-cyan-300/20 bg-white/95 px-3 py-2 shadow-[0_0_28px_rgba(37,99,235,0.22)] backdrop-blur-xl",
        className
      )}
    >
      <Image
        src="/brand/pilotops-logo-with-label.png"
        alt="PilotOps AI"
        width={dimensions.width}
        height={dimensions.height}
        className={dimensions.className}
        priority={size !== "sm"}
      />
    </span>
  );
}
