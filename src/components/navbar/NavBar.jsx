import React from 'react';
import { Link } from 'react-router-dom';
import styles from './navbar.module.scss';
import { useAuth, logout } from '../../firebase';

const NavBar = () => {
  const currentUser = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      alert('There was an error with logging out.');
    }
  };

  return (
    <div className={styles.navBar}>
      <div className={styles.logo}>
        <Link to="/">Troupe</Link>
      </div>
      <div className={styles.items}>
        {/* <Link to="/#" key="about">
          About
        </Link> */}
        <Link to="/board" key="board">
          Board
        </Link>
        {currentUser ? (
          <>
            <Link to={`/profile/${currentUser.uid}`} key="profile">
              Profile
            </Link>
            <Link to="/settings" key="settings">
              Settings
            </Link>
            <Link to="/" onClick={handleLogout} key="logout">
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" key="login">
              Login
            </Link>
            <Link to="/register" key="register">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
