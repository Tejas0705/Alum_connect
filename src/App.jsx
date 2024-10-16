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
import UsnEntryForm from './components/AuthForm/UsnEntryForm';
import NotificationsPage from "./components/Sidebar/NotificationsPage";
import Verification from './components/AuthForm/Verification'; // Import your Verification page

function App() {
  const [authUser] = useAuthState(auth);

  // Function to check if the user can access a page
  const ProtectedRoute = ({ element }) => {
    if (!authUser) {
      return <Navigate to="/auth" />;
    }
   if (!authUser.emailVerified) { // Check if email is verified
      return <Navigate to="/verification" />;
    }
    return element;
  };

  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/auth" element={!authUser ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/:username" element={<ProtectedRoute element={<ProfilePage />} />} />
        <Route path="/addzoomlink" element={<ProtectedRoute element={<Addzoomlink />} />} />
        <Route path="/link" element={<ProtectedRoute element={<Zoomlink />} />} />
        <Route path="/notifications" element={<ProtectedRoute element={<NotificationsPage />} />} />
        <Route path="/chatpage" element={<ProtectedRoute element={<ChatPage currentUser={authUser} authUser={authUser} />} />} />
        <Route path="/usn-entry" element={<UsnEntryForm />} />
        <Route path="/verification" element={<Verification />}  />{/* Add verification route */}
      </Routes>
    </PageLayout>
  );
}

export default App;
