import { useNavigate } from "react-router-dom";
import styles from "./css/AccessCard.module.css"; // Import the module CSS

const AccessCard = ({ role, onClick }) => {
  let w;
  const navigate = useNavigate();
  if (role === "Teacher Portal") {
    w = "Teacher";
  } else if (role === "Student Portal") {
    w = "Student";
  } else {
    w = "Admin";
  }
  const handleClick = () => {
    if (role === "Teacher Portal") {
      navigate("/teacher/signin"); // Navigate to /teacher for the teacher card
    } else if (role === "Student Portal") {
      navigate("/student/signin"); // Navigate to /student for the student card
    } else if (role === "Administrative Portal") {
      navigate("/admin/signin"); // Navigate to /admin for the admin card
    }
  };
  return (
    <div className={styles.card} onClick={handleClick}>
      {" "}
      {/* Use className from module */}
      <h2>{role}</h2>
      <p>Click here to access as a {w}.</p>
    </div>
  );
};

export default AccessCard;
