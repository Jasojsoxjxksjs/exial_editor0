# تعليمات النشر على Vercel

## الخطوات المطلوبة بعد النشر:

### 1. إعداد Environment Variables في Vercel:

اذهب إلى إعدادات المشروع في Vercel Dashboard:
- Settings → Environment Variables

أضف المتغيرات التالية:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5000
```

**ملاحظة مهمة:** 
- `EMAIL_PASS` يجب أن يكون App Password من Gmail (ليس كلمة المرور العادية)
- للحصول على App Password: Google Account → Security → 2-Step Verification → App passwords

### 2. إعادة بناء المشروع:

بعد إضافة Environment Variables:
- اذهب إلى Deployments
- اختر آخر deployment
- اضغط على "Redeploy"

### 3. التحقق من عمل التطبيق:

- تأكد من أن جميع الـ API endpoints تعمل: `/api/send-email`, `/api/emails`, `/api/email-suggestions`
- جرب إرسال إيميل اختباري

### 4. ملاحظات مهمة:

⚠️ **ملف sent-emails.json:**
- في بيئة Vercel serverless، حفظ الملفات في نظام الملفات قد لا يعمل بشكل دائم
- إذا لم يعمل حفظ الإيميلات، قد تحتاج إلى استخدام قاعدة بيانات خارجية (مثل MongoDB, Supabase, أو Vercel KV)

### 5. إعدادات Build:

تأكد من أن:
- `buildCommand` في vercel.json يشير إلى `npm run build-client`
- `installCommand` يشير إلى `npm run install-all`

### 6. اختبار بعد النشر:

1. ✅ تحميل ملف Excel
2. ✅ تعديل البيانات
3. ✅ معاينة PDF
4. ✅ إرسال إيميل
5. ✅ عرض سجل الإيميلات في الملف الشخصي
6. ✅ اقتراحات الإيميلات التلقائية

---

## استكشاف الأخطاء:

### إذا لم يعمل إرسال الإيميل:
- تحقق من Environment Variables في Vercel
- تأكد من أن App Password صحيح
- تحقق من Console Logs في Vercel Dashboard

### إذا لم تعمل حفظ الإيميلات:
- قد تحتاج إلى استخدام قاعدة بيانات خارجية
- أو استخدام Vercel KV للتخزين

