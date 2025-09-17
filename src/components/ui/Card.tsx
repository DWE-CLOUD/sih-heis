import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={twMerge("rounded-xl border border-white/10 bg-white/5", className)}>
      {children}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={twMerge("p-4", className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={twMerge("text-sm text-zinc-400", className)}>{children}</div>;
}

export function CardValue({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={twMerge("mt-1 text-2xl font-semibold", className)}>{children}</div>;
}



