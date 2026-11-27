(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('motion-ready');
  if (reduced) return;

  const intro = document.createElement('div');
  intro.className = 'motion-intro';
  intro.setAttribute('aria-hidden', 'true');
  const logo = document.createElement('img');
  logo.className = 'motion-logo';
  logo.src = `${ASSET}PRIZEWHITEnoBG.png`;
  logo.alt = '';
  const die = document.createElement('span');
  die.className = 'motion-die';
  intro.append(logo, die);
  document.body.append(intro);
  window.setTimeout(() => intro.classList.add('is-leaving'), 2250);
  window.setTimeout(() => intro.remove(), 3100);

  const revealTargets = document.querySelectorAll('main .section,main .card,main .calendar,main .event-row,main .album,main .bio,main .text-block,main .gallery-empty,main .social-list,main .dice-identity-gallery,main .unit-concept-gallery');
  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach(target => target.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  revealTargets.forEach((target, index) => {
    target.classList.add('motion-reveal');
    target.style.setProperty('--item-index', index % 6);
    observer.observe(target);
  });
})();
