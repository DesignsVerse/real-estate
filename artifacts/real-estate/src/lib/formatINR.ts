export function formatINR(price: number, isRent?: boolean): string {
  let formatted = '';
  if (price < 100000) {
    formatted = `₹${price.toLocaleString('en-IN')}`;
  } else if (price >= 100000 && price < 10000000) {
    const lakhs = price / 100000;
    formatted = `₹${parseFloat(lakhs.toFixed(2))} Lakh`;
  } else {
    const crores = price / 10000000;
    formatted = `₹${parseFloat(crores.toFixed(2))} Cr`;
  }

  if (isRent) {
    return `${formatted}/mo`;
  }
  return formatted;
}

export function formatBHK(bedrooms: number): string {
  if (bedrooms === 0) return 'Studio';
  return `${bedrooms} BHK`;
}
