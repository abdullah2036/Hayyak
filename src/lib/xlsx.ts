/**
 * Minimal Excel reader and writer. Reading happens in the visitor's own browser, so the server never opens
 * an uploaded spreadsheet. Sizes are checked before anything is unpacked (zip bombs).
 */
import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';

export const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const MAX_FILE = 2_000_000;
const MAX_PART = 12_000_000;
const MAX_ROWS = 5000;

const unxml = (s: string) => s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const enxml = (s: string) => s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const texts = (x: string) => [...x.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((m) => unxml(m[1]!)).join('');
const colIndex = (ref: string) => [...(ref.match(/^[A-Z]+/)?.[0] || 'A')].reduce((a, c) => a * 26 + c.charCodeAt(0) - 64, 0) - 1;

export function readXlsx(buf: ArrayBuffer): string[][] {
  if (buf.byteLength > MAX_FILE) throw new Error('الملف كبير');
  let total = 0;
  const files = unzipSync(new Uint8Array(buf), {
    filter: (f) => {
      const want = f.name === 'xl/sharedStrings.xml' || /^xl\/worksheets\/sheet\d+\.xml$/.test(f.name);
      if (!want) return false;
      total += f.originalSize;
      if (f.originalSize > MAX_PART || total > MAX_PART * 2) throw new Error('الملف كبير');
      return true;
    },
  });
  const shared = files['xl/sharedStrings.xml'] ? [...strFromU8(files['xl/sharedStrings.xml']).matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => texts(m[1]!)) : [];
  const first = Object.keys(files).filter((n) => n.startsWith('xl/worksheets/')).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))[0];
  if (!first) throw new Error('الملف ما فيه أوراق');
  const rows: string[][] = [];
  for (const r of strFromU8(files[first]!).matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
    const row: string[] = [];
    let next = 0;
    for (const c of r[1]!.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const ref = c[1]!.match(/\br="([A-Z]+\d+)"/)?.[1];
      const i = ref ? colIndex(ref) : next;
      next = i + 1;
      if (i > 60) continue;
      const type = c[1]!.match(/\bt="(\w+)"/)?.[1];
      const body = c[2] || '';
      const val = body.match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? '';
      let t = type === 's' ? (shared[Number(val)] ?? '') : type === 'inlineStr' ? texts(body) : unxml(val);
      // Phone numbers stored as numbers lose their leading zero and may arrive as 5.51234567E8
      if (!type && /^[\d.]+E[+\d]+$/i.test(t)) t = String(Math.round(Number(t)));
      row[i] = t.trim();
    }
    rows.push(Array.from(row, (x) => x ?? ''));
    if (rows.length >= MAX_ROWS) break;
  }
  return rows.filter((r) => r.some(Boolean));
}

