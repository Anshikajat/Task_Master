
import React, { useContext, useEffect } from "react"
import Notecontext from "./Notecontext"
import { 
  Calendar, 
  Users,
  Triangle,
  Circle
} from 'lucide-react';


const styles = `
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer utilities {
    /* Floating Animation */
    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-15px);
      }
    }

    /* Subtle Gradient Shimmer */
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }

    /* Subtle Pulse */
    @keyframes subtlePulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.02);
      }
    }

    /* Animation Classes */
    .animate-float {
      animation: float 4s ease-in-out infinite;
    }

    .animate-shimmer {
      background-size: 2000px 100%;
      animation: shimmer 3s infinite linear;
    }

    .animate-subtle-pulse {
      animation: subtlePulse 3s ease-in-out infinite;
    }
  }
`;


const styleTag = document.createElement('style');
styleTag.textContent = styles;
document.head.appendChild(styleTag);

export default function Searched() {
    const {searchingitem, fetchTasks, fetchTasks2, role, textdata, setTextdata, LogedInUser, id} = useContext(Notecontext);
    
    useEffect(() => {
        if (id && role === "admin") {
          fetchTasks();
        }
        else if (role === "teammate") {
          fetchTasks2();
        }
        const storedData = localStorage.getItem("textdata");
        setTextdata(storedData ? JSON.parse(storedData) : []);
    }, [id, role, LogedInUser]);
    
    return (
      <div className="min-h-screen bg-slate-700 py-12 px-4 sm:px-6 lg:px-8" style={{marginTop:"60px"}}>
        <div className="max-w-5xl mx-auto grid gap-8">
          {textdata.filter(task => task.status === searchingitem).map((task) => (
            <div 
              key={task._id}
              className="group relative transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 rounded-3xl overflow-hidden bg-white border-2 border-blue-50"
            >
             
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-full blur-3xl animate-float -z-10" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-100/50 to-pink-100/50 rounded-full blur-3xl animate-float animation-delay-2000 -z-10" />

             
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-shimmer" />

              <div className="relative z-10 p-6 md:p-8 lg:p-10">
                
                <div className="flex items-center gap-3 mb-6">
                  <Circle className={`w-4 h-4 
                    ${task.status === 'Pending' ? 'text-amber-500' :
                      task.status === 'In Progress' ? 'text-sky-500' :
                      'text-emerald-500'} animate-pulse`} 
                    fill="currentColor"
                  />
                  <span className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
                    {task.status}
                  </span>
                </div>

               
                <h3 className="text-3xl font-bold text-gray-900 mb-5 transition-colors duration-300 group-hover:text-blue-600 flex items-center">
                  <Triangle className="w-6 h-6 mr-3 text-blue-500 animate-subtle-pulse" />
                  {task.title}
                </h3>

               
                <div className="mb-6">
                  <span className={`inline-flex items-center px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-md transform transition-all duration-300 hover:scale-105 
                    ${task.priority === 'high' ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-600' :
                      task.priority === 'medium' ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-600' :
                      'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-600'}
                  `}>
                    {task.priority.toUpperCase()} PRIORITY
                  </span>
                </div>

                
                <p className="text-gray-700 leading-relaxed mb-6 border-l-4 border-blue-300 pl-4 italic">
                  {task.description}
                </p>

               
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-2xl hover:bg-blue-100 transition-all duration-300">
                    <div className="flex items-center text-blue-600">
                      <Calendar className="w-5 h-5 mr-2 animate-subtle-pulse" />
                      <span className="text-sm font-semibold">Due Date</span>
                    </div>
                    <p className="mt-2 text-gray-800">
                      {new Date(task.dueDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-2xl hover:bg-purple-100 transition-all duration-300">
                    <div className="flex items-center text-purple-600">
                      <Users className="w-5 h-5 mr-2 animate-subtle-pulse" />
                      <span className="text-sm font-semibold">Assigned To</span>
                    </div>
                    <p className="mt-2 text-gray-800">{task.assignedTo}</p>
                  </div>
                </div>

                
                {task.tags && task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-xl font-medium 
                        transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 transform hover:scale-105"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

               
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 opacity-50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
}