import React, { useState, useEffect, useContext } from 'react';
import {
  Search, Download, Eye, User, Clock, Image, Video, FileText, FileIcon,
  Folder, Grid, List, Upload, Filter, SortAsc, FileAudio, Tag, Star, Archive, VideoOff, FileArchive, Server, FolderPlus, Calendar, Users, ChevronDown,
  Heart, Share2, Copy, Trash2, Edit3, BookmarkPlus, ZoomIn, Play, Pause,
  MoreVertical, TrendingUp, Shield, Clock3, Sparkles, Globe, Database,
  CheckCircle, XCircle, AlertCircle, Hourglass, UserCheck, FileCheck
} from 'lucide-react';
import Notecontext from './Notecontext.jsx';
import axios from 'axios';

function TextFilePreview({ filePath }) {
  
  const [content, setContent] = useState('Loading...');

  useEffect(() => {
    
    const fetchTextContent = async () => {
      try {
        const fileName = filePath?.split('\\').pop();

        const response = await fetch(
          `http://localhost:5500/uploads/${fileName}`
        );

        if (!response.ok) throw new Error('Failed to load');

        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error(err);
        setContent('Error loading preview');
      }
    };

    if (filePath) {
      fetchTextContent();
    }
  }, [filePath]);

  return <code className="whitespace-pre-wrap text-sm">{content}</code>;
}

