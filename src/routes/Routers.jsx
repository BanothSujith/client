import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ChangePassword from '../components/pages/ChangePasword';

const Home = lazy(() => import('../components/pages/Home'));
const Login = lazy(() => import('../components/pages/Login'));

const Register = lazy(() => import('../components/pages/Register'));
const NotFound = lazy(() => import('../components/pages/NotFound'));
const CreateVideoBlog = lazy(() => import('../components/pages/CreateVideoBlog'));
const CreateImgBlog = lazy(() => import('../components/pages/CreateImgBlog'));
const VideoPage = lazy(() => import('../components/pages/VideoPage'));
const ProfilePage = lazy(() => import('../components/pages/Profile'));
const GalleryPage = lazy(() => import('../components/pages/GalleryPage'));
const ChangeProfile = lazy(() => import('../components/pages/ChangeProfile'));

const token = Cookies.get('token');
const isAuthenticated = Boolean(token);
// console.log('isAuthenticated', isAuthenticated);
function Routers() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/blogvideo" element={isAuthenticated ? <CreateVideoBlog /> : <Navigate to="/login" />} />
        <Route path="/blogimg" element={isAuthenticated ? <CreateImgBlog /> : <Navigate to="/login" />} />
        <Route path="/video/:video" element={<VideoPage />} />
        <Route path="/user/:userprofile" element={<ProfilePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/editprofile" element={<ChangeProfile />} />
        <Route path="/changepassword" element={<ChangePassword/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default Routers;
