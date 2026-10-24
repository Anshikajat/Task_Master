import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

import { io } from "socket.io-client";

const Notecontext = createContext();

export const NoteProvider = ({ children }) => {
    const [searchingitem, setSearchingitem] = useState(null);
    const [textdata, setTextdata] = useState([]);
    const [files, setFiles] = useState([]);
    const [LoggedIn, setLoggedIn] = useState(false);
    const [isSignIn, setIsSignIn] = useState(true);
    const [LogedIn, setLogedIn] = useState(false);
    const [LogedInUser, setLogedInUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    
    const id = LogedInUser?.id;
    
    const role = LogedInUser?.role;
    const id2 = LogedInUser?.username;

    useEffect(() => {
        if (LogedInUser) {
            const newSocket = io("http://localhost:5500");
            setSocket(newSocket);

            
            newSocket.on("receive_message", (data) => {
                setMessages((prev) => [...prev, data]);
            });

            return () => newSocket.disconnect();
        }
    }, [LogedInUser]);

    
    const sendMessage = (text) => {
        if (socket && text.trim() !== "") {
            const messageData = {
                sender: LogedInUser?.username || "Unknown",
                role: LogedInUser?.role || "teammate",
                text,
                time: new Date().toLocaleTimeString()
            };
            socket.emit("send_message", messageData);
            setMessages((prev) => [...prev, messageData]); // instant update
        }
    };

useEffect(() => {
    const loadFiles = async () => {
        if (!LogedInUser?.id) return;

        try {
            const data = await fetchDataaa(LogedInUser.id);
            console.log("FILES FROM BACKEND:", data);
            setFiles(data || []);
        } catch (err) {
            console.error("Error loading files:", err);
            setFiles([]);
        }
    };

    loadFiles();
}, [LogedInUser?.id]);
    const fetchDataaa = async () => {
        console.log("LogedInUser",LogedInUser)
        console.log(LogedInUser.id)
    if (!LogedInUser || !LogedInUser.id) {
    
        return [];
    }
    try {
        
        const response = await axios.get(`http://localhost:5500/projectupload/${LogedInUser.id}`);
        console.log("fffffffffffff",response.data);
        return response.data;
        
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

    const fetchTasks = async () => {
        if (!id) {
            console.log("No user ID available for fetchTasks");
            return;
        }
        
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get(`http://localhost:5500/textscontent/${id}`);
            
            
            
            if (response.data && Array.isArray(response.data)) {
                setTextdata(response.data);
                // Store in localStorage after setting state
                localStorage.setItem("textdata", JSON.stringify(response.data));
            } else if (response.data && Array.isArray(response.data.texts)) {
                setTextdata(response.data.texts);
                localStorage.setItem("textdata", JSON.stringify(response.data.texts));
            } else {
                setTextdata([]);
                localStorage.removeItem("textdata");
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setError("Failed to fetch tasks. Please try again later.");
            setTextdata([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTasks2 = async () => {
        if (!id2) {
            console.log("No username available for fetchTasks2");
            return;
        }
        
        try {
            setIsLoading(true);
            setError(null);
            const name = id2.split(" ");
            const firstName = name[0].toLowerCase();

            console.log("Fetching tasks for:", firstName);
            const response = await axios.get(`http://localhost:5500/textscontent/assigned/${firstName}`);
            
            

            if (response.data && Array.isArray(response.data)) {
                setTextdata(response.data);
                localStorage.setItem("textdata", JSON.stringify(response.data));
            } else if (response.data && Array.isArray(response.data.texts)) {
                setTextdata(response.data.texts);
                localStorage.setItem("textdata", JSON.stringify(response.data.texts));
            } else {
                setTextdata([]);
                localStorage.removeItem("textdata");
            }
        } catch (error) {
            console.error("Error fetching tasks2:", error);
            setError("Failed to fetch assigned tasks. Please try again later.");
            setTextdata([]);
        } finally {
            setIsLoading(false);
        }
    };

    
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("User");
            if (storedUser) {
                const User = JSON.parse(storedUser);
                setLogedIn(true);
                setLogedInUser(User);
                
                
            } else {
                setLogedIn(false);
                setLogedInUser(null);
            }
        } catch (error) {
            console.error("Error loading user from localStorage:", error);
            setLogedIn(false);
            setLogedInUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    
    useEffect(() => {
        if (LogedInUser) {
            try {
                const storedTextdata = localStorage.getItem("textdata");
                if (storedTextdata) {
                    const parsedTextdata = JSON.parse(storedTextdata);
                    if (Array.isArray(parsedTextdata)) {
                        setTextdata(parsedTextdata);
                        
                    }
                }
            } catch (error) {
                console.error("Error loading textdata from localStorage:", error);
            }
        }
    }, [LogedInUser]);

    const uploadProjectFile = async (projectFileData) => {
        console.log("User:", LogedInUser)
    if (!LogedInUser || !LogedInUser.id) {
    throw new Error("User ID not available");
}
    
    try {
        console.log("User:", LogedInUser)
        console.log("Uploader ID:", LogedInUser?.id);
        const formData = new FormData();
        formData.append("file", projectFileData.file);
        formData.append("uploader", LogedInUser.id);
        
        if (projectFileData.projectId) {
            formData.append("projectId", projectFileData.projectId);
        }
        if (projectFileData.taskId) {
            formData.append("taskId", projectFileData.taskId);
        }

        const response = await axios.post(
            "http://localhost:5500/projectfile/upload",
            formData
        );

        return response.data;

    } catch (error) {
        console.error("Error uploading project file:", error);
        setError("Failed to upload project file");
        throw error;
    }
};
    
    const refreshData = async () => {
        if (!LogedInUser) return;
        
        try {
            if (role === 'admin' || role === 'manager') {
                if (id) {
                    await fetchTasks();
                }
            } else {
                await fetchTasks2();
            }
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    };

    
    const clearData = () => {
        setTextdata([]);
        setFiles([]);
        setLogedInUser(null);
        setLogedIn(false);
        setError(null);
        localStorage.removeItem("User");
        localStorage.removeItem("textdata");
        console.log("Data cleared");
    };

    const contextValue = {
        searchingitem, 
        setSearchingitem,
        fetchTasks,
        fetchTasks2,
        textdata, 
        setTextdata,
        LoggedIn, 
        setLoggedIn,
        LogedInUser, 
        setLogedInUser,
        LogedIn, 
        setLogedIn,
        isSignIn, 
        setIsSignIn,
        id,
        role,
        files, 
        setFiles, 
        uploadProjectFile,
        isLoading,
        error,
        setError,
        refreshData,
        clearData,
        fetchDataaa,messages, sendMessage
    };

    return (
        <Notecontext.Provider value={contextValue}>
            {children}
        </Notecontext.Provider>
    );
};

export default Notecontext;