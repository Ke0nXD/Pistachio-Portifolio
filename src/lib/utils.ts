export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(price: number): string {
  return `US$ ${price.toFixed(2)}`;
}