export default function Project() {
  const { LogedInUser, files, setFiles, fetchDataaa, id } = useContext(Notecontext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [showStats, setShowStats] = useState(true);
  const [message, setMessage] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(new Set());
 
useEffect(() => {
  console.log("FILES UPDATED:", files);
}, [files]);
  // useEffect(() => {
  //    console.log("filePath:");
  //   const loadProjectFiles = async () => {
  //     if (id) {
  //       try {
  //         setLoading(true);
  //         const data = await fetchDataaa();
  //         console.log("filePath:",data);
  //         setFiles(data || []);
  //       } catch {
  //         setFiles([]);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };
  //   loadProjectFiles();
  // }, [id]);
  useEffect(() => {
  if (!LogedInUser) return;

  const loadProjectFiles = async () => {
    try {
      setLoading(true);
      const data = await fetchDataaa();
      console.log("filePath:", data);
      
      setFiles(data || []);
      console.log("RENDER FILE:",  files);
    } catch (err) {
      console.error(err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  loadProjectFiles();
}, [LogedInUser]);
const refreshPageData = async () => {
  try {
    setLoading(true);
    const data = await fetchDataaa();
    setFiles(data || []);
    
    
  } catch (error) {
    console.error("Error refreshing data:", error);
  } finally {
    setLoading(false);
  }
};

  const handleUpdateVerification = async (taskId, verificationStatus) => {
    setVerificationLoading(prev => new Set(prev).add(taskId));
    try {
      const response = await axios.put(`http://localhost:5500/verificationprocess/${taskId}`, {
        verificationStatus
      });
      
  
      
      await refreshPageData();
      
      
      setMessage(`Verification status updated to "${verificationStatus}" successfully!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating verification status:", error);
      setMessage("Error updating verification status. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setVerificationLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const getVerificationBadge = (file) => {
    if (!file || !file.taskId) return null;
    
    const verificationStatus = file.verification || 'pending';
    
    switch (verificationStatus) {
      case 'approved':
        return (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
            <CheckCircle className="w-3 h-3" />
            APPROVED
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
            <XCircle className="w-3 h-3" />
            REJECTED
          </div>
        );
      case 'in_review':
        return (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-10 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
            <Hourglass className="w-3 h-3" />
            IN REVIEW
          </div>
        );
      default:
        return (
          <div className="bg-gradient-to-r from-gray-500 to-slate-500 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
            <AlertCircle className="w-3 h-3" />
            Pending
          </div>
        );
    }
  };

  const getVerificationActions = (file) => {
    if (!file.taskId || !LogedInUser) return null;
    
    const verificationStatus = file.taskId.verificationStatus || 'pending';
    const isLoading = verificationLoading.has(file._id); 
    const canVerify = LogedInUser.role === 'admin' || LogedInUser.role === 'manager';
    
    if (!canVerify) return null;

    return (
      <div className="flex gap-3 mt-2">
        {verificationStatus !== 'approved' && (
          <button
            onClick={() => handleUpdateVerification(file._id, 'approved')} 
            disabled={isLoading}
            className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold"
          >
            {isLoading ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <CheckCircle className="w-3 h-3" />
            )}
            Approve
          </button>
        )}
        {verificationStatus !== 'rejected' && (
          <button
            onClick={() => handleUpdateVerification(file._id, 'rejected')} 
            disabled={isLoading}
            className="px-3 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold"
          >
            {isLoading ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            Reject
          </button>
        )}
        {verificationStatus !== 'in_review' && (
          <button
            onClick={() => handleUpdateVerification(file._id, 'in_review')} 
            disabled={isLoading}
            className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold"
          >
            {isLoading ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Hourglass className="w-3 h-3" />
            )}
            Review
          </button>
        )}
      </div>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith('image/')) return <Image className="w-6 h-6 text-emerald-500" />;
    if (mimeType?.startsWith('video/')) return <Video className="w-6 h-6 text-violet-500" />;
    if (mimeType?.startsWith('audio/')) return <FileAudio className="w-6 h-6 text-rose-500" />;
    if (mimeType?.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
    if (mimeType?.includes('zip') || mimeType?.includes('compressed')) return <FileArchive className="w-6 h-6 text-amber-500" />;
    if (mimeType?.includes('archive')) return <Archive className="w-6 h-6 text-orange-500" />;
    if (mimeType?.includes('document')) return <FileIcon className="w-6 h-6 text-blue-600" />;
    if (mimeType?.startsWith('application')) return <Server className="w-6 h-6 text-slate-600" />;
    return <FileIcon className="w-6 h-6 text-gray-500" />;
  };

  const getFileTypeColor = (mimeType) => {
    if (mimeType?.startsWith('image/')) return 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-300';
    if (mimeType?.startsWith('video/')) return 'bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-violet-300';
    if (mimeType?.startsWith('audio/')) return 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 border-rose-300';
    if (mimeType?.includes('pdf')) return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-300';
    if (mimeType?.includes('zip') || mimeType?.includes('compressed')) return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-300';
    if (mimeType?.includes('archive')) return 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-300';
    if (mimeType?.includes('document')) return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-300';
    if (mimeType?.startsWith('application')) return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-300';
    return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-300';
  };

  const getCardBackgroundImage = (mimeType) => {
    if (mimeType?.startsWith('image/')) return 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.2) 100%), url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2310b981" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="7"/%3E%3Ccircle cx="53" cy="53" r="7"/%3E%3Ccircle cx="53" cy="7" r="7"/%3E%3Ccircle cx="7" cy="53" r="7"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")';
    if (mimeType?.startsWith('video/')) return 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(124,58,237,0.2) 100%), url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%238b5cf6" fill-opacity="0.1"%3E%3Cpolygon points="20 0 40 20 20 40 0 20"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")';
    if (mimeType?.startsWith('audio/')) return 'linear-gradient(135deg, rgba(244,63,94,0.1) 0%, rgba(225,29,72,0.2) 100%), url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f43f5e" fill-opacity="0.1"%3E%3Crect width="4" height="20" x="0" y="0"/%3E%3Crect width="4" height="12" x="8" y="4"/%3E%3Crect width="4" height="16" x="16" y="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")';
    if (mimeType?.includes('pdf')) return 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(220,38,38,0.2) 100%), url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ef4444" fill-opacity="0.1"%3E%3Crect width="22" height="6" x="2" y="10"/%3E%3Crect width="22" height="6" x="2" y="20"/%3E%3Crect width="22" height="6" x="2" y="30"/%3E%3Crect width="22" height="6" x="36" y="10"/%3E%3Crect width="22" height="6" x="36" y="20"/%3E%3Crect width="22" height="6" x="36" y="30"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")';
    return 'linear-gradient(135deg, rgba(148,163,184,0.1) 0%, rgba(100,116,139,0.2) 100%), url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2394a3b8" fill-opacity="0.1"%3E%3Cpath d="m56 26-4-4v-4l4-4V6h-8l-4-4-4 4H6v8l-4 4 4 4v34l4 4 4-4h34l4 4 4-4v-8l4-4-4-4V26zM8 8h8l4 4 4-4h8v8l4 4-4 4v8l4 4-4 4v8h-8l-4 4-4-4H8v-8l-4-4 4-4v-8l-4-4 4-4V8z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")';
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch =
      file.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.uploader?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' ||
      (filterType === 'images' && file.mimeType?.startsWith('image/')) ||
      (filterType === 'documents' && (file.mimeType?.includes('pdf') || file.mimeType?.includes('document'))) ||
      (filterType === 'videos' && file.mimeType?.startsWith('video/')) ||
      (filterType === 'audio' && file.mimeType?.startsWith('audio/')) ||
      (filterType === 'archives' && (file.mimeType?.includes('zip') || file.mimeType?.includes('archive'))) ||
      (filterType === 'favorites' && favorites.has(file._id)) ||
      (filterType === 'approved' && file.verification=== 'approved') ||
      (filterType === 'pending' && (!file.verification || file.verification === 'pending')) ||
      (filterType === 'rejected' && file.verification === 'rejected');
    return matchesSearch && matchesFilter;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.filename?.localeCompare(b.filename) || 0;
      case 'size': return (b.size || 0) - (a.size || 0);
      case 'uploader': return a.uploader?.fullName?.localeCompare(b.uploader?.fullName) || 0;
      case 'verification': 
        const statusOrder = { 'approved': 0, 'in_review': 1, 'pending': 2, 'rejected': 3 };
        const aStatus = a.verification || 'pending';
        const bStatus = b.verification || 'pending';
        return statusOrder[aStatus] - statusOrder[bStatus];
      default: return new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0);
    }
  });

  const handlePreview = (file) => {
    setSelectedFile(file);
    setShowPreview(true);
  };

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5500/uploads/${file.filePath?.split('\\').pop()}`;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFavorite = (fileId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(fileId)) {
        newFavorites.delete(fileId);
      } else {
        newFavorites.add(fileId);
      }
      return newFavorites;
    });
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(fileId)) {
        newSelection.delete(fileId);
      } else {
        newSelection.add(fileId);
      }
      return newSelection;
    });
  };

  const copyFileLink = (file) => {
    const link = `http://localhost:5500/uploads/${file.filePath?.split('\\').pop()}`;
    navigator.clipboard.writeText(link);
  };

  const getFileStats = () => {
    const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
    const typeCount = {};
    const verificationCount = { approved: 0, pending: 0, rejected: 0, in_review: 0 };
    
    files.forEach(file => {
      const type = file.mimeType?.split('/')[0] || 'other';
      typeCount[type] = (typeCount[type] || 0) + 1;
      
      const status = file.verification || 'pending';
      verificationCount[status] = (verificationCount[status] || 0) + 1;
    });
    
    return { totalSize, typeCount, verificationCount };
  };

  const stats = getFileStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 pt-20 pb-12 px-6">
      <div className="max-w-7x2 mx-auto">
        
        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-2xl shadow-lg border ${
            message.includes('Error') 
              ? 'bg-red-100 border-red-300 text-red-700' 
              : 'bg-emerald-100 border-emerald-300 text-emerald-700'
          }`}>
            <div className="flex items-center gap-2">
              {message.includes('Error') ? (
                <XCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {message}
            </div>
          </div>
        )}
        
        {/*Header Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-indigo-500/5"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 p-5 rounded-3xl shadow-2xl relative">
                  <FolderPlus className="w-12 h-12 text-white" />
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                    <FileCheck className="w-4 h-4 text-yellow-800" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                    Project Files & Verification
                  </h1>
                  <p className="text-gray-600 mt-2 text-lg">Organize, preview, and manage project verification workflow</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <UserCheck className="w-4 h-4" />
                      <span>Verification system</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Shield className="w-4 h-4" />
                      <span>Quality control</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-4 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-3">
                    <Database className="w-6 h-6" />
                    <div className="text-right">
                      <div className="text-2xl font-bold">{files.length}</div>
                      <div className="text-purple-100 text-sm font-medium">Files</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py- rounded-2xl shadow-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    <div className="text-right">
                      <div className="text-2xl font-bold">{stats.verificationCount.approved}</div>
                      <div className="text-emerald-100 text-sm font-medium">Approved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Stats Dashboard */}
        {showStats && files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <div className="bg-emerald-100 backdrop-blur-lg rounded-2xl p-10 shadow-lg border border-emerald-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="font-bold text-lg text-emerald-800">{stats.verificationCount.approved || 0}</div>
                  <div className="text-sm text-emerald-600">Approved</div>
                </div>
              </div>
            </div>
            <div className="bg-amber-100 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-amber-200">
              <div className="flex items-center gap-3">
                <Hourglass className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="font-bold text-lg text-amber-800">{stats.verificationCount.in_review || 0}</div>
                  <div className="text-sm text-amber-600">In Review</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-bold text-lg text-gray-800">{stats.verificationCount.pending || 0}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>
            <div className="bg-red-100 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-red-200">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-bold text-lg text-red-800">{stats.verificationCount.rejected || 0}</div>
                  <div className="text-sm text-red-600">Rejected</div>
                </div>
              </div>
            </div>
            {Object.entries(stats.typeCount).slice(0, 2).map(([type, count]) => (
              <div key={type} className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/50">
                <div className="flex items-center gap-3">
                  {type === 'image' && <Image className="w-5 h-5 text-emerald-500" />}
                  {type === 'video' && <Video className="w-5 h-5 text-violet-500" />}
                  {type === 'audio' && <FileAudio className="w-5 h-5 text-rose-500" />}
                  {type === 'application' && <FileText className="w-5 h-5 text-blue-500" />}
                  <div>
                    <div className="font-bold text-lg">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{type}s</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/*Controls Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            
            <div className="lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-500" />
                Smart Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search files, uploaders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-all bg-white/70 backdrop-blur-sm focus:bg-white text-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              </div>
            </div>

            
            <div className="lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-500" />
                Filter & Verification
              </label>
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-all bg-white/70 backdrop-blur-sm focus:bg-white appearance-none cursor-pointer text-lg"
                >
                  <option value="all">🗂️ All Files</option>
                  <option value="images">🖼️ Images</option>
                  <option value="documents">📄 Documents</option>
                  <option value="videos">🎬 Videos</option>
                  <option value="audio">🎵 Audio</option>
                  <option value="archives">📦 Archives</option>
                  <option value="favorites">⭐ Favorites</option>
                  <option value="approved">✅ Approved</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="rejected">❌ Rejected</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 pointer-events-none" />
              </div>
            </div>

            
            <div className="lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-purple-500" />
                Sort Order
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-all bg-white/70 backdrop-blur-sm focus:bg-white appearance-none cursor-pointer text-lg"
                >
                  <option value="date">📅 Latest First</option>
                  <option value="name">🔤 Name A-Z</option>
                  <option value="size">📏 File Size</option>
                  <option value="uploader">👤 Uploader</option>
                  <option value="verification">✅ Verification Status</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 pointer-events-none" />
              </div>
            </div>

            
            <div className="lg:col-span-3 flex flex-col gap-3">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-2 flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-white text-purple-600 shadow-lg transform scale-105'
                      : 'text-gray-500 hover:text-purple-500'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-5 h-5 mx-auto" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-white text-purple-600 shadow-lg transform scale-105'
                      : 'text-gray-500 hover:text-purple-500'
                  }`}
                  title="List View"
                >
                  <List className="w-5 h-5 mx-auto" />
                </button>
              </div>
              <button
                onClick={() => setShowStats(!showStats)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                title="Toggle Stats"
              >
                <TrendingUp className="w-5 h-5 mx-auto" />
              </button>
            </div>

          </div>

          
          {selectedFiles.size > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 font-semibold">
                  {selectedFiles.size} file{selectedFiles.size > 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download All
                  </button>
                  <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Approve All
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

       
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-purple-400 animate-pulse" />
                </div>
              </div>
              <p className="mt-8 text-gray-600 text-xl font-medium">Loading your amazing files...</p>
            </div>
          ) : sortedFiles.length === 0 ? (
            <div className="py-32 text-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Folder className="w-16 h-16 text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">No files found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your search or filter criteria</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {sortedFiles.map((file, index) => (
                  
                  <div
                    key={file._id}
                    className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 hover:shadow-3xl"
                    style={{
                      background: getCardBackgroundImage(file.mimeType),
                      backgroundSize: '30px 30px, cover',
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-sm"></div>
                    
                    
                    <div className="relative z-10 p-6 h-full flex flex-col">
                     
                      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <input
                          type="checkbox"
                          checked={selectedFiles.has(file._id)}
                          onChange={() => toggleFileSelection(file._id)}
                          className="w-5 h-5 rounded-lg border-2 border-white bg-white/80 text-purple-600 focus:ring-purple-500"
                        />
                      </div>

                     
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => toggleFavorite(file._id)}
                          className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                            favorites.has(file._id)
                              ? 'bg-yellow-400 text-white shadow-lg animate-pulse'
                              : 'bg-white/80 text-gray-400 hover:text-yellow-500 hover:bg-white'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${favorites.has(file._id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      
                      <div className="flex flex-col gap-2 mb-4">
                        {file.taskId?.title && (
                          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                            <Tag className="w-3 h-3" />
                            {file.taskId.title}
                          </div>
                        )}
                        {getVerificationBadge(file)}
                      </div>

                   
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-white/50">
                            {getFileIcon(file.mimeType)}
                          </div>
                          <span className={`px-4 py-2 rounded-xl text-xs font-bold border-2 shadow-lg ${getFileTypeColor(file.mimeType)}`}>
                            {file.mimeType?.split('/')[1]?.toUpperCase() || 'FILE'}
                          </span>
                        </div>
                      </div>

                      
                      <h3 className="font-bold text-gray-800 text-xl mb-6 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300" title={file.filename}>
                        {file.filename}
                      </h3>

                     
                      <div className="space-y-4 flex-grow">
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-2 rounded-lg">
                            <User className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-semibold truncate">{file.uploader?.fullName || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-lg">
                            <Calendar className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span className="text-sm">{formatDate(file.uploadedAt)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-2 rounded-lg">
                            <Database className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-sm font-bold">{formatFileSize(file.size)}</span>
                        </div>
                      </div>

                     
                      {getVerificationActions(file)}

                    
                      <div className="flex space-x-3 mt-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <button
                          onClick={() => handlePreview(file)}
                          className="flex-1 p-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold"
                          title="Preview file"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        <button
                          onClick={() => handleDownload(file)}
                          className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                          title="Download file"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyFileLink(file)}
                          className="p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                          title="Copy link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-indigo-400/10 blur-xl"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
          
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100 border-b-2 border-purple-200">
                  <tr>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFiles(new Set(sortedFiles.map(f => f._id)));
                            } else {
                              setSelectedFiles(new Set());
                            }
                          }}
                          checked={selectedFiles.size === sortedFiles.length && sortedFiles.length > 0}
                          className="w-5 h-5 rounded border-2 border-purple-300 text-purple-600 focus:ring-purple-500"
                        />
                        File & Details
                      </div>
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Uploader</th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Verification</th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Size</th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {sortedFiles.map((file, index) => (
                    <tr key={file._id} className="group hover:bg-gradient-to-r hover:from-purple-25 hover:via-pink-25 hover:to-indigo-25 transition-all duration-300" style={{animationDelay: `${index * 50}ms`}}>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-6">
                          <input
                            type="checkbox"
                            checked={selectedFiles.has(file._id)}
                            onChange={() => toggleFileSelection(file._id)}
                            className="w-5 h-5 rounded border-2 border-purple-300 text-purple-600 focus:ring-purple-500"
                          />
                          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-white/50">
                            {getFileIcon(file.mimeType)}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-800 text-xl mb-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300" title={file.filename}>
                              {file.filename}
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-4 py-2 rounded-xl text-xs font-bold border shadow-lg ${getFileTypeColor(file.mimeType)}`}>
                                {file.mimeType?.split('/')[1]?.toUpperCase() || 'FILE'}
                              </span>
                              <button
                                onClick={() => toggleFavorite(file._id)}
                                className={`p-2 rounded-full transition-all duration-300 ${
                                  favorites.has(file._id)
                                    ? 'bg-yellow-400 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                                }`}
                              >
                                <Heart className={`w-4 h-4 ${favorites.has(file._id) ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                            {file.taskId?.title && (
                              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-lg mb-2">
                                <Tag className="w-3 h-3" />
                                Task: {file.taskId.title}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full flex items-center justify-center shadow-xl">
                            <span className="text-white font-bold text-lg">
                              {file.uploader?.fullName?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-gray-800 text-lg">
                              {file.uploader?.fullName || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">Uploader</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="space-y-3">
                          {getVerificationBadge(file)}
                          {getVerificationActions(file)}
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-3 rounded-xl inline-block shadow-lg">
                          <span className="font-bold text-emerald-700">{formatFileSize(file.size)}</span>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-3 rounded-xl inline-block shadow-lg">
                          <div className="text-gray-700 font-bold text-sm">
                            {formatDate(file.uploadedAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button
                            onClick={() => handlePreview(file)}
                            className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            title="Preview file"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDownload(file)}
                            className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            title="Download file"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => copyFileLink(file)}
                            className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            title="Copy link"
                          >
                            <Copy className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

       
        {showPreview && selectedFile && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center p-6">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-6xl max-h-[95vh] w-full flex flex-col overflow-hidden border border-purple-200">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white px-10 py-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold mb-3 flex items-center gap-4">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                        {getFileIcon(selectedFile.mimeType)}
                      </div>
                      {selectedFile.filename}
                    </h3>
                    <div className="flex items-center gap-4 mb-3">
                      {selectedFile.taskId?.title && (
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Task: {selectedFile.taskId.title}
                        </div>
                      )}
                      {getVerificationBadge(selectedFile)}
                    </div>
                    <div className="text-purple-100 flex items-center gap-6 text-lg">
                      <span className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {selectedFile.uploader?.fullName || 'Unknown'}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {formatDate(selectedFile.uploadedAt)}
                      </span>
                      <span className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        {formatFileSize(selectedFile.size)}
                      </span>
                    </div>
                    {getVerificationActions(selectedFile)}
                  </div>
                  <div className="flex items-center gap-3 ">
                    <button
                      onClick={() => toggleFavorite(selectedFile._id)}
                      className={`p-10 rounded-2xl transition-all duration-300 ${
                        favorites.has(selectedFile._id)
                          ? 'bg-yellow-400 text-white shadow-xl'
                          : 'bg-white/20 hover:bg-white/30'
                      }`}
                      title="Toggle favorite"
                    >
                      <Heart className={`w-6 h-6 ${favorites.has(selectedFile._id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleDownload(selectedFile)}
                      className="bg-white/20 hover:bg-white/30 p-4 rounded-2xl transition-all duration-300"
                      title="Download file"
                    >
                      <Download className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="bg-white/20 hover:bg-white/30 p-4 rounded-2xl transition-all duration-300"
                      title="Close preview"
                    >
                      <span className="text-3xl font-bold">×</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-10 overflow-auto bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-indigo-50/50 backdrop-blur-sm">
                <div className="flex justify-center items-center h-full">
                  {selectedFile.mimeType?.startsWith('image/') ? (
                    <div className="relative group">
                      <img
                        src={`http://localhost:5500/uploads/${selectedFile.filePath?.split('\\').pop()}`}
                        alt={selectedFile.filename}
                        className="max-w-full max-h-full rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"></div>
                    </div>
                  ) : selectedFile.mimeType?.startsWith('video/') ? (
                    <video controls className="max-w-full max-h-full rounded-2xl shadow-2xl">
                      <source src={`http://localhost:5500/uploads/${selectedFile.filePath?.split('\\').pop()}`} type={selectedFile.mimeType} />
                      Your browser does not support the video tag.
                    </video>
                  ) : selectedFile.mimeType?.includes('pdf') ? (
                    <iframe
                      src={`http://localhost:5500/uploads/${selectedFile.filePath?.split('\\').pop()}`}
                      title={selectedFile.filename}
                      className="w-full h-full min-h-[700px] rounded-2xl border-4 border-purple-200 shadow-2xl"
                    />
                  ) : selectedFile.mimeType?.startsWith('text/') ? (
                    <div className="w-full h-full bg-white/90 backdrop-blur-sm rounded-2xl border-4 border-purple-200 p-8 overflow-auto shadow-2xl">
                      <TextFilePreview filePath={selectedFile.filePath} />
                    </div>
                  ) : (
                    <div className="text-center py-32">
                      <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        {getFileIcon(selectedFile.mimeType)}
                      </div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Preview not available</h3>
                      <p className="text-gray-600 text-xl">This file type cannot be previewed in the browser</p>
                      <button
                        onClick={() => handleDownload(selectedFile)}
                        className="mt-6 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-3 mx-auto"
                      >
                        <Download className="w-5 h-5" />
                        Download to view
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}