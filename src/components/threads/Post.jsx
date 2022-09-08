import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, useAuth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import styles from './post.module.scss';
import blankProfilePhoto from '../../images/blankProfilePhoto.jpg';

const Post = ({ id }) => {
  const currentUser = useAuth();
  const [post, setPost] = useState({});
  const [poster, setPoster] = useState({});
  const postRef = doc(db, 'posts', id);

  useEffect(() => {
    const fetchPoster = async (uid) => {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        setPoster(userSnap.data());
      } else {
        alert(`Error fetching user ${uid}`);
      }
    };

    const fetchPost = async () => {
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        setPost(postSnap.data());
        fetchPoster(postSnap.data().user);
      } else {
        alert(`Error fetching post ${id}.`);
      }
    };

    fetchPost();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.userColumn}>
        <div className={styles.avatar}>
          { poster.avatar ? (
            <img src={poster.avatar} alt='avatar' />
          ) : (
            <img src={blankProfilePhoto} alt='avatar' />
          )}
        </div>
        <div className={styles.userInfo}>
          <Link to={`/profile/${post.user}`}>{poster.name}</Link>
        </div>
        <span className={styles.userStyle}>{poster.style}</span>
      </div>
      <div className={styles.contentColumn}>
        <div className={styles.postContent}>{post.content}</div>
        <div className={styles.postFooter}>
          {/* post conditional */}
          {post.posted_at ? (
            <div className={styles.postTimestamp}>
              Posted at {post.posted_at.toDate().toLocaleTimeString()},{' '}
              {post.posted_at.toDate().toLocaleDateString()}
            </div>
          ) : null}
          {/* current user conditional */}
          {post.user && currentUser && post.user === currentUser.uid ? (
            <div className={styles.postControls}>
              <Link to="#">Edit</Link>
              <Link to="#">Delete</Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Post;
