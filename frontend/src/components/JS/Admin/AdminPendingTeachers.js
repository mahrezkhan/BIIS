import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../css/Pending.module.css"; // Create this CSS file as per your design

const AdminPendingTeachers = () => {
  const [pendingTeachers, setpendingTeachers] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // Show/Hide approval modal
  const [selectedTeacher, setSelectedStudent] = useState(null); // Store selected student for approval
  const [departmentId, setDepartmentId] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
const token = sessionStorage.getItem("token");
  useEffect(() => {
    const fetchpendingTeachers = async () => {
      try {
        
        const response = await axios.get(
          "http://localhost:5050/api/admin/pending-teachers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setpendingTeachers(response.data);
      } catch (err) {
        console.error(err);
        setError("Error fetching pending teacehrs.");
      }
    };

    fetchpendingTeachers();
  }, []);

  // Handle approve action
  const handleApprove = (teacher) => {
    setSelectedStudent(teacher); // Set the selected student for approval
    setShowModal(true); // Show the modal for additional information
  };

  const handleReject = async (login_id) => {
    try {
      await axios.put(
        `http://localhost:5050/api/admin/reject-teacher/${login_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Remove the student from the list after rejection
      setpendingTeachers(
        pendingTeachers.filter((teacher) => teacher.login_id !== login_id)
      );
    } catch (err) {
      console.error(err);
      setError("Error rejecting the teacher.");
    }
  };

  const submitApproval = async () => {
    try {

      // Prepare the data for submission
      const approvalData = {
        login_id: selectedTeacher.login_id,
        department_id: departmentId, // Assuming departmentId is set from the form/input
      };

      console.log("Sending Approval Data:", approvalData);

      // Send the data to the backend to add student info
      const response = await axios.post(
        "http://localhost:5050/api/admin/add-teacher",
        approvalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Remove the student from the list after approval
        setpendingTeachers((prevPending) =>
          prevPending.filter(
            (teacher) => teacher.login_id !== selectedTeacher.login_id
          )
        );

        setError(response.data.message);
        // Optionally, you can close the modal here if necessary
        // setShowModal(false);
      }
    } catch (err) {
      console.error("Approval Error:", err);

      // If error response exists, show the specific error message
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Shows the actual backend error message
      } else {
        setError("Error approving the teacher."); // Fallback error message
      }
    }
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebartitle}>Admin Portal</h2>
        <nav>
          <a
            href="/admin/pendingstudents"
            className={
              location.pathname === "/admin/pendingstudents"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Pending Students
          </a>
          <a
            href="/admin/pendingteachers"
            className={
              location.pathname === "/admin/pendingteachers"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Pending Teachers
          </a>
          <a
            href="/admin/addcourses"
            className={
              location.pathname === "/admin/addcourses"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Add Courses
          </a>
          <a
            href="/admin/assignteacher"
            className={
              location.pathname === "/admin/assignteacher"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Assign Teacher
          </a>
        </nav>
      </aside>

      <div className={styles.adminContainer}>
        <h2>Pending Teachers</h2>

        <table className={styles.pendingTable}>
          <thead>
            <tr>
              <th>Teacher ID</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingTeachers.length === 0 ? (
              <tr>
                <td colSpan="3">No pending teachers found.</td>
              </tr>
            ) : (
              pendingTeachers.map((teacher) => (
                <tr key={teacher.login_id}>
                  <td>{teacher.login_id}</td>
                  <td>{teacher.email}</td>
                  <td>
                    <button
                      onClick={() => handleApprove(teacher)}
                      className={styles.approveBtn}>
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(teacher.login_id)}
                      className={styles.rejectBtn}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for approval with additional fields */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Approve Teacher</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitApproval();
              }}>
              <label>Department ID:</label>
              <input
                type="text"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
              />

              <div>{error && <p className={styles.error}>{error}</p>}</div>
              <div className={styles.modalButtons}>
                <button type="submit">Approve</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPendingTeachers;
