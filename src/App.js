import React, { useEffect } from 'react';
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
  useEffect(() => {
    const userIdCookie = cookies.userId;
    console.log("userIdCookie:", userIdCookie);
  }, [cookies]);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={cookies?.userId ? <Navigate to="/Dashboard" /> : <Navigate to="/LoginSignUp" />}
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