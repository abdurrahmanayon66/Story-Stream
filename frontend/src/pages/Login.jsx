import React, { useState } from 'react';
import img from './Blog post-amico.svg';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import images from '../assets/images'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Client-side validation
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/loginUser', { email, password });
      toast.success('Welcome Back!');
      
      // Extract the token from the response
      const token = response.data.token;

      // Store the token in session storage
      sessionStorage.setItem('jwtToken', token);
      navigate('/');
    } catch (error) {
      toast.error('Error while logging in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-purple-200'>
      <ToastContainer />
      <div className='bg-white bg-opacity-50 backdrop-blur-lg h-[600px] w-[80%] flex p-10 rounded-lg'>
        <img className='w-1/2' src={images.footer} alt="" />
        <form className='w-1/2 px-12 flex flex-col justify-start gap-y-8' onSubmit={handleSignup}>
          <div>
            <p className='text-6xl text-center font-semibold mt-16 mb-6 text-darkPurple'>StoryStream</p>
            <Link to={'/signup'}><p className='text-center text-lg text-customGray font-semibold hover:cursor-pointer'>Don't have an account? <span className='text-purple-600'>Sign up</span></p></Link>
          </div>
          <label className="input input-bordered flex text-black border-purple-400 items-center gap-2 bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
            <input type="text" className="grow" placeholder="Enter Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="input input-bordered text-black flex border-purple-400 items-center gap-2 bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
            <input type="password" className="grow" placeholder='Enter Your Password' value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <div className='flex justify-center'>
                <button className='w-[200px] p-3 text-white font-semibold rounded-lg text-xl text-semibold bg-purple-400' disabled={isLoading}>
                    {isLoading ? <span className="loading loading-spinner text-purple-200"></span> : 'Login'}
                </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login