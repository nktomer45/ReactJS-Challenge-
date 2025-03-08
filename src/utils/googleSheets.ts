
import { toast } from "sonner";
import { generateWeeks, getCalendarItemByWeek } from "./calendarData";

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
  weekLabel?: string;
  month: string;
  monthLabel?: string; 
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

// Mock data for stores
const MOCK_STORES = [
  { id: 'ST035', name: 'San Francisco Bay Trends' },
  { id: 'ST046', name: 'Phoenix Sunwear' },
  { id: 'ST064', name: 'Dallas Ranch Supply' },
  { id: 'ST066', name: 'Atlanta Outfitters' },
  { id: 'ST073', name: 'Nashville Melody Music Store' },
  { id: 'ST074', name: 'New York Empire Eats' },
  { id: 'ST091', name: 'Denver Peaks Outdoor' },
  { id: 'ST094', name: 'Philadelphia Liberty Market' },
  { id: 'ST097', name: 'Boston Harbor Books' },
  { id: 'ST101', name: 'Austin Vibe Co.' },
  { id: 'ST131', name: 'Los Angeles Luxe' },
  { id: 'ST150', name: 'Houston Harvest Market' },
];

// Mock data for SKUs
const MOCK_SKUS = [
  { id: 'SK00158', name: 'Crew Neck Merino Wool Sweater', code: 'SK00158', price: 114.99, cost: 18.28 },
  { id: 'SK00269', name: 'Faux Leather Leggings', code: 'SK00269', price: 9.99, cost: 8.45 },
  { id: 'SK00300', name: 'Fleece-Lined Parka', code: 'SK00300', price: 199.99, cost: 17.80 },
  { id: 'SK00304', name: 'Cotton Polo Shirt', code: 'SK00304', price: 139.99, cost: 10.78 },
  { id: 'SK00766', name: 'Foldable Travel Hat', code: 'SK00766', price: 44.99, cost: 27.08 },
  { id: 'SK00786', name: 'Chic Quilted Wallet', code: 'SK00786', price: 14.99, cost: 4.02 },
  { id: 'SK00960', name: 'High-Slit Maxi Dress', code: 'SK00960', price: 74.99, cost: 47.47 },
  { id: 'SK01183', name: 'Turtleneck Cable Knit Sweater', code: 'SK01183', price: 49.99, cost: 22.60 },
  { id: 'SK01189', name: 'Retro-Inspired Sunglasses', code: 'SK01189', price: 194.99, cost: 115.63 },
  { id: 'SK01193', name: 'Stretch Denim Overalls', code: 'SK01193', price: 129.99, cost: 47.06 },
  { id: 'SK01249', name: 'Adjustable Elastic Headband', code: 'SK01249', price: 19.99, cost: 1.34 },
  { id: 'SK01319', name: 'Adjustable Baseball Cap', code: 'SK01319', price: 4.99, cost: 2.29 },
];

// Raw planning data
const MOCK_PLANNING_DATA = `Store	SKU	Week	Sales Units
ST035	SK00158	W01	58
ST035	SK00158	W07	107
ST035	SK00158	W09	0
ST035	SK00158	W11	92
ST035	SK00158	W13	122
ST035	SK00158	W15	38
ST035	SK00158	W23	88
ST035	SK00158	W31	45
ST035	SK00158	W35	197
ST035	SK00158	W50	133
ST035	SK00269	W05	107
ST035	SK00269	W06	104
ST035	SK00269	W09	32
ST035	SK00269	W18	174
ST035	SK00269	W23	174
ST035	SK00269	W27	37
ST035	SK00269	W28	95
ST035	SK00269	W29	161
ST035	SK00269	W30	175
ST035	SK00269	W32	200
ST035	SK00269	W33	120
ST035	SK00269	W51	167
ST035	SK00300	W14	135
ST035	SK00300	W15	42
ST035	SK00300	W41	185
ST035	SK00300	W46	38
ST035	SK00300	W50	149
ST035	SK00304	W16	40
ST035	SK00304	W18	140
ST035	SK00304	W19	200
ST035	SK00304	W23	108
ST035	SK00304	W36	28
ST035	SK00304	W42	11
ST035	SK00304	W47	42
ST035	SK00766	W04	167
ST035	SK00766	W08	143
ST035	SK00766	W10	120
ST035	SK00766	W12	21
ST035	SK00766	W13	92
ST035	SK00766	W14	141
ST035	SK00766	W15	108
ST035	SK00766	W19	167
ST035	SK00766	W21	1
ST035	SK00766	W42	63
ST035	SK00766	W44	179
ST035	SK00766	W49	110`;

