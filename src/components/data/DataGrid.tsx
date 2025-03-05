
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { calculateExpressions } from '@/utils/calculations';
import { applyConditionalFormatting } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, RefreshCw, Table } from 'lucide-react';
import { toast } from 'sonner';

interface DataGridProps {
  dimensions1: string[];
  dimensions2: string[];
}

const DataGrid: React.FC<DataGridProps> = ({ dimensions1, dimensions2 }) => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<any[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Generate headers based on dimensions provided
  useEffect(() => {
    if (dimensions1.length && dimensions2.length) {
      // Create column definitions
      const cols = [
        {
          headerName: 'Dimension 1',
          field: 'dim1',
          editable: false,
          filter: true,
          sortable: true,
          resizable: true,
          minWidth: 120,
          cellClass: 'font-medium'
        },
        {
          headerName: 'Dimension 2',
          field: 'dim2',
          editable: false,
          filter: true,
          sortable: true,
          resizable: true,
          minWidth: 120,
          cellClass: 'font-medium'
        },
        {
          headerName: 'Value 1',
          field: 'value1',
          editable: true,
          sortable: true,
          filter: 'agNumberColumnFilter',
          type: 'numericColumn',
          resizable: true,
          minWidth: 100
        },
        {
          headerName: 'Value 2',
          field: 'value2',
          editable: true,
          sortable: true,
          filter: 'agNumberColumnFilter',
          type: 'numericColumn',
          resizable: true,
          minWidth: 100
        },
        {
          headerName: 'Sum',
          field: 'sum',
          editable: false,
          sortable: true,
          filter: 'agNumberColumnFilter',
          type: 'numericColumn',
          resizable: true,
          minWidth: 100,
          valueGetter: (params: any) => {
            const value1 = parseFloat(params.data.value1) || 0;
            const value2 = parseFloat(params.data.value2) || 0;
            return value1 + value2;
          }
        },
        {
          headerName: 'Product',
          field: 'product',
          editable: false,
          sortable: true,
          filter: 'agNumberColumnFilter',
          type: 'numericColumn',
          resizable: true,
          minWidth: 100,
          valueGetter: (params: any) => {
            const value1 = parseFloat(params.data.value1) || 0;
            const value2 = parseFloat(params.data.value2) || 0;
            return value1 * value2;
          }
        },
        {
          headerName: 'Ratio',
          field: 'ratio',
          editable: false,
          sortable: true,
          filter: 'agNumberColumnFilter',
          type: 'numericColumn',
          resizable: true,
          minWidth: 100,
          valueFormatter: (params: any) => {
            const value1 = parseFloat(params.data.value1) || 0;
            const value2 = parseFloat(params.data.value2) || 0;
            return value2 !== 0 ? (value1 / value2).toFixed(2) : 'N/A';
          }
        }
      ];
      
      setColumnDefs(cols);

      // Generate grid data based on the dimensions
      const data = [];
      for (const dim1 of dimensions1) {
        for (const dim2 of dimensions2) {
          data.push({
            dim1,
            dim2,
            value1: Math.floor(Math.random() * 100),
            value2: Math.floor(Math.random() * 100)
          });
        }
      }
      
      setRowData(data);
    }
  }, [dimensions1, dimensions2]);

  const handleCalculateExpressions = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      if (gridRef.current && gridRef.current.api) {
        // Update calculations
        const updatedData = calculateExpressions(rowData);
        setRowData(updatedData);
        
        // Apply conditional formatting
        applyConditionalFormatting(gridRef.current.api);
        
        toast.success('Calculations complete and outliers highlighted');
        setIsCalculating(false);
        
        // Force refresh of the grid
        gridRef.current.api.refreshCells();
      }
    }, 500);
  };

  const handleExportData = () => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: 'data-dimensions-export.csv'
      });
      toast.success('Data exported successfully');
    }
  };

  return (
    <Card className="glass shadow-lg">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Table className="w-5 h-5 mr-2" />
            Data Grid
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportData}
              className="flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button 
              size="sm"
              onClick={handleCalculateExpressions}
              disabled={isCalculating}
              className="flex items-center gap-1 btn-hover-effect"
            >
              <RefreshCw className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
              {isCalculating ? 'Calculating...' : 'Calculate & Format'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-[500px] ag-theme-alpine rounded-md overflow-hidden"
        >
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            animateRows={true}
            rowSelection="multiple"
            enableCellChangeFlash={true}
            suppressMovableColumns={false}
            defaultColDef={{
              flex: 1,
              minWidth: 100,
              resizable: true
            }}
            getRowStyle={(params) => {
              const rowStyle: any = {};
              if (params.node.rowIndex % 2 === 0) {
                rowStyle.backgroundColor = 'rgba(0, 0, 0, 0.02)';
              }
              return rowStyle;
            }}
          />
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default DataGrid;
