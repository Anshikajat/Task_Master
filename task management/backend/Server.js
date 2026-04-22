import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import http from "http"; 
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import multer from "multer";
import Taskcontent from "./Module/Taskcontent.js";
import Signupdata from "./Module/Signupdata.js";
import projectupload from "./Module/projectupload.js";

const app = express();
app.use(bodyParser.json());
// app.use(cors());
app.use(cors({
  origin: "http://localhost:5173",  // frontend origin
  credentials: true                 // allow cookies/sessions
}));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"]
  }
});


io.on("connection", (socket) => {
  console.log("🔗 A user connected:", socket.id);

  
  socket.on("send_message", (data) => {
    console.log("💬 New Message:", data);
    
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});


mongoose.connect("mongodb://localhost:27017/textocontent").then(() => {
    console.log("connected");
});

app.get("/", (req, res) => {
    res.send("Hi");
});

app.get("/projectupload/:leaderId", async (req, res) => {
  try {
    const teamLeaderId = req.params.leaderId;

    
    const leaderTasks = await Taskcontent.find({ referralId: teamLeaderId });
    const leaderTaskIds = leaderTasks.map(t => t._id);

    
    const files = await projectupload.find({ taskId: { $in: leaderTaskIds } })
      .populate({
        path: 'uploader',       
        select: 'fullName username'  
      })
      .populate({
        path: 'taskId',         
        select: 'title'         
      });

    res.json(files);
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ error: "Error fetching project uploads: " + error.message });
  }
});

app.get("/text2", async (req, res) => {
    try {
        
        const textss = await Taskcontent.find({});
        res.json(textss);
    } catch (error) {
        console.error("Backend error:", error);
        res.status(500).json({ error: "Error fetching tasks: " + error.message });
    }
});

// Get tasks by referralId
app.get("/textscontent/:id", async (req, res) => {
    try {
        const referralId = req.params.id;
        const texts = await Taskcontent.find({ referralId });
        res.json(texts);
    } catch (error) {
        console.error("Backend error:", error);
        res.status(500).json({ error: "Error fetching tasks: " + error.message });
    }
});

app.get("/textscontent/assigned/:name", async (req, res) => {
  try {
    const assignedName = req.params.name;
    const texts2 = await Taskcontent.find({ assignedTo: assignedName });
    res.json(texts2);
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ error: "Error fetching tasks by assigned name: " + error.message });
  }
});


