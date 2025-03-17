
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Package, BarChart2, LineChart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  text: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const NavItem = ({ href, icon: Icon, text, isActive, isCollapsed }: NavItemProps) => (
  <Link 
    to={href} 
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
      isActive 
        ? "bg-primary text-white" 
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    )}
  >
    <Icon className="w-5 h-5 shrink-0" />
    {!isCollapsed && <span className="text-sm font-medium">{text}</span>}
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Create a handler for toggling the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { href: '/dimensions1', icon: Store, text: 'Stores' },
    { href: '/dimensions2', icon: Package, text: 'SKUs' },
    { href: '/data-entry', icon: BarChart2, text: 'Planning' },
    { href: '/chart-view', icon: LineChart, text: 'Charts' },
  ];

  // If on mobile and menu is closed, show a floating button to open it
  if (isMobile && !isMobileMenuOpen) {
    return (
      <Button
        variant="default"
        size="icon"
        onClick={toggleMobileMenu}
        className="fixed top-[72px] left-4 z-50 h-10 w-10 rounded-full shadow-md"
      >
        <Menu className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <motion.div 
      className={cn(
        "fixed z-40 border-r border-border bg-sidebar-background flex flex-col",
        isMobile 
          ? "top-0 left-0 right-0 bottom-0" 
          : "top-0 left-0 h-screen"
      )}
      initial={{ width: isMobile ? "100%" : isCollapsed ? 64 : 240, x: isMobile ? "-100%" : 0 }}
      animate={{ 
        width: isMobile ? "100%" : isCollapsed ? 64 : 240,
        x: isMobile ? (isMobileMenuOpen ? 0 : "-100%") : 0
      }}
      transition={{ duration: 0.2 }}
      style={{ marginTop: isMobile ? '0' : '64px' }}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h2 className="text-sm font-semibold">Navigation</h2>}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => isMobile ? toggleMobileMenu() : setIsCollapsed(!isCollapsed)}
          className="ml-auto"
          aria-label={isMobile ? "Close menu" : isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      <nav className="space-y-1 p-2 overflow-y-auto flex-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            text={item.text}
            isActive={location.pathname === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar;
