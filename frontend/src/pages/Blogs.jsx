import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from '../components/Pagination';

const Blogs = () => {
    const { genre } = useParams();
    const [blogs, setBlogs] = useState([]);
    const [trendingBlogs, setTrendingBlogs] = useState([]);
    const descriptionLength = 80;
    const navigate = useNavigate();
    const [ratings, setRatings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 6;

    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          let response;
          
          if (genre === 'null') {
            response = await axios.get("http://localhost:8000/api/getAllBlogs");
          } else {
            response = await axios.get(`http://localhost:8000/api/getBlogsByGenre/${genre}`);
          }
          
          setBlogs(response.data.data);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, [genre]); // Dependency array ensures useEffect runs when `genre` changes
  

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:8000/api/getAllRating")
      .then((response) => {
        setRatings(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:8000/api/getTrendingBlogs")
      .then((response) => {
        setTrendingBlogs(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCardClick = (blogId) => {
    navigate(`/viewBlog/${blogId}`);
  };

  // Get current blogs
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <div className="h-screen w-[100%] flex justify-center items-center">
    <span className="loading loading-spinner w-[10%] text-purple-400"></span>
  </div>;
  }
  return (
    <div className="flex justify-between px-16">
    <div className="w-[70%] h-[250vh] relative">
      <div className="flex flex-wrap gap-x-20 gap-y-16 pt-10 pb-20">
        {currentBlogs.map((blog, index) => (
          <div
            key={index}
            className="card w-96 h-[500x] bg-white shadow-xl rounded-md hover:cursor-pointer"
            onClick={() => handleCardClick(blog.blog_id)}
          >
            <figure>
              <img
                className="w-full h-[250px]"
                src={`data:image/jpeg;base64,${blog.blog_image}`}
                alt="Blog"
              />
            </figure>
            <div className="card-body px-4 pt-4 pb-2 h-[250px]">
              <div className="mb-2">
                <span className="bg-purple-200 text-sm p-2 font-semibold rounded-md text-mediumPurple">
                  {blog.genre}
                </span>
              </div>
              <h2 className="card-title text-darkPurple">{blog.title}</h2>
              <p className="text-customGray">
                {blog.content.slice(0, descriptionLength)}...
              </p>
              <div className="flex justify-between">
                <div className="flex space-x-3 mt-2">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full">
                      <img
                        src={`data:image/jpeg;base64,${blog.user_image}`}
                        alt="Blog"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-black font-semibold text-sm">
                      {blog.user_name}
                    </span>
                    <span>
                      <span className="font-semibold text-sm text-customGray">
                        {formatDate(blog.created_at)}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="pt-3">
                  <div className="rating">
                    {[1, 2, 3, 4, 5].map((value) => {
                      const isChecked =
                        Array.isArray(ratings) &&
                        ratings.some(
                          (rating) =>
                            rating.blog_id === blog.blog_id &&
                            parseInt(rating.average_rating) >= value
                        );
                      return (
                        <input
                          key={value}
                          type="radio"
                          name={`rating-${index}`} // Use a unique name for each rating
                          className="mask mask-star-2 bg-purple-500 w-4 h-4"
                          checked={isChecked}
                          readOnly // Make the radio inputs read-only
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-[1700px] flex w-[100%] justify-center">
      <Pagination
        totalBlogs={blogs.length}
        blogsPerPage={blogsPerPage}
        currentPage={currentPage}
        paginate={paginate}
      />
      </div>
    </div>
    <div className="w-[30%] mt-10 mb-20 px-5 pt-5 bg-[#f9fafb] rounded-md shadow-lg">
      <p className="text-2xl text-black font-semibold mb-4">
        Trending Articles
      </p>
      { trendingBlogs && trendingBlogs.map((trendingBlog, index) => (
      <div className="relative h-[250px] mb-6 hover:cursor-pointer"  onClick={() => handleCardClick(trendingBlog.blog_id)}>
        <img className="rounded-md h-full w-full"   src={`data:image/jpeg;base64,${trendingBlog.blog_image}`} alt="Blog" />
        <div className="absolute px-4 bg-black bg-opacity-30 bottom-0 h-[100%] flex flex-col justify-end items-start rounded-md w-full overflow-hidden pb-6">
          <span className="bg-purple-200 p-2 text-sm rounded-md text-mediumPurple font-semibold">
            {trendingBlog.genre}
          </span>
          <p className="text-white font-bold my-2 text-md">
            {trendingBlog.title}
          </p>
        </div>
      </div>
      ))}
    </div>
  </div>
);
}

export default Blogs
 

