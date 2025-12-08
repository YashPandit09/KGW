import React, { useState } from 'react';
import axios from 'axios';
import './BulkUpload.css';

const BulkUpload = ({ onUploadComplete }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.name.endsWith('.csv')) {
                setFile(droppedFile);
                setResult(null);
            } else {
                alert('Please upload a CSV file');
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a CSV file first');
            return;
        }

        setUploading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('csvFile', file);

        try {
            const { data } = await axios.post('/api/products/bulk-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setResult(data);
            setFile(null);

            if (onUploadComplete) {
                onUploadComplete();
            }
        } catch (error) {
            setResult({
                message: error.response?.data?.message || 'Upload failed',
                errors: error.response?.data?.errors
            });
        } finally {
            setUploading(false);
        }
    };

    const downloadTemplate = async () => {
        try {
            const response = await axios.get('/api/products/csv-template', {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'product-template.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Failed to download template');
        }
    };

    return (
        <div className="bulk-upload-container">
            <div className="upload-header">
                <h3>📦 Bulk Product Upload</h3>
                <button onClick={downloadTemplate} className="btn-download-template">
                    ⬇ Download CSV Template
                </button>
            </div>

            <div
                className={`upload-dropzone ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="dropzone-content">
                    {file ? (
                        <>
                            <span className="file-icon">📄</span>
                            <p className="file-name">{file.name}</p>
                            <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                            <button onClick={() => setFile(null)} className="btn-remove-file">
                                Remove
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="upload-icon">📁</span>
                            <p className="upload-text">Drag & drop CSV file here</p>
                            <p className="upload-subtext">or</p>
                            <label htmlFor="file-input" className="btn-browse">
                                Browse Files
                            </label>
                            <input
                                id="file-input"
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </>
                    )}
                </div>
            </div>

            {file && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="btn-upload"
                >
                    {uploading ? 'Uploading...' : '🚀 Upload Products'}
                </button>
            )}

            {result && (
                <div className={`upload-result ${result.errors ? 'warning' : 'success'}`}>
                    <h4>{result.message}</h4>
                    {result.uploaded !== undefined && (
                        <p>✅ Successfully uploaded: {result.uploaded} products</p>
                    )}
                    {result.failed > 0 && (
                        <p>❌ Failed: {result.failed} products</p>
                    )}

                    {result.errors && result.errors.length > 0 && (
                        <details className="error-details">
                            <summary>Show Errors ({result.errors.length})</summary>
                            <div className="error-list">
                                {result.errors.slice(0, 10).map((err, idx) => (
                                    <div key={idx} className="error-item">
                                        <strong>Line {err.line || err.sku}:</strong> {err.message}
                                    </div>
                                ))}
                                {result.errors.length > 10 && (
                                    <p className="more-errors">...and {result.errors.length - 10} more errors</p>
                                )}
                            </div>
                        </details>
                    )}
                </div>
            )}

            <div className="upload-instructions">
                <h4>📋 CSV Format Instructions:</h4>
                <ul>
                    <li><strong>Required columns:</strong> name, sku, category, price</li>
                    <li><strong>Optional columns:</strong> material, coating, diameter, flutes, shankDiameter, overallLength, stock, description, images, isFeatured</li>
                    <li><strong>Categories:</strong> Endmills, Drills, Reamers, Taps, Inserts</li>
                    <li><strong>Materials:</strong> Carbide, HSS, High-Speed Steel, Cobalt</li>
                    <li><strong>Images:</strong> Separate multiple URLs with | (pipe)</li>
                    <li><strong>Featured:</strong> Use "true" or "false"</li>
                </ul>
            </div>
        </div>
    );
};

export default BulkUpload;
