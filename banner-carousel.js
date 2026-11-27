(() => {
  const original = document.querySelector('.banner-link');
  if (!original) return;

  const slides = [
    { image: 'BANNER-TEACHME.png', alt: 'DICERED feat. GALCHANIE - Teach Me', url: 'https://dicesonray.lnk.to/TeachMe' },
    { image: 'BANNER-SISTER.png', alt: 'DICEBLUE - รอ SIS (TER)', url: 'https://dicesonray.lnk.to/TER' }
  ];
  const carousel = document.createElement('section');
  carousel.className = 'banner-carousel';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-roledescription', 'carousel');
  carousel.setAttribute('aria-label', 'แบนเนอร์ประชาสัมพันธ์ DICE');
  carousel.setAttribute('aria-live', 'off');

  const track = document.createElement('div');
  track.className = 'banner-carousel-slides';
  const dots = document.createElement('div');
  dots.className = 'banner-carousel-dots';
  dots.setAttribute('aria-label', 'เลือกแบนเนอร์');
  const slideLinks = [];
  const dotButtons = [];

  slides.forEach((slide, index) => {
    const link = document.createElement('a');
    link.className = 'banner-carousel-slide';
    link.href = slide.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `${slide.alt} — เปิดลิงก์สตรีมมิง`);
    link.setAttribute('aria-hidden', 'true');
    const image = document.createElement('img');
    image.src = `${ASSET}${slide.image}`;
    image.alt = slide.alt;
    image.width = 1600;
    image.height = 900;
    image.loading = index === 0 ? 'eager' : 'lazy';
    image.decoding = 'async';
    link.append(image);
    track.append(link);
    slideLinks.push(link);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'banner-carousel-dot';
    dot.setAttribute('aria-label', `แบนเนอร์ที่ ${index + 1}: ${slide.alt}`);
    dot.setAttribute('aria-current', 'false');
    dot.addEventListener('click', () => show(index, true));
    dots.append(dot);
    dotButtons.push(dot);
  });

  const previous = document.createElement('button');
  previous.type = 'button';
  previous.className = 'banner-carousel-control prev';
  previous.setAttribute('aria-label', 'แบนเนอร์ก่อนหน้า');
  previous.innerHTML = '&#8249;';
  previous.addEventListener('click', () => show((active - 1 + slides.length) % slides.length, true));

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'banner-carousel-control next';
  next.setAttribute('aria-label', 'แบนเนอร์ถัดไป');
  next.innerHTML = '&#8250;';
  next.addEventListener('click', () => show((active + 1) % slides.length, true));

  carousel.append(track, previous, next, dots);
  original.replaceWith(carousel);

  let active = 0;
  let timer;
  function show(index, resetTimer = false) {
    active = index;
    slideLinks.forEach((link, i) => {
      const selected = i === active;
      link.classList.toggle('is-active', selected);
      link.setAttribute('aria-hidden', String(!selected));
      dotButtons[i].setAttribute('aria-current', String(selected));
    });
    if (resetTimer) restart();
  }
  function stop() { window.clearInterval(timer); }
  function start() {
    stop();
    if (slides.length < 2 || document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = window.setInterval(() => show((active + 1) % slides.length), 5000);
  }
  function restart() { start(); }

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', event => { if (!carousel.contains(event.relatedTarget)) start(); });
  document.addEventListener('visibilitychange', start);
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show((active - 1 + slides.length) % slides.length, true); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show((active + 1) % slides.length, true); }
  });

  show(0);
  start();
})();
