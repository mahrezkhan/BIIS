// src/components/Header.js
import styles from '../css/Header.module.css';  // Import the CSS Module

const Header = () => {
  return (
    <header className={styles.header}>  {/* Use the header class from the module */}
        <h1 className={styles.h1}>BUET</h1>  {/* Apply the styles from the module */}
        <h2 className={styles.h2}>Welcome to BUET INSTITUTIONAL INFORMATION SYSTEM</h2>  {/* Apply the styles from the module */}
    </header>
  );
};

export default Header;
