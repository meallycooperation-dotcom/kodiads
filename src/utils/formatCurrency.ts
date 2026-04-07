export const formatCurrency = (
  value: number | string | null | undefined,
  currency = 'KES',
) => {
  if (value == null || Number.isNaN(Number(value))) {
    return '—'
  }

  const num = typeof value === 'number' ? value : Number(value)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(num)
}
