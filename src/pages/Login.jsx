import React, { useRef, useState } from 'react';
import NavBar from '../components/navbar/NavBar';
import { login } from '../firebase';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.scss';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
        await login(emailRef.current.value, passwordRef.current.value);
        navigate('/board');
      } catch {
        alert('There was an error logging in.');
      }
      setLoading(false);
  };

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.login}>
          <h1>Login</h1>
          <form>
            <label>Email address</label>
            <input type="email" placeholder="Email address" ref={emailRef} />

            <label>Password</label>
            <input type="password" placeholder="Password" ref={passwordRef} />

            <button disabled={loading} onClick={handleLogin}>Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
