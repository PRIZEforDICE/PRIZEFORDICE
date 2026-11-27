(() => {
  const ASSET = 'https://cdn.jsdelivr.net/gh/PRIZEforDICE/PRIZEFORDICE/';
  const byText = (selector, pattern, root = document) => [...root.querySelectorAll(selector)].find(el => pattern.test(el.textContent));

  // Add direct routes to the public community and the terms page to shared navigation/footer.
  const nav = document.querySelector('.navlinks');
  if (nav && !nav.querySelector('[data-community-link]')) {
    const link = document.createElement('a');
    link.href = 'community.html';
    link.textContent = 'ชุมชน';
    link.dataset.communityLink = '';
    nav.append(link);
  }
  document.querySelectorAll('.footer .wrap').forEach(footer => {
    if (footer.querySelector('.site-legal-links')) return;
    const links = document.createElement('nav');
    links.className = 'site-legal-links';
    links.setAttribute('aria-label', 'ลิงก์เพิ่มเติม');
    links.innerHTML = '<a href="community.html">ชุมชนแฟนคลับ</a><a href="terms.html">ข้อกำหนดการใช้บริการ</a>';
    footer.append(links);
  });

  // Keep the die itself interactive and give it the requested call to action.
  const die = document.getElementById('dieButton');
  if (die) {
    die.setAttribute('aria-label', "Let's roll");
    if (!document.querySelector('.roll-caption')) {
      const caption = document.createElement('span');
      caption.className = 'roll-caption';
      caption.textContent = "Let's roll";
      die.insertAdjacentElement('afterend', caption);
    }
  }

  // Replace the Teach Me clip with the official YouTube video and make latest news link to news.html.
  const newsSection = byText('h2', /ข่าวสารล่าสุด/);
  if (newsSection) {
    const section = newsSection.closest('.section');
    const sectionHead = newsSection.closest('.section-head');
    if (sectionHead && !sectionHead.querySelector('.all-news-link')) {
      const more = document.createElement('a');
      more.className = 'all-news-link';
      more.href = 'news.html';
      more.textContent = 'ข่าวสารทั้งหมด →';
      sectionHead.append(more);
    }
    const cards = section?.querySelector('.cards');
    const teachCard = cards && byText('h3', /DICERED.*สอนที.*Teach Me/i, cards);
    if (teachCard) {
      const oldVideo = teachCard.querySelector('video,iframe');
      const wrap = oldVideo?.closest('.teachme-video-wrap') || teachCard.querySelector('.teachme-video-wrap');
      if (wrap) {
        wrap.replaceChildren();
        const frame = document.createElement('iframe');
        frame.className = 'news-youtube';
        frame.src = 'https://www.youtube-nocookie.com/embed/WumsLvZhHhk';
        frame.title = 'DICERED feat. GALCHANIE – สอนที (Teach Me)';
        frame.loading = 'lazy';
        frame.referrerPolicy = 'strict-origin-when-cross-origin';
        frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        frame.allowFullscreen = true;
        wrap.append(frame);
      }
      if (!cards.querySelector('.sister-feature')) {
        const sister = document.createElement('article');
        sister.className = 'card teachme-feature sister-feature';
        sister.innerHTML = '<div class="teachme-copy"><span class="label">DICEBLUE · NEW RELEASE <span class="news-age">1 month ago.</span></span><h3>DICEBLUE ‘รอ SIS (TER)’ OUT NOW!!</h3><p>รับชมมิวสิกวิดีโอและติดตามผลงานของ DICEBLUE</p><a class="button primary" href="https://www.youtube.com/watch?v=C0DXctGPWxw" target="_blank" rel="noopener noreferrer">รับชมบน YouTube ↗</a></div><div class="teachme-video-wrap"></div>';
        const frame = document.createElement('iframe');
        frame.className = 'news-youtube';
        frame.src = 'https://www.youtube-nocookie.com/embed/C0DXctGPWxw';
        frame.title = 'DICEBLUE – รอ SIS (TER)';
        frame.loading = 'lazy';
        frame.referrerPolicy = 'strict-origin-when-cross-origin';
        frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        frame.allowFullscreen = true;
        sister.querySelector('.teachme-video-wrap').append(frame);
        cards.append(sister);
      }
    }
  }

  // Member photos pop forward into a larger, readable preview on hover/focus.
  document.querySelectorAll('.home-member').forEach((member, index) => {
    const image = member.querySelector('img');
    if (!image || member.dataset.previewReady) return;
    member.dataset.previewReady = 'true';
    member.setAttribute('aria-label', `ดูรูปสมาชิก ${image.alt}`);
    member.style.setProperty('--member-index', index % 5);
    const preview = document.createElement('span');
    preview.className = 'member-hover-preview';
    preview.setAttribute('aria-hidden', 'true');
    const enlarged = image.cloneNode();
    enlarged.removeAttribute('loading');
    const name = document.createElement('strong');
    name.textContent = image.alt;
    preview.append(enlarged, name);
    member.append(preview);
  });
})();
