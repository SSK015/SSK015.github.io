(() => {
  'use strict';
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.main-nav');
  const indicator = document.querySelector('.nav-indicator');
  const progress = document.querySelector('[data-reading-progress]');
  const glow = document.querySelector('.cursor-glow');
  const home = document.body.dataset.home === 'true';
  const links = home ? [...document.querySelectorAll('.main-nav [data-section]')] : [];
  const sections = links.map(link => document.getElementById(link.dataset.section)).filter(Boolean);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine)');
  let frame = 0;
  let measureNeeded = true;
  let pointerNeeded = false;
  let headerHeight = 0;
  let maxScroll = 0;
  let rows = [];
  let linkBoxes = [];
  let activeId = '';
  let requestedId = '';
  let pointer = null;
  let litSurface = null;

  function requestFrame() {
    if (!frame) frame = window.requestAnimationFrame(render);
  }
  function requestMeasure() { measureNeeded = true; requestFrame(); }
  function selectSection(id) {
    if (!links.some(link => link.dataset.section === id)) return;
    requestedId = id;
    activeId = '';
    requestFrame();
  }
  function selectHash() {
    try { selectSection(decodeURIComponent(window.location.hash.slice(1))); } catch (_) {}
  }
  function manualScroll(event) {
    if (event.type === 'keydown' && (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key) || event.target.closest('input, textarea, [contenteditable]'))) return;
    requestedId = '';
    requestFrame();
  }
  function nearestSection(y) {
    if (!rows.length) return '';
    if (requestedId) return requestedId;
    if (y > 0 && y >= maxScroll - 2) return rows[rows.length - 1].id;
    const anchor = y + headerHeight + 12;
    const visible = rows.filter(row => row.bottom > y + headerHeight && row.top < y + window.innerHeight);
    return (visible.length ? visible : rows).reduce((best, row) =>
      Math.abs(row.top - anchor) < Math.abs(best.top - anchor) ? row : best
    ).id;
  }
  function render() {
    frame = 0;
    if (measureNeeded) {
      headerHeight = header ? header.getBoundingClientRect().height : 0;
      maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      rows = sections.map(section => {
        const box = section.getBoundingClientRect();
        return { id: section.id, top: box.top + window.scrollY, bottom: box.bottom + window.scrollY };
      });
      const navBox = nav ? nav.getBoundingClientRect() : { left: 0 };
      linkBoxes = links.map(link => {
        const box = link.getBoundingClientRect();
        return { left: box.left - navBox.left, width: box.width };
      });
      measureNeeded = false;
      activeId = '';
    }
    const id = nearestSection(window.scrollY);
    const point = pointerNeeded && pointer && finePointer.matches && !motion.matches ? pointer : null;
    const surfaceBox = point && point.surface ? point.surface.getBoundingClientRect() : null;
    if (progress) progress.style.transform = 'scaleX(' + (maxScroll ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0) + ')';
    if (id && id !== activeId) {
      activeId = id;
      links.forEach((link, index) => {
        const current = link.dataset.section === id;
        link.classList.toggle('active', current);
        if (current) {
          link.setAttribute('aria-current', 'location');
          if (indicator && linkBoxes[index]) {
            indicator.style.width = linkBoxes[index].width + 'px';
            indicator.style.transform = 'translate3d(' + linkBoxes[index].left + 'px,0,0)';
            nav.classList.add('has-indicator');
          }
        } else link.removeAttribute('aria-current');
      });
    }
    if (pointerNeeded) {
      if (litSurface && (!point || litSurface !== point.surface)) litSurface.classList.remove('is-pointer-active');
      litSurface = point ? point.surface : null;
      if (point) {
        if (glow) glow.style.transform = 'translate3d(' + (point.x - 260) + 'px,' + (point.y - 260) + 'px,0)';
        root.classList.add('has-pointer');
        if (litSurface && surfaceBox) {
          litSurface.style.setProperty('--pointer-x', (point.x - surfaceBox.left).toFixed(1) + 'px');
          litSurface.style.setProperty('--pointer-y', (point.y - surfaceBox.top).toFixed(1) + 'px');
          litSurface.classList.add('is-pointer-active');
        }
      } else root.classList.remove('has-pointer');
      pointerNeeded = false;
    }
  }
  function clearPointer() { pointer = null; pointerNeeded = true; requestFrame(); }
  window.addEventListener('scroll', () => { if (pointer) pointerNeeded = true; requestFrame(); }, { passive: true });
  window.addEventListener('resize', requestMeasure);
  window.addEventListener('load', requestMeasure);
  window.addEventListener('hashchange', selectHash);
  window.addEventListener('wheel', manualScroll, { passive: true });
  window.addEventListener('touchmove', manualScroll, { passive: true });
  window.addEventListener('keydown', manualScroll);
  window.addEventListener('scrollend', () => {
    const row = rows.find(row => row.id === requestedId);
    if (row && Math.abs(row.top - window.scrollY - headerHeight) < 40) requestedId = '';
  });
  document.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest('a[href]');
    if (anchor && anchor.origin === location.origin && anchor.pathname === location.pathname && anchor.hash) {
      try { selectSection(decodeURIComponent(anchor.hash.slice(1))); } catch (_) {}
    }
    const shortcut = event.target.closest('[data-run-command]');
    if (shortcut) selectSection(shortcut.dataset.runCommand);
  });
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !finePointer.matches || motion.matches || root.classList.contains('lightbox-open')) return;
    pointer = { x: event.clientX, y: event.clientY, surface: event.target.closest('.work-card, .engineering-card, .terminal-window') };
    pointerNeeded = true;
    requestFrame();
  }, { passive: true });
  document.addEventListener('pointerleave', clearPointer);
  finePointer.addEventListener('change', clearPointer);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearPointer();
      if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
    } else requestMeasure();
  });
  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(requestMeasure);
    const main = document.querySelector('.site-main');
    if (main) observer.observe(main);
    if (header) observer.observe(header);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(requestMeasure);
  let copyTimer;
  const copyButton = document.querySelector('[data-copy-email]');
  const copyStatus = document.querySelector('[data-copy-status]');
  function legacyCopy(text) {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
    document.body.append(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) {}
    field.remove();
    if (copyButton) copyButton.focus({ preventScroll: true });
    return copied;
  }
  if (copyButton) copyButton.addEventListener('click', async event => {
    event.preventDefault();
    const email = copyButton.dataset.email;
    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
        copied = true;
      }
    } catch (_) {}
    if (!copied) copied = legacyCopy(email);
    if (copyTimer) window.clearTimeout(copyTimer);
    if (copyStatus) copyStatus.textContent = copied ? 'Copied ✓' : 'Select the address to copy';
    copyButton.classList.toggle('is-copied', copied);
    if (!copied) {
      const label = copyButton.querySelector('[data-email-label]');
      if (label) {
        const range = document.createRange();
        range.selectNodeContents(label);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    copyTimer = window.setTimeout(() => {
      if (copyStatus) copyStatus.textContent = '';
      copyButton.classList.remove('is-copied');
    }, 2000);
  });

  // Native dialog provides Escape dismissal and a keyboard focus trap.
  const imageDialog = document.querySelector('#image-lightbox');
  const imageView = document.querySelector('#image-lightbox-view');
  const imageCaption = document.querySelector('#image-lightbox-caption');
  const imageClose = document.querySelector('[data-close-lightbox]');
  let imageOpener = null;
  if (imageDialog && imageView && imageClose) {
    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      const link = target ? target.closest('[data-lightbox]') : null;
      if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || typeof imageDialog.showModal !== 'function') return;
      event.preventDefault();
      if (imageDialog.open) return;
      const palette = document.querySelector('#command-dialog');
      if (palette && palette.open) palette.close();
      imageOpener = link;
      const preview = link.querySelector('img');
      imageView.src = link.href;
      imageView.alt = preview ? preview.alt : link.dataset.imageTitle || 'Project image';
      if (imageCaption) imageCaption.textContent = (link.dataset.imageTitle || 'Project') + ' · Full-size image';
      clearPointer();
      root.classList.add('lightbox-open');
      imageDialog.showModal();
      imageClose.focus({ preventScroll: true });
    });
    imageClose.addEventListener('click', () => imageDialog.close());
    imageDialog.addEventListener('click', event => {
      if (event.target !== imageView && event.target !== imageCaption && !imageClose.contains(event.target)) imageDialog.close();
    });
    imageDialog.addEventListener('close', () => {
      root.classList.remove('lightbox-open');
      if (imageOpener && imageOpener.isConnected) imageOpener.focus({ preventScroll: true });
      imageOpener = null;
    });
  }

  let revealObserver;
  const revealItems = [...document.querySelectorAll('.section-heading, .undergraduate-heading, .work-card, .engineering-card, .research-item, .personal-copy, .personal-art, .project-artwork, .contact-section > div')];
  function setupReveals() {
    if (revealObserver) revealObserver.disconnect();
    if (motion.matches || typeof IntersectionObserver !== 'function') {
      revealItems.forEach(item => item.dataset.reveal = 'visible');
      return;
    }
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.dataset.reveal = 'visible';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -20px 0px' });
    revealItems.forEach((item, index) => {
      if (item.dataset.reveal === 'visible') return;
      item.style.setProperty('--reveal-delay', ((index % 4) * 45) + 'ms');
      item.dataset.reveal = 'pending';
      revealObserver.observe(item);
    });
  }
  document.addEventListener('focusin', event => {
    const item = event.target.closest('[data-reveal]');
    if (item) item.dataset.reveal = 'visible';
  });
  motion.addEventListener('change', () => { clearPointer(); setupReveals(); });
  setupReveals();
  selectHash();
  requestFrame();
})();
