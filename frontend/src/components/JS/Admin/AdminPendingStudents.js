import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../css/Pending.module.css"; // Create this CSS file as per your design

const AdminPendingStudents = () => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState('');
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
      const token = sessionStorage.getItem("token");
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
        // Remove the student from the list after approval
        setPendingStudents((prevPending) =>
          prevPending.filter(
            (student) => student.login_id !== selectedStudent.login_id
          )
        );
        setError("")
        setSuccess(response.data.message);
        // Optionally, you can close the modal here if necessary
        // setShowModal(false);
      }
    } catch (err) {
      console.error("Approval Error:", err);

      // If error response exists, show the specific error message
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Shows the actual backend error message
      } else {
        setError("Error approving the student."); // Fallback error message
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
        <h2>Pending Students</h2>

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
            <h2 className={styles.modelh2}>Approve Student</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitApproval();
              }}>
              <label className={styles.modelh2}>Level Term ID:</label>
              <input
                type="text"
                value={levelTermId}
                onChange={(e) => setLevelTermId(e.target.value)}
                required
              />
              <label className={styles.modelh2}>Department ID:</label>
              <input
                type="text"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
              />
              <label className={styles.modelh2}>Hall ID:</label>
              <input
                type="text"
                value={hallId}
                onChange={(e) => setHallId(e.target.value)}
                required
              />
              <label className={styles.modelh2}>Advisor ID:</label>
              <input
                type="text"
                value={advisorId}
                onChange={(e) => setAdvisorId(e.target.value)}
                required
              />
              <div>{error && <p className={styles.error}>{error}</p>}</div>
              {success && <p className={styles.success}>{success}</p>}
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
