import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import LoginSignUp from './LoginSignUp';
import Dashboard from './Dashboard';
import SharedLinkPage from './SharedLinkPage'
import SharedCollectionPage from './SharedCollectionPage'
import PrivacyPolicy from './PrivacyPolicy';
import './App.css'

function App() {
  const [cookies, setCookie] = useCookies(['userId']);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    let userIdCookie = cookies.userId;
    if (userIdCookie == null || userIdCookie === '') {
      const localUserId = localStorage.getItem('userId');
      if (localUserId) {
        setUserId(localUserId);
      } 
    } else {
      setUserId(userIdCookie);
    }
  }, [cookies, setCookie]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={ userId ? <Navigate to="/Dashboard" /> : <Navigate to="/LoginSignUp" />}
        />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/LoginSignUp" element={<LoginSignUp />} />
        <Route path="/SharedLinkPage/:linkId" element={<SharedLinkPage />} />
        <Route path="/SharedLinkPage/:linkId/LoginSignUp" element={<LoginSignUp />} />
        <Route path="/SharedCollectionPage/:collectionId" element={<SharedCollectionPage />} />
        <Route path="/SharedCollectionPage/:collectionId/LoginSignUp" element={<LoginSignUp />} />
      </Routes>
    </Router>
  );
}

export default App;