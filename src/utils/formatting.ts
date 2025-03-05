
/**
 * Returns the text color for a GM percentage value
 * based on conditional formatting rules
 */
export const getGmPercentColor = (gmPercent: number): string => {
  if (gmPercent >= 40) {
    return 'white';
  } else if (gmPercent >= 10) {
    return 'white';
  } else if (gmPercent > 5) {
    return 'white';
  } else {
    return 'white';
  }
};

/**
 * Formats a number as currency
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formats a number as percentage
 */
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};