const upload = multer({ dest: "uploads/" }); 
app.post("/projectfile/upload", upload.single("file"), async (req, res) => {
  try {
    const { uploader, projectId, taskId } = req.body; 
    const file = req.file;
    
    if (!file || !uploader) {
      return res.status(400).json({ message: "File and uploader are required" });
    }
    
    const projectFile = new projectupload({
      filename: file.originalname,
      filePath: file.path,
      mimeType: file.mimetype,
      size: file.size,
      uploader,
      projectId,
      taskId, // Store the related task ID
    });
    
    await projectFile.save();
    
    // If taskId is provided, update the task status to completed
    if (taskId) {
      try {
        const updatedTask = await Taskcontent.findByIdAndUpdate(
          taskId,
          { status: "Completed" },
          { new: true }
        );
        
        console.log(`Task ${taskId} status updated to completed`);
        
        res.status(201).json({ 
          message: "File uploaded and task completed", 
          file: projectFile,
          task: updatedTask
        });
      } catch (taskError) {
        console.error("Error updating task status:", taskError);
        // Still return success for file upload even if task update fails
        res.status(201).json({ 
          message: "File uploaded but failed to update task status", 
          file: projectFile,
          error: "Task status update failed"
        });
      }
    } else {
      res.status(201).json({ 
        message: "File uploaded", 
        file: projectFile 
      });
    }
    
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Alternative endpoint: Update task status when project is submitted
app.post("/project/submit", async (req, res) => {
  try {
    const { taskId, uploader } = req.body;
    
    if (!taskId || !uploader) {
      return res.status(400).json({ message: "Task ID and uploader are required" });
    }
    
    // Check if there are any project files uploaded for this task
    const projectFiles = await projectupload.find({ 
      taskId: taskId, 
      uploader: uploader 
    });
    
    if (projectFiles.length > 0) {
      // Update task status to completed
      const updatedTask = await Taskcontent.findByIdAndUpdate(
        taskId,
        { status: "completed" },
        { new: true }
      );
      
      res.json({
        message: "Project submitted and task marked as completed",
        task: updatedTask,
        filesCount: projectFiles.length
      });
    } else {
      res.status(400).json({ 
        message: "No project files found for this task" 
      });
    }
    
  } catch (error) {
    console.error("Project submission error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get completed tasks for a user
app.get("/tasks/completed/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const completedTasks = await Taskcontent.find({ 
      referralId: userId, 
      status: "completed" 
    });
    res.json(completedTasks);
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
    res.status(500).json({ error: error.message });
  }
});

// Check if task has uploaded files
app.get("/task/:taskId/files", async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const files = await projectupload.find({ taskId: taskId });
    
    res.json({
      taskId: taskId,
      hasFiles: files.length > 0,
      filesCount: files.length,
      files: files
    });
  } catch (error) {
    console.error("Error checking task files:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/projectfile/uploader/:id", async (req, res) => {
  try {
    const uploaderId = req.params.id;
    const files = await projectupload.find({ uploader: uploaderId });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/verificationprocess/:id", async (req, res) => {
  try {
    console.log('Received verification update request:');
    console.log('ID:', req.params.id);
    console.log('Body:', req.body);
    
    const { verificationStatus } = req.body;
    const ID = req.params.id;

    if (!verificationStatus) {
      return res.status(400).json({ error: "verificationAction is required" });
    }

    let updateFields = {};
    
    switch (verificationStatus) {
      case "approved":
        updateFields.verification = "approved";
        break;
      case "rejected":
        updateFields.verification = "rejected";
        break;
      case "in_review":
        updateFields.verification = "in_review";
        break;
      case "Pending":
        updateFields.verification = "pending"; // matches schema default
        break;
      default:
        return res.status(400).json({ error: `Invalid verification action: ${verificationStatus}` });
    }

    const file = await projectupload.findByIdAndUpdate(
      ID,
      { $set: updateFields },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (verificationStatus === "rejected" && file.taskId) {
      try {
        const updatedTask = await Taskcontent.findByIdAndUpdate(
          file.taskId,
          { $set: { status: "Pending" } },
          { new: true }
        );
        
        console.log('Task status updated to Pending due to file rejection:', updatedTask);
        
        res.json({
          message: "File verification updated and task status reset to Pending",
          file: file,
          task: updatedTask
        });
      } catch (taskError) {
        console.error("Error updating task status:", taskError);
        // Still return success for file update even if task update fails
        res.json({
          message: "File verification updated but failed to update task status",
          file: file,
          error: "Task status update failed"
        });
      }
    } else {
      res.json({
        message: "File verification updated successfully",
        file: file
      });
    }
      
  } catch (error) {
    console.error("Error updating verification:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});
// Create a task
app.post("/textscontent", async (req, res) => {
    const { title, description, priority, dueDate, assignedTo, tags, referralId } = req.body;
    const task = new Taskcontent({ title, description, priority, dueDate, assignedTo, tags, referralId });
    await task.save();
    res.json(task);
});


// Sign up user with bcrypt
app.post("/SignUp", async (req, res) => {
    const { fullName, username, password,role } = req.body;

    // Check if the username already exists
    const existingUser = await Signupdata.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const signup = new Signupdata({ fullName, username, password: hashedPassword,role });
    await signup.save();
    res.json(signup);
});

// Fetch all signups
app.get("/SignUp", async (req, res) => {
    res.json({
        texts: await Signupdata.find()
    });
});



app.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Signupdata.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "yourSecretKey",   // keep secret in .env
      { expiresIn: "1h" }
    );

    // ✅ Send cookie
    res.cookie("authToken", token, {
      httpOnly: false,     // protects against XSS
      secure: false,      // set true in production (HTTPS)
      sameSite: "lax"  // prevents CSRF
    });

    res.json({
      message: "Logged in successfully",
      user: { id: user._id, fullName: user.fullName, username: user.username,role: user.role }
    });

  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});


// Update user profile with bcrypt
app.put("/updateUser/:id", async (req, res) => {
    try {
        const { fullName, username, currentPassword, newPassword } = req.body;
        const userId = req.params.id;

        // Find the user
        const user = await Signupdata.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Check if new username already exists
        if (username !== user.username) {
            const existingUser = await Signupdata.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: "Username already exists" });
            }
        }

        // Update user data
        user.fullName = fullName || user.fullName;
        user.username = username || user.username;
        if (newPassword) {
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username
            }
        });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Error updating profile: " + error.message });
    }
});

// Update a task
app.put("/textscontent/:id", async (req, res) => {
    const { title, description, priority, dueDate, assignedTo, tags, status, referralId } = req.body;
    const ID = req.params.id;
    const task = await Taskcontent.findByIdAndUpdate(
        ID,
        { title, description, priority, dueDate, assignedTo, tags, status, referralId },
        { new: true }
    );
    res.json(task);
});

// Delete a task
app.delete("/textscontent/:id", async (req, res) => {
    const ID = req.params.id;
    await Taskcontent.findByIdAndDelete(ID);
    res.send("Task deleted successfully");
});

// Start the server
app.listen(5500, () => {
    console.log("Server running on port 5500");
});