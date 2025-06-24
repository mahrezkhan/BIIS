// src/components/StudentDashboard.js
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react"; // 3-dot icon
import "./css/StudentDashboard.css";

const StudentDashboard = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleProfileClick = () => {
    setShowMenu(false);
    navigate("/student/profile");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>BIIS</h2>
        <div
          className="menu-icon"
          onClick={() => setShowMenu((prev) => !prev)}
          aria-label="Menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setShowMenu((prev) => !prev)}>
          <MoreVertical size={30} />
        </div>
        {showMenu && (
          <div className="dropdown-menu" ref={menuRef}>
            <button onClick={handleProfileClick}>My Profile</button>
            {/* Add more options if needed */}
          </div>
        )}
      </header>
      <main className="dashboard-content">
        <h2>Welcome to Student Dashboard</h2>
        {/* Add more dashboard content here */}
      </main>
    </div>
  );
};

export default StudentDashboard;
