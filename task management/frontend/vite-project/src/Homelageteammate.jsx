import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Notecontext from "./Notecontext.jsx";

import {
  
  Check,
  Calendar,
  ChevronRight,
  BarChart2,
  Clock,
  Layers,
  TrendingUp,
  Sparkles,
  Users,
  Target,
  
} from 'lucide-react';


const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-8px) rotate(1deg); }
    50% { transform: translateY(-12px) rotate(0deg); }
    75% { transform: translateY(-8px) rotate(-1deg); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { 
      transform: scale(1); 
      box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
    }
    50% { 
      transform: scale(1.02); 
      box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
    }
  }
  
  @keyframes slideInUp {
    from { 
      opacity: 0; 
      transform: translateY(40px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  .glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .shimmer-effect {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  
  .gradient-bg {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    animation: gradient-shift 8s ease infinite;
    background-size: 200% 200%;
  }
  
  .neon-glow {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3), 
                0 0 40px rgba(139, 92, 246, 0.1),
                0 0 60px rgba(139, 92, 246, 0.1);
  }
`;


const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);

export default function Homelageteammate() {
  const {
    searchingitem,
    setSearchingitem,
    LogedInUser,
    fetchTasks2,
    textdata,
  } = useContext(Notecontext);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-200';
      case 'In Progress': return 'bg-gradient-to-r from-sky-400 to-sky-600 text-white shadow-lg shadow-sky-200';
      case 'Pending': return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-200';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-lg shadow-gray-200';
    }
  };

  useEffect(() => {
    if (LogedInUser) {
      fetchTasks2();
    }
  }, [LogedInUser]);

  const getOneTaskPerStatus = () => {
    const statuses = ['Pending', 'In Progress', 'Completed'];
    const result = [];

    statuses.forEach(status => {
      const task = textdata.find(task => task.status === status);
      if (task) {
        result.push(task);
      }
    });

    return result;
  };

  const tochangeserach = (value) => {
    setSearchingitem(value);
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    return textdata
      .filter(task => new Date(task.dueDate) >= today)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 6);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-sky-50 p-6 overflow-hidden relative" style={{ marginTop: "70px" }}>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-[float_8s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-[float_7s_ease-in-out_infinite]"></div>
      </div>

      <div className="container mx-auto max-w-7xl space-y-10 relative z-10">
        {/* Header */}
        <div className="text-center animate-[slideInUp_0.8s_ease-out]">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-sky-600 bg-clip-text text-transparent mb-4">
            <Sparkles className="text-purple-500" size={36} />
            <h1 className="text-6xl font-bold">Dashboard</h1>
            <Sparkles className="text-sky-500" size={36} />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Welcome back, <span className="font-semibold text-purple-600">{LogedInUser?.username}</span>! 
            Here's your comprehensive task management overview with real-time insights.
          </p>
        </div>

        
        <div className="grid lg:grid-cols-3 gap-8">
          {[
            { 
              icon: <Layers className="text-purple-600" size={36} />, 
              title: "Total Tasks", 
              value: textdata.length,
              gradient: "from-purple-500 to-purple-700",
              iconBg: "bg-purple-100",
              description: "Active projects"
            },
            { 
              icon: <Check className="text-emerald-600" size={36} />, 
              title: "Completed", 
              value: textdata.filter(task => task.status === "Completed").length,
              gradient: "from-emerald-500 to-emerald-700",
              iconBg: "bg-emerald-100",
              description: "Finished tasks"
            },
            { 
              icon: <TrendingUp className="text-sky-600" size={36} />, 
              title: "In Progress", 
              value: textdata.filter(task => task.status === "In Progress").length,
              gradient: "from-sky-500 to-sky-700",
              iconBg: "bg-sky-100",
              description: "Work in progress"
            }
          ].map((stat, index) => (
            <div 
              key={stat.title} 
              className="group relative overflow-hidden"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl rounded-3xl"></div>
              <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border border-white/20 animate-[slideInUp_0.6s_ease-out] group-hover:animate-[pulse-glow_2s_infinite]">
                <div className="flex items-start justify-between mb-6">
                  <div className={`${stat.iconBg} p-4 rounded-2xl shadow-lg animate-[float_3s_infinite] group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <div className={`text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 font-medium mt-1">{stat.description}</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{stat.title}</h3>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full shimmer-effect`} style={{width: `${Math.min((stat.value / Math.max(textdata.length, 1)) * 100, 100)}%`}}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Main Content Area */}
        <div className="grid lg:grid-cols-2 gap-10">
          
          <div className="group animate-[slideInUp_0.8s_ease-out_0.3s] opacity-0 [animation-fill-mode:forwards]">
            <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/30 hover:shadow-3xl transition-all duration-500">
              <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm p-8 flex justify-between items-center border-b border-white/20">
                <div className="flex items-center gap-4">
                  <Target className="text-purple-600" size={28} />
                  <h2 className="text-2xl font-bold text-gray-800">Active Tasks</h2>
                </div>
                <Link 
                  to="./Task" 
                  className="group flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-2xl hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  View All <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="p-2">
                {getOneTaskPerStatus().map((task, index) => (
                  <div
                    key={task._id}
                    className="m-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/80 transition-all duration-300 flex justify-between items-center group shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-purple-700 transition-colors">{task.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>Due {task.dueDate}</span>
                      </div>
                    </div>
                    <Link 
                      to="./Searched" 
                      onClick={() => { tochangeserach(task.status); }} 
                      className="flex items-center gap-4 group/link"
                    >
                      <span className={`px-4 py-2 rounded-xl text-sm font-semibold transform transition-all duration-300 group-hover/link:scale-105 ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <ChevronRight className="text-gray-400 group-hover/link:text-purple-600 group-hover/link:translate-x-1 transition-all" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Upcoming Deadlines */}
          <div className="animate-[slideInUp_0.8s_ease-out_0.4s] opacity-0 [animation-fill-mode:forwards]">
            <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 hover:shadow-3xl transition-all duration-500 h-full">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <Clock className="text-sky-600" size={28} />
                  <h3 className="text-2xl font-bold text-gray-800">Upcoming Deadlines</h3>
                </div>
                <div className="bg-sky-100 p-3 rounded-2xl">
                  <Calendar className="text-sky-600" size={24} />
                </div>
              </div>
              
              <div className="space-y-4">
                {getUpcomingTasks()
                  .filter(task => task.assignedTo === LogedInUser?.username)
                  .slice(0, 3)
                  .map((task, index) => (
                    <div 
                      key={task._id} 
                      className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/30 hover:bg-white/80 transition-all duration-300 flex justify-between items-center group shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1 group-hover:text-sky-700 transition-colors">{task.title}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={14} />
                          <span>Due {task.dueDate}</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-sky-400 to-sky-600 text-white p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                        <Clock size={18} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { 
              icon: <BarChart2 className="mr-3" size={24} />, 
              text: "Reports & Analytics", 
              gradient: "from-emerald-400 to-emerald-600",
              link: "/SmartTrackingSystem",
              description: "View detailed insights"
            },
            { 
              icon: <Users className="mr-3" size={24} />, 
              text: "Team Collaboration", 
              gradient: "from-sky-400 to-sky-600",
              link: "/Teamchat",
              description: "Connect with teammates"
            },
          ].map((link, index) => (
            link.link ? (
              <Link 
                key={link.text} 
                to={link.link} 
                className={`group relative overflow-hidden animate-[slideInUp_0.6s_ease-out] opacity-0 [animation-fill-mode:forwards]`}
                style={{animationDelay: `${0.6 + index * 0.1}s`}}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl rounded-3xl"></div>
                <div className={`relative bg-gradient-to-r ${link.gradient} p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 text-white overflow-hidden group-hover:animate-[pulse-glow_2s_infinite]`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center">
                      {link.icon}
                      <div>
                        <div className="text-xl font-bold">{link.text}</div>
                        <div className="text-white/80 text-sm mt-1">{link.description}</div>
                      </div>
                    </div>
                    <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                  <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </Link>
            ) : null
          ))}
        </div>
      </div>
    </div>
  );
}