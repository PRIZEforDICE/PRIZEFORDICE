import { auth, db, googleProvider } from './firebase-config.js';
import { getRedirectResult, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { collection, addDoc, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, limit } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const $ = selector => document.querySelector(selector);
const status = $('#communityStatus');
const authArea = $('#authArea');
const postForm = $('#postForm');
const newsForm = $('#newsForm');
const postsList = $('#communityPosts');
const newsList = $('#communityNews');
const setStatus = (message, kind = '') => { status.textContent = message; status.className = `community-status ${kind}`; };
const readableDate = timestamp => timestamp?.toDate ? new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp.toDate()) : 'เมื่อสักครู่';

const authErrorMessage = error => {
  switch (error?.code) {
    case 'auth/unauthorized-domain':
      return `โดเมนนี้ยังไม่ได้รับอนุญาตจาก Firebase (${location.hostname}) กรุณาเพิ่ม ${location.hostname} ที่ Firebase Console → Authentication → Settings → Authorized domains แล้วลองใหม่`;
    case 'auth/operation-not-allowed':
      return 'Google Sign-In ยังไม่เปิดใช้งานใน Firebase Console → Authentication → Sign-in method → Google';
    case 'auth/popup-blocked':
    case 'auth/popup-closed-by-user':
      return 'หน้าต่างเข้าสู่ระบบถูกปิดหรือถูกบล็อก กำลังลองเข้าสู่ระบบด้วยหน้าเปลี่ยนเส้นทาง';
    case 'auth/network-request-failed':
      return 'เชื่อมต่อ Firebase ไม่ได้ กรุณาตรวจสอบอินเทอร์เน็ตหรือการบล็อกสคริปต์';
    case 'auth/invalid-api-key':
      return 'Firebase API key ไม่ถูกต้อง กรุณาตรวจสอบ firebase-config.js และการตั้งค่า API key';
    case 'auth/account-exists-with-different-credential':
      return 'อีเมลนี้มีบัญชีอยู่แล้วด้วยวิธีเข้าสู่ระบบอื่น กรุณาใช้วิธีเดิม';
    default:
      return `เข้าสู่ระบบไม่สำเร็จ (${error?.code || 'unknown'}). ตรวจสอบ Google provider, authorized domain และ Firebase config`;
  }
};

// A redirect sign-in can recover from browsers that block popup windows.
getRedirectResult(auth).then(result => {
  if (result?.user) setStatus('เข้าสู่ระบบสำเร็จ', 'success');
}).catch(error => setStatus(authErrorMessage(error), 'error'));

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
      try {
        const videoUrl = new URL(data.videoUrl);
        if (['youtu.be','youtube.com','www.youtube.com','www.youtube-nocookie.com'].includes(videoUrl.hostname)) {
          const link = document.createElement('a');
          link.href = videoUrl.href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = 'เปิดวิดีโอ ↗';
          article.append(link);
        }
      } catch { /* Ignore malformed optional video links. */ }
    }
    if (auth.currentUser && (data.uid === auth.currentUser.uid || document.body.dataset.isAdmin === 'true')) {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'text-button';
      remove.textContent = 'ลบโพสต์';
      remove.addEventListener('click', async () => {
        if (!window.confirm('ยืนยันลบเนื้อหานี้?')) return;
        try { await deleteDoc(doc(db, type === 'news' ? 'news' : 'posts', item.id)); }
        catch { setStatus('ลบไม่สำเร็จ ตรวจสอบ Firestore Rules', 'error'); }
      });
      article.append(remove);
    }
    container.append(article);
  });
};

onSnapshot(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(60)), snapshot => renderFeed(snapshot, postsList, 'post'), error => setStatus(`โหลดโพสต์ไม่สำเร็จ (${error.code || 'Firestore error'}) ตรวจสอบ Firestore Rules`, 'error'));
onSnapshot(query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(30)), snapshot => renderFeed(snapshot, newsList, 'news'), error => setStatus(`โหลดข่าวไม่สำเร็จ (${error.code || 'Firestore error'}) ตรวจสอบ Firestore Rules`, 'error'));

onAuthStateChanged(auth, async user => {
  document.body.dataset.isAdmin = 'false';
  authArea.replaceChildren();
  if (!user) {
    const login = document.createElement('button');
    login.className = 'button google-button';
    login.type = 'button';
    login.textContent = 'เข้าสู่ระบบ / สมัครสมาชิกด้วย Google';
    login.addEventListener('click', async () => {
      login.disabled = true;
      setStatus('กำลังเชื่อมต่อ Google Sign-In…');
      try {
        await signInWithPopup(auth, googleProvider);
        setStatus('เข้าสู่ระบบสำเร็จ', 'success');
      } catch (error) {
        if (['auth/popup-blocked','auth/popup-closed-by-user'].includes(error?.code)) {
          try {
            await signInWithRedirect(auth, googleProvider);
            return;
          } catch (redirectError) {
            setStatus(authErrorMessage(redirectError), 'error');
          }
        } else {
          setStatus(authErrorMessage(error), 'error');
        }
      } finally {
        login.disabled = false;
      }
    });
    authArea.append(login);
    postForm.querySelector('button[type="submit"]').disabled = true;
    newsForm.hidden = true;
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
    $('#adminNotice').textContent = isAdmin ? 'บัญชีผู้ดูแล: เพิ่มและเผยแพร่ข่าวสารได้' : 'สมาชิกทั่วไปโพสต์ในชุมชนได้ การเผยแพร่ข่าวสงวนสิทธิ์เฉพาะผู้ดูแลเว็บไซต์';
  } catch {
    newsForm.hidden = true;
    $('#adminNotice').textContent = 'ตรวจสอบสิทธิ์ผู้ดูแลไม่สำเร็จ';
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
  } catch (error) { setStatus(`โพสต์ไม่สำเร็จ (${error.code || 'Firestore error'}) ตรวจสอบ Firestore Rules`, 'error'); }
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
    await addDoc(collection(db, 'news'), { uid: user.uid, authorName: user.displayName || user.email || 'ทีมงาน', title, text, videoUrl, createdAt: serverTimestamp() });
    newsForm.reset();
    setStatus('เผยแพร่ข่าวแล้ว', 'success');
  } catch (error) { setStatus(`เผยแพร่ไม่สำเร็จ (${error.code || 'Firestore error'}) บัญชีนี้ต้องมีเอกสารผู้ดูแลใน Firestore`, 'error'); }
});
