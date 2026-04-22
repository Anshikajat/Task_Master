import mongoose from "mongoose";

let projectFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: "Signupdata", required: true },
  projectId: { type: String },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Taskcontent" },
  verification: { type: String, default: "pending" },
});

export default mongoose.model("projectupload", projectFileSchema);