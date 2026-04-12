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
