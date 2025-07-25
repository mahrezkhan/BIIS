import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import styles from "../../css/EnrollmentRequests.module.css"; // CSS file for styling

const EnrollmentRequests = () => {
  const [requests, setRequests] = useState([]); // All enrollment requests
  const [error, setError] = useState(""); // Error message state
  const [success, setsuccess] = useState(""); // Error message state

  const location = useLocation();

  // Fetch enrollment requests on component mount
  useEffect(() => {
    const fetchEnrollmentRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5050/api/teacher/view-enrollment-requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequests(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err.data);
      }
    };

    fetchEnrollmentRequests();
  }, []);

  // Handle approve or reject
  const handleApprove = async (requestId, studentId) => {
    try {
      const token = localStorage.getItem("token");

      // Send approve request to the backend
      const response = await axios.post(
        "http://localhost:5050/api/teacher/approve-enrollment",
        {
          student_id: studentId,
          action: "approve",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        try {
          const token = localStorage.getItem("token");
          const response1 = await axios.get(
            "http://localhost:5050/api/teacher/view-enrollment-requests",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setRequests(response1.data);
          console.log(response1.data);
        } catch (err) {
          setError(err.data);
          
        }
        setsuccess("approved");
        //alert("Enrollment request approved.");
      }
    } catch (err) {
      console.error(err);
      setError("Error approving the request.");
    }
  };

  const handleReject= async (requestId, studentId) => {
    setsuccess("");
    console.log("Reject request with ID:", requestId);
    try {
      const token = localStorage.getItem("token");

      // Send approve request to the backend
      const response = await axios.post(
        "http://localhost:5050/api/teacher/approve-enrollment",
        {
          student_id: studentId,
          action: "reject",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        try {
          const token = localStorage.getItem("token");
          const response1 = await axios.get(
            "http://localhost:5050/api/teacher/view-enrollment-requests",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setRequests(response1.data);
          console.log(response1.data);
        } catch (err) {
          setError(err.data);
          
        }
        setsuccess("rejected");
        //alert("Enrollment request approved.");
      }
    } catch (err) {
      console.error(err);
      setError("Error approving the request.");
    }
    // Logic for rejecting the request
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebartitle}>Teacher Portal</h2>
        <nav>
          <a
            href="/teacher/myprofile/personalinformation"
            className={
              location.pathname === "/teacher/myprofile/personalinformation"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            My Profile
          </a>
          <a
            href="/teacher/enrollmentrequest"
            className={
              location.pathname === "/teacher/enrollmentrequest"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Enrollment Request
          </a>
          <a
            href="/student/dashboard"
            className={
              location.pathname === "/student/dashboard"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Users
          </a>
          <a
            href="/student/settings"
            className={
              location.pathname === "/student/settings"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Settings
          </a>
        </nav>
      </aside>

      <div className={styles.dashboard1}>
        <h2>Enrollment Requests</h2>
        <table className={styles.requestTable}>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Student ID</th>
              <th>Student Email</th>
              <th>Courses</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="3">No pending students found.</td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.request_id}>
                  <td>{request.enrollment_request_id}</td>
                  <td>{request.login_id}</td>
                  <td>
                    {new Date(request.request_date).toLocaleDateString("en-GB")}
                  </td>
                  <td>
                    <ul>
                      {request.selected_courses.map((course, index) => (
                        <li key={index}>{course}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{request.status}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleApprove(request.request_id, request.login_id)
                      }>
                      Approve
                    </button>
                    <button onClick={() => handleReject(request.request_id)}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div>{error && <p className={styles.error}>{error}</p>}</div>
        {success && <p className={styles.success}>{success}</p>}
      </div>
    </div>
  );
};

export default EnrollmentRequests;
