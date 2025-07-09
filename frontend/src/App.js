import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import TeacherPage from "./components/TeacherPage";
import StudentPage from "./components/StudentPage";
import AdminPage from "./components/AdminPage";
import AdminDashboard from './components/AdminDashboard';
import A from './components/A';
import StudentSignup from "./components/StudentSignup";
import TeacherSignup from "./components/TeacherSignup";
import Student from "./components/Student";
import MyProfile from './components/MyProfile';
import "./index.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/teacher/signin" element={<TeacherPage />} />
          <Route path="/student/signin" element={<StudentPage />} />
          <Route path="/student" element={<Student />} />
          <Route path="/student/myprofile" element={<MyProfile />} />
          <Route path="/admin/signin" element={<AdminPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/a" element={<A />} />
          <Route path="/student/signup" element={<StudentSignup />} />
          <Route path="/teacher/signup" element={<TeacherSignup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
