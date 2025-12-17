import React, { useEffect, useState } from 'react';
import { resumeAPI } from '../api';
import toast from 'react-hot-toast';
import { FileText, Download, Trash2, Eye, FileSpreadsheet, Search } from 'lucide-react';

export default function ResumesPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const response = await resumeAPI.list();
      setResumes(response.data.resumes);
    } catch (error) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      await resumeAPI.delete(id);
      toast.success('Resume deleted successfully');
      loadResumes();
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      const response = await resumeAPI.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Resume downloaded successfully');
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  const handleExportSingle = async (id, fileName) => {
    try {
      const response = await resumeAPI.exportExcelById(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}_export.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      toast.error('Failed to export resume');
    }
  };

  const handleExportAll = async () => {
    try {
      const response = await resumeAPI.exportExcel();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `all_resumes_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('All resumes exported successfully');
    } catch (error) {
      toast.error('Failed to export all resumes');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm(`Are you sure you want to delete all ${resumes.length} resume(s)? This action cannot be undone!`)) return;

    try {
      const response = await resumeAPI.deleteAll();
      toast.success(response.data.message);
      loadResumes();
    } catch (error) {
      toast.error('Failed to delete resumes');
    }
  };

  const filteredResumes = resumes.filter(resume => {
    const searchLower = searchTerm.toLowerCase();
    return (
      resume.fileName.toLowerCase().includes(searchLower) ||
      resume.extractedData?.name?.toLowerCase().includes(searchLower) ||
      resume.extractedData?.email?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Resumes</h1>
          <p className="text-gray-600">Manage all your uploaded resumes</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleDeleteAll}
            disabled={resumes.length === 0}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Trash2 className="w-5 h-5 inline mr-2" />
            Clear All
          </button>
          <button
            onClick={handleExportAll}
            disabled={resumes.length === 0}
            className="btn-primary disabled:opacity-50"
          >
            <FileSpreadsheet className="w-5 h-5 inline mr-2" />
            Export All to Excel
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or filename..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredResumes.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No resumes found matching your search' : 'No resumes uploaded yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredResumes.map((resume) => (
            <div key={resume._id} className="card p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{resume.fileName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 font-medium">Name:</span>
                        <p className="text-gray-700">{resume.extractedData?.name || '-'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Email:</span>
                        <p className="text-gray-700">{resume.extractedData?.email || '-'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Phone:</span>
                        <p className="text-gray-700">{resume.extractedData?.phone || '-'}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-gray-500 font-medium text-sm">Location:</span>
                      <p className="text-gray-700 text-sm">{resume.extractedData?.location || '-'}</p>
                    </div>
                    {resume.extractedData?.skills && resume.extractedData.skills.length > 0 && (
                      <div className="mt-3">
                        <span className="text-gray-500 font-medium text-sm">Skills:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {resume.extractedData.skills.slice(0, 8).map((skill, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {resume.extractedData.skills.length > 8 && (
                            <span className="text-gray-500 text-xs py-1">
                              +{resume.extractedData.skills.length - 8} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-3">
                      Uploaded: {new Date(resume.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => setSelectedResume(selectedResume?._id === resume._id ? null : resume)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDownload(resume._id, resume.fileName)}
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                    title="Download Original"
                  >
                    <Download className="w-5 h-5 text-green-600" />
                  </button>
                  <button
                    onClick={() => handleExportSingle(resume._id, resume.fileName)}
                    className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                    title="Export to Excel"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>

              {selectedResume?._id === resume._id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4">Complete Details:</h4>
                  
                  {resume.extractedData?.education && resume.extractedData.education.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">Education:</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {resume.extractedData.education.map((edu, idx) => (
                          <li key={idx}>{edu}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {resume.extractedData?.experience && resume.extractedData.experience.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Experience:</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {resume.extractedData.experience.map((exp, idx) => (
                          <li key={idx}>{exp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
