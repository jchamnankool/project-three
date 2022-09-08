import { useState, useEffect } from 'react';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { getFirestore } from '@firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDTN3jFMIKX7TbMyY9a9ddJCwv1lePojEI',
  authDomain: 'project3-e2382.firebaseapp.com',
  projectId: 'project3-e2382',
  storageBucket: 'project3-e2382.appspot.com',
  messagingSenderId: '547974702170',
  appId: '1:547974702170:web:d4a986c59ca2a8db8ea463',
  measurementId: 'G-PTLF60W6HQ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const storage = getStorage();
export const db = getFirestore();

export function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  return currentUser;
}

// storage
export async function upload(file, currentUser, setLoading, goToProfile) {
  const fileRef = ref(storage, currentUser.uid + '.png');
  setLoading(true);
  const snapshot = await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);
  updateProfile(currentUser, {photoURL: photoURL});
  const userRef = doc(db, 'users', currentUser.uid);
  await updateDoc(userRef, {
    avatar: photoURL
  });
  goToProfile();
  setLoading(false);
}
