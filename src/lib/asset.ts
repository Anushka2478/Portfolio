import fs from 'node:fs';
import path from 'node:path';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Public URL for a file in /public, respecting the GitHub Pages base path. */
export const url = (p: string) => `${base}/${p.replace(/^\//, '')}`;

/** True when an exported screen exists, so pages can show a tidy placeholder instead of a broken image. */
export const hasAsset = (p: string) => fs.existsSync(path.join(process.cwd(), 'public', p.replace(/^\//, '')));

/** Parse an image key: "@x" = browser frame, "%x" = website on a phone, plain = platform default. */
export const parseShot = (key: string, platform: 'phone' | 'browser') => {
  if (key.startsWith('@')) return { kind: 'browser' as const, key: key.slice(1) };
  if (key.startsWith('%')) return { kind: 'phoneweb' as const, key: key.slice(1) };
  return { kind: platform === 'phone' ? ('phone' as const) : ('browser' as const), key };
};
