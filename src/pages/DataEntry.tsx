
import { useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import PageTransition from '@/components/layout/PageTransition';
import { Card, CardContent } from '@/components/ui/card';
import PlanningToolbar from '@/components/data-entry/PlanningToolbar';
import PlanningDataGrid from '@/components/data-entry/PlanningDataGrid';
import { usePlanningData } from '@/hooks/usePlanningData';

const DataEntry = () => {
  const gridRef = useRef<AgGridReact>(null);
  const { rowData, isLoading, handleExportData, handleRefreshData } = usePlanningData(gridRef);

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto">
        <PlanningToolbar 
          onRefresh={handleRefreshData} 
          onExport={handleExportData} 
          isLoading={isLoading}
        />

        <Card className="shadow-md">
          <CardContent className="p-4">
            <PlanningDataGrid 
              rowData={rowData} 
              isLoading={isLoading}
              gridRef={gridRef}
            />
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default DataEntry;
