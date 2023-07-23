import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Header from './components/header';

import Home from './pages/home';
import Chapter from './pages/chapter';
import Page from './pages/page';

import Admin from './pages/admin';
import Login from './pages/login';

function App() {
  const [chapters, setChapters] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getChapters = async () => {
      try {
        const res = await axios.get('http://localhost:5000/chapter/findall');
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
      if(window.location.pathname === '/') {
        getChapters();
      }
      setChapters(JSON.parse(localStorage.getItem('chapters')));
    }
  }, [chapters.length]);

  useEffect(() => {
    const checkUser = async () => {
      const response = await axios.get('http://localhost:5000/auth', {
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

  return (
    <BrowserRouter>
      <div className="App">
        <Header user={user} />
        <Routes>
          <Route path="/" element={<Home chapters={chapters} />} />
          <Route path="/chapter/:id" element={<Chapter chapters={chapters} />} />
          <Route path="/page/:id/:number" element={<Page chapters={chapters} />} />

          <Route path="/admin?" element={<Admin user={user} />} />
          <Route path="/login" element={<Login user={user} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
