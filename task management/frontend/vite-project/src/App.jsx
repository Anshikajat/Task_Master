import "./App.css";
import Navbar from "./Navbar.jsx";
import { Route, Routes, Navigate } from "react-router-dom";
import { useContext, Suspense, lazy } from "react";
import Notecontext from "./Notecontext.jsx";

// Lazy load heavy components
const Homepage = lazy(() => import("./Homepage.jsx"));
const Createtask = lazy(() => import("./Createtask.jsx"));
const Task = lazy(() => import("./Task.jsx"));
const Searched = lazy(() => import("./searched.jsx"));
const Calendar = lazy(() => import("./Calendar.jsx"));
const SignUp = lazy(() => import("./SignUp.jsx"));
const LandingPage = lazy(() => import("./LandingPage.jsx"));
const SmartTrackingSystem = lazy(() => import("./Trackingtask.jsx"));
const Homelageteammate = lazy(() => import("./Homelageteammate.jsx"));
const Project = lazy(() => import("./Project.jsx"));
const Teamchat = lazy(() => import("./Teamchat.jsx"));
const Submituserproject = lazy(() => import("./Submituserproject.jsx"));

function App() {
  const {
    LogedInUser,
  } = useContext(Notecontext);

  return (
    <div>
      <Navbar />
      
      <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              LogedInUser ? (
                LogedInUser.role === "admin" ? (
                  <Homepage />
                ) : (
                  <Homelageteammate />
                )
              ) : (
                <LandingPage />
              )
            }
          />

          <Route
            path="/Createtask"
            element={LogedInUser ? <Createtask /> : <Navigate to="/SignUp" />}
          />

          <Route
            path="/Task"
            element={LogedInUser ? <Task /> : <Navigate to="/SignUp" />}
          />

          <Route path="/Searched" element={<Searched />} />
          <Route path="/Teamchat" element={<Teamchat />} />
          <Route path="/Submituserproject" element={<Submituserproject />} />
          <Route path="/Calendar" element={<Calendar />} />
          <Route path="/Project" element={<Project />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SmartTrackingSystem" element={<SmartTrackingSystem />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
