import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import NavBar from '../components/navbar/NavBar';
import styles from './profile.module.scss';
import blankProfilePhoto from '../images/blankProfilePhoto.jpg';
import seiji from '../images/seiji.jpg';
import arcian from '../images/arcian.jpg';
import syvan from '../images/syvan.jpg';
import lucas from '../images/lucas.jpg';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser(userSnap.data());
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        {user && (
          <div className={styles.profile}>
            <div className={styles.leftColumn}>
              <div className={styles.avatar}>
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" />
                ) : (
                  <img src={blankProfilePhoto} alt="avatar" />
                )}
              </div>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userAttribute}>{user.style} writer</span>
            </div>

            <div className={styles.userInfo}>
              <h2>About Me</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <h2>Characters</h2>
              <div className={styles.characters} onClick={() => alert('hehe')}>
                <div className={styles.characterImage}>
                  <img src={seiji} alt="character" />
                </div>

                <div className={styles.characterImage}>
                  <img src={syvan} alt="character" />
                </div>

                <div className={styles.characterImage}>
                  <img src={lucas} alt="character" />
                </div>

                <div className={styles.characterImage}>
                  <img src={arcian} alt="character" />
                </div>
              </div>
              <h2>Stories</h2>
              <p>This user has no stories yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
