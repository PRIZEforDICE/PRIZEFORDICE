import { db } from './firebase-config.js';
import { collection, onSnapshot, orderBy, query, limit } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const containers = [...document.querySelectorAll('[data-community-news-feed]')];
if (containers.length) {
  const render = snapshot => containers.forEach(container => {
    container.replaceChildren();
    if (snapshot.empty) {
      const empty = document.createElement('p');
      empty.className = 'community-empty';
      empty.textContent = 'ยังไม่มีข่าวเพิ่มเติมจากทีมงาน';
      container.append(empty);
    }
    snapshot.forEach(item => {
      const data = item.data();
      const card = document.createElement('article');
      card.className = 'card community-news-entry';
      const label = document.createElement('span');
      label.className = 'label';
      label.textContent = 'COMMUNITY NEWS';
      const title = document.createElement('h3');
      title.textContent = data.title || '';
      const text = document.createElement('p');
      text.textContent = data.text || '';
      card.append(label, title, text);
      if (data.videoUrl) {
        try {
          const url = new URL(data.videoUrl);
          const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v');
          if (id && /^[\x00-\x7F]{6,20}$/.test(id)) {
            const frame = document.createElement('iframe');
            frame.className = 'news-youtube';
            frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
            frame.title = data.title || 'วิดีโอข่าว';
            frame.loading = 'lazy';
            frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            frame.allowFullscreen = true;
            card.append(frame);
          }
        } catch { /* Ignore malformed optional video links. */ }
      }
      container.append(card);
    });
    const link = document.createElement('a');
    link.className = 'community-feed-link';
    link.href = 'community.html';
    link.textContent = 'ร่วมพูดคุยและโพสต์ในชุมชน →';
    container.append(link);
  });
  onSnapshot(query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(30)), render, error => {
    containers.forEach(container => {
      const message = document.createElement('p');
      message.className = 'community-feed-error';
      message.textContent = 'โหลดข่าวเพิ่มเติมไม่สำเร็จ โปรดตรวจสอบสิทธิ์การอ่านข่าวใน Firestore';
      container.append(message);
    });
    console.error('Community news feed error', error);
  });
}
