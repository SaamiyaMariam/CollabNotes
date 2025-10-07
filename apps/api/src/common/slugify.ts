export function slugify(base: string): string {
  return base
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove symbols
    .replace(/\s+/g, '_'); // spaces → underscores
}
