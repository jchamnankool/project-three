import React, { useRef, useState } from 'react';
import NavBar from '../components/navbar/NavBar';
import styles from './register.module.scss';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { signup, useAuth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [style, setStyle] = useState('Literate');
  const [dob, setDob] = useState('');
  const [agree, setAgree] = useState(false);
  const currentUser = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();

  let date = new Date();
  date.setFullYear(date.getFullYear() - 13);
  date = date.toISOString().split('T')[0];

  const handleSignup = async () => {
    setLoading(true);
    if (agree) {
      try {
        const response = await signup(
          emailRef.current.value,
          passwordRef.current.value
        );
        if (response) {
          const uid = response.user.uid;

          await setDoc(doc(db, 'users', uid), {
            name: name,
            style: style,
            dob: dob,
          });
        }
        navigate('/board');
      } catch {
        alert('There was an error signing up.');
      }
    } else {
      alert(
        'You must agree to the Privacy Policy and Terms & Services in order to sign up.'
      );
    }

    setLoading(false);
  };

  return (
    <div>
      <NavBar />
      {console.log(`Currently logged in as: ${currentUser?.email}`)}
      <div className={styles.container}>
        <div className={styles.registration}>
          <h1>Registration</h1>
          <form>
            <label>Name</label>
            <input
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Email address</label>
            <input
              type="email"
              placeholder="Email address"
              ref={emailRef}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              ref={passwordRef}
              required
            />

            <label>
              Roleplay Style
              <div className={styles.tooltip}>
                <BsQuestionCircleFill />
                <div className={styles.tooltiptext}>
                  <p>
                    <strong>Casual:</strong> One-liners, could have action
                    statements and fragments.
                  </p>
                  <p>
                    <strong>Literate:</strong> Average 1-2 paragraph length
                    replies with proper punctuation and grammar.
                  </p>
                  <p>
                    <strong>Novella:</strong> Average 4+ paragraph length
                    replies with proper punctuation and grammar.
                  </p>
                </div>
              </div>
            </label>
            <span>Please choose one.</span>
            <div
              className={styles.selectionContainer}
              onChange={(e) => setStyle(e.target.value)}
              required
            >
              <input type="radio" name="rad" id="casual" value="Casual" />
              <label htmlFor="casual">Casual</label>
              <input
                type="radio"
                name="rad"
                id="literate"
                value="Literate"
                defaultChecked={style === 'Literate'}
              />
              <label htmlFor="literate">Literate</label>
              <input type="radio" name="rad" id="novella" value="Novella" />
              <label htmlFor="novella">Novella</label>
            </div>

            <label>Date of Birth</label>
            <span>
              You must be at least 13 years old to register for Troupe.
            </span>
            <input
              type="date"
              name="dob"
              max={date}
              onChange={(e) => setDob(e.target.value)}
              required
            />

            <div className={styles.agreeContainer}>
              <input
                type="checkbox"
                id="agree"
                onChange={(e) =>
                  e.target.checked ? setAgree(true) : setAgree(false)
                }
              />
              <label htmlFor="agree" className={styles.agree}>
                I agree to the <Link to="#">Terms & Services</Link> and{' '}
                <Link to="#">Privacy Policy</Link>.
              </label>
            </div>

            <button disabled={loading || currentUser} onClick={handleSignup}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
