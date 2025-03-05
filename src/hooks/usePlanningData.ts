
import { useState, useEffect, RefObject } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { toast } from 'sonner';
import { fetchPlanningData } from '@/utils/googleSheets';

export const usePlanningData = (gridRef: RefObject<AgGridReact>) => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch data from Google Sheets
      const { rowData: planningData } = await fetchPlanningData();
      setRowData(planningData);
    } catch (error) {
      console.error('Error loading planning data:', error);
      toast.error('Failed to load planning data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: 'planning-data-export.csv'
      });
      toast.success('Data exported successfully');
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    toast.info('Refreshing data from Google Sheets...');
    
    try {
      const { rowData: planningData } = await fetchPlanningData();
      setRowData(planningData);
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rowData,
    isLoading,
    handleExportData,
    handleRefreshData
  };
};
