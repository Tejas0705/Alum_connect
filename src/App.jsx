import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import AuthPage from './pages/AuthPage/AuthPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Addzoomlink from './components/Sidebar/Addzoomlink';
import Zoomlink from './components/Sidebar/Zoomlink';
import ChatPage from './components/Sidebar/ChatPage';
import PageLayout from './Layouts/PageLayout/PageLayout';
import SidebarItems from './components/Sidebar/SidebarItems';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/firebase';

function App() {
  const [authUser] = useAuthState(auth);

  return (
    <PageLayout>
      
        
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={!authUser ? <AuthPage /> : <Navigate to="/" />} />
          <Route path="/:username" element={<ProfilePage />} />
          <Route path="/addzoomlink" element={<Addzoomlink />} />
          <Route path="/zoomlink" element={<Zoomlink />} />
          <Route path="/chatpage" element={authUser ? <ChatPage currentUser={authUser} authUser={authUser} /> : <Navigate to="/auth" />} />
        </Routes>
      
    </PageLayout>
  );
}

export default App;
