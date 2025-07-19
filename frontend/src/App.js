// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/FrontPage/LandingPage";
import TeacherSignin from "./components/JS/Teacher/TeacherSignin";
import TeacherSignup from "./components/JS/Teacher/TeacherSignup";


import StudentSignin from "./components/JS/Student/StudentSignin";
import StudentSignup from "./components/JS/Student/StudentSignup";
import StudentHome from "./components/JS/Student/StudentHome";
import StudentMyProfilepersonalinformation from './components/JS/Student/StudentMyProfilepersonalinformation';
import StudentMyProfilehall from './components/JS/Student/StudentMyProfilehall';
import StudentMyProfileaddress from './components/JS/Student/StudentMyProfileaddress';
import StudentMyProfilebankaccountinformation from './components/JS/Student/StudentMyProfilebankaccountinformation';
import StudentMyProfileemergencycontactperson from './components/JS/Student/StudentMyProfileemergencycontactperson';


import AdminSignin from "./components/JS/Admin/AdminSignin";
import AdminHome from './components/JS/Admin/AdminHome';


//import A from './components/JS/Admin/A';
import "./index.css";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/teacher/signin" element={<TeacherSignin />} />
          <Route path="/teacher/signup" element={<TeacherSignup />} />
          <Route path="/student/signin" element={<StudentSignin />} />
          <Route path="/student/signup" element={<StudentSignup />} />
          <Route path="/admin/signin" element={<AdminSignin />} />

          {/* Private Routes for Students */}
          <Route 
            path="/student" 
            element={
              <PrivateRoute roleRequired="student">
                <StudentHome />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/student/myprofile/personalinformation" 
            element={
              <PrivateRoute roleRequired="student">
                <StudentMyProfilepersonalinformation />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/student/myprofile/hall" 
            element={
              <PrivateRoute roleRequired="student">
                <StudentMyProfilehall />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/student/myprofile/address" 
            element={
              <PrivateRoute roleRequired="student">
                <StudentMyProfileaddress />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/student/myprofile/bankaccountinformation" 
            element={
              <PrivateRoute roleRequired="student">
                <StudentMyProfilebankaccountinformation />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/student/myprofile/emergencycontactperson" 
            element={
              <PrivateRoute roleRequired="student">
                <StudentMyProfileemergencycontactperson />
              </PrivateRoute>
            } 
          />

          {/* Private Routes for Admin */}
          <Route 
            path="/admin/dashboard" 
            element={
              <PrivateRoute roleRequired="admin">
                <AdminHome />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;