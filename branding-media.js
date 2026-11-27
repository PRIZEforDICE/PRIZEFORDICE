(() => {
  const asset = name => `${ASSET}${name}`;
  const makeVideo = (name, className, poster) => {
    const video = document.createElement('video');
    video.className = className;
    video.src = asset(name);
    video.poster = asset(poster);
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('aria-hidden', 'true');
    video.addEventListener('error', () => {
      if (!video.dataset.fallbackApplied) {
        video.dataset.fallbackApplied = 'true';
        const fallback = document.createElement('img');
        fallback.src = asset(poster);
        fallback.alt = name.startsWith('PRIZE') ? 'PRIZE' : 'DICE';
        fallback.className = className;
        video.replaceWith(fallback);
      }
    }, { once: true });
    video.play().catch(() => {});
    return video;
  };

  document.querySelectorAll('.brand img, .splash-inner img').forEach(image => {
    image.replaceWith(makeVideo('PRIZE.mp4', image.className, 'PRIZENEW.png'));
  });

  const homeDice = document.querySelector('.hero-art img');
  if (homeDice) homeDice.replaceWith(makeVideo('DICElogo.mp4', homeDice.className, 'DICE.png'));

  const meaningDice = document.querySelector('.meaning-img[src*="DICENEW.png"]');
  if (meaningDice) meaningDice.replaceWith(makeVideo('DICElogo.mp4', meaningDice.className, 'DICENEW.png'));

  if (document.body.dataset.page === 'meaning') {
    const introSplit = document.querySelector('.page .split');
    if (introSplit) {
      const gallery = document.createElement('div');
      gallery.className = 'dice-identity-gallery';
      ['DICEPURPLE.png', 'DICEPART.png', 'DICENEW.png'].forEach(file => {
        const image = document.createElement('img');
        image.src = asset(file);
        image.alt = '';
        image.loading = 'lazy';
        gallery.append(image);
      });
      introSplit.insertAdjacentElement('afterend', gallery);
    }

    document.querySelectorAll('.page .cards > .card').forEach(card => {
      const title = card.querySelector('h3')?.textContent.trim();
      if (title !== 'DICEBLUE' && title !== 'DICERED') return;
      const files = title === 'DICEBLUE'
        ? ['DICEBLUEIDEA.png', 'DICEBLUEPART.png']
        : ['DICEREDIDEA.png', 'DICEREDPART.png'];
      const gallery = document.createElement('div');
      gallery.className = 'unit-concept-gallery';
      files.forEach(file => {
        const image = document.createElement('img');
        image.src = asset(file);
        image.alt = '';
        image.loading = 'lazy';
        gallery.append(image);
      });
      card.append(gallery);
    });
  }
})();
