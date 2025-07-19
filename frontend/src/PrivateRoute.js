// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  console.log(role);
  console.log(token);
  if (!token) {
    if (roleRequired === 'student') {
      return <Navigate to="/student/signin" replace />;
    } else if (roleRequired === 'teacher') {
      return <Navigate to="/teacher/signin" replace />;
    } else if (roleRequired === 'admin') {
      return <Navigate to="/admin/signin" replace />;
    }
  }

//   if (role !== roleRequired) {
//     return <Navigate to="/" replace />;
//   }

  return children;
};

export default PrivateRoute;