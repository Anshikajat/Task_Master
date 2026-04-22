import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

import Notecontext from "./Notecontext.jsx";

export default function SignUp() {
  const {
    isSignIn,
    setIsSignIn,
    LogedIn,
    setLogedIn,
    LogedInUser,
    setLogedInUser
  } = useContext(Notecontext);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "teammate",
  });

  

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    fullName: "",
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    role: "", 
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  
  useEffect(() => {
    if (LogedInUser) {
      setEditData({
        ...editData,
        fullName: LogedInUser.fullName,
        username: LogedInUser.username,
        role: LogedInUser.role || "teammate", 
      });
    }
  }, [LogedInUser]);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    
    
    if (formData.role === "teammate" && !formData.password.startsWith("T@mytask")) {
      newErrors.password = "Teammate password must start with 'T@mytask'";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const validateEdit = () => {
    const newErrors = {};
    if (!editData.fullName) newErrors.editFullName = "Full name is required";
    if (!editData.username) newErrors.editUsername = "Username is required";
    
    if (editData.newPassword) {
      if (editData.newPassword.length < 8) {
        newErrors.editNewPassword = "New password must be at least 8 characters";
      }
      
      
      if (editData.role === "teammate" && !editData.newPassword.startsWith("T@mytask")) {
        newErrors.editNewPassword = "Teammate password must start with 'T@mytask'";
      }
      
      if (editData.newPassword !== editData.confirmNewPassword) {
        newErrors.editConfirmPassword = "New passwords do not match";
      }
    }
    
    if (!editData.currentPassword) newErrors.editCurrentPassword = "Current password is required";
    return newErrors;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateEdit();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
     
      const updateData = {
        fullName: editData.fullName,
        username: editData.username,
        currentPassword: editData.currentPassword,
        newPassword: editData.newPassword || undefined,
        role: editData.role, 
      };
      
      console.log("Sending update data:", updateData); 
      
      const response = await axios.put(`http://localhost:5500/updateUser/${LogedInUser._id}`, updateData);

      setMessage("Profile updated successfully!");
      setLogedInUser(response.data.user);
      localStorage.setItem("User", JSON.stringify(response.data.user));
      setEditMode(false);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response && error.response.data) {
        console.error("Server error details:", error.response.data);
        setMessage(error.response.data.message || "Error updating profile. Please try again.");
      } else {
        setMessage("Error updating profile. Please try again.");
      }
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const dataToSend = {
        fullName: formData.fullName,
        username: formData.username,
        password: formData.password,
        role: formData.role, 
      };
      
      console.log("Sending signup data:", dataToSend); 
      
      const Res = await axios.post("http://localhost:5500/SignUp", dataToSend);
      setMessage("SignUp successfully!");
      setLogedIn(true);
      const User = Res.data;
      setLogedInUser(User);
      localStorage.setItem("User", JSON.stringify(User));

      setTimeout(() => {
        setMessage("");
      }, 3000);
      
      setFormData({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "teammate",
      });
    } catch (error) {
      console.error("Error submitting Information:", error);
      if (error.response && error.response.data) {
        console.error("Server error details:", error.response.data);
        setMessage(error.response.data.message || "Error creating Account. Please try again.");
      } else {
        setMessage("Error creating Account. Please try again.");
      }
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5500/signin", loginData,{withCredentials: true});
      setMessage("Logged in successfully!");
      setLogedIn(true);
      const User = response.data.user;
      setLogedInUser(User);
      localStorage.setItem("User", JSON.stringify(User));
      
      setLoginData({
        username: "",
        password: "",
      });
      
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("Error logging in. Please try again.");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
    if (errors[`edit${e.target.name}`]) {
      setErrors({
        ...errors,
        [`edit${e.target.name}`]: "",
      });
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("User");
    setLogedIn(false);
    setLogedInUser(null);
    setMessage("You have successfully logged out.");
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  if (LogedIn && LogedInUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            {!editMode ? (
              <>
                <div className="text-center mb-6">
                  <div className="h-24 w-24 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl text-blue-600">{LogedInUser.fullName[0]}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Welcome, {LogedInUser.fullName}!</h2>
                  <p className="text-gray-600 mt-1">@{LogedInUser.username}</p>
                  <p className="text-gray-600 mt-1">Role: {LogedInUser.role || "teammate"}</p>
                </div>
                <div className="space-y-6">
                  <button
                    onClick={() => setEditMode(true)}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <h3 className="text-xl font-bold text-center mb-6">Edit Profile</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={editData.fullName}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.editFullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.editFullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={editData.username}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.editUsername && (
                    <p className="mt-1 text-sm text-red-600">{errors.editUsername}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    name="role"
                    value={editData.role}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="teammate">Teammate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={editData.currentPassword}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.editCurrentPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.editCurrentPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password (Optional)</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={editData.newPassword}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.editNewPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.editNewPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={editData.confirmNewPassword}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.editConfirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.editConfirmPassword}</p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
          {message && (
            <p className="text-center text-sm text-green-600 mt-4">{message}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Welcome</h1>
          <p className="text-gray-600">Join our community today</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setIsSignIn(false)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                !isSignIn
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setIsSignIn(true)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                isSignIn
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Login
            </button>
          </div>

          {isSignIn ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="teammate">Teammate</option>
                </select>
                {formData.role === "teammate" && (
                  <p className="mt-1 text-xs text-blue-600">Note: Teammate passwords must start with "T@mytask"</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Create Account
              </button>
            </form>
          )}
        </div>

        {message && (
          <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="text-center text-sm text-green-600">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}