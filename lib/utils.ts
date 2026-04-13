/**
 * Format price to Vietnamese Dong currency format
 */
export const priceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

/**
 * Format a price value without currency symbol
 */
export const formatPriceSimple = (price: number): string => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

/**
 * Format a price value with currency symbol
 */
export const formatPrice = (price: number): string => {
  return priceFormatter.format(price);
};

/**
 * Calculate total power consumption from selected parts
 */
export const calculateTotalPower = (selectedParts: { [key: string]: any }): number => {
  let total = 0;
  
  if (selectedParts.cpu?.specs?.power_consumption) {
    total += selectedParts.cpu.specs.power_consumption;
  }
  if (selectedParts.gpu?.specs?.power_consumption) {
    total += selectedParts.gpu.specs.power_consumption;
  }
  if (selectedParts.mainboard?.specs?.power_consumption) {
    total += selectedParts.mainboard.specs.power_consumption;
  }
  if (selectedParts.ram?.specs?.power_consumption) {
    total += selectedParts.ram.specs.power_consumption;
  }
  
  return total;
};