export function readCsv(text: string): string[][] {
  if (text.length > MAX_FILE) throw new Error('الملف كبير');
  const s = text.replace(/^﻿/, '');
  const sep = (s.split('\n')[0] || '').split(';').length > (s.split('\n')[0] || '').split(',').length ? ';' : ',';
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < s.length && rows.length < MAX_ROWS; i++) {
    const c = s[i]!;
    if (q) {
      if (c === '"' && s[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === sep) { row.push(cur.trim()); cur = ''; } else if (c === '\n') { row.push(cur.trim()); rows.push(row); row = []; cur = ''; } else if (c !== '\r') cur += c;
  }
  if (cur || row.length) { row.push(cur.trim()); rows.push(row); }
  return rows.filter((r) => r.some(Boolean));
}

/** Writes right-to-left sheets. Text is stored as text, so a name that starts with "=" is never run as a formula. */
export function writeXlsx(sheets: { name: string; rows: (string | number)[][] }[]): Uint8Array {
  const cell = (val: string | number, r: number, c: number) => {
    let ref = '';
    for (let n = c + 1; n > 0; n = Math.floor((n - 1) / 26)) ref = String.fromCharCode(65 + ((n - 1) % 26)) + ref;
    ref += r + 1;
    const st = r === 0 ? ' s="1"' : '';
    return typeof val === 'number' && Number.isFinite(val) ? `<c r="${ref}"${st}><v>${val}</v></c>` : `<c r="${ref}" t="inlineStr"${st}><is><t xml:space="preserve">${enxml(String(val ?? ''))}</t></is></c>`;
  };
  const head = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
  const parts: Record<string, Uint8Array> = {
    '[Content_Types].xml': strToU8(`${head}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`),
    '_rels/.rels': strToU8(`${head}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`),
    'xl/workbook.xml': strToU8(`${head}<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((s, i) => `<sheet name="${enxml(s.name.replace(/[\\/?*[\]:]/g, ' ').slice(0, 31))}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>`),
    'xl/_rels/workbook.xml.rels': strToU8(`${head}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`),
    'xl/styles.xml': strToU8(`${head}<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="12"/><name val="Arial"/></font><font><b/><sz val="12"/><color rgb="FFFFFFFF"/><name val="Arial"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0E97AE"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="2"><xf fontId="0" fillId="0" borderId="0" xfId="0"/><xf fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs></styleSheet>`),
  };
  sheets.forEach((s, i) => {
    const cols = Math.max(1, ...s.rows.map((r) => r.length));
    const widths = Array.from({ length: cols }, (_, c) => Math.min(46, Math.max(12, ...s.rows.slice(0, 200).map((r) => String(r[c] ?? '').length + 3))));
    parts[`xl/worksheets/sheet${i + 1}.xml`] = strToU8(`${head}<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView rightToLeft="1" workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${widths.map((w, c) => `<col min="${c + 1}" max="${c + 1}" width="${w}" customWidth="1"/>`).join('')}</cols><sheetData>${s.rows.map((r, ri) => `<row r="${ri + 1}">${r.map((val, c) => cell(val, ri, c)).join('')}</row>`).join('')}</sheetData></worksheet>`);
  });
  return zipSync(parts, { level: 6 });
}

/** Turns a sheet into guests, finding the columns by their titles. */
export function guestsFromRows(rows: string[][]) {
  const find = (r: string[], ...keys: string[]) => r.findIndex((h) => keys.some((k) => h.replace(/\s+/g, ' ').toLowerCase().includes(k)));
  const hi = rows.findIndex((r) => find(r, 'الاسم', 'اسم', 'name') > -1 && (find(r, 'جوال', 'رقم', 'هاتف', 'phone', 'mobile') > -1 || find(r, 'ايميل', 'إيميل', 'بريد', 'email') > -1));
  const h = hi > -1 ? rows[hi]! : null;
  const at = h ? { n: find(h, 'الاسم', 'اسم', 'name'), p: find(h, 'جوال', 'رقم', 'هاتف', 'phone', 'mobile'), e: find(h, 'ايميل', 'إيميل', 'بريد', 'email'), s: find(h, 'ختم', 'seal'), t: find(h, 'صفة', 'title'), x: find(h, 'ملاحظ', 'note') } : { n: 0, p: 1, e: 2, s: 3, t: 4, x: 5 };
  return rows.slice(hi + 1).map((r) => ({ n: (r[at.n] || '').trim(), p: at.p > -1 ? (r[at.p] || '').trim() : '', e: at.e > -1 ? (r[at.e] || '').trim() : '', s: at.s > -1 ? (r[at.s] || '').trim() : '', t: at.t > -1 ? (r[at.t] || '').trim() : '', x: at.x > -1 ? (r[at.x] || '').trim() : '' })).filter((g) => g.n || g.p || g.e);
}

export const okPhone = (p: string) => { const d = p.replace(/[٠-٩]/g, (c) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/[^\d+]/g, ''); return /^(05\d{8}|5\d{8}|\+\d{8,15}|00\d{8,14}|966\d{9})$/.test(d); };
export const okEmail = (e: string) => /^[^@\s<>"',;:\\()[\]]+@[^@\s<>"',;:\\()[\]]+\.[a-z0-9-]{2,}$/i.test(e.trim());
