# نظام التواصل الداخلي - مؤسسة السنابل للشباب والتنمية

نظام تواصل داخلي شامل لمؤسسة السنابل للشباب والتنمية، يوفر محادثات مباشرة ومجموعات تواصل مع نظام صلاحيات متقدم.

## المميزات

- ✅ **محادثات مباشرة**: تواصل فوري بين المستخدمين
- ✅ **مجموعات التواصل**: إنشاء وإدارة مجموعات للبرامج والأقسام
- ✅ **نظام صلاحيات**: نظام RBAC متقدم مع أدوار مختلفة
- ✅ **رسائل فورية**: استخدام Socket.io للتواصل الفوري
- ✅ **واجهة عربية**: واجهة مستخدم كاملة باللغة العربية
- ✅ **Dashboard**: لوحة تحكم شاملة مع إحصائيات

## التقنيات المستخدمة

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Cache**: Redis
- **Real-time**: Socket.io
- **Frontend**: EJS, Bootstrap 5, JavaScript
- **Queue**: BullMQ (للأعمال الخلفية)

## متطلبات التشغيل

- Node.js 16+ 
- MongoDB 4.4+
- Redis 6+

## التثبيت

1. استنساخ المشروع:
```bash
git clone <repository-url>
cd "Sanabel Communication Service"
```

2. تثبيت الحزم:
```bash
npm install
```

3. إعداد ملف البيئة:
```bash
cp .env.example .env
```

4. تعديل ملف `.env` بإضافة إعدادات قاعدة البيانات و Redis

5. تشغيل المشروع:
```bash
# Development
npm run dev

# Production
npm start
```

## البنية

```
├── app/
│   ├── constants/          # الثوابت (الأدوار، الصلاحيات)
│   ├── controllers/        # معالجات الطلبات
│   ├── middlewares/        # Middlewares (المصادقة، الصلاحيات)
│   ├── models/             # نماذج MongoDB
│   ├── repositories/      # طبقة الوصول للبيانات
│   ├── routes/             # مسارات API و UI
│   ├── services/           # منطق العمل
│   └── sockets/            # معالجات Socket.io
├── config/                 # إعدادات قاعدة البيانات
├── views/                  # قوالب EJS
├── public/                 # الملفات الثابتة
└── server.js              # نقطة البداية
```

## نظام الصلاحيات

النظام يدعم الأدوار التالية:

- **OWNER**: مالك النظام - صلاحيات كاملة
- **ADMIN**: مدير - إدارة المجموعات والمحادثات
- **MODERATOR**: مشرف - إدارة الرسائل
- **MEMBER**: عضو - إرسال واستقبال الرسائل
- **VISITOR**: زائر - صلاحيات محدودة

## API Endpoints

### المحادثات (Conversations)

- `GET /api/conversations` - الحصول على محادثات المستخدم
- `POST /api/conversations/direct` - إنشاء محادثة مباشرة
- `POST /api/conversations/group` - إنشاء محادثة جماعية
- `GET /api/conversations/:id` - الحصول على محادثة
- `GET /api/conversations/:id/messages` - الحصول على رسائل محادثة
- `POST /api/conversations/:id/messages` - إرسال رسالة
- `PUT /api/conversations/messages/:messageId` - تحديث رسالة
- `DELETE /api/conversations/messages/:messageId` - حذف رسالة

### المجموعات (Groups)

- `GET /api/groups/mine` - الحصول على مجموعاتي
- `POST /api/groups` - إنشاء مجموعة
- `POST /api/groups/add-member` - إضافة عضو لمجموعة

## Socket.io Events

### Client → Server

- `join_conversation` - الانضمام لمحادثة
- `leave_conversation` - مغادرة محادثة
- `send_message` - إرسال رسالة
- `update_message` - تحديث رسالة
- `delete_message` - حذف رسالة
- `typing` - مؤشر الكتابة

### Server → Client

- `welcome` - رسالة ترحيب
- `new_message` - رسالة جديدة
- `message_updated` - رسالة محدثة
- `message_deleted` - رسالة محذوفة
- `conversation_updated` - محادثة محدثة
- `user_typing` - مؤشر كتابة مستخدم

## المصادقة (Authentication)

النظام يعتمد على نظام مصادقة خارجي. يتم تمرير Token في Header:

```
Authorization: Bearer userId:name:role:scope:companyId:department
```

أو في Socket.io:

```javascript
socket.connect({
  auth: {
    token: "userId:name:role:scope:companyId:department"
  }
});
```

## الصفحات

- `/` - الصفحة الرئيسية
- `/dashboard` - لوحة التحكم
- `/owner/conversations` - المحادثات
- `/groups` - إدارة المجموعات

## التطوير

```bash
# تشغيل في وضع التطوير
npm run dev

# فحص الأخطاء
npm run lint
```

## المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## الترخيص

هذا المشروع مخصص لمؤسسة السنابل للشباب والتنمية.

## الدعم

للحصول على الدعم، يرجى التواصل مع فريق التطوير.

---

**مؤسسة السنابل للشباب والتنمية - مكتب فلسطين**  
© 2026 جميع الحقوق محفوظة
