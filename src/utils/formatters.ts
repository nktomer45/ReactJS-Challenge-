
/**
 * Applies conditional formatting to the grid
 */
export const applyConditionalFormatting = (gridApi: any) => {
  // Get all the data from the grid
  const rowData: any[] = [];
  gridApi.forEachNode((node: any) => rowData.push(node.data));
  
  // Calculate statistics for outlier detection
  const stats = calculateStats(rowData);
  
  // Apply cell styling based on values
  gridApi.forEachNode((node: any) => {
    const data = node.data;
    
    // Apply to value1
    const value1 = parseFloat(data.value1) || 0;
    if (isHighOutlier(value1, stats.value1)) {
      node.setDataValue('value1', { value: value1, cellClass: 'bg-data-warning text-white font-medium p-1 rounded-sm' });
    } else if (isLowOutlier(value1, stats.value1)) {
      node.setDataValue('value1', { value: value1, cellClass: 'bg-data-danger text-white font-medium p-1 rounded-sm' });
    }
    
    // Apply to value2
    const value2 = parseFloat(data.value2) || 0;
    if (isHighOutlier(value2, stats.value2)) {
      node.setDataValue('value2', { value: value2, cellClass: 'bg-data-warning text-white font-medium p-1 rounded-sm' });
    } else if (isLowOutlier(value2, stats.value2)) {
      node.setDataValue('value2', { value: value2, cellClass: 'bg-data-danger text-white font-medium p-1 rounded-sm' });
    }
    
    // Apply to sum
    const sum = parseFloat(data.sum) || 0;
    if (isHighOutlier(sum, stats.sum)) {
      node.setDataValue('sum', { value: sum, cellClass: 'bg-data-highlight text-white font-medium p-1 rounded-sm' });
    }
    
    // Apply to product
    const product = parseFloat(data.product) || 0;
    if (isHighOutlier(product, stats.product)) {
      node.setDataValue('product', { value: product, cellClass: 'bg-data-highlight text-white font-medium p-1 rounded-sm' });
    }
    
    // Apply to ratio
    const ratio = parseFloat(data.ratio) || 0;
    if (!isNaN(ratio) && isHighOutlier(ratio, stats.ratio)) {
      node.setDataValue('ratio', { value: ratio.toFixed(2), cellClass: 'bg-data-highlight text-white font-medium p-1 rounded-sm' });
    }
  });
};

// Helper functions
const calculateStats = (rowData: any[]) => {
  const extractValues = (field: string) => {
    return rowData.map(row => {
      const val = typeof row[field] === 'object' ? row[field].value : row[field];
      return parseFloat(val) || 0;
    }).filter(val => !isNaN(val));
  };
  
  const value1Values = extractValues('value1');
  const value2Values = extractValues('value2');
  const sumValues = extractValues('sum');
  const productValues = extractValues('product');
  const ratioValues = extractValues('ratio');
  
  return {
    value1: getStats(value1Values),
    value2: getStats(value2Values),
    sum: getStats(sumValues),
    product: getStats(productValues),
    ratio: getStats(ratioValues)
  };
};

const getStats = (values: number[]) => {
  const sum = values.reduce((acc, val) => acc + val, 0);
  const avg = sum / values.length;
  
  const deviations = values.map(val => Math.pow(val - avg, 2));
  const variance = deviations.reduce((acc, val) => acc + val, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  return {
    avg,
    stdDev,
    q1: getPercentile(values, 25),
    q3: getPercentile(values, 75)
  };
};

const getPercentile = (values: number[], percentile: number) => {
  const sorted = [...values].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const floor = Math.floor(index);
  
  if (floor === index) return sorted[index];
  
  const ceil = Math.ceil(index);
  const weight = index - floor;
  
  return sorted[floor] * (1 - weight) + sorted[ceil] * weight;
};

const isHighOutlier = (value: number, stats: any) => {
  const iqr = stats.q3 - stats.q1;
  const upperBound = stats.q3 + 1.5 * iqr;
  
  return value > upperBound;
};

const isLowOutlier = (value: number, stats: any) => {
  const iqr = stats.q3 - stats.q1;
  const lowerBound = stats.q1 - 1.5 * iqr;
  
  return value < lowerBound;
};
