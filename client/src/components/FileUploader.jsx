import React from 'react';
import { Upload } from 'lucide-react';

const FileUploader = ({ handleFileUpload }) => {
    return (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div
                style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '1rem',
                    padding: '4rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = '#2563eb'}
                onMouseOut={e => e.currentTarget.style.borderColor = '#cbd5e1'}
            >
                <Upload size={64} color="#2563eb" style={{ marginBottom: '1.5rem' }} />
                <h2 style={{ marginBottom: '1rem' }}>اسحب وأفلت الملف هنا</h2>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>يدعم ملفات .xlsx و .xls فقط</p>

                <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                    اختر الملف
                    <input
                        type="file"
                        hidden
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                    />
                </label>
            </div>
        </div>
    );
};

export default FileUploader;
