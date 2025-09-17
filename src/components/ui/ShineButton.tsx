"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type ShineButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
};

export function ShineButton({ children, className = "", ...props }: ShineButtonProps) {
  return (
    <button className={`btn-12 ${className}`} {...props}>
      <span>{children}</span>
    </button>
  );
}



