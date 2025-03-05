
import { toast } from "sonner";

// Spreadsheet ID from the URL
const SPREADSHEET_ID = '1EgMU8-gBeUs5j898IZAHI4WOdXe-ewRw';

// The Google Sheets API v4 endpoint for getting spreadsheet data
const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

interface Store {
  id: string;
  name: string;
}

interface SKU {
  id: string;
  name: string;
  code: string;
  price: number;
  cost: number;
}

interface WeekData {
  week: string;
  month: string;
  gmDollars: number;
  salesDollars: number;
  gmPercent: number;
}

interface PlanningRow {
  id: string;
  store: Store;
  sku: SKU;
  [key: string]: any;
}

// Function to fetch data from a specific sheet
async function fetchSheetData(sheetName: string) {
  try {
    // Assuming the spreadsheet is publicly accessible with read permissions
    const url = `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${sheetName}?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching sheet data: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Failed to fetch sheet data:', error);
    toast.error('Failed to load data from Google Sheets');
    return [];
  }
}

// Function to fetch stores data
export async function fetchStores(): Promise<Store[]> {
  try {
    const data = await fetchSheetData('Stores');
    
    // Skip header row and map to store objects
    if (data.length <= 1) return [];
    
    return data.slice(1).map((row: any[], index: number) => ({
      id: row[0] || `store-${index + 1}`,
      name: row[1] || `Store ${index + 1}`
    }));
  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
}

// Function to fetch SKUs data
export async function fetchSKUs(): Promise<SKU[]> {
  try {
    const data = await fetchSheetData('SKUs');
    
    // Skip header row and map to SKU objects
    if (data.length <= 1) return [];
    
    return data.slice(1).map((row: any[], index: number) => ({
      id: row[0] || `sku-${index + 1}`,
      code: row[1] || `SKU${index + 1}`,
      name: row[2] || `Product ${index + 1}`,
      price: parseFloat(row[3]) || 0,
      cost: parseFloat(row[4]) || 0
    }));
  } catch (error) {
    console.error('Error fetching SKUs:', error);
    return [];
  }
}

// Function to fetch planning data (sales/units by store/SKU/week)
export async function fetchPlanningData(): Promise<{
  rowData: PlanningRow[];
  weeks: { id: string; month: string; week: string }[];
}> {
  try {
    const storesData = await fetchStores();
    const skusData = await fetchSKUs();
    const planningSheet = await fetchSheetData('Planning');
    
    // Generate weeks
    const weeks = generateWeeks();
    
    // Initialize rows with cross join of stores and SKUs
    const rowData: PlanningRow[] = [];
    
    // Skip header row if exists
    const hasHeader = planningSheet.length > 0 && planningSheet[0][0] === 'Store ID';
    const planningData = hasHeader ? planningSheet.slice(1) : planningSheet;
    
    // Convert sheet data to row data
    planningData.forEach((row: any[]) => {
      const storeId = row[0];
      const skuId = row[1];
      const store = storesData.find(s => s.id === storeId) || { id: storeId, name: `Store ${storeId}` };
      const sku = skusData.find(s => s.id === skuId) || { id: skuId, name: `SKU ${skuId}`, code: `CODE-${skuId}`, price: 0, cost: 0 };
      
      const rowItem: PlanningRow = {
        id: `${storeId}_${skuId}`,
        store,
        sku
      };
      
      // Add week data starting from column 2 (0-indexed)
      for (let i = 0; i < weeks.length; i++) {
        // Add units sold for each week
        const weekUnits = parseInt(row[i + 2], 10) || 0;
        rowItem[`${weeks[i].id}_units`] = weekUnits;
      }
      
      rowData.push(rowItem);
    });
    
    return { rowData, weeks };
  } catch (error) {
    console.error('Error fetching planning data:', error);
    return { rowData: [], weeks: generateWeeks() };
  }
}

// Function to fetch weekly data for charts
export async function fetchWeeklyData(storeId: string): Promise<WeekData[]> {
  try {
    const storesData = await fetchStores();
    const skusData = await fetchSKUs();
    const planningSheet = await fetchSheetData('Planning');
    
    // Generate weeks
    const weeks = generateWeeks();
    
    // Skip header row if exists
    const hasHeader = planningSheet.length > 0 && planningSheet[0][0] === 'Store ID';
    const planningData = hasHeader ? planningSheet.slice(1) : planningSheet;
    
    // Filter rows for the selected store
    const storeRows = planningData.filter((row: any[]) => row[0] === storeId);
    
    // Calculate totals by week
    const weeklyData: WeekData[] = weeks.map((week, weekIndex) => {
      let totalGmDollars = 0;
      let totalSalesDollars = 0;
      
      storeRows.forEach((row: any[]) => {
        const skuId = row[1];
        const sku = skusData.find(s => s.id === skuId);
        if (!sku) return;
        
        const units = parseInt(row[weekIndex + 2], 10) || 0;
        const salesDollars = units * sku.price;
        const gmDollars = salesDollars - (units * sku.cost);
        
        totalSalesDollars += salesDollars;
        totalGmDollars += gmDollars;
      });
      
      const gmPercent = totalSalesDollars > 0 ? (totalGmDollars / totalSalesDollars) * 100 : 0;
      
      return {
        week: week.week,
        month: week.month,
        gmDollars: totalGmDollars,
        salesDollars: totalSalesDollars,
        gmPercent
      };
    });
    
    return weeklyData;
  } catch (error) {
    console.error('Error fetching weekly data:', error);
    return [];
  }
}

// Helper function to generate weeks
export function generateWeeks() {
  const weeks = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr'];
  
  for (let m = 0; m < months.length; m++) {
    for (let w = 1; w <= 4; w++) {
      const weekNum = m * 4 + w;
      weeks.push({
        id: `w${weekNum}`,
        week: `W${weekNum}`,
        month: months[m]
      });
    }
  }
  
  return weeks;
}
