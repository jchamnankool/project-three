import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import styles from './category.module.scss';

const Category = ({ id }) => {
  const [category, setCategory] = useState({});
  const docRef = doc(db, "categories", id);

  useEffect(() => {
    const fetchCategory = async () => {
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
          setCategory(docSnap.data());
      }
    };
    
    fetchCategory();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Link to={id}>
    <div className={styles.container}>
      <div>
        <div className={styles.title}>{category.title}</div>
        <div>{category.description}</div>
      </div>
      <div className={styles.numTopics}>
        <div className={styles.num}>{category.num_topics}</div>
        {(category.num_topics === 1) ? ('topic') : ('topics')}
      </div>
    </div>
    </Link>
  );
};

export default Category;
