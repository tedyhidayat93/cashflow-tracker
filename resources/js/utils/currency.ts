// Utility functions for currency formatting

export const formatCurrencyInput = (value: string): string => {
  if (!value) return '';

  // Remove everything except digits and comma
  let clean = value.replace(/[^\d,]/g, '');

  // split decimal
  const parts = clean.split(',');

  const integerPart = parts[0].replace(/^0+(?=\d)/, '');
  const decimalPart = parts[1] ?? '';

  const formattedInteger = new Intl.NumberFormat('id-ID').format(
    Number(integerPart || 0)
  );

  return decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger;
};

export const parseCurrencyInput = (formattedValue: string): number => {
  if (!formattedValue) return 0;

  const normalized = formattedValue
    .replace(/\./g, '') // remove thousand separator
    .replace(',', '.'); // convert decimal

  const number = Number(normalized);
  return isNaN(number) ? 0 : number; // Return as-is, don't convert to cents
};

export const formatCurrencyDisplay = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '-';
  }

  // Use value directly since it's no longer in cents
  const decimalValue = value;

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(decimalValue);
};

export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined || isNaN(price)) {
    return '-';
  }

  // Use value directly since it's no longer in cents
  const decimalPrice = price;

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(decimalPrice);
};