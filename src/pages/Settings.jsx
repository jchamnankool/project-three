import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { upload, useAuth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import NavBar from '../components/navbar/NavBar';
import styles from './settings.module.scss';
import { BsQuestionCircleFill } from 'react-icons/bs';
import blankProfilePhoto from '../images/blankProfilePhoto.jpg';

const Settings = () => {
  const currentUser = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [fileName, setFileName] = useState('No file selected.');
  const [file, setFile] = useState(null);
  const [style, setStyle] = useState('');
  let date = new Date();
  date.setFullYear(date.getFullYear() - 13);
  date = date.toISOString().split('T')[0];
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);

  const goToProfile = () => {
    navigate(`/profile/${currentUser.uid}`);
  }

  const saveChanges = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        name: name,
        style: style,
        dob: dob
      });
      if (file) {
        upload(file, currentUser, setLoading, goToProfile);
      } else {
        goToProfile();
      };
      // alert('wahoo');
    } catch {
      alert('There was an error changing settings.');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setName(userSnap.data().name);
        setStyle(userSnap.data().style);
        setDob(userSnap.data().dob);
      } else {
        alert(`Error fetching user ${currentUser.uid}`);
      }
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.settings}>
          <h1>Settings</h1>
          <form>
            <div className={styles.avatar}>
              {currentUser && currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="avatar" />
              ) : (
                <img src={blankProfilePhoto} alt="avatar" />
              )}
            </div>
            <label>Avatar</label>
            <div className={styles.avatarUpload}>
              <label className={styles.customUpload}>
                <input
                  type="file"
                  onChange={(e) => {
                    setFileName(e.target.value.replace(/^.*[\\\/]/, ''));
                    setFile(e.target.files[0]);
                  }}
                />
                Upload File
              </label>
              <span className={styles.fileName}>{fileName}</span>
            </div>

            <label>Name</label>
            <input
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
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
            {style ? (
              <div
                className={styles.selectionContainer}
                onChange={(e) => setStyle(e.target.value)}
                required
              >
                <input
                  type="radio"
                  name="rad"
                  id="casual"
                  value="Casual"
                  defaultChecked={style === 'Casual'}
                />
                <label htmlFor="casual">Casual</label>
                <input
                  type="radio"
                  name="rad"
                  id="literate"
                  value="Literate"
                  defaultChecked={style === 'Literate'}
                />
                <label htmlFor="literate">Literate</label>
                <input
                  type="radio"
                  name="rad"
                  id="novella"
                  value="Novella"
                  defaultChecked={style === 'Novella'}
                />
                <label htmlFor="novella">Novella</label>
              </div>
            ) : null}

            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              max={date}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />

            <button disabled={loading} onClick={saveChanges}>
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
