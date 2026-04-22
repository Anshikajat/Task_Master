import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useContext } from "react"
import Notecontext from "./Notecontext.jsx"


import { 
  Plus, 
  Check, 
  Calendar, 
  ChevronRight, 
  BarChart2, 
  Clock 
} from 'lucide-react';


const HomePage = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design Product Mockup', status: 'In Progress', dueDate: 'Tomorrow' },
    { id: 2, title: 'Team Meeting', status: 'Pending', dueDate: 'Wednesday' },
    { id: 3, title: 'Code Review', status: 'Completed', dueDate: 'Last Week' }
  ]);
  


  const {searchingitem, setSearchingitem,fetchTasks,id,textdata} = useContext(Notecontext);
  let contextData = useContext(Notecontext)
  textdata.map((e)=>{
    if
    (e.status=='Pending'){
    console.log(e.status)}
  })
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200';
      case 'In Progress': return 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200';
      case 'Pending': return 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200';
      default: return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200';
    }
  };
  
      
        useEffect(() => {
          if (id) {
            fetchTasks();
          }
        }, [id]);

      useEffect(()=>{
        
      },[searchingitem])

      const tochangeserach=(value)=>{
        setSearchingitem(value)
      }
      const getUpcomingTasks = () => {
        const today = new Date();
        return textdata
          .filter(task => new Date(task.dueDate) >= today)
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 6); 
      };

      

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6" style={{marginTop:"70px"}}>
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600">Track and manage your tasks</p>
          </div>
          <Link 
            to="/Createtask" 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="mr-2" size={20} /> Create Task
          </Link>
        </div>

       
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-white/20 p-6 flex items-center space-x-4 hover:shadow-xl transition-all duration-300 group">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
              <BarChart2 className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-800">{textdata.length}</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-white/20 p-6 flex items-center space-x-4 hover:shadow-xl transition-all duration-300 group">
            <div className="bg-gradient-to-br from-emerald-100 to-green-200 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Check className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-800">{textdata.filter(task => task.status ==="Completed" ).length}</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-white/20 p-6 flex items-center space-x-4 hover:shadow-xl transition-all duration-300 group">
            <div className="bg-gradient-to-br from-amber-100 to-orange-200 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Clock className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{textdata.filter(task => task.status ==="Pending").length}</p>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Active Tasks</h2>
            <Link to="./Task" className="text-blue-500 flex items-center hover:text-blue-700 transition-colors group">
              View All <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className="p-4 border-b last:border-b-0 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/50 transition-all duration-300 flex justify-between items-center group"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{task.title}</h3>
                  <p className="text-sm text-gray-500">Due {task.dueDate}</p>
                </div>
                <Link to="./Searched" onClick={()=>{tochangeserach(task.status);}} className="flex items-center space-x-3 group">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <ChevronRight className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {getUpcomingTasks().slice(0, 3).map(task => (
                <div key={task.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-700">{task.title}</p>
                    <p className="text-sm text-gray-500">Due {task.dueDate}</p>
                  </div>
                  <Calendar className="text-blue-500" size={20} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                to="/Project" 
                className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 py-3 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300 flex items-center justify-center hover:shadow-lg transform hover:scale-105"
              >
                <BarChart2 className="mr-2" size={20} /> Projects 
              </Link>
              <Link 
                to="/SmartTrackingSystem" 
                className="bg-gradient-to-br from-green-50 to-green-100 text-green-600 py-3 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-300 flex items-center justify-center hover:shadow-lg transform hover:scale-105"
              >
                <Calendar className="mr-2" size={20} /> Analytics
              </Link>
              <Link 
                to="/Teamchat" 
                className="bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 py-3 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-300 flex items-center justify-center hover:shadow-lg transform hover:scale-105"
              >
                <Clock className="mr-2" size={20} /> Team Chat
              </Link>
              <Link to="/Createtask" className="bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 py-3 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-300 flex items-center justify-center hover:shadow-lg transform hover:scale-105">
                <Plus className="mr-2" size={20} /> New Task
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;