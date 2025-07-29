import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import StudentPayFee from "./StudentPayFee";

const StudentDues = () => {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDue, setSelectedDue] = useState(null);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchDues = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/student/unpaid-dues", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDues(res.data.unpaid_dues || []);
      } catch (err) {
        setDues([]);
        setError(
          err.response?.data?.message || "Failed to fetch unpaid dues."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDues();
  }, [token]);

  const handlePaySuccess = () => {
    setSelectedDue(null);
    // Refresh dues after payment
    setLoading(true);
    axios
      .get("/student/unpaid-dues", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDues(res.data.unpaid_dues || []))
      .catch(() => setDues([]))
      .finally(() => setLoading(false));
  };

  if (selectedDue) {
    return (
      <StudentPayFee
        due={selectedDue}
        onSuccess={handlePaySuccess}
        onCancel={() => setSelectedDue(null)}
      />
    );
  }

  return (
    <div>
      <h2>Unpaid Dues</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && dues.length === 0 && <p>No unpaid dues found.</p>}
      {!loading && dues.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Due Code</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Pay</th>
            </tr>
          </thead>
          <tbody>
            {dues.map((due) => (
              <tr key={due.due_code}>
                <td>{due.due_code}</td>
                <td>{due.fee_type}</td>
                <td>{due.amount}</td>
                <td>{new Date(due.due_date).toLocaleDateString()}</td>
                <td>{due.status}</td>
                <td>
                  <button onClick={() => setSelectedDue(due)}>Pay Fee</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentDues;