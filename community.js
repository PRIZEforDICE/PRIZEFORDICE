import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, collection, addDoc, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, limit } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const $ = selector => document.querySelector(selector);
const configReady = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
const status = $('#communityStatus');
const authArea = $('#authArea');
const postForm = $('#postForm');
const newsForm = $('#newsForm');
const postsList = $('#communityPosts');
const newsList = $('#communityNews');
const setStatus = (message, kind = '') => { status.textContent = message; status.className = `community-status ${kind}`; };
const readableDate = timestamp => timestamp?.toDate ? new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp.toDate()) : 'เมื่อสักครู่';

if (!configReady) {
  setStatus('ระบบชุมชนกำลังเตรียมใช้งาน ต้องตั้งค่า Firebase และเปิด Google Sign-In ก่อน จึงจะสมัครสมาชิกหรือโพสต์ได้', 'setup-needed');
  authArea.innerHTML = '<a class="button primary" href="FIREBASE_SETUP.md">วิธีเปิดใช้งานระบบ</a>';
} else {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const google = new GoogleAuthProvider();
  google.setCustomParameters({ prompt: 'select_account' });

  const renderFeed = (snapshot, container, type) => {
    container.replaceChildren();
    if (snapshot.empty) {
      const empty = document.createElement('p');
      empty.className = 'community-empty';
      empty.textContent = type === 'post' ? 'ยังไม่มีโพสต์ในชุมชน เริ่มแบ่งปันเรื่องราวกันได้เลย' : 'ยังไม่มีข่าวที่เผยแพร่ผ่านระบบชุมชน';
      container.append(empty);
      return;
    }
    snapshot.forEach(item => {
      const data = item.data();
      const article = document.createElement('article');
      article.className = `community-entry ${type === 'news' ? 'community-news-entry' : ''}`;
      const header = document.createElement('header');
      const author = document.createElement('strong');
      author.textContent = data.authorName || 'สมาชิกชุมชน';
      const date = document.createElement('time');
      date.textContent = readableDate(data.createdAt);
      header.append(author, date);
      const title = document.createElement('h3');
      title.textContent = data.title || '';
      const body = document.createElement('p');
      body.textContent = data.text || '';
      article.append(header);
      if (data.title) article.append(title);
      article.append(body);
      if (data.videoUrl) {
        const safeUrl = new URL(data.videoUrl);
        if (safeUrl.hostname === 'youtu.be' || safeUrl.hostname.endsWith('youtube.com')) {
          const link = document.createElement('a');
          link.href = safeUrl.href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = 'เปิดวิดีโอ ↗';
          article.append(link);
        }
      }
      if (auth.currentUser && (data.uid === auth.currentUser.uid || document.body.dataset.isAdmin === 'true')) {
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'text-button';
        remove.textContent = 'ลบโพสต์';
        remove.addEventListener('click', async () => {
          if (!window.confirm('ยืนยันลบเนื้อหานี้?')) return;
          try { await deleteDoc(doc(db, type === 'news' ? 'news' : 'posts', item.id)); }
          catch { setStatus('ลบไม่สำเร็จ ตรวจสอบสิทธิ์หรือการเชื่อมต่อ', 'error'); }
        });
        article.append(remove);
      }
      container.append(article);
    });
  };

  onSnapshot(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(60)), snapshot => renderFeed(snapshot, postsList, 'post'), () => setStatus('โหลดโพสต์ไม่สำเร็จ ตรวจสอบ Firestore Rules', 'error'));
  onSnapshot(query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(30)), snapshot => renderFeed(snapshot, newsList, 'news'), () => setStatus('โหลดข่าวไม่สำเร็จ ตรวจสอบ Firestore Rules', 'error'));

  onAuthStateChanged(auth, async user => {
    document.body.dataset.isAdmin = 'false';
    authArea.replaceChildren();
    if (!user) {
      const login = document.createElement('button');
      login.className = 'button google-button';
      login.type = 'button';
      login.textContent = 'เข้าสู่ระบบ / สมัครสมาชิกด้วย Google';
      login.addEventListener('click', async () => {
        try { await signInWithPopup(auth, google); setStatus('เข้าสู่ระบบสำเร็จ', 'success'); }
        catch (error) { setStatus(error.code === 'auth/popup-closed-by-user' ? 'ปิดหน้าต่างเข้าสู่ระบบแล้ว' : 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบ Google Sign-In', 'error'); }
      });
      authArea.append(login);
      postForm.querySelector('button[type="submit"]').disabled = true;
      return;
    }
    const welcome = document.createElement('span');
    welcome.className = 'signed-in-user';
    welcome.textContent = `เข้าสู่ระบบ: ${user.displayName || user.email || 'สมาชิก'}`;
    const logout = document.createElement('button');
    logout.className = 'text-button';
    logout.type = 'button';
    logout.textContent = 'ออกจากระบบ';
    logout.addEventListener('click', () => signOut(auth));
    authArea.append(welcome, logout);
    postForm.querySelector('button[type="submit"]').disabled = false;

    try {
      const adminRecord = await getDoc(doc(db, 'admins', user.uid));
      const isAdmin = adminRecord.exists();
      document.body.dataset.isAdmin = String(isAdmin);
      newsForm.hidden = !isAdmin;
      $('#adminNotice').textContent = isAdmin ? 'บัญชีผู้ดูแล: เพิ่ม/แก้ไขข่าวสารได้' : 'สมาชิกทั่วไปโพสต์ในชุมชนได้ การเผยแพร่ข่าวสงวนสิทธิ์เฉพาะผู้ดูแลเว็บไซต์';
    } catch {
      newsForm.hidden = true;
      $('#adminNotice').textContent = 'ไม่สามารถตรวจสอบสิทธิ์ผู้ดูแลได้';
    }
  });

  postForm.addEventListener('submit', async event => {
    event.preventDefault();
    const user = auth.currentUser;
    const text = $('#postText').value.trim();
    if (!user || !text || text.length > 2000) return setStatus('เข้าสู่ระบบก่อนโพสต์ และจำกัดข้อความไม่เกิน 2,000 ตัวอักษร', 'error');
    try {
      await addDoc(collection(db, 'posts'), { uid: user.uid, authorName: user.displayName || 'สมาชิกชุมชน', text, createdAt: serverTimestamp() });
      postForm.reset();
      setStatus('โพสต์ลงชุมชนแล้ว', 'success');
    } catch { setStatus('โพสต์ไม่สำเร็จ ตรวจสอบการเข้าสู่ระบบและ Firestore Rules', 'error'); }
  });

  newsForm.addEventListener('submit', async event => {
    event.preventDefault();
    const user = auth.currentUser;
    const title = $('#newsTitle').value.trim();
    const text = $('#newsText').value.trim();
    const videoUrl = $('#newsVideo').value.trim();
    if (!user || !title || !text) return setStatus('กรอกหัวข้อและเนื้อหาข่าวให้ครบ', 'error');
    if (videoUrl) {
      try { const url = new URL(videoUrl); if (!['youtube.com','www.youtube.com','youtu.be','www.youtube-nocookie.com'].includes(url.hostname)) throw new Error(); }
      catch { return setStatus('ลิงก์วิดีโอต้องเป็น YouTube URL', 'error'); }
    }
    try {
      await addDoc(collection(db, 'news'), { uid: user.uid, authorName: user.displayName || user.email, title, text, videoUrl, createdAt: serverTimestamp() });
      newsForm.reset();
      setStatus('เผยแพร่ข่าวแล้ว', 'success');
    } catch { setStatus('เผยแพร่ไม่สำเร็จ บัญชีนี้ต้องมีสิทธิ์ผู้ดูแลใน Firestore', 'error'); }
  });
}
