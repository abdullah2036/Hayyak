/**
 * The brand typeface (Thmanyah) travels as one scrambled pack and is put together in memory only. Its licence allows
 * embedding in a website as part of a packaged or obfuscated product, and forbids offering the font files themselves.
 * See docs/FONTS.md. The bytes of each font are not changed.
 */
export const FAMILIES = ['TD', 'TS'] as const;
export type Face = { family: (typeof FAMILIES)[number]; weight: number; bytes: Uint8Array<ArrayBuffer> };
const MAGIC = 0x48595431;
const HEAD = 8;

function scramble(u: Uint8Array, seed: number) {
  let s = seed | 1;
  for (let i = HEAD; i < u.length; i++) {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    u[i] = u[i]! ^ (s & 255);
  }
}

export function pack(faces: Face[], seed: number) {
  const u = new Uint8Array(HEAD + 1 + faces.reduce((n, f) => n + 7 + f.bytes.length, 0));
  const v = new DataView(u.buffer);
  v.setUint32(0, MAGIC);
  v.setUint32(4, seed >>> 0);
  let p = HEAD;
  u[p++] = faces.length;
  for (const f of faces) {
    u[p] = FAMILIES.indexOf(f.family);
    v.setUint16(p + 1, f.weight);
    v.setUint32(p + 3, f.bytes.length);
    u.set(f.bytes, p + 7);
    p += 7 + f.bytes.length;
  }
  scramble(u, seed);
  return u;
}

export function unpack(buf: ArrayBuffer): Face[] {
  const u = new Uint8Array(buf);
  const v = new DataView(buf);
  if (u.length < HEAD + 1 || v.getUint32(0) !== MAGIC) return [];
  scramble(u, v.getUint32(4));
  const out: Face[] = [];
  let p = HEAD + 1;
  for (let n = u[HEAD]!; n > 0; n--) {
    const len = v.getUint32(p + 3);
    out.push({ family: FAMILIES[u[p]!] ?? 'TS', weight: v.getUint16(p + 1), bytes: u.slice(p + 7, p + 7 + len) });
    p += 7 + len;
  }
  return out;
}

/**
 * Runs at the top of every page, before anything is drawn. Text waits for the typeface for a moment, so it does not
 * appear in one face and change to another; on later visits the browser already has it. Without a typeface, or if
 * anything fails, the open stand-ins take over.
 */
export function boot(url: string | null) {
  if (!url) return 'window.__hyType=Promise.resolve(false)';
  return `(function(w,d){var h=d.documentElement,c=h.classList,t=setTimeout(show,1200);function show(){clearTimeout(t);c.remove('hyw')}c.add('hyw');w.__hyTypeUrl=${JSON.stringify(url)};
w.__hyType=fetch(${JSON.stringify(url)}).then(function(r){return r.status===200?r.arrayBuffer():null}).then(function(b){if(!b)return false;var u=new Uint8Array(b),v=new DataView(b),n=u.length,i,p=9,a=[];if(n<9||v.getUint32(0)!==${MAGIC})return false;
var s=v.getUint32(4)|1;for(i=8;i<n;i++){s^=s<<13;s^=s>>>17;s^=s<<5;u[i]^=s&255}
for(i=u[8];i>0;i--){var l=v.getUint32(p+3);a.push(new FontFace(${JSON.stringify(FAMILIES)}[u[p]],b.slice(p+7,p+7+l),{weight:String(v.getUint16(p+1))}).load());p+=7+l}
return Promise.all(a).then(function(f){f.forEach(function(x){d.fonts.add(x)});return true})}).catch(function(){return false}).then(function(x){show();return x})})(window,document)`;
}
