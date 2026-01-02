import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Save, X, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';

const Profile = ({ onClose }) => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'emails'
    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email
    });
    const [message, setMessage] = useState('');
    const [emails, setEmails] = useState([]);
    const [loadingEmails, setLoadingEmails] = useState(false);
    const [emailFilter, setEmailFilter] = useState('all'); // 'all', 'success', 'failed'

    // جلب الإيميلات المحفوظة
    useEffect(() => {
        if (activeTab === 'emails') {
            fetchEmails();
        }
    }, [activeTab, emailFilter]);

    const fetchEmails = async () => {
        setLoadingEmails(true);
        try {
            const statusParam = emailFilter !== 'all' ? `&status=${emailFilter}` : '';
            const response = await fetch(`/api/emails?limit=100${statusParam}`);
            const data = await response.json();
            if (response.ok) {
                setEmails(data.emails || []);
            }
        } catch (error) {
            console.error('Error fetching emails:', error);
        } finally {
            setLoadingEmails(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = updateProfile(formData);
        setMessage(result.message);
        if (result.success) {
            setIsEditing(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="glass-card" style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        padding: '0.5rem',
                        zIndex: 10
                    }}
                >
                    <X size={24} />
                </button>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0' }}>
                    <button
                        onClick={() => setActiveTab('profile')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: activeTab === 'profile' ? '#2563eb' : 'transparent',
                            color: activeTab === 'profile' ? 'white' : '#64748b',
                            border: 'none',
                            borderBottom: activeTab === 'profile' ? '3px solid #2563eb' : '3px solid transparent',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '1rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <User size={18} style={{ display: 'inline', marginLeft: '0.5rem' }} />
                        الملف الشخصي
                    </button>
                    <button
                        onClick={() => setActiveTab('emails')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: activeTab === 'emails' ? '#2563eb' : 'transparent',
                            color: activeTab === 'emails' ? 'white' : '#64748b',
                            border: 'none',
                            borderBottom: activeTab === 'emails' ? '3px solid #2563eb' : '3px solid transparent',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '1rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Mail size={18} style={{ display: 'inline', marginLeft: '0.5rem' }} />
                        الإيميلات المرسلة
                    </button>
                </div>

                {activeTab === 'profile' ? (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '2.5rem',
                        color: 'white',
                        fontWeight: '700'
                    }}>
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h2 style={{ fontSize: '1.75rem', color: '#1e293b', marginBottom: '0.5rem' }}>
                        الملف الشخصي
                    </h2>
                </div>

                {!isEditing ? (
                    <div>
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <User size={20} color="#2563eb" />
                                <span style={{ fontWeight: '600', color: '#64748b' }}>اسم المستخدم:</span>
                            </div>
                            <p style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0, paddingRight: '2rem' }}>
                                {user.username}
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <Mail size={20} color="#2563eb" />
                                <span style={{ fontWeight: '600', color: '#64748b' }}>البريد الإلكتروني:</span>
                            </div>
                            <p style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0, paddingRight: '2rem' }}>
                                {user.email}
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <Calendar size={20} color="#2563eb" />
                                <span style={{ fontWeight: '600', color: '#64748b' }}>تاريخ التسجيل:</span>
                            </div>
                            <p style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0, paddingRight: '2rem' }}>
                                {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                            </p>
                        </div>

                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem' }}
                        >
                            تعديل الملف الشخصي
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                <User size={18} style={{ display: 'inline', marginLeft: '0.5rem' }} />
                                اسم المستخدم
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                <Mail size={18} style={{ display: 'inline', marginLeft: '0.5rem' }} />
                                البريد الإلكتروني
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {message && (
                            <div style={{
                                padding: '0.875rem',
                                background: message.includes('نجاح') ? '#d1fae5' : '#fee2e2',
                                border: `1px solid ${message.includes('نجاح') ? '#a7f3d0' : '#fecaca'}`,
                                borderRadius: '0.5rem',
                                color: message.includes('نجاح') ? '#065f46' : '#dc2626',
                                marginBottom: '1.5rem',
                                textAlign: 'center'
                            }}>
                                {message}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ flex: 1, padding: '1rem' }}
                            >
                                <Save size={20} /> حفظ التغييرات
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({ username: user.username, email: user.email });
                                    setMessage('');
                                }}
                                className="btn"
                                style={{ flex: 1, padding: '1rem', background: '#64748b', color: 'white' }}
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                )}
                    </>
                ) : (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.75rem', color: '#1e293b' }}>الإيميلات المرسلة</h2>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <Filter size={18} color="#64748b" />
                                <select
                                    value={emailFilter}
                                    onChange={(e) => setEmailFilter(e.target.value)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="all">الكل</option>
                                    <option value="success">نجح</option>
                                    <option value="failed">فشل</option>
                                </select>
                            </div>
                        </div>

                        {loadingEmails ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <Clock className="animate-spin" size={32} color="#2563eb" />
                                <p style={{ marginTop: '1rem', color: '#64748b' }}>جاري التحميل...</p>
                            </div>
                        ) : emails.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                <Mail size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                <p>لا توجد إيميلات محفوظة</p>
                            </div>
                        ) : (
                            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                {emails.map((email) => (
                                    <div
                                        key={email.id}
                                        style={{
                                            padding: '1.25rem',
                                            marginBottom: '1rem',
                                            background: email.status === 'success' ? '#f0fdf4' : '#fef2f2',
                                            border: `2px solid ${email.status === 'success' ? '#86efac' : '#fca5a5'}`,
                                            borderRadius: '0.75rem',
                                            borderRight: `4px solid ${email.status === 'success' ? '#22c55e' : '#ef4444'}`
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                                {email.status === 'success' ? (
                                                    <CheckCircle size={20} color="#22c55e" />
                                                ) : (
                                                    <XCircle size={20} color="#ef4444" />
                                                )}
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: '600', color: '#1e293b', fontSize: '1rem' }}>
                                                        {email.to}
                                                    </p>
                                                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                                                        {email.subject}
                                                    </p>
                                                </div>
                                            </div>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                background: email.status === 'success' ? '#dcfce7' : '#fee2e2',
                                                color: email.status === 'success' ? '#166534' : '#991b1b',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                {email.status === 'success' ? 'نجح' : 'فشل'}
                                            </span>
                                        </div>

                                        {email.message && (
                                            <p style={{
                                                margin: '0.5rem 0',
                                                fontSize: '0.875rem',
                                                color: '#475569',
                                                lineHeight: '1.5'
                                            }}>
                                                {email.message}
                                            </p>
                                        )}

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                                                <Calendar size={14} />
                                                <span>{new Date(email.sentAt).toLocaleString('ar-EG')}</span>
                                            </div>
                                            {email.fileSize && (
                                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                    حجم الملف: {email.fileSize}
                                                </span>
                                            )}
                                        </div>

                                        {email.error && (
                                            <div style={{
                                                marginTop: '0.75rem',
                                                padding: '0.75rem',
                                                background: '#fee2e2',
                                                border: '1px solid #fca5a5',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem',
                                                color: '#991b1b'
                                            }}>
                                                <strong>خطأ:</strong> {email.error}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
