import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import TeacherPage from "./components/TeacherPage";
import StudentPage from "./components/StudentPage";
import AdminPage from "./components/AdminPage";
import StudentSignup from "./components/StudentSignup";
import TeacherSignup from "./components/TeacherSignup";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/student/signup" element={<StudentSignup />} />
          <Route path="/teacher/signup" element={<TeacherSignup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
