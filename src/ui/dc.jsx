'use client';
/**
 * Small runtime shared by every screen.
 *  - S():    turns a CSS declaration string into a React style object (cached)
 *  - txt():  safe interpolation (undefined/null/false print as an empty string)
 *  - A:      link that understands the design page names and uses client navigation
 *  - Screen: base class. A screen keeps its state, builds view values in renderVals(),
 *            and hands them to its view.
 */
import React from 'react';
import Link from 'next/link';
import { resolve } from './routes';

const cache = new Map();
const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

export function txt(val) {
  return val === undefined || val === null || val === false ? '' : val;
}

export function S(css) {
  if (!css) return undefined;
  const hit = cache.get(css);
  if (hit) return hit;
  const out = {};
  let cur = '';
  let depth = 0;
  let quote = '';
  const flush = () => {
    const i = cur.indexOf(':');
    if (i > 0) {
      const k = cur.slice(0, i).trim();
      const val = cur.slice(i + 1).replace(/\s*!important\s*$/, '').trim();
      if (k && val) {
        if (k.startsWith('--')) out[k] = val;
        else if (k.startsWith('-webkit-')) out['Webkit' + camel('-' + k.slice(8))] = val;
        else out[k === 'float' ? 'cssFloat' : camel(k.toLowerCase())] = val;
      }
    }
    cur = '';
  };
  for (const c of css) {
    if (quote) {
      if (c === quote) quote = '';
      cur += c;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      cur += c;
      continue;
    }
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === ';' && depth === 0) flush();
    else cur += c;
  }
  flush();
  if (cache.size > 6000) cache.clear();
  cache.set(css, out);
  return out;
}

/** Only http(s), mailto, tel, calendar data, in-page and same-site links are ever rendered. */
export function safeHref(href) {
  if (typeof href !== 'string' || !href) return undefined;
  if (href[0] === '#' || (href[0] === '/' && href[1] !== '/' && href[1] !== '\\')) return href;
  if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) return href;
  if (/^data:text\/calendar[;,]/i.test(href)) return href;
  return undefined;
}

export function A({ href, children, ...rest }) {
  const target = safeHref(resolve(href));
  if (!target || target[0] === '#') {
    return (
      <a href={target} {...rest}>
        {children}
      </a>
    );
  }
  if (target[0] === '/' && !target.startsWith('/api/') && !rest.download && rest.target !== '_blank') {
    return (
      <Link href={target} prefetch={false} {...rest}>
        {children}
      </Link>
    );
  }
  if (/^https?:/i.test(target)) {
    return (
      <a href={target} {...rest} target="_blank" rel="noopener noreferrer nofollow">
        {children}
      </a>
    );
  }
  return (
    <a href={target} {...rest}>
      {children}
    </a>
  );
}

/** A control drawn without behaviour, for thumbnails. */
export function Still({ style, className, children }) {
  return (
    <span style={style} className={className}>
      {children}
    </span>
  );
}

export class Screen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderVals() {
    return {};
  }

  render() {
    const View = this.constructor.View;
    return <View v={this.renderVals()} />;
  }
}
