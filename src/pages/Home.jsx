import React from 'react';
import NavBar from '../components/navbar/NavBar';
import styles from './home.module.scss';

const Home = () => {
  return (
    <div>
      <NavBar />
      <div className={styles.wrapper}>
        <div className={styles.hero}>
          <h1>Troupe</h1>
            <span className={styles.tagline}>where roleplayers find their next great story</span>
        </div>
      </div>
      {/* TODO: footer */}
    </div>
  );
};

export default Home;
