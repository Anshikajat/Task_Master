import React, { useState,useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Tag, 
  Clock, 
  Users, 
  AlertTriangle 
} from 'lucide-react';
import axios from 'axios';

const CreateTask = () => {
  let [UserData, setUserData] = useState({})
  const [taskDetails, setTaskDetails] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
    tags: [],
    referralId: '' 
  });
  
  useEffect(() => {
    const User = JSON.parse(localStorage.getItem("User"));
    if (User) {
      setUserData(User);
      console.log(User)
      
      setTaskDetails(prev => ({
        ...prev,
        referralId: User.id 
      }));
      console.log("User data:", User);
    }
  }, []);

  const [message, setMessage] = useState("");

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let Res = await axios.post("http://localhost:5500/textscontent", taskDetails);
      setMessage("Task created successfully!");
      
      setTimeout(() => {
        setMessage("");
      }, 3000);
      
setTaskDetails({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  assignedTo: '',
  tags: [],
  referralId: UserData._id 
});
    } catch (error) {
      console.error("Error submitting task:", error);
      setMessage("Error creating task. Please try again.");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{marginTop:"70px"}}>
      <div className="container mx-auto max-w-2xl bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex items-center">
          <Plus className="mr-4" size={24} />
          <h1 className="text-2xl font-bold">Create New Task</h1>
        </div>

        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mx-6 mt-4 rounded">
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" >Task Title</label>
            <input 
              type="text"
              name="title"
              value={taskDetails.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{backgroundColor:"#E3EEFC",color:"black",fontWeight:"bold"}}
              placeholder="Enter task title"
              required
            />
          </div>

         
<div>
  <label className="block text-gray-700 font-medium mb-2">Description</label>
  <textarea
    name="description"
    value={taskDetails.description}
    onChange={handleInputChange}
    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-cyan-50"
    
    rows="4"
    placeholder="Describe your task details"
  />
</div>


        
          <div>
            <label className="block text-gray-700 font-medium mb-2">Priority</label>
            <div className="flex space-x-4" >
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTaskDetails(prev => ({...prev, priority: option.value}))}
                  className={`
                    flex-1 py-2 rounded-md transition 
                    ${taskDetails.priority === option.value 
                      ? option.color 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Due Date</label>
              <div className="relative">
                <input 
                  type="date"
                  name="dueDate"
                  value={taskDetails.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{backgroundColor:"#E3EEFC",color:"black"}}
                />
                <Calendar className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
            </div>

            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Assign To</label>
              <div className="relative">
                <select 
                  name="assignedTo"
                  value={taskDetails.assignedTo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{backgroundColor:"#E3EEFC",color:"black"}}
                >
                  <option value="">Select Team Member</option>
                  <option value="john">John Doe</option>
                  <option value="jane">Jane Smith</option>
                  <option value="mike">Mike Johnson</option>
                </select>
                <Users className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {['Design', 'Development', 'Marketing', 'Research'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTaskDetails(prev => ({
                    ...prev, 
                    tags: prev.tags.includes(tag) 
                      ? prev.tags.filter(t => t !== tag)
                      : [...prev.tags, tag]
                  }))}
                  className={`
                    px-3 py-1 rounded-full text-sm transition
                    ${taskDetails.tags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          
          <div className="pt-6 border-t">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
            >
              <Plus className="mr-2" size={20} /> Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;