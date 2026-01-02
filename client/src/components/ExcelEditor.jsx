import React, { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

const ExcelEditor = ({ data, onUpdate }) => {
    // Determine grid size
    const MAX_ROWS = Math.max(50, data.length + 10);
    const MAX_COLS = Math.max(15, data[0]?.length || 0);

    const getColumnLabel = (index) => {
        let label = '';
        while (index >= 0) {
            label = String.fromCharCode((index % 26) + 65) + label;
            index = Math.floor(index / 26) - 1;
        }
        return label;
    };

    const handleChange = (rowIndex, colIndex, value) => {
        const newData = [...data];

        // Ensure row exists in data
        while (newData.length <= rowIndex) {
            newData.push([]);
        }

        // Ensure column exists in row
        while (newData[rowIndex].length <= colIndex) {
            newData[rowIndex].push('');
        }

        newData[rowIndex][colIndex] = value;
        onUpdate(newData);
    };

    const handleDeleteRow = (rowIndex) => {
        const newData = data.filter((_, idx) => idx !== rowIndex);
        onUpdate(newData);
    };

    const handleAddRow = () => {
        const newData = [...data];
        const colCount = data[0]?.length || 5;
        newData.push(new Array(colCount).fill(''));
        onUpdate(newData);
    };

    // Columns A, B, C...
    const columns = Array.from({ length: MAX_COLS }, (_, i) => getColumnLabel(i));

    return (
        <div className="editor-wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', color: '#1e293b', fontWeight: '700' }}>محرر البيانات الذكي</h2>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-primary" onClick={handleAddRow} style={{ background: '#217346' }}>
                        <Plus size={18} /> إضافة صف
                    </button>
                </div>
            </div>

            <div className="table-container google-sheets-style">
                <table>
                    <thead>
                        <tr>
                            <th className="corner-header"></th>
                            {columns.map((label, idx) => (
                                <th key={idx} className="col-header">{label}</th>
                            ))}
                            <th className="col-header" style={{ width: '60px' }}>الإجراء</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: MAX_ROWS }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                <th className="row-header">{rowIndex + 1}</th>
                                {Array.from({ length: MAX_COLS }).map((_, colIndex) => (
                                    <td key={colIndex}>
                                        <input
                                            type="text"
                                            value={data[rowIndex]?.[colIndex] || ''}
                                            onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                                            className="sheet-input"
                                            spellCheck="false"
                                        />
                                    </td>
                                ))}
                                <td style={{ textAlign: 'center' }}>
                                    {rowIndex < data.length && (
                                        <button
                                            onClick={() => handleDeleteRow(rowIndex)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#ef4444',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%'
                                            }}
                                            title="حذف الصف"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExcelEditor;
