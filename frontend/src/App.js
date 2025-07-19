import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/FrontPage/LandingPage";
import TeacherSignin from "./components/Teacher/TeacherSignin";
import StudentSignin from "./components/Student/StudentSignin";
import AdminSignin from "./components/Admin/AdminSignin";
import AdminDashboard from './components/Admin/AdminDashboard';
import A from './components/Admin/A';
import StudentSignup from "./components/Student/StudentSignup";
import TeacherSignup from "./components/Teacher/TeacherSignup";
import StudentHome from "./components/Student/StudentHome";
import StudentMyProfilepersonalinformation from './components/Student/StudentMyProfilepersonalinformation';
import StudentMyProfileaddress from './components/Student/StudentMyProfileaddress';
import StudentMyProfilebankaccountinformation from './components/Student/StudentMyProfilebankaccountinformation';
import StudentMyProfilehall from './components/Student/StudentMyProfilehall';
import StudentMyProfileemergencycontactperson from './components/Student/StudentMyProfileemergencycontactperson';
import "./index.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/teacher/signin" element={<TeacherSignin />} />
          <Route path="/student/signin" element={<StudentSignin />} />
          <Route path="/student" element={<StudentHome />} />
          <Route path="/student/myprofile/personalinformation" element={<StudentMyProfilepersonalinformation />} />
          <Route path="/student/myprofile/address" element={<StudentMyProfileaddress />} />
          <Route path="/student/myprofile/hall" element={<StudentMyProfilehall />} />
          <Route path="/student/myprofile/emergencycontactperson" element={<StudentMyProfileemergencycontactperson />} />
          <Route path="/student/myprofile/bankaccountinformation" element={<StudentMyProfilebankaccountinformation />} />
          <Route path="/admin/signin" element={<AdminSignin />} />
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
