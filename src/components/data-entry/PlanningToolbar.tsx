
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

interface PlanningToolbarProps {
  onRefresh: () => void;
  onExport: () => void;
  isLoading: boolean;
}

const PlanningToolbar = ({ onRefresh, onExport, isLoading }: PlanningToolbarProps) => {
  return (
    <div className="mb-6 flex flex-wrap justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold mb-1">Planning</h1>
        <p className="text-muted-foreground">
          Enter and analyze sales planning data
        </p>
      </div>
      
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          className="flex items-center gap-1"
          disabled={isLoading}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onExport}
          className="flex items-center gap-1"
          disabled={isLoading}
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default PlanningToolbar;
