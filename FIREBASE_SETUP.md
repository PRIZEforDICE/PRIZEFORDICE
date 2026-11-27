# เปิดใช้ระบบสมาชิกและชุมชน PRIZEOFDICE.COM

ระบบสมาชิก Google, โพสต์ชุมชน และการเผยแพร่ข่าวใช้ Firebase Authentication + Cloud Firestore เนื่องจาก repository ปัจจุบันเป็นเว็บ static จึงต้องเชื่อม Firebase project ของผู้ดูแลก่อนใช้งานจริง

## ตั้งค่า
1. สร้าง Firebase project และเพิ่ม Web app ใน Firebase Console
2. เปิด **Authentication → Sign-in method → Google** และกำหนด authorized domains ให้ตรงกับโดเมนที่โฮสต์เว็บ
3. สร้าง Cloud Firestore database
4. คัดลอก Firebase Web config จาก Project settings → Your apps แล้วใส่ค่าใน `firebase-config.js` ให้ครบ (ห้ามใส่ service-account/private key ในไฟล์เว็บ)
5. Deploy `firestore.rules` ไปยัง Firestore Rules
6. เปิดเว็บ `community.html` และเข้าสู่ระบบ Google หนึ่งครั้ง จากนั้นคัดลอก UID จาก Authentication → Users
7. ใน Firestore Console สร้าง document `admins/{UID}` (ใส่ UID เป็น document ID) เพื่อให้บัญชีนั้นเผยแพร่/ลบข่าวได้ ผู้ดูแลเพิ่ม UID ได้จาก Firebase Console เท่านั้น กฎ Firestore ไม่อนุญาตให้ผู้ใช้สร้างสิทธิ์ผู้ดูแลเอง

## สิทธิ์และข้อมูล
- ผู้เยี่ยมชมอ่านข่าวและโพสต์สาธารณะได้
- เฉพาะบัญชี Google ที่เข้าสู่ระบบโพสต์ชุมชนได้ และลบได้เฉพาะโพสต์ของตนเอง
- สร้าง/แก้ไข/ลบข่าวได้เฉพาะ UID ที่มีเอกสารใน `admins`
- ไม่ควรเผยแพร่ข้อมูลส่วนบุคคลในโพสต์สาธารณะ
- การเปิดใช้งาน Google OAuth, Firebase config และการ deploy rules ต้องทำในบัญชี Firebase ที่เจ้าของเว็บไซต์ควบคุม ไม่สามารถทำแทนจาก GitHub repository ได้

## ข่าวสารและ Terms
หน้า `community.html` มีแบบฟอร์มข่าวที่แสดงให้ผู้ดูแลเท่านั้น ส่วนการบันทึกถูกบังคับซ้ำที่ Firestore Rules ไม่พึ่งการซ่อนฟอร์มฝั่งเบราว์เซอร์เพียงอย่างเดียว
