// Shared behaviour for every page. No frameworks; ~5 KB.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll(s)) as T[];

/* ---------- reveal on scroll (once) ---------- */
const reveals = $$('.reveal');
if (reduce || !('IntersectionObserver' in window)) reveals.forEach((el) => el.classList.add('is-in'));
else {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -15% 0px' });
  reveals.forEach((el) => io.observe(el));
}

/* ---------- go-up + scroll rail ---------- */
const goUp = $('[data-go-up]');
const thumb = $('.scroll-rail__thumb');
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? scrollY / max : 0;
  if (thumb) thumb.style.top = `${p * (240 - 56)}px`;
  goUp?.classList.toggle('is-visible', scrollY > innerHeight);
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();
goUp?.addEventListener('click', () => { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); ($('#main') as HTMLElement | null)?.focus?.(); });

/* ---------- scroll spy: header keys (home) and chapter tabs (stories) ---------- */
const spyLinks = $$<HTMLAnchorElement>('[data-spy]');
if (spyLinks.length && 'IntersectionObserver' in window) {
  const targets = spyLinks.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean) as HTMLElement[];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const i = targets.indexOf(e.target as HTMLElement);
      spyLinks.forEach((a, j) => {
        if (j === i) a.setAttribute('aria-current', a.dataset.spy === 'step' ? 'step' : 'true'); else a.removeAttribute('aria-current');
        a.dataset.state = j < i ? 'done' : j === i ? 'current' : 'upcoming';
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  targets.forEach((t) => io.observe(t));
}

/* ---------- character: eyes follow the pointer, blink, react to keys ---------- */
const character = $('.character--live');
if (character) {
  const pupils = $$<SVGGElement>('.expr--follow .pupils', character);
  const svg = $('svg', character)!;
  let raf = 0;
  if (!reduce) {
    addEventListener('pointermove', (ev) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = svg.getBoundingClientRect();
        const eyeX = r.left + r.width * 0.5, eyeY = r.top + r.height * 0.36;
        const dx = Math.max(-6, Math.min(6, (ev.clientX - eyeX) / 40));
        const dy = Math.max(-4, Math.min(4, (ev.clientY - eyeY) / 40));
        pupils.forEach((p) => p.setAttribute('transform', `translate(${dx} ${dy})`));
      });
    }, { passive: true });
    const blink = () => { character.classList.add('is-blinking'); setTimeout(() => character.classList.remove('is-blinking'), 140); setTimeout(blink, 3500 + Math.random() * 1500); };
    setTimeout(blink, 3000);
  }
  const setEyes = (e: string) => (character.dataset.eyes = e);
  $$<HTMLElement>('[data-eyes-on]').forEach((el) => {
    const e = el.dataset.eyesOn!;
    el.addEventListener('pointerenter', () => setEyes(e));
    el.addEventListener('focus', () => setEyes(e));
    el.addEventListener('pointerleave', () => setEyes('follow'));
    el.addEventListener('blur', () => setEyes('follow'));
  });
}

/* ---------- keyboard shortcuts F1 / F2 / F3 (home only) ---------- */
const shortcuts = $$<HTMLAnchorElement>('[data-shortcut]');
if (shortcuts.length) {
  addEventListener('keydown', (ev) => {
    const t = ev.target as HTMLElement;
    if (t.closest('input, textarea, [contenteditable]') || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    const a = shortcuts.find((s) => s.dataset.shortcut === ev.key);
    if (a) { ev.preventDefault(); a.click(); }
  });
}

/* ---------- folder pop-ups (<dialog>) ---------- */
$$<HTMLButtonElement>('[data-open-popup]').forEach((btn) => {
  const dlg = document.getElementById(btn.dataset.openPopup!) as HTMLDialogElement | null;
  if (!dlg) return;
  btn.addEventListener('click', () => {
    const r = btn.getBoundingClientRect();
    dlg.style.setProperty('--from-x', `${r.left + r.width / 2 - innerWidth / 2}px`);
    dlg.style.setProperty('--from-y', `${r.top + r.height / 2 - innerHeight / 2}px`);
    dlg.showModal();
  });
  dlg.addEventListener('click', (ev) => { if (ev.target === dlg) dlg.close(); });
  $$('[data-close]', dlg).forEach((c) => c.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('close', () => btn.focus());
});

/* ---------- count-up for numeric targets ---------- */
const counters = $$<HTMLElement>('[data-count]');
if (counters.length && !reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return; io.unobserve(e.target);
    const el = e.target as HTMLElement; const final = el.textContent || ''; const m = final.match(/(\d+)/); if (!m) return;
    const n = +m[1]; const t0 = performance.now();
    const step = (t: number) => { const k = Math.min(1, (t - t0) / 600); const v = Math.round(n * (1 - Math.pow(1 - k, 3))); el.textContent = final.replace(m[1], String(v)); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  counters.forEach((c) => io.observe(c));
}
