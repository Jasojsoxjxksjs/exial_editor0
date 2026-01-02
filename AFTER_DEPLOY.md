# خطوات ما بعد النشر على Vercel

## ✅ الخطوات المطلوبة فوراً:

### 1. إضافة Environment Variables في Vercel:

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك
3. Settings → Environment Variables
4. أضف المتغيرات التالية:

```
EMAIL_USER = your-email@gmail.com
EMAIL_PASS = your-gmail-app-password
```

**كيفية الحصول على Gmail App Password:**
- اذهب إلى [Google Account Settings](https://myaccount.google.com/)
- Security → 2-Step Verification (يجب تفعيلها أولاً)
- App passwords → Generate new app password
- انسخ الرمز وأضفه في `EMAIL_PASS`

### 2. إعادة النشر (Redeploy):

بعد إضافة Environment Variables:
- اذهب إلى Deployments
- اضغط على "..." بجانب آخر deployment
- اختر "Redeploy"

### 3. التحقق من عمل التطبيق:

✅ اختبر الميزات التالية:
- [ ] تحميل ملف Excel
- [ ] تعديل البيانات
- [ ] معاينة PDF
- [ ] إرسال إيميل
- [ ] عرض سجل الإيميلات (في الملف الشخصي)
- [ ] اقتراحات الإيميلات التلقائية

---

## 🔧 استكشاف الأخطاء:

### مشكلة: إرسال الإيميل لا يعمل
**الحل:**
- تحقق من Environment Variables في Vercel
- تأكد من أن App Password صحيح
- راجع Logs في Vercel Dashboard

### مشكلة: حفظ الإيميلات لا يعمل
**السبب:** Vercel serverless functions قد لا تحفظ الملفات بشكل دائم

**الحلول:**
1. استخدام قاعدة بيانات (MongoDB, Supabase)
2. استخدام Vercel KV للتخزين
3. استخدام خدمة خارجية

---

## 📝 ملاحظات:

- ملف `sent-emails.json` قد لا يعمل بشكل دائم في Vercel serverless
- للتخزين الدائم، استخدم قاعدة بيانات خارجية
- جميع الملفات المعدلة جاهزة للنشر

---

## 🚀 النشر:

```bash
git add .
git commit -m "Update deployment configuration"
git push
```

Vercel سيقوم ببناء ونشر التطبيق تلقائياً!

