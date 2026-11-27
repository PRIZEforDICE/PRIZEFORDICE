(() => {
  const asset = name => `${ASSET}${name}`;
  document.querySelectorAll('.brand img, .splash-inner img').forEach(image => {
    image.src = asset('PRIZEWHITEnoBG.png');
    image.alt = 'PRIZE';
    image.decoding = 'async';
  });

  const page = document.body.dataset.page;
  if (page === 'home') {
    const hero = document.querySelector('.hero');
    if (hero) {
      const eyebrow = hero.querySelector('.eyebrow');
      const heading = hero.querySelector('h1');
      const description = hero.querySelector('p');
      const quickLinks = hero.querySelector('.quick');
      const art = hero.querySelector('.hero-art');
      const die = hero.querySelector('.die-button');
      if (eyebrow) eyebrow.textContent = 'PRIZE FOR DICE';
      if (heading) {
        heading.textContent = 'ความแปลกใหม่ มิติที่หลากหลาย และความน่าค้นหา';
        heading.classList.add('hero-subtitle');
      }
      description?.remove();
      quickLinks?.remove();
      const oldMark = art?.querySelector('img,video');
      oldMark?.remove();
      if (art && die) {
        die.classList.add('hero-die');
        die.setAttribute('aria-label', 'ทอยลูกเต๋า');
        art.replaceChildren(die);
      }
    }

    const main = document.querySelector('main');
    const sections = [...(main?.querySelectorAll(':scope > .section') || [])];
    const scheduleSection = sections.find(section => /ตารางงานที่กำลังจะมาถึง/.test(section.textContent));
    const latestSection = sections.find(section => /ผลงานและกิจกรรมล่าสุด/.test(section.textContent));
    const newsSection = sections.find(section => /ข่าวสารล่าสุด/.test(section.textContent));

    if (scheduleSection) {
      const intro = document.createElement('section');
      intro.className = 'section home-members';
      intro.innerHTML = '<div class="section-head"><h2>มาทำความรู้จักวง DICE กันหน่อยดีกว่าาา!!!</h2><a href="members.html">สมาชิกทั้งหมด →</a></div><p class="intro">10 สมาชิก 10 คาแรกเตอร์ รวมกันเป็น DICE — มารู้จักพวกเขาให้มากขึ้น</p><div class="home-member-grid"></div>';
      const grid = intro.querySelector('.home-member-grid');
      [['MIN','มิน'],['ALEX','อเล็กซ์'],['JAY','เจย์'],['APO','อาโป'],['JISANG','จีซัง'],['OBO','โอโบ'],['CHEESE','ชีส'],['MADDOC','แมดดอค'],['OTTO','อ๊อตโต้'],['FRAME','เฟรม']].forEach(([file,name]) => {
        const link = document.createElement('a');
        link.className = 'home-member';
        link.href = 'members.html';
        const image = document.createElement('img');
        image.src = asset(`${file}.png`);
        image.alt = name;
        image.loading = 'lazy';
        link.append(image);
        grid.append(link);
      });
      scheduleSection.replaceWith(intro);
    }
    latestSection?.remove();

    if (newsSection) {
      const cards = newsSection.querySelector('.cards');
      if (cards) {
        cards.classList.add('news-feature-grid');
        cards.replaceChildren();

        const teachMe = document.createElement('article');
        teachMe.className = 'card teachme-feature';
        teachMe.innerHTML = '<div class="teachme-copy"><span class="label">DICERED · NEW RELEASE</span><h3>DICERED feat. GALCHANIE ‘สอนที (Teach Me)’ OUT NOW!!</h3><p>MUSIC ON ALL STREAMING<br>ฟังเพลงกันได้แล้วตอนนี้! 🏝️</p><a class="button primary" href="https://dicesonray.lnk.to/TeachMe" target="_blank" rel="noopener noreferrer">ฟังเพลงบนทุกแพลตฟอร์ม ↗</a></div><div class="teachme-video-wrap"></div>';
        const teachMeVideo = document.createElement('video');
        teachMeVideo.className = 'teachme-video';
        teachMeVideo.src = asset('TEACHME300K.mp4');
        teachMeVideo.poster = asset('BANNER-TEACHME.png');
        teachMeVideo.controls = true;
        teachMeVideo.autoplay = true;
        teachMeVideo.muted = true;
        teachMeVideo.loop = true;
        teachMeVideo.playsInline = true;
        teachMeVideo.preload = 'metadata';
        teachMeVideo.setAttribute('aria-label', 'DICERED feat. GALCHANIE สอนที (Teach Me)');
        teachMeVideo.play().catch(() => {});
        teachMe.querySelector('.teachme-video-wrap').append(teachMeVideo);

        const sister = document.createElement('article');
        sister.className = 'card teachme-feature sister-feature';
        sister.innerHTML = '<div class="teachme-copy"><span class="label">DICEBLUE · NEW RELEASE <span class="news-age">1 month ago.</span></span><h3>DICEBLUE ‘รอ SIS (TER)’ OUT NOW!!</h3><p>รับชมมิวสิกวิดีโอและติดตามผลงานของ DICEBLUE</p><a class="button primary" href="https://www.youtube.com/watch?v=C0DXctGPWxw" target="_blank" rel="noopener noreferrer">รับชมบน YouTube ↗</a></div><div class="teachme-video-wrap sister-video-wrap"></div>';
        const sisterVideo = document.createElement('iframe');
        sisterVideo.className = 'sister-youtube';
        sisterVideo.src = 'https://www.youtube-nocookie.com/embed/C0DXctGPWxw';
        sisterVideo.title = 'DICEBLUE ‘รอ SIS (TER)’ Official YouTube video';
        sisterVideo.loading = 'lazy';
        sisterVideo.referrerPolicy = 'strict-origin-when-cross-origin';
        sisterVideo.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        sisterVideo.allowFullscreen = true;
        sister.querySelector('.sister-video-wrap').append(sisterVideo);
        cards.append(teachMe, sister);
      }
    }
  }

  const meaningDice = document.querySelector('.meaning-img[src*="DICENEW.png"]');
  if (meaningDice) {
    const video = document.createElement('video');
    video.className = meaningDice.className;
    video.src = asset('DICElogo.mp4');
    video.poster = asset('DICENEW.png');
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('aria-label', 'โลโก้ DICE');
    video.play().catch(() => {});
    meaningDice.replaceWith(video);
  }

  if (page === 'meaning') {
    const introSplit = document.querySelector('.page .split');
    if (introSplit && !document.querySelector('.dice-identity-gallery')) {
      const gallery = document.createElement('div');
      gallery.className = 'dice-identity-gallery';
      ['DICEPURPLE.png','DICEPART.png','DICENEW.png'].forEach(file => {
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
      if ((title !== 'DICEBLUE' && title !== 'DICERED') || card.querySelector('.unit-concept-gallery')) return;
      const files = title === 'DICEBLUE' ? ['DICEBLUEIDEA.png','DICEBLUEPART.png'] : ['DICEREDIDEA.png','DICEREDPART.png'];
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
