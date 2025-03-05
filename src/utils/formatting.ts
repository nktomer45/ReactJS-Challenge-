
/**
 * Returns the background color class for a GM percentage value
 * based on conditional formatting rules
 */
export const getGmPercentColor = (gmPercent: number): string => {
  if (gmPercent >= 40) {
    return 'bg-green-500 text-white';
  } else if (gmPercent >= 10) {
    return 'bg-yellow-500 text-white';
  } else if (gmPercent > 5) {
    return 'bg-orange-500 text-white';
  } else {
    return 'bg-red-500 text-white';
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