// Function to fetch data from a specific sheet
async function fetchSheetData(sheetName: string) {
  try {
    if (!import.meta.env.VITE_GOOGLE_API_KEY) {
      console.log("Using mock data as no API key is present");
      return [];
    }

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
    toast.error('Failed to load data from Google Sheets, using sample data');
    return [];
  }
}

// Function to fetch stores data
export async function fetchStores(): Promise<Store[]> {
  try {
    const data = await fetchSheetData('Stores');
    
    // If we got data from the API, use that
    if (data.length > 1) {
      // Skip header row and map to store objects
      return data.slice(1).map((row: any[], index: number) => ({
        id: row[0] || `store-${index + 1}`,
        name: row[1] || `Store ${index + 1}`
      }));
    }
    
    // Otherwise, return mock data
    return MOCK_STORES;
  } catch (error) {
    console.error('Error fetching stores:', error);
    return MOCK_STORES;
  }
}

// Function to fetch SKUs data
export async function fetchSKUs(): Promise<SKU[]> {
  try {
    const data = await fetchSheetData('SKUs');
    
    // If we got data from the API, use that
    if (data.length > 1) {
      // Skip header row and map to SKU objects
      return data.slice(1).map((row: any[], index: number) => ({
        id: row[0] || `sku-${index + 1}`,
        code: row[1] || `SKU${index + 1}`,
        name: row[2] || `Product ${index + 1}`,
        price: parseFloat(row[3]) || 0,
        cost: parseFloat(row[4]) || 0
      }));
    }
    
    // Otherwise, return mock data
    return MOCK_SKUS;
  } catch (error) {
    console.error('Error fetching SKUs:', error);
    return MOCK_SKUS;
  }
}

// Parse the raw planning data 
function parsePlanningData(rawData: string): { storeId: string, skuId: string, week: string, units: number }[] {
  if (!rawData) return [];
  
  const lines = rawData.split('\n');
  // Skip the header
  const dataLines = lines.slice(1);
  
  return dataLines.map(line => {
    const [storeId, skuId, week, units] = line.split('\t');
    return {
      storeId,
      skuId,
      week,
      units: parseInt(units, 10) || 0
    };
  });
}

// Function to fetch planning data (sales/units by store/SKU/week)
export async function fetchPlanningData(): Promise<{
  rowData: PlanningRow[];
  weeks: { id: string; month: string; week: string }[];
}> {
  try {
    const storesData = await fetchStores();
    const skusData = await fetchSKUs();
    
    // Get the planning data from the API or use mock data
    const planningSheet = await fetchSheetData('Planning');
    
    // Generate weeks using calendar data
    const weeks = generateWeeks();
    
    // Initialize rows with cross join of stores and SKUs
    const rowData: PlanningRow[] = [];
    
    // Use API data if available, otherwise use mock data
    const planningData = planningSheet.length > 0 
      ? parseApiPlanningData(planningSheet) 
      : parsePlanningData(MOCK_PLANNING_DATA);
    
    // Create a dictionary to store unique store-sku combinations
    const storeSkuMap: Record<string, PlanningRow> = {};
    
    // Process each entry
    planningData.forEach(entry => {
      const { storeId, skuId, week, units } = entry;
      
      // Create a unique key for this store-sku combination
      const key = `${storeId}_${skuId}`;
      
      // If we haven't seen this combination before, create it
      if (!storeSkuMap[key]) {
        const store = storesData.find(s => s.id === storeId) || { id: storeId, name: `Store ${storeId}` };
        const sku = skusData.find(s => s.id === skuId) || { id: skuId, name: `SKU ${skuId}`, code: `CODE-${skuId}`, price: 0, cost: 0 };
        
        storeSkuMap[key] = {
          id: key,
          store,
          sku
        };
      }
      
      // Add the units for this week
      storeSkuMap[key][`${week}_units`] = units;
    });
    
    // Convert the map to an array
    const rowArray = Object.values(storeSkuMap);
    
    return { rowData: rowArray, weeks };
  } catch (error) {
    console.error('Error fetching planning data:', error);
    return { rowData: [], weeks: generateWeeks() };
  }
}

