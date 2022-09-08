import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Board from './pages/Board';
import Threads from './pages/Threads';
import Thread from './pages/Thread';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="board">
        <Route index={true} element={<Board />} />
        <Route path=":categoryId">
          <Route index={true} element={<Threads />} />
          <Route path=":threadId" element={<Thread />} />
        </Route>
      </Route>
      <Route path="profile">
        <Route path=":userId" element={<Profile />} />
      </Route>
      <Route path="settings" element={<Settings />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
