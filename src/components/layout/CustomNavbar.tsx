
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';

const CustomNavbar = () => {
  return (
    <header className="h-16 border-b border-border sticky top-0 z-50 bg-background">
      <div className="container h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl text-primary">GSynergy</span>
        </Link>
        
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <UserCircle className="h-5 w-5" />
          <span>Sign In</span>
        </Button>
      </div>
    </header>
  );
};

export default CustomNavbar;
