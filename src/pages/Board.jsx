import React, { useState, useEffect } from 'react';
import NavBar from '../components/navbar/NavBar';
import styles from './board.module.scss';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Category from '../components/categories/Category';

const Board = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    if (categoriesSnapshot) {
      categoriesSnapshot.forEach((doc) => {
        setCategories((categories) => [...categories, doc.id]);
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <h1>Message Board</h1>
        {categories.map((cat) => (
          <Category id={cat} key={cat} />
        ))}
      </div>
    </div>
  );
};

export default Board;
