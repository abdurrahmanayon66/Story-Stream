import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";
import ShowBlogs from '../components/ShowBlogs';
import img2 from './img2.png';
import home from './home.png';
import Categories from '../components/Categories';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleCardClick = (genre) => {
    navigate(`/blogs/${genre}`);
  };

  const handleSearch = async (query) => {
    setIsSearching(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/searchBlog/${query}`);
      setSearchResults(response.data.data); // This should return an array of results or empty array
      setIsSearching(false);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setIsSearching(false);
      setSearchResults([]); // Reset search results in case of error
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
    } else {
      handleSearch(query);
    }
  };

  return (
    <div>
    <div className="hero min-h-screen px-16">
      <div className="flex justify-between flex-row-reverse">
        <img className='w-1/2' src={home} alt="Home" />
        <div className='w-1/2 flex flex-col justify-center pr-10'>
          <h1 className="text-5xl font-bold text-darkPurple">Welcome to StoryStream</h1>
          <p className="py-6 text-xl text-customGray font-semibold">Share your blogs, explore new narratives, and connect with a community of passionate writers and readers. Your journey begins here!</p>
          <label className="input input-bordered flex items-center gap-4 w-[80%] bg-white shadow-xl px-2 relative">
            <IoIosSearch className='text-4xl font-semibold text-purple-400' />
            <input
              type="text"
              className="text-black w-full font-semibold focus:outline-none placeholder:text-slate-500"
              placeholder="Search Article"
              value={searchQuery}
              onChange={handleInputChange}
            />
            <button className='bg-purple-400 w-[30%] rounded-lg text-white h-10' disabled={isSearching}>
              {isSearching ? <span className="loading loading-spinner text-white"></span> : 'Search'}
            </button>
            {searchQuery.trim() !== '' && (
              <div className='bg-purple-200 absolute left-0 top-14 max-h-[200px] overflow-y-scroll space-y-3 text-darkPurple text-lg font-semibold px-4 py-4 rounded-lg'>
                {searchResults.length === 0 ? (
                  <p>No results found</p>
                ) : (
                  searchResults.map((result) => (
                    <div key={result.id}>
                      <p>{result.title}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </label>
          <div className='my-6 flex justify-between w-[70%] items-center'>
            <span className='text-slate-600 font-semibold'>Popular Tags :</span>
            <span className='bg-purple-200 p-2 rounded-lg text-mediumPurple font-semibold hover:cursor-pointer' onClick={() => handleCardClick('Design')}>Design</span>
            <span className='bg-purple-200 p-2 rounded-lg text-mediumPurple font-semibold hover:cursor-pointer' onClick={() => handleCardClick('User Experience')}>User Experience</span>
            <span className='bg-purple-200 p-2 rounded-lg text-mediumPurple font-semibold hover:cursor-pointer' onClick={() => handleCardClick('User Interface')}>User Interface</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <section className='px-16 h-[260vh]'>
        <ShowBlogs />
      </section>
      <section className='flex justify-between px-16'>
        <div className='flex flex-col gap-y-5 justify-center w-[50%] pl-10'>
          <p className='text-darkPurple font-semibold text-6xl text-left'>Resources and insights</p>
          <p className='text-purple-500 text-2xl'>The latest industry news, interviews, technologies and resources.</p>
        </div>
        <div className='w-[50%]'>
          <img className='w-full' src={img2} alt="Resources and insights" />
        </div>
      </section>
    </div>
    <div>
      <Categories />
    </div>
  </div>
  );
}

export default Home;
