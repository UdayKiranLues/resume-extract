import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../api';
import toast from 'react-hot-toast';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length > 500) {
      toast.error('Maximum 500 files allowed at once');
      return;
    }

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const validFiles = [];
    let hasInvalidFiles = false;

    for (const file of selectedFiles) {
      if (!validTypes.includes(file.type)) {
        hasInvalidFiles = true;
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit`);
        continue;
      }
      validFiles.push(file);
    }

    if (hasInvalidFiles) {
      toast.error('Some files were skipped (only PDF and DOCX allowed)');
    }

    if (validFiles.length > 0) {
      setFiles(validFiles);
      setUploadResults(null);
      toast.success(`${validFiles.length} file(s) selected`);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('resumes', file);
    });

    setUploading(true);
    try {
      const response = await resumeAPI.upload(formData);
      setUploadResults(response.data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setUploadResults(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Upload Resumes</h1>
      <p className="text-gray-600 mb-8">Upload multiple PDF or DOCX files (up to 500 files at once)</p>

      <div className="card p-8 mb-6">
        {!uploadResults ? (
          <>
            <div
              className={`border-3 border-dashed rounded-xl p-12 text-center transition-colors ${
                files.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                multiple
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {files.length > 0 ? (
                  <div className="flex items-center justify-center space-x-4">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                    <div className="text-left">
                      <p className="text-lg font-semibold text-gray-800">{files.length} file(s) selected</p>
                      <p className="text-sm text-gray-500">
                        Total size: {(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-700 mb-2">
                      Click to upload or drag and drop multiple files
                    </p>
                    <p className="text-gray-500">PDF or DOCX (max 10MB per file, up to 500 files)</p>
                  </>
                )}
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-4 max-h-40 overflow-y-auto">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
                <div className="space-y-1">
                  {files.map((file, idx) => (
                    <div key={idx} className="text-xs text-gray-600 flex justify-between">
                      <span>{file.name}</span>
                      <span className="text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4 mt-6">
              {files.length > 0 && (
                <>
                  <button onClick={handleReset} className="btn-secondary">
                    Clear Files
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {uploading ? `Processing ${files.length} file(s)...` : `Upload & Extract ${files.length} file(s)`}
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-800">{uploadResults.message}</h2>
              </div>
              <button onClick={handleReset} className="btn-primary">
                Upload More
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="card p-4 bg-blue-50">
                <p className="text-sm text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-blue-600">{uploadResults.totalFiles}</p>
              </div>
              <div className="card p-4 bg-green-50">
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{uploadResults.successCount}</p>
              </div>
              <div className="card p-4 bg-red-50">
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{uploadResults.errorCount}</p>
              </div>
            </div>

            {uploadResults.results.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Successfully Processed:</h3>
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {uploadResults.results.map((result, idx) => (
                    <div key={idx} className="card p-4 bg-green-50">
                      <p className="font-semibold text-gray-800">{result.fileName}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span> {result.extractedData?.name || '-'}
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span> {result.extractedData?.email || '-'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadResults.errors.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-red-700 mb-3">Failed to Process:</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {uploadResults.errors.map((error, idx) => (
                    <div key={idx} className="card p-3 bg-red-50 border-l-4 border-red-500">
                      <p className="font-semibold text-gray-800">{error.fileName}</p>
                      <p className="text-sm text-red-600">{error.error}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                onClick={() => navigate('/resumes')}
                className="btn-secondary"
              >
                View All Resumes
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {!uploadResults && (
        <div className="card p-6 bg-blue-50 border-l-4 border-blue-500">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Tips for best results:</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Use well-formatted PDF or DOCX files</li>
                <li>Ensure text is readable and not in image format</li>
                <li>Include standard sections like Skills, Education, and Experience</li>
                <li>File size should not exceed 10MB per file</li>
                <li>You can select up to 500 files at once for batch processing</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DataField({ label, value, fullWidth = false, multiline = false }) {
  return (
    <div className={fullWidth ? 'col-span-full' : ''}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      {multiline ? (
        <textarea
          value={value || 'Not found'}
          readOnly
          rows={value ? value.split('\n').length : 2}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 resize-none"
        />
      ) : (
        <input
          type="text"
          value={value || 'Not found'}
          readOnly
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700"
        />
      )}
    </div>
  );
}
