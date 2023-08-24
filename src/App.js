import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Header from './components/header';

import Home from './pages/home';
import Chapter from './pages/chapter';
import Page from './pages/page';

import Register from './pages/register';

import Admin from './pages/admin';
import Login from './pages/login';
import User from './pages/user';

function App() {
  const [chapters, setChapters] = useState([]);
  const [user, setUser] = useState(null);
  const [likes, setLikes] = useState(null);

  useEffect(() => {
    const getChapters = async () => {
      try {
        const res = await axios.get('https://comic.api.sigve.dev/chapter/findall');
        setChapters(res.data);
        if(chapters.length === 0) {
          localStorage.setItem('chapters', JSON.stringify(res.data));
        }
      } catch (err) {
        console.log(err);
      }
    }
    if(!localStorage.getItem('chapters')) {
      getChapters();
    } else {
      if(window.location.pathname === '/' || window.location.pathname === '/user' || window.location.pathname === '/admin') {
        getChapters();
      }
      setChapters(JSON.parse(localStorage.getItem('chapters')));
    }
  }, [chapters.length]);

  useEffect(() => {
    const checkUser = async () => {
      const response = await axios.get('https://comic.api.sigve.dev/auth', {
        headers: {
          Authorization: JSON.parse(localStorage.getItem('user'))
        }
      }, { withCredentials: true });
      if(response.data) {
        setUser(response.data);
      } else {
        setUser("error");
      }
    };
    if(localStorage.getItem('user')) {
      if(JSON.parse(localStorage.getItem('ttl')) < new Date().getTime()) {
        localStorage.removeItem('user');
        localStorage.removeItem('ttl');
      } else {
        checkUser();
      }
    } else {
      setUser("error");
    }
  }, []);

  useEffect(() => {
    const getLikes = async () => {
      try {
        const res = await axios.get('https://comic.api.sigve.dev/liked/likes/' + user._id, {}, { withCredentials: true });
        setLikes(res.data);
        localStorage.setItem('likes', JSON.stringify(res.data));
      } catch (err) {
        console.log(err);
      }
    }
    if(window.location.pathname === '/' || window.location.pathname === '/user') {
      if(user !== null && user !== "error") {
        getLikes();
      }
    } else {
      if(user !== null && user !== "error") {
        setLikes(JSON.parse(localStorage.getItem('likes')));
      }
    }
  }, [user]);

  return (
    <BrowserRouter>
      <div className="App">
        <Header user={user} />
        <Routes>
          <Route path="/" element={<Home chapters={chapters} />} />
          <Route path="/chapter/:id" element={<Chapter chapters={chapters} user={user} />} />
          <Route path="/page/:id/:number" element={<Page chapters={chapters} likes={likes} user={user} />} />

          <Route path="/register" element={<Register user={user} />} />

          <Route path="/admin?" element={<Admin user={user} />} />
          <Route path="/login" element={<Login user={user} />} />
          <Route path="/user" element={<User user={user} chapters={chapters} likes={likes} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
