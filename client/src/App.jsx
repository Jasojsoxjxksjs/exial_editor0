import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileText, Eye, Download, Mail, ArrowRight, Save, Clock, Trash2, LogOut, User as UserIcon } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ExcelEditor from './components/ExcelEditor';
import FileUploader from './components/FileUploader';
import Preview from './components/Preview';
import Profile from './components/Profile';

function AppContent() {
    const { user, logout, isAuthenticated } = useAuth();
    const [data, setData] = useState(null);
    const [view, setView] = useState('upload'); // 'upload', 'edit', 'preview'
    const [fileName, setFileName] = useState('');
    const [metadata, setMetadata] = useState({
        subject: '',
        message: ''
    });
    const [recentFiles, setRecentFiles] = useState([]);
    const [authView, setAuthView] = useState('login'); // 'login' or 'register'
    const [showProfile, setShowProfile] = useState(false);

    // Load recent files from localStorage on mount
    useEffect(() => {
        if (isAuthenticated) {
            const saved = localStorage.getItem(`recentExcelFiles_${user.id}`);
            if (saved) {
                setRecentFiles(JSON.parse(saved));
            }
        }
    }, [isAuthenticated, user]);

    // Save to localStorage whenever data changes
    useEffect(() => {
        if (data && fileName && isAuthenticated) {
            saveToRecent();
        }
    }, [data, metadata]);

    const saveToRecent = () => {
        const fileEntry = {
            id: Date.now(),
            fileName,
            data,
            metadata,
            timestamp: new Date().toISOString()
        };

        const updated = [fileEntry, ...recentFiles.filter(f => f.fileName !== fileName)].slice(0, 5);
        setRecentFiles(updated);
        localStorage.setItem(`recentExcelFiles_${user.id}`, JSON.stringify(updated));
    };

    const loadRecentFile = (file) => {
        setFileName(file.fileName);
        setData(file.data);
        setMetadata(file.metadata);
        setView('edit');
    };

    const deleteRecentFile = (id) => {
        const updated = recentFiles.filter(f => f.id !== id);
        setRecentFiles(updated);
        localStorage.setItem(`recentExcelFiles_${user.id}`, JSON.stringify(updated));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

            const cleanedData = jsonData.filter(row => row.length > 0);
            setData(cleanedData);
            setView('edit');
        };
        reader.readAsBinaryString(file);
    };

    const handleUpdateData = (newData) => {
        setData(newData);
    };

    const handleLogout = () => {
        logout();
        setData(null);
        setView('upload');
        setFileName('');
        setMetadata({ subject: '', message: '' });
        setRecentFiles([]);
    };

    // Show auth screens if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="container">
                <header className="header">
                    <h1>محرر إكسيل الذكي</h1>
                    <p>قم برفع ملفك، تعديله، وإرساله فوراً</p>
                </header>

                <main>
                    {authView === 'login' ? (
                        <Login onSwitchToRegister={() => setAuthView('register')} />
                    ) : (
                        <Register onSwitchToLogin={() => setAuthView('login')} />
                    )}
                </main>

                <footer style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b' }}>
                    &copy; 2026 محرر إكسيل أونلاين - جميع الحقوق محفوظة
                </footer>
            </div>
        );
    }

    // Main app for authenticated users
    return (
        <div className="container">
            {showProfile && <Profile onClose={() => setShowProfile(false)} />}
            <header className="header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
                    <div>
                        <h1>محرر إكسيل الذكي</h1>
                        <p>مرحباً، {user.username} 👋</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="btn"
                            onClick={() => setShowProfile(true)}
                            style={{ background: '#217346', color: 'white' }}
                        >
                            <UserIcon size={20} /> الملف الشخصي
                        </button>
                        <button
                            className="btn"
                            onClick={handleLogout}
                            style={{ background: '#ef4444', color: 'white' }}
                        >
                            <LogOut size={20} /> تسجيل الخروج
                        </button>
                    </div>
                </div>
            </header>

            <main className="glass-card">
                {view === 'upload' && (
                    <>
                        <FileUploader handleFileUpload={handleFileUpload} />

                        {recentFiles.length > 0 && (
                            <div style={{ marginTop: '3rem', borderTop: '2px solid #e2e8f0', paddingTop: '2rem' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#1e293b' }}>
                                    <Clock size={24} /> الملفات الأخيرة
                                </h3>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {recentFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '1rem',
                                                background: '#f8fafc',
                                                borderRadius: '0.5rem',
                                                border: '1px solid #e2e8f0',
                                                transition: 'all 0.2s',
                                                cursor: 'pointer'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                                            onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}
                                        >
                                            <div
                                                onClick={() => loadRecentFile(file)}
                                                style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}
                                            >
                                                <FileText size={20} color="#2563eb" />
                                                <div>
                                                    <p style={{ fontWeight: '600', margin: 0, color: '#1e293b' }}>{file.fileName}</p>
                                                    <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                                                        {new Date(file.timestamp).toLocaleString('ar-EG')}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteRecentFile(file.id);
                                                }}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#ef4444',
                                                    padding: '0.5rem'
                                                }}
                                                title="حذف"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {view === 'edit' && data && (
                    <>
                        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ marginBottom: '1.2rem', color: '#1e293b' }}>قسم التحكم بالبيانات</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>عنوان المستند / الموضوع:</label>
                                    <input
                                        type="text"
                                        value={metadata.subject}
                                        onChange={(e) => setMetadata({ ...metadata, subject: e.target.value })}
                                        style={{ border: '1px solid #cbd5e1', width: '100%', padding: '0.6rem', borderRadius: '0.4rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>رسالة البريد / ملاحظات التصدير:</label>
                                    <textarea
                                        value={metadata.message}
                                        onChange={(e) => setMetadata({ ...metadata, message: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '0.4rem', border: '1px solid #cbd5e1', height: '42px', minHeight: '42px', fontFamily: 'inherit', resize: 'vertical' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <ExcelEditor data={data} onUpdate={handleUpdateData} />
                        <div className="actions-bar">
                            <button className="btn btn-primary" onClick={() => setView('preview')}>
                                <Eye size={20} /> معاينة البيانات
                            </button>
                        </div>
                    </>
                )}

                {view === 'preview' && data && (
                    <>
                        <Preview
                            data={data}
                            fileName={fileName}
                            metadata={metadata}
                            onBack={() => setView('edit')}
                        />
                    </>
                )}
            </main>

            <footer style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b' }}>
                &copy; 2026 محرر إكسيل أونلاين - جميع الحقوق محفوظة
            </footer>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
