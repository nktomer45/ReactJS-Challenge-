
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Package, BarChart2, LineChart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { href: '/dimensions1', icon: Store, text: 'Stores' },
    { href: '/dimensions2', icon: Package, text: 'SKUs' },
    { href: '/data-entry', icon: BarChart2, text: 'Planning' },
    { href: '/chart-view', icon: LineChart, text: 'Charts' },
  ];

  return (
    <motion.div 
      className="h-screen fixed top-0 left-0 border-r border-border bg-sidebar-background flex flex-col z-40"
      initial={{ width: isCollapsed ? 64 : 240 }}
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h2 className="text-sm font-semibold">Navigation</h2>}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <nav className="space-y-1 p-2 overflow-y-auto">
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
