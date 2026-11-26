'use client';
/**
 * A small, still preview of an invitation. Pages show many of them, so one is drawn again only when what it shows
 * changes: picking a pattern on a phone no longer redraws every preview on the page.
 */
import { memo } from 'react';
import Invite from '@/screens/Invite';

const same = (a, b) => {
  const ka = Object.keys(a);
  if (ka.length !== Object.keys(b).length) return false;
  return ka.every((k) => (k === 'look' ? a.look === b.look || JSON.stringify(a.look) === JSON.stringify(b.look) : a[k] === b[k]));
};

function Thumb(props) {
  return <Invite {...props} thumb="نعم" />;
}

export default memo(Thumb, same);
