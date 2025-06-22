// src/components/AccessCard.js
import './css/AccessCard.css';

const AccessCard = ({ role, onClick }) => {
    let w;
    if(role==="Teacher Portal")
    {
        w="Teacher";
    }
    else if(role==="Student Portal")
    {
        w="Student";
    }
    else
    {
        w="Admin";
    }
  return (
    <div className="card" onClick={onClick}>
      <h2>{role}</h2>
      <p>Click here to access as a {w}.</p>
    </div>
  );
};

export default AccessCard;
