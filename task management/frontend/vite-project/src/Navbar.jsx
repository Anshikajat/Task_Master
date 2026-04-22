import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { 
  Home, 
  CheckSquare, 
  PlusSquare, 
  Calendar, 
  UserRound, 
  Menu, 
  X 
} from 'lucide-react';
import { useContext } from "react"
import Notecontext from "./Notecontext.jsx"

export default function Navbar() {
  const {searchingitem, setSearchingitem,isSignIn, setIsSignIn,LogedIn, setLogedIn,LogedInUser, setLogedInUser,role} = useContext(Notecontext);
  let contextData = useContext(Notecontext)  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link  className="flex items-center text-2xl font-bold text-blue-600">
            TaskMaster
          </Link>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link 
               to="/"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home size={20} className="mr-2" /> Home
            </Link>
            <Link 
               to="/Task"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <CheckSquare size={20} className="mr-2" /> Tasks
            </Link>
            {role === "admin" ? (
  <Link
    to="/Createtask"
    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
  >
    <PlusSquare size={20} className="mr-2" /> Create Task
  </Link>
) : (
  <Link
    to="/Submituserproject"
    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
  >
    <PlusSquare size={20} className="mr-2" /> Submit
  </Link>
)}
            <Link 
              to="/Calendar"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Calendar size={20} className="mr-2" /> Calendar
            </Link>
            <Link 
              to="/SignUp"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              < UserRound size={20} className="mr-2" />{LogedIn?
               <span>{LogedInUser.username}</span>:<span>SignUp</span>}
            </Link>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
              <div className="flex flex-col p-4 space-y-2">
                <Link 
                  to="/" 
                  className="flex items-center p-2 hover:bg-blue-50 rounded"
                  onClick={toggleMenu}
                >
                  <Home size={20} className="mr-2" /> Home
                </Link>
                <Link 
                  to="/Task"
                  className="flex items-center p-2 hover:bg-blue-50 rounded"
                  onClick={toggleMenu}
                >
                  <CheckSquare size={20} className="mr-2" /> Tasks
                </Link>
                <Link 
                   to="/Createtask"
                  className="flex items-center p-2 hover:bg-blue-50 rounded"
                  onClick={toggleMenu}
                >
                  <PlusSquare size={20} className="mr-2" /> Create Task
                </Link>
                <Link 
                  to="/Calendar" 
                  className="flex items-center p-2 hover:bg-blue-50 rounded"
                  onClick={toggleMenu}
                >
                  <Calendar size={20} className="mr-2" /> Calendar
                </Link>
                <Link 
                  to="/SignUp"
                  className="flex items-center p-2 hover:bg-blue-50 rounded"
                  onClick={toggleMenu}
                >
                  < UserRound size={20} className="mr-2" /> {LogedIn?
               <span>{LogedInUser.username}</span>:<span>SignUp</span>}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
