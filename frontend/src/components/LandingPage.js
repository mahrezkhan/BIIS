import { useNavigate } from 'react-router-dom';
import Header from "./Header";
import AccessCard from "./AccessCard";
import './css/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleClick = (role) => {
    if (role === "Teacher") {
      navigate('/teacher'); 
    } else if (role === "Student") {
      navigate('/student');
    } else if (role === "Admin") {
      navigate('/admin');
    }
  };

  return (
    <div className="landing">
      <Header />
      <div className="card-container">
        <AccessCard role="Teacher Portal" onClick={() => handleClick("Teacher")} />
        <AccessCard role="Student Portal" onClick={() => handleClick("Student")} />
        <AccessCard role="Administrative Portal" onClick={() => handleClick("Admin")} />
      </div>
    </div>
  );
};

export default LandingPage;
