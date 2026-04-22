import React, { useState, useContext, useEffect } from 'react';
import Notecontext from "./Notecontext";
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Users, Tag } from 'lucide-react';

export default function Calendar() {
  const { textdata, LogedInUser, fetchTasks, fetchTasks2, role, isLoading, error } = useContext(Notecontext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  const id = LogedInUser?._id;

  
  useEffect(() => {
    const loadTasks = async () => {
      if (!LogedInUser) return;
      if (role === "admin") await fetchTasks();
      else if (role === "teammate") await fetchTasks2();
    };
    loadTasks();
  }, [LogedInUser, role]);

  
  useEffect(() => {
    if (textdata) setTasks(textdata);
  }, [textdata]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const previousMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));

  const getTasksForDay = (day) =>
    tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === day &&
             taskDate.getMonth() === currentDate.getMonth() &&
             taskDate.getFullYear() === currentDate.getFullYear();
    });

  const getPriorityClasses = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-800 hover:from-red-100 hover:to-pink-100';
      case 'medium': return 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 text-amber-800 hover:from-amber-100 hover:to-yellow-100';
      case 'low': return 'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-800 hover:from-emerald-100 hover:to-green-100';
      default: return 'bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 text-gray-800 hover:from-gray-100 hover:to-slate-100';
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (err) {
      return "Time not set";
    }
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    return tasks
      .filter(task => new Date(task.dueDate) >= today)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 6);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 absolute top-0"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200 p-8 text-center">
        <div className="text-red-600 text-lg font-semibold">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-8" style={{ marginTop: "65px" }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8">
          <div className="flex items-center gap-6">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-4 rounded-2xl">
              <CalendarIcon className="w-10 h-10 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Task Calendar
              </h1>
              <p className="text-gray-600 mt-2">Organize and track your tasks</p>
            </div>
          </div>
          <Link 
            to="/Createtask" 
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl flex items-center gap-3 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" /> 
            <span className="font-semibold">Add Task</span>
          </Link>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={previousMonth} 
              className="p-3 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 group"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
            </button>
            <button 
              onClick={nextMonth} 
              className="p-3 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 group"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/40">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
          {days.map(day => (
            <div key={day} className="p-6 text-center text-indigo-700 font-bold text-lg">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {[...Array(firstDayOfMonth)].map((_, i) => (
            <div key={`empty-${i}`} className="min-h-28 p-2 border-b border-r border-gray-100/50" />
          ))}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const isToday = day === new Date().getDate() &&
                            currentDate.getMonth() === new Date().getMonth() &&
                            currentDate.getFullYear() === new Date().getFullYear();
            const dayTasks = getTasksForDay(day);

            return (
              <div key={day} className="min-h-28 p-2 border-b border-r border-gray-100/50 relative group hover:bg-gradient-to-br hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300">
                <div className={`inline-flex w-8 h-8 items-center justify-center rounded-lg font-semibold transition-all duration-300 ${
                  isToday 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100'
                }`}>
                  {day}
                </div>
                <div className="mt-2 space-y-1">
                  {dayTasks.map(task => (
                    <div key={task._id} className={`p-2 rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${getPriorityClasses(task.priority)}`}>
                      <div className="text-xs font-semibold mb-1 truncate">{task.title}</div>
                      <div className="flex items-center gap-1 text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 
                          <span>{formatTime(task.dueDate)}</span>
                        </div>
                        {task.assignedTo && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span className="truncate max-w-12">{task.assignedTo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="absolute top-2 right-2 p-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 border border-gray-200">
                  <Plus className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="max-w-7xl mx-auto mt-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 border-b border-indigo-100">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-indigo-600" />
              Upcoming Tasks
            </h3>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getUpcomingTasks().map(task => (
                <div key={task._id} className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-bold text-gray-800 text-lg group-hover:text-indigo-600 transition-colors truncate flex-1 mr-3">
                        {task.title}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                        task.priority?.toLowerCase() === 'high' 
                          ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200' 
                          : task.priority?.toLowerCase() === 'medium' 
                          ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200' 
                          : 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                          <Clock className="w-4 h-4 text-indigo-500" /> 
                          <span className="font-medium">{formatTime(task.dueDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {task.assignedTo && (
                          <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 text-sm text-blue-700">
                            <Users className="w-4 h-4" /> 
                            <span className="font-medium">{task.assignedTo}</span>
                          </div>
                        )}
                        {task.tags?.length > 0 && (
                          <div className="flex items-center gap-2 bg-purple-50 rounded-lg px-3 py-2 text-sm text-purple-700">
                            <Tag className="w-4 h-4" /> 
                            <span className="font-medium">{task.tags[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}