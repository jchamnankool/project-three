import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db, useAuth } from '../firebase';
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  addDoc,
  Timestamp,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import NavBar from '../components/navbar/NavBar';
import Overview from '../components/threads/Overview';
import CreateTopic from '../components/popups/CreateTopic';
import styles from './threads.module.scss';

const Threads = () => {
  const currentUser = useAuth();
  const navigate = useNavigate();
  const { categoryId } = useParams();
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
  const [category, setCategory] = useState();
  const categoryRef = doc(db, 'categories', categoryId);

  const threadQuery = query(
    collection(db, 'threads'),
    where('category', '==', categoryId),
    orderBy('created_at', 'desc')
  );
  const [threads, setThreads] = useState([]);

  const [buttonPopup, setButtonPopup] = useState(false);

  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [firstPost, setFirstPost] = useState('');

  const createTopic = async (e) => {
    e.preventDefault();
    const newTopic = await addDoc(collection(db, 'threads'), {
      title: newThreadTitle,
      category: categoryId,
      num_posts: 1,
      poster: currentUser.uid,
      created_at: Timestamp.fromDate(new Date()),
    });

    if (newTopic) {
      const newDoc = await addDoc(collection(db, 'posts'), {
        content: firstPost,
        thread: newTopic.id,
        user: currentUser.uid,
        posted_at: Timestamp.fromDate(new Date()),
      });

      if (newDoc) {
        const newNumTopics = category.num_topics + 1;
        const update = await updateDoc(categoryRef, {
          num_topics: newNumTopics,
        });

        if (update) console.log(update);
      }

      navigate(`${newTopic.id}`);
    }
  };

  useEffect(() => {
    const fetchThreads = async () => {
      const querySnapshot = await getDocs(threadQuery);
      if (querySnapshot) {
        querySnapshot.forEach((doc) =>
          setThreads((threads) => [...threads, doc.id])
        );
      }
    };

    const fetchCategory = async () => {
      const categorySnap = await getDoc(categoryRef);

      if (categorySnap.exists()) {
        setCategory(categorySnap.data());
      } else {
        alert('Error fetching category.');
        navigate('/board');
      }
    };

    fetchThreads();
    fetchCategory();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <h1>{categoryTitle}</h1>
        {threads.map((thread) => (
          <Overview id={thread} key={thread} />
        ))}

        <div className={styles.newTopicPanel}>
          {currentUser ? (
            <>
              <button onClick={() => setButtonPopup(true)}>
                Create a New Topic
              </button>
              <CreateTopic trigger={buttonPopup} setTrigger={setButtonPopup}>
                <h2>Create Topic</h2>
                <form>
                  <label>Title</label>
                  <input
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    required
                  />

                  <label>First Post</label>
                  <textarea
                    onChange={(e) => setFirstPost(e.target.value)}
                    required
                  />

                  <button id={styles.createTopicButton} onClick={createTopic}>
                    Create Topic
                  </button>
                </form>
              </CreateTopic>
            </>
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

export default Threads;
