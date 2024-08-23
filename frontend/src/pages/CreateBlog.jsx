import React, { useEffect, useState, useRef } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img from './59563728_9318694.jpg';

const CreateBlog = () => {
  const [userId, setUserId] = useState(null);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(img);
  const fileInputRef = useRef(null);


  useEffect(() => {
    // Retrieve JWT token from session storage
    const token = sessionStorage.getItem('jwtToken');

    if (token) {
      // Decode the token to extract user ID
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.sub);
    }
  }, []);

  const clearForm = () => {
    setTitle('');
    setGenre('');
    setContent('');
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Retrieve JWT token from session storage
    const token = sessionStorage.getItem('jwtToken');

    if (token) {
      // Decode the token to extract user ID
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.sub);
    }

    // Create a form data object to send the file
    const formData = new FormData();
    formData.append('title', title);
    formData.append('genre', genre);
    formData.append('content', content);
    formData.append('author_id', userId);
    if (file) {
      formData.append('image', file);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/createBlog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Post created successfully');
      setIsLoading(false);
      clearForm();
    } catch (error) {
      toast.error('Error creating post:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className='px-16'>
      <ToastContainer/>
    <form onSubmit={handleSubmit}>
      <div className='py-16'>
        <div className='flex justify-between pr-28'>
          <p className='text-4xl font-semibold text-darkPurple'>Create Post</p>
          <button className='w-28 text-white font-semibold rounded-md bg-purple-400' disabled={isLoading}>{isLoading ? <span className="loading loading-spinner text-white"></span> : 'Save'}</button>
        </div>
        <div className='my-6 rounded-lg flex'>
          <section className='w-1/2 bg-purple-400 bg-opacity-30 backdrop-blur-md p-6 space-y-6'>
            <label className="form-control w-full">
              <div className="label">
                <span className="text-darkPurple font-semibold text-xl">What is the title of your work?</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered bg-white text-lg text-black placeholder:text-customGray"
                value={title}
                onChange={(e) => setTitle(e.target.value)} required
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="text-darkPurple font-semibold text-xl">Select the genre</span>
              </div>
              <select
                className="select w-full max-w-xs bg-white text-lg text-black placeholder:text-customGray"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
              >
                <option disabled selected>Select</option>
                <option>Fashion</option>
                <option>Technology</option>
                <option>Health and Wellness</option>
                <option>Business</option>
                <option>Medical Science</option>
                <option>Education</option>
                <option>Lifestyle</option>
                <option>Environment</option>
                <option>Leadership</option>
                <option>Marketing</option>
              </select>
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text text-darkPurple font-semibold text-xl">Enter Your Content</span>
              </div>
              <textarea
                className="textarea textarea-bordered h-48 bg-white text-lg text-black placeholder:text-customGray"
                placeholder="Type here..."
                value={content}
                required
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </label>
          </section>
          <section className='w-[40%] bg-purple-400 bg-opacity-30 backdrop-blur-md p-6 space-y-6 ml-8 rounded-lg'>
            <p className='text-darkPurple font-semibold text-xl'>Featured Image</p>
            <div>
              <img className='h-[300px] rounded-md' src={imagePreview} alt="Selected" />
            </div>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text text-darkPurple font-semibold text-xl">Pick an image</span>
              </div>
              <input
                  type="file"
                  className="file-input file-input-bordered file-input-ghost w-full bg-white text-lg text-black placeholder:text-customGray"
                  required
                  ref={fileInputRef}
                  onChange={(e) => {
                  const file = e.target.files[0];
                  setFile(file);
                  if (file) {
                    const imageURL = URL.createObjectURL(file);
                    setImagePreview(imageURL);
                  } else {
                    setImagePreview(img);
                  }
                }}
              />

            </label>
          </section>
        </div>
      </div>
    </form>
    </div>
  );
}

export default CreateBlog;
