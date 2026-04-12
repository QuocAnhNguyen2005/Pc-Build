/**
 * Format price to Vietnamese Dong currency format
 */
export const priceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

/**
 * Format a price value
 */
export const formatPrice = (price: number): string => {
  return priceFormatter.format(price);
};
