
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency, formatPercent, getGmPercentColor } from '@/utils/formatting';
import { fetchPlanningData, generateWeeks } from '@/utils/googleSheets';

const DataEntry = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate column definitions and load data from Google Sheets
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch data from Google Sheets
        const { rowData, weeks } = await fetchPlanningData();
        
        // Generate column definitions based on the weeks
        const columnDefinitions = generateColumnDefs(weeks);
        
        setRowData(rowData);
        setColumnDefs(columnDefinitions);
      } catch (error) {
        console.error('Error loading planning data:', error);
        toast.error('Failed to load planning data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Generate column definitions
  const generateColumnDefs = (weeks: {id: string, month: string, week: string}[]) => {
    // Fixed columns
    const fixedCols = [
      {
        headerName: 'Store',
        field: 'store.name',
        pinned: 'left',
        lockPosition: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        width: 120
      },
      {
        headerName: 'SKU',
        field: 'sku.name',
        pinned: 'left',
        lockPosition: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        width: 120
      },
      {
        headerName: 'SKU Code',
        field: 'sku.code',
        pinned: 'left',
        lockPosition: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        width: 120
      }
    ];
    
    // Dynamic columns based on weeks
    const weekCols = [];
    
    // Group columns by month
    const monthGroups: any = {};
    
    weeks.forEach(week => {
      if (!monthGroups[week.month]) {
        monthGroups[week.month] = {
          headerName: week.month,
          children: []
        };
      }
      
      // For each week, add 4 columns: Units, Sales $, GM $, GM %
      monthGroups[week.month].children.push(
        {
          headerName: week.week,
          children: [
            {
              headerName: 'Sales Units',
              field: `${week.id}_units`,
              editable: true,
              sortable: true,
              filter: 'agNumberColumnFilter',
              width: 110,
              type: 'numericColumn',
              valueParser: (params: any) => {
                return Number(params.newValue);
              },
              cellStyle: { backgroundColor: '#f9fafb' }
            },
            {
              headerName: 'Sales $',
              width: 110,
              valueGetter: (params: any) => {
                const units = params.data[`${week.id}_units`] || 0;
                const price = params.data.sku.price || 0;
                return units * price;
              },
              valueFormatter: (params: any) => {
                return formatCurrency(params.value);
              },
              type: 'numericColumn'
            },
            {
              headerName: 'GM $',
              width: 110,
              valueGetter: (params: any) => {
                const units = params.data[`${week.id}_units`] || 0;
                const price = params.data.sku.price || 0;
                const cost = params.data.sku.cost || 0;
                return (units * price) - (units * cost);
              },
              valueFormatter: (params: any) => {
                return formatCurrency(params.value);
              },
              type: 'numericColumn'
            },
            {
              headerName: 'GM %',
              width: 110,
              valueGetter: (params: any) => {
                const units = params.data[`${week.id}_units`] || 0;
                const price = params.data.sku.price || 0;
                const cost = params.data.sku.cost || 0;
                const salesDollars = units * price;
                const gmDollars = salesDollars - (units * cost);
                return salesDollars > 0 ? (gmDollars / salesDollars) * 100 : 0;
              },
              valueFormatter: (params: any) => {
                return formatPercent(params.value);
              },
              cellStyle: (params: any) => {
                return { 
                  textAlign: 'right',
                  color: getGmPercentColor(params.value)
                };
              },
              type: 'numericColumn'
            }
          ]
        }
      );
    });
    
    // Convert month groups to array
    const monthColDefs = Object.values(monthGroups);
    
    return [...fixedCols, ...monthColDefs];
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
      const { rowData, weeks } = await fetchPlanningData();
      setRowData(rowData);
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto">
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
              onClick={handleRefreshData}
              className="flex items-center gap-1"
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportData}
              className="flex items-center gap-1"
              disabled={isLoading}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-4">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-[calc(100vh-12rem)]"
              >
                <div className="animate-pulse-gentle text-center">
                  <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading planning data...</p>
                </div>
              </motion.div>
            ) : (
              <div 
                className="w-full h-[calc(100vh-12rem)] ag-theme-alpine" 
                style={{ minHeight: '500px' }}
              >
                <AgGridReact
                  ref={gridRef}
                  rowData={rowData}
                  columnDefs={columnDefs}
                  animateRows={true}
                  enableCellChangeFlash={true}
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    filter: true,
                    suppressMovable: false
                  }}
                  suppressRowClickSelection={true}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default DataEntry;
