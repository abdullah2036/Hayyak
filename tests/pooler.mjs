/**
 * Sits between the app and Postgres and counts the queries that Supabase's pooler (before 2.10) would never answer:
 * those sent on a connection before the answer to the one in front of them is complete.
 */
import net from 'node:net';

export function watchPooler(url, listen) {
  const to = new URL(url);
  const stat = { queries: 0, pipelined: 0 };
  const srv = net.createServer((app) => {
    const pg = net.connect(Number(to.port || 5432), to.hostname);
    let started = false;
    let batch = false; // messages were sent and their Sync was not yet
    let waiting = 1; // answers not complete yet; the first is the sign-in
    let a = Buffer.alloc(0);
    let b = Buffer.alloc(0);
    app.on('data', (d) => {
      pg.write(d);
      a = Buffer.concat([a, d]);
      for (;;) {
        if (a.length < 8 && !started) return;
        const size = started ? (a.length < 5 ? Infinity : a.readInt32BE(1) + 1) : a.readInt32BE(0);
        if (a.length < size) return;
        const type = started ? String.fromCharCode(a[0]) : '';
        // 80877103 asks for TLS and 80877102 cancels a query: neither opens a session.
        if (!started) started = ![80877103, 80877102].includes(a.readInt32BE(4));
        else if (type !== 'p' && type !== 'X') {
          if (!batch && waiting > 0) stat.pipelined++;
          batch = type !== 'S' && type !== 'Q';
          if (!batch) (waiting++, stat.queries++);
        }
        a = a.subarray(size);
      }
    });
    let tls = false;
    pg.on('data', (d) => {
      app.write(d);
      b = Buffer.concat([b, d]);
      if (!started && !tls && b.length === 1) return void ((tls = true), (b = Buffer.alloc(0)));
      while (b.length >= 5 && b.length >= b.readInt32BE(1) + 1) {
        if (b[0] === 90) waiting--; // ReadyForQuery
        b = b.subarray(b.readInt32BE(1) + 1);
      }
    });
    const end = () => (app.destroy(), pg.destroy());
    for (const s of [app, pg]) s.on('error', end).on('close', end);
  });
  const via = new URL(url);
  via.hostname = '127.0.0.1';
  via.port = String(listen);
  return new Promise((done) => srv.listen(listen, '127.0.0.1', () => done({ url: via.href, stat, close: () => srv.close() })));
}
