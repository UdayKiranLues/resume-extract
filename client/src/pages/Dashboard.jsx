import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeAPI } from '../api';
import toast from 'react-hot-toast';
import { Upload, FileText, Download, TrendingUp, Clock } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalResumes: 0,
    recentUploads: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await resumeAPI.list();
      const resumes = response.data.resumes;
      setStats({
        totalResumes: resumes.length,
        recentUploads: resumes.slice(0, 5)
      });
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
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
      toast.success('Excel file downloaded successfully!');
    } catch (error) {
      toast.error('Failed to export resumes');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">Manage and extract data from your resumes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Resumes</p>
              <h3 className="text-4xl font-bold mt-2">{stats.totalResumes}</h3>
            </div>
            <FileText className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">This Month</p>
              <h3 className="text-4xl font-bold mt-2">
                {stats.recentUploads.filter(r => {
                  const uploadDate = new Date(r.uploadedAt);
                  const now = new Date();
                  return uploadDate.getMonth() === now.getMonth();
                }).length}
              </h3>
            </div>
            <TrendingUp className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Recent Activity</p>
              <h3 className="text-4xl font-bold mt-2">
                {stats.recentUploads.length > 0 ? '✓' : '-'}
              </h3>
            </div>
            <Clock className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/upload" className="card p-8 hover:scale-105 transition-transform duration-200 cursor-pointer group">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 group-hover:bg-blue-200 p-4 rounded-full transition-colors">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Upload Resume</h3>
              <p className="text-gray-600">Extract data from new resumes</p>
            </div>
          </div>
        </Link>

        <button
          onClick={handleExportAll}
          disabled={stats.totalResumes === 0}
          className="card p-8 hover:scale-105 transition-transform duration-200 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 group-hover:bg-green-200 p-4 rounded-full transition-colors">
              <Download className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-800">Export All</h3>
              <p className="text-gray-600">Download all resumes as Excel</p>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Uploads */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Uploads</h2>
          <Link to="/resumes" className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>

        {stats.recentUploads.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No resumes uploaded yet</p>
            <Link to="/upload" className="btn-primary mt-4 inline-block">
              Upload Your First Resume
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">File Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUploads.map((resume) => (
                  <tr key={resume._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{resume.fileName}</td>
                    <td className="py-3 px-4">{resume.extractedData?.name || '-'}</td>
                    <td className="py-3 px-4">{resume.extractedData?.email || '-'}</td>
                    <td className="py-3 px-4">
                      {new Date(resume.uploadedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
