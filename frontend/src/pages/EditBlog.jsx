import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img from "./59563728_9318694.jpg";

const EditBlog = () => {
  const { blogId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imagePreview, setImagePreview] = useState(img);
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [isTitleChanged, setIsTitleChanged] = useState(false);
  const [isGenreChanged, setIsGenreChanged] = useState(false);
  const [isContentChanged, setIsContentChanged] = useState(false);
  const [isFileChanged, setIsFileChanged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = sessionStorage.getItem("jwtToken");
        if (!token || !jwtDecode(token).sub) {
          // Handle invalid token or missing user ID
          console.error("Invalid token or missing user ID");
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/getBlog/${blogId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include authorization header
            },
          }
        );
        const blogData = response.data.data;
        setTitle(blogData.title);
        setGenre(blogData.genre);
        setContent(blogData.content);

        // Set the image preview to the base64 image if it exists
        if (blogData.blog_image) {
          setImagePreview(`data:image/jpeg;base64,${blogData.blog_image}`);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [blogId]);

  const clearForm = () => {
    setTitle("");
    setGenre("");
    setContent("");
    setFile(null);
  };

  // Update state change flags in respective handlers
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setIsTitleChanged(true);
  };

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
    setIsGenreChanged(true);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setIsContentChanged(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setIsFileChanged(true);
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImagePreview(imageURL);
    } else {
      setImagePreview(img);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const token = sessionStorage.getItem("jwtToken");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.sub;

    const formData = new FormData();
    if (isTitleChanged) formData.append("title", title);
    if (isGenreChanged) formData.append("genre", genre);
    if (isContentChanged) formData.append("content", content);
    if (isFileChanged && file) formData.append("image", file);

    formData.append("author_id", userId);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/updateBlog/${blogId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Include authorization header
          },
        }
      );
      toast.success("Post updated successfully");
      setTimeout(() => {
        setIsProcessing(false);
        clearForm();
        navigate("/myBlogs");
      }, 3000);
    } catch (error) {
      toast.error("Error updating post:", error);
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-[100%] flex justify-center items-center">
        <span className="loading loading-spinner w-[10%] text-purple-400"></span>
      </div>
    );
  }

  return (
    <div className="px-16">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="py-16">
          <div className="flex justify-between pr-28">
            <p className="text-4xl font-semibold text-darkPurple">
              Create Post
            </p>
            <button
              className="px-3 text-white font-semibold rounded-md bg-purple-400"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="loading loading-spinner text-white"></span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
          <div className="my-6 rounded-lg flex">
            <section className="w-1/2 bg-purple-400 bg-opacity-30 backdrop-blur-md p-6 space-y-6">
              <label className="form-control w-full">
                <div className="label">
                  <span className="text-darkPurple font-semibold text-xl">
                    What is the title of your work?
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered bg-white text-lg text-black placeholder:text-customGray"
                  value={title}
                  onChange={handleTitleChange}
                  required
                />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="text-darkPurple font-semibold text-xl">
                    Select the genre
                  </span>
                </div>
                <select
                  className="select w-full max-w-xs bg-white text-lg text-black placeholder:text-customGray"
                  value={genre}
                  onChange={handleGenreChange}
                  required
                >
                  <option disabled selected>
                    Select
                  </option>
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
                  <span className="label-text text-darkPurple font-semibold text-xl">
                    Enter Your Content
                  </span>
                </div>
                <textarea
                  className="textarea textarea-bordered h-48 bg-white text-lg text-black placeholder:text-customGray"
                  placeholder="Type here..."
                  value={content}
                  required
                  onChange={handleContentChange}
                ></textarea>
              </label>
            </section>
            <section className="w-[40%] bg-purple-400 bg-opacity-30 backdrop-blur-md p-6 space-y-6 ml-8 rounded-lg">
              <p className="text-darkPurple font-semibold text-xl">
                Featured Image
              </p>
              <div>
                <img
                  className="h-[300px] rounded-md"
                  src={imagePreview}
                  alt="Selected"
                />
              </div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-darkPurple font-semibold text-xl">
                    Pick an image
                  </span>
                </div>
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-ghost w-full bg-white text-lg text-black placeholder:text-customGray"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </label>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
