
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface FloatingActionButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  label?: string;
  asChild?: boolean;
}

export function FloatingActionButton({
  onClick,
  icon = <Plus className="h-6 w-6" />,
  className,
  label,
  asChild = false,
  ...props
}: FloatingActionButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const isMobile = useIsMobile();
  
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-[9999] transition-all duration-300 shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:-translate-y-1",
        isMobile ? "h-12 w-12 rounded-full p-0" : label ? "h-12 px-4 rounded-full" : "h-14 w-14 rounded-full p-0",
        className
      )}
      size={isMobile ? "icon" : label ? "default" : "icon"}
      asChild={asChild}
      {...props}
    >
      {icon}
      {!isMobile && label && <span className="ml-2">{label}</span>}
    </Button>
  );
}
