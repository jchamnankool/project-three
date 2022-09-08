import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, useAuth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import styles from './overview.module.scss';

const Overview = ({ id }) => {
  const currentUser = useAuth();
  const [thread, setThread] = useState({});
  const threadRef = doc(db, 'threads', id);
  const [poster, setPoster] = useState({});

  useEffect(() => {
    const fetchUser = async (uid) => {
      const posterRef = doc(db, 'users', uid);
      const posterSnap = await getDoc(posterRef);

      if (posterSnap.exists()) {
        setPoster(posterSnap.data());
      }
    };

    const fetchThread = async () => {
      const threadSnap = await getDoc(threadRef);

      if (threadSnap.exists()) {
        setThread(threadSnap.data());
        fetchUser(threadSnap.data().poster);
      } else {
        alert(`Error fetching post ${id}.`);
      }
    };

    fetchThread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Link to={id}>
      <div className={styles.container}>
        <div className={styles.columns}>
          <div className={styles.leftColumn}>
            <h2>{thread.title}</h2>
            <div className={styles.author}>
            {poster ? <>by <Link to={`/profile/${thread.poster}`}>{poster.name}</Link></> : null}
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.num}>{thread.num_posts}</div>
            {thread.num_posts === 1 ? 'post' : 'posts'}
          </div>
        </div>

        <div className={styles.overviewFooter}>
          {thread.created_at ? (
            <div>
              Posted at {thread.created_at.toDate().toLocaleTimeString()},{' '}
              {thread.created_at.toDate().toLocaleDateString()}
            </div>
          ) : null}

          {currentUser && thread.poster && thread.poster === currentUser.uid ? (
            <div className={styles.topicControls}>
              <Link to="#">Edit</Link>
              <Link to="#">Delete</Link>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

export default Overview;
