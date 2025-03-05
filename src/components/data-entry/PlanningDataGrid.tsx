
import { useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { motion } from 'framer-motion';
import { formatCurrency, formatPercent, getGmPercentColor } from '@/utils/formatting';
import { generateWeeks } from '@/utils/googleSheets';

interface PlanningDataGridProps {
  rowData: any[];
  isLoading: boolean;
}

export const generateColumnDefs = (weeks: {id: string, month: string, week: string}[]) => {
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

const PlanningDataGrid = ({ rowData, isLoading }: PlanningDataGridProps) => {
  const gridRef = useRef<AgGridReact>(null);
  
  if (isLoading) {
    return (
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
    );
  }

  const weeks = generateWeeks();
  const columnDefs = generateColumnDefs(weeks);

  return (
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
  );
};

export default PlanningDataGrid;