// Function to parse planning data from the API
function parseApiPlanningData(data: any[]): { storeId: string, skuId: string, week: string, units: number }[] {
  if (!data || data.length <= 1) return [];
  
  const hasHeader = data[0][0] === 'Store ID' || data[0][0] === 'Store';
  const planningData = hasHeader ? data.slice(1) : data;
  
  return planningData.map(row => {
    // The format might be different in the API, adjust as needed
    return {
      storeId: row[0],
      skuId: row[1],
      week: `W${row[2].replace('W', '')}`, // Ensure consistent week format
      units: parseInt(row[3], 10) || 0
    };
  });
}

// Function to fetch weekly data for charts
export async function fetchWeeklyData(storeId: string): Promise<WeekData[]> {
  try {
    const storesData = await fetchStores();
    const skusData = await fetchSKUs();
    const planningSheet = await fetchSheetData('Planning');
    
    // Generate weeks using calendar data
    const weeks = generateWeeks();
    
    // Use API data if available, otherwise use mock data
    const planningData = planningSheet.length > 0 
      ? parseApiPlanningData(planningSheet) 
      : parsePlanningData(MOCK_PLANNING_DATA);
    
    // Filter for the selected store
    const storeData = planningData.filter(entry => entry.storeId === storeId);
    
    // Calculate totals by week
    const weeklyData: WeekData[] = weeks.map(week => {
      let totalGmDollars = 0;
      let totalSalesDollars = 0;
      
      // Get all entries for this week
      const weekEntries = storeData.filter(entry => entry.week === week.week);
      
      weekEntries.forEach(entry => {
        const sku = skusData.find(s => s.id === entry.skuId);
        if (!sku) return;
        
        const units = entry.units;
        const salesDollars = units * sku.price;
        const gmDollars = salesDollars - (units * sku.cost);
        
        totalSalesDollars += salesDollars;
        totalGmDollars += gmDollars;
      });
      
      const gmPercent = totalSalesDollars > 0 ? (totalGmDollars / totalSalesDollars) * 100 : 0;
      
      // Get additional calendar information
      const calendarItem = getCalendarItemByWeek(week.week);
      
      return {
        week: week.week,
        weekLabel: calendarItem?.weekLabel,
        month: week.month,
        monthLabel: calendarItem?.monthLabel,
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

// Helper function to generate weeks - using imported function instead
// export function generateWeeks() {
//   const weeks = [];
//   const months = ['Jan', 'Feb', 'Mar', 'Apr'];
//   
//   for (let m = 0; m < months.length; m++) {
//     for (let w = 1; w <= 4; w++) {
//       const weekNum = m * 4 + w;
//       const paddedNum = weekNum.toString().padStart(2, '0');
//       weeks.push({
//         id: `W${paddedNum}`,
//         week: `W${paddedNum}`,
//         month: months[m]
//       });
//     }
//   }
//   
//   // Add weeks 17-52 to match planning data
//   for (let weekNum = 17; weekNum <= 52; weekNum++) {
//     const paddedNum = weekNum.toString().padStart(2, '0');
//     const monthIndex = Math.floor((weekNum-1) / 4) % 12;
//     const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex];
//     
//     if (weekNum <= 16) continue; // Skip weeks already added
//     
//     weeks.push({
//       id: `W${paddedNum}`,
//       week: `W${paddedNum}`,
//       month: monthName
//     });
//   }
//   
//   return weeks;
// }
