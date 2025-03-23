import React from 'react'
import {  Route, Routes, Navigate  } from 'react-router-dom';
import Cookies from 'js-cookie';
import Home from '../components/pages//Home';
import Login from '../components/pages/Login';
import Logout from '../components/pages/Logout';
import AdminPage from '../components/pages/AdminPage';
import Register from '../components/pages/Register';
import NotFound from '../components/pages/NotFound';
import CreateVideoBlog from '../components/pages//CreateVideoBlog';
import CreateImgBlog from '../components/pages/CreateImgBlog';
import VideoPage from '../components/pages/VideoPage';
import Profilepage from '../components/pages/Profile';
import GalleryPage from '../components/pages/GalleryPage';
import ChangeProfile from '../components/pages/ChangeProfile';
 
function Routers() {
    const token = Cookies.get('token');
    const isAuthenticated = Boolean(token)
   
  return (

    <Routes>
       <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
      <Route path="/" element={ <Home /> } />
      <Route path="/adminpage" element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" />} />
      <Route path="/logout" element={isAuthenticated ? <Logout /> : <Navigate to="/login" />} />
      <Route path="/blogvideo" element={isAuthenticated ? <CreateVideoBlog /> : <Navigate to="/login" />} />
      <Route path="/blogimg" element={isAuthenticated ? <CreateImgBlog /> : <Navigate to="/login" />} />
      <Route path="/video/:video" element={<VideoPage/>} />
      <Route path="/user/:userprofile" element={<Profilepage/>}/>
      <Route path="/gallery" element={<GalleryPage/>} />
      <Route path="/editprofile" element={<ChangeProfile/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Routers