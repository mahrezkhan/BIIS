// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/FrontPage/LandingPage";
import TeacherSignin from "./components/JS/Teacher/TeacherSignin";
import TeacherSignup from "./components/JS/Teacher/TeacherSignup";
import TeacherHome from "./components/JS/Teacher/TeacherHome";
import EnrollmentRequest from "./components/JS/Teacher/EnrollmentRequest";
import TeacherMyProfilepersonalinformation from './components/JS/Teacher/TeacherMyProfilepersonalinformation';


import StudentSignin from "./components/JS/Student/StudentSignin";
import StudentSignup from "./components/JS/Student/StudentSignup";
import StudentHome from "./components/JS/Student/StudentHome";
import StudentMyProfilepersonalinformation from './components/JS/Student/StudentMyProfilepersonalinformation';
import StudentMyProfilehall from './components/JS/Student/StudentMyProfilehall';
import StudentMyProfileaddress from './components/JS/Student/StudentMyProfileaddress';
import StudentMyProfilebankaccountinformation from './components/JS/Student/StudentMyProfilebankaccountinformation';
import StudentMyProfileemergencycontactperson from './components/JS/Student/StudentMyProfileemergencycontactperson';
import StudentEnrollCourses from './components/JS/Student/StudentEnrollCourses';
import StudentRequests from './components/JS/Student/StudentRequests';

import AdminSignin from "./components/JS/Admin/AdminSignin";
import AdminHome from './components/JS/Admin/AdminHome';
import AdminPendingStudents from './components/JS/Admin/AdminPendingStudents';
import AdminPendingTeachers from './components/JS/Admin/AdminPendingTeachers';
import AdminAddCourse from './components/JS/Admin/AdminAddCourse';
import AdminAssignTeacher from './components/JS/Admin/AdminAssignTeacher';
import AdminPendingRequest from './components/JS/Admin/AdminPendingRequest';
import AdminRespondedRequests from './components/JS/Admin/AdminRespondedRequests';



import A from './components/JS/Admin/A';
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
          <Route path="/admin/A" element={<A />} />

          {/* Private Routes for Teachers */}
           <Route 
            path="/teacher" 
            element={
              <PrivateRoute roleRequired="teacher">
                <TeacherHome />
              </PrivateRoute>
            } 
          />
           <Route 
            path="/teacher/myprofile/personalinformation" 
            element={
              <PrivateRoute roleRequired="teacher">
                <TeacherMyProfilepersonalinformation />
              </PrivateRoute>
            } 
          />
           <Route 
            path="/teacher/enrollmentrequest" 
            element={
              <PrivateRoute roleRequired="teacher">
                <EnrollmentRequest />
              </PrivateRoute>
            } 
          />


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


          <Route 
            path="/student/enroll" 
            element={
              <PrivateRoute roleRequired="student">
                <StudentEnrollCourses />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/student/requests" 
            element={
              <PrivateRoute roleRequired="student">
                <StudentRequests />
              </PrivateRoute>
            } 
          />

          {/* Private Routes for Admin */}
          <Route 
            path="/admin" 
            element={
              <PrivateRoute roleRequired="admin">
                <AdminHome />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/pendingstudents" 
            element={
              <PrivateRoute roleRequired="admin">
                <AdminPendingStudents />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/pendingteachers" 
            element={
              <PrivateRoute roleRequired="admin">
                <AdminPendingTeachers />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/addcourses" 
            element={
              <PrivateRoute roleRequired="admin">
                <AdminAddCourse />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/assignteacher" 
            element={
              <PrivateRoute roleRequired="admin">
                <AdminAssignTeacher />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/pendingrequests" 
            element={
              <PrivateRoute roleRequired="admin">
                <AdminPendingRequest />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/redpondedrequests" 
            element={
              <PrivateRoute roleRequired="admin">
                <AdminRespondedRequests />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;