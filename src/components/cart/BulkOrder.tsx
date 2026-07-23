import { useState } from 'react';
import { ListPlus, Upload } from 'lucide-react';
import * as api from '@/api/client';
import { useShop } from '@/context/ShopContext';

interface BulkResult { added: { sku: string; qty: number; name: string }[]; missed: string[]; }

function parseLines(text: string): { sku: string; qty: number }[] {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const [sku, qtyRaw] = line.split(/[;,\t]|\s{2,}|\s+(?=\d+$)/).map((s) => s?.trim());
    const qty = parseInt(qtyRaw ?? '1', 10);
    return { sku: sku ?? '', qty: Number.isNaN(qty) || qty < 1 ? 1 : qty };
  }).filter((r) => r.sku);
}

export function BulkOrder() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<BulkResult | null>(null);
  const { addToCart } = useShop();
  const readFile = (file: File) => { const reader = new FileReader(); reader.onload = () => setText(String(reader.result ?? '')); reader.readAsText(file); };
  const submit = async () => {
    const rows = parseLines(text); if (!rows.length || busy) return; setBusy(true); setResult(null);
    const added: BulkResult['added'] = []; const missed: string[] = [];
    for (const row of rows) { const found = await api.findProductBySku(row.sku); if (found) { addToCart(found, row.qty); added.push({ sku: found.sku, qty: row.qty, name: found.name }); } else missed.push(row.sku); }
    setResult({ added, missed }); setBusy(false); if (added.length) setText('');
  };
  return (
    <section className="rounded-lg border border-line bg-surface p-4" aria-labelledby="bulk-heading">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center gap-2 text-left"><ListPlus size={18} className="text-circuit" /><span id="bulk-heading" className="flex-1 text-sm font-semibold">Массовый заказ по списку артикулов</span><span className="text-xs text-muted">{open ? 'Свернуть' : 'Развернуть'}</span></button>
      {open && (
        <div className="mt-3 space-y-3">
          <p className="text-xs text-muted">Каждая строка — артикул и количество через точку с запятой, запятую или пробел. Например: <code className="font-mono">ET-011024; 50</code>. Можно загрузить CSV-файл.</p>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder={'ET-011024; 50\nET-021058; 10'} aria-label="Список артикулов" className="w-full rounded border border-line bg-paper p-2 font-mono text-sm" />
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={submit} disabled={busy || !text.trim()} className="h-9 rounded bg-signal px-4 text-sm font-semibold text-[#1B1F24] disabled:opacity-50">{busy ? 'Собираем корзину…' : 'Добавить в корзину'}</button>
            <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded border border-line px-3 text-sm font-medium text-muted hover:text-ink"><Upload size={15} />Загрузить CSV<input type="file" accept=".csv,.txt" className="sr-only" onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])} /></label>
          </div>
          {result && (<div className="space-y-1 text-sm">{result.added.length > 0 && <p className="text-breaker">Добавлено позиций: {result.added.length}</p>}{result.missed.length > 0 && <p className="text-fault">Не найдены артикулы: <span className="font-mono">{result.missed.join(', ')}</span></p>}</div>)}
        </div>
      )}
    </section>
  );
}
