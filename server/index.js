import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import fs from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// مسار ملف حفظ الإيميلات
const emailsFilePath = path.join(__dirname, 'sent-emails.json');

// دالة لقراءة الإيميلات المحفوظة
const readEmails = () => {
    try {
        if (fs.existsSync(emailsFilePath)) {
            const data = fs.readFileSync(emailsFilePath, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('Error reading emails file:', error);
        return [];
    }
};

// دالة لحفظ الإيميل
const saveEmail = (emailData) => {
    try {
        const emails = readEmails();
        emails.unshift(emailData); // إضافة في البداية (الأحدث أولاً)
        // حفظ آخر 1000 إيميل فقط
        const limitedEmails = emails.slice(0, 1000);
        fs.writeFileSync(emailsFilePath, JSON.stringify(limitedEmails, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving email:', error);
    }
};

app.post('/api/send-email', upload.single('pdf'), async (req, res) => {
    try {
        // التحقق من وجود الملف
        if (!req.file) {
            return res.status(400).json({ error: 'لم يتم رفع الملف' });
        }

        const { email, subject, message } = req.body;
        const pdfBuffer = req.file.buffer;
        
        // الحد الأقصى لحجم الملف: 20 ميجابايت (Gmail يسمح بـ 25 ميجابايت، لكن نترك هامش أمان)
        const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
        const fileSizeInMB = (pdfBuffer.length / (1024 * 1024)).toFixed(2);

        if (pdfBuffer.length > MAX_FILE_SIZE) {
            return res.status(400).json({ 
                error: `حجم الملف كبير جدًا (${fileSizeInMB} MB). الحد الأقصى المسموح به هو 20 MB` 
            });
        }

        // التحقق من وجود البريد الإلكتروني
        if (!email) {
            return res.status(400).json({ error: 'يرجى إدخال البريد الإلكتروني' });
        }

        // إعدادات المرسل - يجب على المستخدم تحديث هذه البيانات في ملف .env
        // SMTP Configuration
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // بريدك الإلكتروني
                pass: process.env.EMAIL_PASS, // كلمة مرور التطبيق (App Password)
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject || 'طلبات العملاء',
            text: message || 'مقدم من مدخل البيانات محمود احمد علي',
            attachments: [
                {
                    filename: 'document.pdf',
                    content: pdfBuffer,
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        
        // حفظ الإيميل في السجل (نجح)
        const emailRecord = {
            id: Date.now(),
            to: email,
            subject: subject || 'طلبات العملاء',
            message: message || 'مقدم من مدخل البيانات محمود احمد علي',
            status: 'success',
            fileSize: `${fileSizeInMB} MB`,
            sentAt: new Date().toISOString(),
            error: null
        };
        saveEmail(emailRecord);
        
        res.status(200).json({ message: 'تم إرسال البريد الإلكتروني بنجاح' });
    } catch (error) {
        console.error('Error sending email:', error);
        
        // معالجة أخطاء محددة
        let errorMessage = 'حدث خطأ أثناء إرسال البريد الإلكتروني';
        
        if (error.code === 'EMESSAGE' || error.responseCode === 552) {
            errorMessage = 'حجم الملف كبير جدًا. الحد الأقصى المسموح به من Gmail هو 25 MB';
        } else if (error.code === 'EAUTH') {
            errorMessage = 'خطأ في بيانات المصادقة. يرجى التحقق من إعدادات البريد الإلكتروني';
        } else if (error.code === 'ECONNECTION') {
            errorMessage = 'خطأ في الاتصال. يرجى التحقق من الاتصال بالإنترنت';
        }
        
        // حفظ الإيميل في السجل (فشل)
        const emailRecord = {
            id: Date.now(),
            to: email || 'غير محدد',
            subject: subject || 'طلبات العملاء',
            message: message || 'مقدم من مدخل البيانات محمود احمد علي',
            status: 'failed',
            fileSize: req.file ? `${(req.file.buffer.length / (1024 * 1024)).toFixed(2)} MB` : 'غير محدد',
            sentAt: new Date().toISOString(),
            error: errorMessage
        };
        saveEmail(emailRecord);
        
        res.status(500).json({ error: errorMessage });
    }
});

// Endpoint للحصول على الإيميلات المحفوظة
app.get('/api/emails', (req, res) => {
    try {
        const { limit = 50, status } = req.query;
        let emails = readEmails();
        
        // فلترة حسب الحالة إذا تم تحديدها
        if (status && (status === 'success' || status === 'failed')) {
            emails = emails.filter(email => email.status === status);
        }
        
        // تحديد العدد المطلوب
        const limitedEmails = emails.slice(0, parseInt(limit));
        
        res.status(200).json({
            emails: limitedEmails,
            total: emails.length
        });
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الإيميلات' });
    }
});

// Endpoint للحصول على قائمة فريدة من الإيميلات المرسلة إليها (للاقتراحات)
app.get('/api/email-suggestions', (req, res) => {
    try {
        const emails = readEmails();
        // استخراج قائمة فريدة من الإيميلات المرسلة إليها
        const uniqueEmails = [...new Set(emails.map(email => email.to).filter(email => email && email !== 'غير محدد'))];
        
        // ترتيب حسب آخر إرسال (الأكثر استخداماً أولاً)
        const emailCounts = {};
        emails.forEach(email => {
            if (email.to && email.to !== 'غير محدد') {
                emailCounts[email.to] = (emailCounts[email.to] || 0) + 1;
            }
        });
        
        const sortedEmails = uniqueEmails.sort((a, b) => {
            // ترتيب حسب عدد المرات المستخدمة
            const countDiff = (emailCounts[b] || 0) - (emailCounts[a] || 0);
            if (countDiff !== 0) return countDiff;
            // إذا كانت متساوية، ترتيب أبجدي
            return a.localeCompare(b);
        });
        
        res.status(200).json({ emails: sortedEmails });
    } catch (error) {
        console.error('Error fetching email suggestions:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الاقتراحات' });
    }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).send('API endpoint not found');
    }
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
