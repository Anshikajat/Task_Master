import React, { useState, useRef, useContext, useEffect } from 'react';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  Archive, 
  X, 
  CheckCircle,
  Layers,
  Award,
  Briefcase,
  Target,
  Calendar,
  Tag,
  AlertCircle,
  Clock,
  Filter,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Notecontext from './Notecontext';

export default function Submituserproject() {
  const { LogedInUser, textdata, files, setFiles, uploadProjectFile, fetchTasks2, fetchTasks, id, role } = useContext(Notecontext);

  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTasks, setShowTasks] = useState(false);
  const [taskFilter, setTaskFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      if (!LogedInUser) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        
        if (role === 'admin' || role === 'manager') {
          if (id) {
            await fetchTasks();
          }
        } else {
          
          await fetchTasks2();
        }
        setDataFetched(true);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    
    setDataFetched(false);
    fetchData();
  }, [LogedInUser, id, role]); 
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && LogedInUser && !dataFetched) {
        if (role === 'admin' || role === 'manager') {
          if (id) {
            fetchTasks();
          }
        } else {
          fetchTasks2();
        }
        setDataFetched(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [LogedInUser, id, role, dataFetched]);

  const projectTypes = [
    { 
      id: 'web', 
      name: 'Development', 
      icon: <Layers className="w-8 h-8 text-blue-500" />,
      description: 'Websites, Web Apps, and Interfaces'
    },
    { 
      id: 'design', 
      name: 'Design Project', 
      icon: <Award className="w-8 h-8 text-purple-500" />,
      description: 'UI/UX, Graphic Design, Branding'
    },
    { 
      id: 'marketing', 
      name: 'Marketing', 
      icon: <Target className="w-8 h-8 text-green-500" />,
      description: 'Campaign, Content, Strategy'
    },
    { 
      id: 'research', 
      name: 'Research Project', 
      icon: <Briefcase className="w-8 h-8 text-orange-500" />,
      description: 'Academic, Scientific, Market Research'
    }
  ];

  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

 
  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

 
  const filteredTasks = textdata?.filter(task => {
    const matchesFilter = taskFilter === 'all' || task.priority === taskFilter;
    const matchesSearch = task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  
  const isTaskCompleted = (task) => {
    return task.status === 'Completed' || task.completed === true;
  };

  
  const getFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  
  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map(file => ({
      file,
      preview: getFilePreview(file),
      id: Math.random().toString(36).substring(2, 15)
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

 
  const removeFile = (id) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(f => {
        if (f.id === id && f.preview) {
          URL.revokeObjectURL(f.preview);
        }
        return f.id !== id;
      });
      return updatedFiles;
    });
  };

  
  const resetFormState = () => {
    
    files.forEach(fileItem => {
      if (fileItem.preview) {
        URL.revokeObjectURL(fileItem.preview);
      }
    });
    setFiles([]);
    setSelectedProject(null);
    setSelectedTask(null);
    setShowTasks(false);
    setTaskFilter('all');
    setSearchQuery('');
  };

  
  useEffect(() => {
    return () => {
     
      files.forEach(fileItem => {
        if (fileItem.preview) {
          URL.revokeObjectURL(fileItem.preview);
        }
      });
    };
  }, []);

  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

 
  const renderFileIcon = (file) => {
    const fileType = file.file.type;
    if (fileType.startsWith('image/')) return <Image className="w-8 h-8 text-blue-500" />;
    if (fileType === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="w-8 h-8 text-green-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  
  const handleSubmitProject = async () => {
    if (!selectedProject) {
      alert('Please select a project type');
      return;
    }
    if (!selectedTask) {
      alert('Please select a task');
      return;
    }
    if (files.length === 0) {
      alert('Please upload at least one file');
      return;
    }

    
    if (isTaskCompleted(selectedTask)) {
      alert('This task is already completed. Resubmission is not allowed.');
      return;
    }

    try {
      
      for (const fileItem of files) {
        await uploadProjectFile({
          file: fileItem.file,
          projectId: selectedProject,
          taskId: selectedTask._id
        });
      }
      
      alert('Project submitted successfully and task marked as completed!');
      
      
      resetFormState();
      
      
      if (LogedInUser) {
        if (role === 'admin' || role === 'manager') {
          if (id) {
            await fetchTasks();
          }
        } else {
          await fetchTasks2();
        }
      }
      
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files. Please try again.');
    }
  };

  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center" style={{marginTop:"60px"}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  
  if (!LogedInUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center" style={{marginTop:"60px"}}>
        <div className="text-center">
          <p className="text-gray-600">Please log in to submit projects.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-6 sm:px-10 lg:px-8" style={{marginTop:"60px"}}>
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Submit Your Project
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your project type, choose the related task, and upload your project files for review.
          </p>
        </div>

       
        <div className="text-center mb-6">
          <button 
            onClick={() => {
              setDataFetched(false);
              if (role === 'admin' || role === 'manager') {
                if (id) fetchTasks();
              } else {
                fetchTasks2();
              }
              setDataFetched(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200"
          >
            Refresh Tasks
          </button>
        </div>

        
        {!isLoading && (!textdata || textdata.length === 0) && (
          <div className="text-center mb-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <p className="text-yellow-800">No tasks available. Please contact your administrator.</p>
            </div>
          </div>
        )}

      
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${selectedProject ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <span className="text-sm font-semibold">1</span>
            </div>
            <div className={`w-16 h-1 ${selectedProject ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${selectedTask ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <span className="text-sm font-semibold">2</span>
            </div>
            <div className={`w-16 h-1 ${files.length > 0 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${files.length > 0 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <span className="text-sm font-semibold">3</span>
            </div>
          </div>
        </div>

       
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">1</span>
            Select Your Project Type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {projectTypes.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  setSelectedProject(project.id);
                  setShowTasks(true);
                }}
                className={`
                  group p-6 rounded-2xl text-center transition-all duration-300 
                  hover:shadow-xl hover:scale-105 
                  ${selectedProject === project.id 
                    ? 'bg-blue-50 border-2 border-blue-500 shadow-lg ring-4 ring-blue-100' 
                    : 'bg-white border-2 border-gray-200 hover:border-blue-300 shadow-md hover:shadow-lg'}
                `}
              >
                <div className="flex flex-col items-center">
                  {React.cloneElement(project.icon, {
                    className: `w-12 h-12 mb-4 transition-colors duration-300
                      ${selectedProject === project.id 
                        ? 'text-blue-600' 
                        : 'text-gray-500 group-hover:text-blue-500'}`
                  })}
                  <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300
                    ${selectedProject === project.id 
                      ? 'text-blue-700' 
                      : 'text-gray-800 group-hover:text-blue-600'}`}>
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500 text-center">
                    {project.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        
        {showTasks && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">2</span>
                Select Related Task
              </h2>
              <button
                onClick={() => setShowTasks(!showTasks)}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                {showTasks ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

           
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={taskFilter}
                    onChange={(e) => setTaskFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

            
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task, index) => {
                    const taskCompleted = isTaskCompleted(task);
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          if (taskCompleted) {
                            alert('This task is already completed. You cannot resubmit.');
                            return;
                          }
                          setSelectedTask(task);
                        }}
                        className={`p-4 rounded-xl transition-all duration-300 relative
                          ${taskCompleted 
                            ? 'bg-gray-100 border-2 border-gray-300 cursor-not-allowed opacity-60' 
                            : selectedTask === task 
                              ? 'bg-blue-50 border-2 border-blue-500 shadow-lg cursor-pointer' 
                              : 'bg-gray-50 border-2 border-transparent hover:border-blue-300 cursor-pointer hover:shadow-md'}`}
                      >
                        {taskCompleted && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-3">
                          <h3 className={`font-semibold text-sm line-clamp-2 ${taskCompleted ? 'text-gray-500' : 'text-gray-800'}`}>
                            {task.title || 'Untitled Task'}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getPriorityColor(task.priority)}`}>
                            {getPriorityIcon(task.priority)}
                            <span className="capitalize">{task.priority}</span>
                          </span>
                        </div>
                        
                        <p className={`text-sm mb-3 line-clamp-2 ${taskCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
                          {task.description || 'No description available'}
                        </p>
                        
                        {taskCompleted && (
                          <div className="mb-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span className={isOverdue(task.dueDate) && !taskCompleted ? 'text-red-500 font-medium' : ''}>
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Tag className="w-4 h-4" />
                              <span>{task.tags.length} tags</span>
                            </div>
                          )}
                        </div>

                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {task.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span key={tagIndex} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                            {task.tags.length > 3 && (
                              <span className="text-gray-500 text-xs">+{task.tags.length - 3} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No tasks found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

       
        {selectedTask && !isTaskCompleted(selectedTask) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">3</span>
              Upload Project Files
            </h2>
            
            {/* Selected Task Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Selected Task: {selectedTask.title}
                  </h3>
                  <p className="text-blue-700 text-sm mb-2">{selectedTask.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`px-2 py-1 rounded-full font-medium flex items-center space-x-1 ${getPriorityColor(selectedTask.priority)}`}>
                      {getPriorityIcon(selectedTask.priority)}
                      <span className="capitalize">{selectedTask.priority} Priority</span>
                    </span>
                    <span className="flex items-center space-x-1 text-blue-700">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {formatDate(selectedTask.dueDate)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 
                ${dragging 
                  ? 'border-blue-500 bg-blue-50 scale-105' 
                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/50'}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                multiple 
                ref={fileInputRef} 
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden" 
              />
              
              <div className="flex flex-col items-center justify-center space-y-6">
                <Upload className="w-16 h-16 text-blue-500 animate-bounce" />
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Upload Your Project Files
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop files or{' '}
                    <button 
                      onClick={() => fileInputRef.current.click()}
                      className="text-blue-600 hover:underline focus:outline-none font-semibold"
                    >
                      browse
                    </button>
                  </p>
                </div>
                
                {/* File Type Hints */}
                <div className="flex space-x-6 text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Image className="w-5 h-5" />
                    <span className="text-sm">Images</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm">Documents</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Archive className="w-5 h-5" />
                    <span className="text-sm">Archives</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      
        {files.length > 0 && selectedTask && !isTaskCompleted(selectedTask) && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              Uploaded Files ({files.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((fileItem) => (
                <div 
                  key={fileItem.id} 
                  className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {fileItem.preview ? (
                        <img 
                          src={fileItem.preview} 
                          alt="File preview" 
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        renderFileIcon(fileItem)
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                          {fileItem.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(fileItem.file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile(fileItem.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

       
        {selectedProject && selectedTask && !isTaskCompleted(selectedTask) && files.length > 0 && (
          <div className="text-center">
            <button 
              onClick={handleSubmitProject}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold 
              hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center mx-auto space-x-3
              transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <CheckCircle className="w-6 h-6" />
              <span>Submit Project</span>
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Your project will be submitted for review and feedback.
            </p>
          </div>
        )}

        
        {(selectedProject || selectedTask || files.length > 0) && (
          <div className="text-center mt-8">
            <button 
              onClick={resetFormState}
              className="bg-gray-500 text-white px-6 py-3 rounded-full text-md font-medium 
              hover:bg-gray-600 transition-all duration-300 flex items-center justify-center mx-auto space-x-2"
            >
              <X className="w-5 h-5" />
              <span>Start New Submission</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}