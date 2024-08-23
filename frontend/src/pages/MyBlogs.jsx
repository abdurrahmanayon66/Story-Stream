import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import images from "../assets/images";
import { jwtDecode } from "jwt-decode";
import { FaTrashCan } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { isTokenValid } from "../assets/tokenUtils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosWarning } from "react-icons/io";
const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const descriptionLength = 80;
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 4;
  const [userId, setUserId] = useState();
  const [blogId, setBlogId] = useState();

  useEffect(() => {
    setIsLoading(true);
    const token = sessionStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.sub);
      setIsLoading(false);
    } else {
      navigate("/login");
      setIsLoading(false);
    }
  }, []);

  const fetchBlogsByUserId = (userId) => {
    setIsLoading(true);
    axios
      .get(`http://localhost:8000/api/getBlogsByUserId/${userId}`)
      .then((response) => {
        setBlogs(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    const token = sessionStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;
      fetchBlogsByUserId(userId);
    }
  }, [userId]);

  useEffect(() => {
    setIsLoading(true);
    const token = sessionStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;
      axios
        .get(`http://localhost:8000/api/getRatingsByUserId/${userId}`)
        .then((response) => {
          setRatings(response.data.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }
  }, [userId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get current blogs
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async () => {
    setIsProcessing(true);
    if (isTokenValid()) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/api/deleteBlog/${blogId}`
        );
        document.getElementById("deleteBlogModal").close();
        toast.success("Blog deleted successfully");
        setTimeout(() => {
          setIsProcessing(false);
          fetchBlogsByUserId(userId);
        }, 3000);
      } catch (error) {
        toast.error("Failed to delete blog"); // Ensure error message is displayed
        setIsProcessing(false);
        console.error(error); // Log the error for debugging
        // You can consider handling specific errors here and displaying a more user-friendly message
      }
    } else {
      navigate("/login");
      setIsProcessing(false);
    }
  };

  const openDeleteModal = (blogId) => {
    setBlogId(blogId);
    document.getElementById("deleteBlogModal").showModal();
  };

  const handleEdit = (blogId) => {
    navigate(`/editBlog/${blogId}`);
  };

  if (isLoading) {
    return <div className="h-screen w-[100%] flex justify-center items-center">
      <span className="loading loading-spinner w-[10%] text-purple-400"></span>
    </div>;
  }

  return (
    <div className="px-16">
      <ToastContainer />
      <div className="flex">
        <section className="w-[65%]">
          <div className="flex flex-wrap gap-x-20 gap-y-16 pt-16 pb-20">
            {currentBlogs.map((blog, index) => (
              <div
                key={index}
                className="card w-96 h-[500x] bg-white shadow-xl rounded-md hover:cursor-pointer"
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
                      <div className="flex">
                        <span className="flex flex-col space-y-1">
                          <span className="font-semibold text-sm text-customGray">
                            {formatDate(blog.created_at)}
                          </span>
                          <div className="pt-1">
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
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-[220px]">
                      <button
                        className="btn text-lg hover:bg-red-700 bg-white border-2 hover:border-white hover:text-white border-red-700 text-red-700 font-semibold"
                        onClick={() => openDeleteModal(blog.blog_id)}
                      >
                        <FaTrashCan /> Delete
                      </button>
                      <button
                        className="btn text-lg hover:bg-blue-600 hover:border-white hover:text-white bg-white border-2 border-blue-600 text-blue-600 font-semibold"
                        onClick={() => handleEdit(blog.blog_id)}
                      >
                        <MdEdit /> Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex w-[100%] justify-center">
            <Pagination
              totalBlogs={blogs.length}
              blogsPerPage={blogsPerPage}
              currentPage={currentPage}
              paginate={paginate}
            />
          </div>
        </section>
        <section className="w-[35%]">
          <div className="flex justify-end">
            <div className="shadow-xl rounded-lg bg-lightPink w-[400px] mt-16 mb-28 p-4">
              <p className="text-center text-4xl text-mediumPurple font-semibold">
                Manage Your Posts
              </p>
              <img
                src={images.myBlogs}
                alt="Rating"
                className="w-full h-auto"
              />
              <p className="mt-4 text-lg text-customGray">
                Easily manage your blog posts from this page. Whether you want
                to update an existing post with new information, fine-tune your
                writing, or delete a post, you have full control. Keep your
                content fresh and relevant.
              </p>
            </div>
          </div>
        </section>
      </div>
      <dialog id="deleteBlogModal" className="modal">
        <div
          className="modal-box bg-white"
          style={{ width: "700px", maxWidth: "none" }}
        >
          <p className="text-black font-semibold text-3xl flex items-center justify-center mb-4">
            {" "}
            <IoIosWarning className="mr-2 text-red-600 text-3xl" /> Warning!
          </p>
          <h3 className="font-bold text-2xl text-black">
            Are you sure you want to delete this blog?
          </h3>
          <p className="py-4 text-xl text-customGray font-semibold">
            This change is irreversible.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleDelete}
              className="bg-red-600 w-[150px] text-white hover:bg-red-600 border-none font-semibold text-lg rounded-lg p-3"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="loading loading-spinner text-white"></span>
              ) : (
                "Yes, Delete"
              )}
            </button>

            <button
              onClick={() => document.getElementById("deleteBlogModal").close()}
              className="bg-neutral-600 text-white hover:bg-neutral-600 border-none font-semibold text-lg p-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MyBlogs;
