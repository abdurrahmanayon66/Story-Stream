import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CommentSection from "../components/CommentSection";
import Rating from "../components/Rating";
import { getUserIdFromToken, isTokenValid } from "../assets/tokenUtils";

const ViewBlog = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState();
  const descriptionLength = 40;
  const navigate = useNavigate();
  const userId = getUserIdFromToken();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/getAllBlogs")
      .then((response) => {
        setBlogs(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    setIsLoading(true);
    if (isTokenValid()) {
    axios
      .get(`http://localhost:8000/api/getBlog/${blogId}`)
      .then((response) => {
        setBlog(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
    }else{
      setIsLoading(false);
      navigate("/login")
    }
  }, [blogId]);

  const formatContent = (content) => {
    return content ? content.replace(/\n/g, "<br />") : "";
  };

  const handleCardClick = (blogId) => {
    navigate(`/viewBlog/${blogId}`);
  };

  if (isLoading) {
    return <div className="h-screen w-[100%] flex justify-center items-center">
    <span className="loading loading-spinner w-[10%] text-purple-400"></span>
  </div>;
  } else if (!isLoading && blog) {
    return (
      <div className="px-16">
        <div className="flex py-16">
          <section className="w-[60%]">
            <div className="mb-20 flex flex-col space-y-6">
              <img
                className="max-h-[400px] max-w-[600px] rounded-lg"
                src={`data:image/jpeg;base64,${blog.blog_image}`}
                alt="Blog"
              />
              <div>
                <span className="bg-purple-200 text-lg uppercase text-mediumPurple text-semibold p-2 rounded-lg">
                  {blog.genre}
                </span>
              </div>
              <p className="text-2xl text-mediumPurple font-bold">
                {blog.title}
              </p>
              <p
                className="text-lg text-customGray"
                dangerouslySetInnerHTML={{
                  __html: formatContent(blog.content),
                }}
              />
            </div>
            <CommentSection blogId={blog.blog_id} />
          </section>

          {/* Right section starts here */}

          <section className="w-[40%] pl-16 pb-12 flex flex-col items-end">
            <div className="rounded-lg px-8 pb-10 shadow-xl shadow-slate-300 w-[450px] max-h-[900px]">
              <p className="text-2xl mb-4 font-semibold text-black">
                Latest Articles
              </p>
              {blogs &&
                blogs.slice(0, 6).map(
                  (latestBlog, index) =>
                    latestBlog.blog_id !== blog.blog_id && (
                      <div
                        className="flex my-10 h-[100px] hover:cursor-pointer"
                        key={latestBlog.blog_id}
                        onClick={() => handleCardClick(latestBlog.blog_id)}
                      >
                        <img
                          className="max-h-[100px] rounded-xl"
                          src={`data:image/jpeg;base64,${latestBlog.blog_image}`}
                          alt="Blog"
                        />
                        <section className="h-[100%] pl-6 flex flex-col gap-y-1">
                          <p className="text-lg text-black font-semibold">
                            {latestBlog.title.slice(0, descriptionLength)}...
                          </p>
                          <p className="text-lg font-semibold text-slate-400">
                            {formatDate(latestBlog.created_at)}
                          </p>
                        </section>
                      </div>
                    )
                )}
            </div>

            <div className="mt-10">
              <Rating blogId={blog.blog_id} userId={userId} />
            </div>
          </section>

          {/* Right section ends here */}
        </div>
      </div>
    );
  }
};

export default ViewBlog;
