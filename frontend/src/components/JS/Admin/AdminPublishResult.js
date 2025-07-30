import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../../api/axiosInstance';
import styles from '../../css/form.module.css';

const AdminPublishResult = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get('/admin/all-sessions', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Sessions response:', response.data);
      const sessionsList = response.data.sessions || [];
      const sortedSessions = sessionsList.sort((a, b) => 
        b.session_name.localeCompare(a.session_name)
      );

      setSessions(sortedSessions);
    } catch (err) {
      console.error('Session fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch sessions');
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!selectedSession) {
      setError('Please select a session');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post('/admin/publish-result', 
        { session_name: selectedSession },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSuccess(response.data.message || 'Results published successfully');
      setSelectedSession('');
    } catch (err) {
      console.error('Publish error:', err);
      setError(err.response?.data?.message || 'Failed to publish results');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/admin/signin');
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebartitle}>Admin Portal</h2>
        <nav>
          <a
            href="/admin/pendingstudents"
            className={location.pathname === "/admin/pendingstudents" 
              ? `${styles.navLink} ${styles.activeNavLink}` 
              : styles.navLink}>
            Pending Students
          </a>
          <a
            href="/admin/pendingteachers"
            className={location.pathname === "/admin/pendingteachers" 
              ? `${styles.navLink} ${styles.activeNavLink}` 
              : styles.navLink}>
            Pending Teachers
          </a>
          <a
            href="/admin/publish-result"
            className={location.pathname === "/admin/publish-result" 
              ? `${styles.navLink} ${styles.activeNavLink}` 
              : styles.navLink}>
            Publish Results
          </a>
          <a
            href="/admin/send-notice"
            className={location.pathname === "/admin/send-notice" 
              ? `${styles.navLink} ${styles.activeNavLink}` 
              : styles.navLink}>
            Send Notice
          </a>
          <a
            href="/admin/manage-sessions"
            className={location.pathname === "/admin/manage-sessions" 
              ? `${styles.navLink} ${styles.activeNavLink}` 
              : styles.navLink}>
            Manage Sessions
          </a>
        </nav>
      </aside>

      <div className={styles.mainContent}>
        <div className={styles.formContainer}>
          <h2>Publish Session Results</h2>
          
          <form onSubmit={handlePublish} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Select Session:</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                required
                className={styles.select}
                disabled={loading}
              >
                <option value="">Choose a session</option>
                {sessions.map((session) => (
                  <option key={session.session_name} value={session.session_name}>
                    {session.session_name}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !selectedSession}
            >
              {loading ? 'Publishing...' : 'Publish Results'}
            </button>
          </form>

          <div className={styles.infoBox}>
            <h3>Important Notes:</h3>
            <ul>
              <li>Ensure all marks have been entered for the selected session</li>
              <li>This action cannot be undone</li>
              <li>Students will be able to view their results after publishing</li>
              <li>Make sure to verify all grades before publishing</li>
            </ul>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default AdminPublishResult;