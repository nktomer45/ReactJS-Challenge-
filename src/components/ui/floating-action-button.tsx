
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
        "fixed right-8 top-1/2 translate-y-1/2 shadow-lg z-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
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
