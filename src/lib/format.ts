const priceFmt = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatPrice(value: number): string { return `${priceFmt.format(value)} ₽`; }

export function slugify(name: string): string {
  const map: Record<string, string> = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' };
  return name.toLowerCase().split('').map((ch) => map[ch] ?? ch).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

export function productPath(id: number, name: string): string { return `/product/${id}-${slugify(name)}`; }

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function stockStatus(count: number): { label: string; tone: 'ok' | 'low' | 'none' } {
  if (count <= 0) return { label: 'Под заказ', tone: 'none' };
  if (count <= 5) return { label: `Осталось мало — ${count} шт.`, tone: 'low' };
  return { label: `В наличии — ${count} шт.`, tone: 'ok' };
}
