
/**
 * Performs calculations on the grid data
 */
export const calculateExpressions = (rowData: any[]) => {
  return rowData.map(row => {
    const value1 = parseFloat(row.value1) || 0;
    const value2 = parseFloat(row.value2) || 0;
    
    return {
      ...row,
      sum: value1 + value2,
      product: value1 * value2,
      ratio: value2 !== 0 ? value1 / value2 : null,
      // Add additional calculated values here as needed
    };
  });
};

/**
 * Calculates statistical data from the grid
 */
export const calculateStatistics = (rowData: any[]) => {
  const values1 = rowData.map(row => parseFloat(row.value1) || 0);
  const values2 = rowData.map(row => parseFloat(row.value2) || 0);
  
  return {
    value1: {
      min: Math.min(...values1),
      max: Math.max(...values1),
      avg: values1.reduce((sum, val) => sum + val, 0) / values1.length,
      median: getMedian(values1),
      stdDev: getStandardDeviation(values1)
    },
    value2: {
      min: Math.min(...values2),
      max: Math.max(...values2),
      avg: values2.reduce((sum, val) => sum + val, 0) / values2.length,
      median: getMedian(values2),
      stdDev: getStandardDeviation(values2)
    }
  };
};

// Helper functions
const getMedian = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

const getStandardDeviation = (values: number[]): number => {
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  
  return Math.sqrt(variance);
};
