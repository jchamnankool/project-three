import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db, useAuth } from '../firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  where,
  getDocs,
  addDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import NavBar from '../components/navbar/NavBar';
import Post from '../components/threads/Post';
import { BsArrowLeft } from 'react-icons/bs';
import styles from './thread.module.scss';

const Thread = () => {
  const currentUser = useAuth();
  const navigate = useNavigate();
  // thread stuff
  const { categoryId, threadId } = useParams();
  let categoryTitle;
  switch (categoryId) {
    case 'feedback':
      categoryTitle = 'Feedback';
      break;
    case 'general':
      categoryTitle = 'General Discussion';
      break;
    case 'search_group':
      categoryTitle = 'Group Roleplay Search';
      break;
    case 'search_partner':
      categoryTitle = 'One-on-One Roleplay Search';
      break;
    default:
      categoryTitle = 'Threads';
  }
  const [thread, setThread] = useState({});
  const threadRef = doc(db, 'threads', threadId);
  // post stuff
  const [posts, setPosts] = useState([]);
  const postsQuery = query(
    collection(db, 'posts'),
    where('thread', '==', threadId),
    orderBy('posted_at') // note for future jackie: index composite queries 💃
  );
  // reply stuff
  const [reply, setReply] = useState('');

  const submitReply = async (e) => {
    e.preventDefault();
    const newReply = await addDoc(collection(db, 'posts'), {
      content: reply,
      thread: threadId,
      user: currentUser.uid,
      posted_at: Timestamp.fromDate(new Date()),
    });
    if (newReply) {
      setReply('');
      setPosts([...posts, newReply.id]);

      // increment number of posts for thread
      const newNumPosts = thread.num_posts + 1;

      const update = await updateDoc(threadRef, {
        num_posts: newNumPosts
      });

      if (update) console.log(update);
    }
  };

  const capitalize = (str) => {
    return str[0].toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const fetchThread = async () => {
      const threadSnap = await getDoc(threadRef);

      if (threadSnap.exists()) {
        setThread(threadSnap.data());
      } else {
        alert('Error fetching thread.');
        navigate('/board');
      }
    };

    const fetchPosts = async () => {
      const querySnapshot = await getDocs(postsQuery);

      if (querySnapshot) {
        querySnapshot.forEach((doc) => setPosts((posts) => [...posts, doc.id]));
      } else {
        alert('Error fetching posts.');
        navigate('/board');
      }
    };

    fetchThread();
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <NavBar />
      
      <div className={styles.container}>
        <h1>{thread.title}</h1>
        <div className={styles.controls}>
          <Link to={`/board/${thread.category}`}>
            <BsArrowLeft /> Back to{' '}
            {categoryTitle}
          </Link>
        </div>
        {posts.map((post) => (
          <Post id={post} key={post} />
        ))}
        <div className={styles.replyPanel}>
          {currentUser ? (
            <form>
              <label>Reply</label>
              <textarea onChange={(e) => setReply(e.target.value)} value={reply} required />
              <div className={styles.control}>
                <button onClick={submitReply}>
                  Add reply
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.loginToReply}>
              <p>Login to join the conversation.</p>
              <Link to="/login">
                <button>Login</button>
              </Link>
              <p>
                Don't have an account yet? Sign up{' '}
                <Link to="/register">here</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Thread;
