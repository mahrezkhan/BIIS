import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../css/AdminPendingStudents.module.css"; // Create this CSS file as per your design

const AdminPendingStudents = () => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // Show/Hide approval modal
  const [selectedStudent, setSelectedStudent] = useState(null); // Store selected student for approval
  const [levelTermId, setLevelTermId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [hallId, setHallId] = useState("");
  const [advisorId, setAdvisorId] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5050/api/admin/pending-students",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPendingStudents(response.data);
      } catch (err) {
        console.error(err);
        setError("Error fetching pending students.");
      }
    };

    fetchPendingStudents();
  }, []);

  // Handle approve action
  const handleApprove = (student) => {
    setSelectedStudent(student); // Set the selected student for approval
    setShowModal(true); // Show the modal for additional information
  };

  const handleReject = async (login_id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5050/api/admin/reject-student/${login_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Remove the student from the list after rejection
      setPendingStudents(
        pendingStudents.filter((student) => student.login_id !== login_id)
      );
    } catch (err) {
      console.error(err);
      setError("Error rejecting the student.");
    }
  };

  const submitApproval = async () => {
    try {
      const token = localStorage.getItem("token");

      // Prepare the data for submission
      const approvalData = {
        login_id: selectedStudent.login_id,
        level_term_id: levelTermId, // Assuming levelTermId is set from the form/input
        department_id: departmentId, // Assuming departmentId is set from the form/input
        hall_id: hallId, // Assuming hallId is set from the form/input
        advisor_id: advisorId, // Assuming advisorId is set from the form/input
      };
      console.log("Sending Approval Data:", approvalData);
      // Send the data to the backend to add student info
      const response = await axios.post(
        "http://localhost:5050/api/admin/add-student",
        approvalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // If the student was successfully added, you can proceed with removing from the pending list
        setPendingStudents(
          pendingStudents.filter(
            (student) => student.login_id !== selectedStudent.login_id
          )
        );
        setShowModal(false); // Close the modal after the approval is successful
        alert("Student added successfully!");
      }
    } catch (err) {
      console.error("Approval Error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // shows the actual backend message
      } else {
        setError("Error approving the student.");
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

      <div className={styles.adminContainer}>
        <h2>Pending Students</h2>
        {error && <p className={styles.error}>{error}</p>}
        <table className={styles.pendingTable}>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingStudents.length === 0 ? (
              <tr>
                <td colSpan="3">No pending students found.</td>
              </tr>
            ) : (
              pendingStudents.map((student) => (
                <tr key={student.login_id}>
                  <td>{student.login_id}</td>
                  <td>{student.email}</td>
                  <td>
                    <button
                      onClick={() => handleApprove(student)}
                      className={styles.approveBtn}>
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(student.login_id)}
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
            <h2>Approve Student</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitApproval();
              }}>
              <label>Level Term ID:</label>
              <input
                type="text"
                value={levelTermId}
                onChange={(e) => setLevelTermId(e.target.value)}
                required
              />
              <label>Department ID:</label>
              <input
                type="text"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
              />
              <label>Hall ID:</label>
              <input
                type="text"
                value={hallId}
                onChange={(e) => setHallId(e.target.value)}
                required
              />
              <label>Advisor ID:</label>
              <input
                type="text"
                value={advisorId}
                onChange={(e) => setAdvisorId(e.target.value)}
                required
              />
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

export default AdminPendingStudents;
