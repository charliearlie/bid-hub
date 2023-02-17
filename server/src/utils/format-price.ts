export default function formatPrice(
  price: number | undefined,
  locale: string = 'en-GB',
  currency: string = 'gbp'
) {
  if (price) {
    return new Intl.NumberFormat(locale, {
      currency,
      style: 'currency',
    }).format(price / 100);
  }
  return '';
}
