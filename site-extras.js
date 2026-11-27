(() => {
  const byText = (selector, pattern, root = document) => [...root.querySelectorAll(selector)].find(el => pattern.test(el.textContent));
  const page = document.body.dataset.page;

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

  const die = document.getElementById('dieButton');
  if (die) {
    die.setAttribute('aria-label', "Let's roll");
    die.title = "Let's roll";
    if (!document.querySelector('.roll-caption')) {
      const caption = document.createElement('span');
      caption.className = 'roll-caption';
      caption.textContent = "Let's roll";
      die.insertAdjacentElement('afterend', caption);
    }
  }

  if (page === 'home') {
    const heading = byText('h2', /ข่าวสารล่าสุด/);
    const section = heading?.closest('.section');
    const sectionHead = heading?.closest('.section-head');
    if (sectionHead && !sectionHead.querySelector('.all-news-link')) {
      const more = document.createElement('a');
      more.className = 'all-news-link';
      more.href = 'news.html';
      more.textContent = 'ข่าวสารทั้งหมด →';
      sectionHead.append(more);
    }
    if (section && !section.querySelector('[data-community-news-feed]')) {
      const feed = document.createElement('div');
      feed.className = 'community-news-feed';
      feed.dataset.communityNewsFeed = '';
      section.append(feed);
    }
  }

  if (page === 'news') {
    const main = document.querySelector('main');
    if (main && !main.querySelector('[data-community-news-feed]')) {
      const section = document.createElement('section');
      section.className = 'section community-news-section';
      section.innerHTML = '<div class="section-head"><h2>ข่าวจากทีมงานและชุมชน</h2><a href="community.html">เข้าร่วมชุมชน →</a></div>';
      const feed = document.createElement('div');
      feed.className = 'community-news-feed';
      feed.dataset.communityNewsFeed = '';
      section.append(feed);
      main.append(section);
    }
  }

  // Add pop-up portraits to home member tiles. Tapping once on touch opens a preview.
  document.querySelectorAll('.home-member').forEach(member => {
    const image = member.querySelector('img');
    if (!image || member.dataset.previewReady) return;
    member.dataset.previewReady = 'true';
    member.setAttribute('aria-label', `ดูรูปสมาชิก ${image.alt}`);
    const preview = document.createElement('span');
    preview.className = 'member-hover-preview';
    preview.setAttribute('aria-hidden', 'true');
    const enlarged = image.cloneNode();
    enlarged.removeAttribute('loading');
    const name = document.createElement('strong');
    name.textContent = image.alt;
    preview.append(enlarged, name);
    member.append(preview);
    member.addEventListener('click', event => {
      if (!window.matchMedia('(hover: none)').matches || member.classList.contains('preview-open')) return;
      event.preventDefault();
      document.querySelectorAll('.home-member.preview-open').forEach(other => other.classList.remove('preview-open'));
      member.classList.add('preview-open');
    });
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.home-member')) document.querySelectorAll('.home-member.preview-open').forEach(member => member.classList.remove('preview-open'));
  });
})();
