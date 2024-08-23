import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import ViewBlog from './pages/ViewBlog';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CreateBlog from './pages/CreateBlog';
import Blogs from './pages/Blogs';
import MyBlogs from './pages/MyBlogs'
import EditBlog from './pages/EditBlog'

const App = () => {
  return (
    <BrowserRouter>
      <div className='bg-white'>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/*" 
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/viewBlog/:blogId" element={<ViewBlog />} />
                  <Route path="/createBlog" element={<CreateBlog/>} />
                  <Route path="/blogs/:genre" element={<Blogs />} />
                  <Route path="/myBlogs" element={<MyBlogs />} />
                  <Route path="/editBlog/:blogId" element={<EditBlog />} />
                </Routes>
              </Layout>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
