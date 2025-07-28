import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Books       from './components/Books';
import SingleBook  from './components/SingleBook';
import Login       from './components/Login';
import Register    from './components/Register';
import Account     from './components/Account';
import Navigations from './components/Navigations';

import bookLogo from './assets/books.png';

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) setToken(saved);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <header className="App-header">
        <img src={bookLogo} alt="Logo" id="logo-image" />
        <h1>Library App</h1>
      </header>

      <Navigations token={token} handleLogout={handleLogout} />

      <main className="content">
        <Routes>
          <Route path="/"          element={<Books token={token} />} />
          <Route path="/books"     element={<Books token={token} />} />
          <Route path="/books/:id" element={<SingleBook token={token} />} />
          <Route path="/login"     element={<Login  setToken={setToken} />} />
          <Route path="/register"  element={<Register setToken={setToken} />} />
          <Route path="/account"   element={<Account token={token} />} />
        </Routes>
      </main>
    </Router>
  );
}