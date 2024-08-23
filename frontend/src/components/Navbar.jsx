import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserIdFromToken, isTokenValid } from "../assets/tokenUtils";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const userId = getUserIdFromToken();

  useEffect(() => {
    if (isTokenValid()) {
      axios
        .get(`http://localhost:8000/api/getUserById/${userId}`)
        .then((response) => {
          setUserData(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userId]); // Add token as a dependency to the effect

  const handleCardClick = (genre) => {
    navigate(`/blogs/${genre}`);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("jwtToken");
    setUserData(null); // Ensure userData is cleared
    navigate("/login");
  };

  const renderAuthLinks = () => (
    <>
      <li
        className={`p-2 rounded-lg hover:cursor-pointer ${
          location.pathname === "/createBlog" ? "bg-purple-200" : ""
        }`}
      >
        <Link className="hover:bg-purple-200 p-2 rounded-lg" to={"/createBlog"}>
          Create Blog
        </Link>
      </li>
      <li
        className={`p-2 rounded-lg hover:cursor-pointer ${
          location.pathname === "/myBlogs" ? "bg-purple-200" : ""
        }`}
      >
        <Link className="hover:bg-purple-200 p-2 rounded-lg" to={"/myBlogs"}>
          My Blogs
        </Link>
      </li>
    </>
  );

  const renderAuthButtons = () => (
    <div className="flex space-x-4">
      <Link to="/signup" className="bg-purple-400 w-[100px] p-3 rounded-lg text-xl text-white font-semibold text-center">
        Signup
      </Link>
      <Link to="/login" className="bg-purple-500 p-3 rounded-lg text-xl text-white font-semibold w-[100px] text-center">
        Login
      </Link>
    </div>
  );

  return (
    <div>
      <ToastContainer />
      <div className="navbar bg-lightPink flex justify-between h-20 px-16 text-darkPurple">
        <div className="navbar-start w-auto">
          <a className="text-4xl font-bold">StoryStream</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="text-xl font-semibold flex gap-x-4 mr-16 items-center">
            <li
              className={`p-2 hover:bg-purple-200 rounded-lg hover:cursor-pointer ${
                location.pathname === "/" ? "bg-purple-200" : ""
              }`}
            >
              <Link to={"/"}>Home</Link>
            </li>
            <li
              className={`p-2 rounded-lg hover:cursor-pointer ${
                location.pathname === "/blogs" ? "bg-purple-200" : ""
              }`}
            >
              <Link
                className="hover:bg-purple-200 p-2 rounded-lg"
                to={`/blogs/${"null"}`}
              >
                Blogs
              </Link>
            </li>
            <li
              className={`p-2 rounded-lg hover:cursor-pointer ${
                location.pathname === "/categories" ? "bg-purple-200" : ""
              }`}
            >
              <div className="dropdown dropdown-hover">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn m-1 bg-lightPink border-none text-darkPurple text-xl font-semibold shadow-none hover:bg-purple-200 p-2 rounded-lg hover:cursor-pointer"
                >
                  Categories
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-lightPink rounded-box w-[300px]"
                >
                  <li
                    className="text-darkPurple text-xl font-semibold hover:bg-purple-200 p-2 rounded-lg hover:cursor-pointer"
                    onClick={() => handleCardClick("Education")}
                  >
                    <a>Education</a>
                  </li>
                  <li
                    className="text-darkPurple text-xl font-semibold hover:bg-purple-200 p-2 rounded-lg hover:cursor-pointer"
                    onClick={() => handleCardClick("Business")}
                  >
                    <a>Business</a>
                  </li>
                  <li
                    className="text-darkPurple text-xl font-semibold hover:bg-purple-200 p-2 rounded-lg hover:cursor-pointer"
                    onClick={() => handleCardClick("Technology")}
                  >
                    <a>Technology</a>
                  </li>
                  <li
                    className="text-darkPurple text-xl font-semibold hover:bg-purple-200 p-2 rounded-lg hover:cursor-pointer"
                    onClick={() => handleCardClick("Health and Wellness")}
                  >
                    <a>Health & Wellness</a>
                  </li>
                  <li
                    className="text-darkPurple text-xl font-semibold hover:bg-purple-200 p-2 rounded-lg hover:cursor-pointer"
                    onClick={() => handleCardClick("Lifestyle")}
                  >
                    <a>Lifestyle</a>
                  </li>
                  <li
                    className="text-darkPurple text-xl font-semibold hover:bg-purple-200 p-2 rounded-lg hover:cursor-pointer"
                    onClick={() => handleCardClick("Marketing")}
                  >
                    <a>Marketing</a>
                  </li>
                  <li
                    className="text-darkPurple text-xl font-semibold hover:bg-purple-200 p-2 rounded-lg hover:cursor-pointer"
                    onClick={() => handleCardClick("Environment")}
                  >
                    <a>Environment</a>
                  </li>
                </ul>
              </div>
            </li>
            {userData && renderAuthLinks()}
          </ul>
        </div>
        {userData ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ring ring-purple-400 ring-offset-2">
                <img
                  alt="User Avatar"
                  src={`data:image/jpeg;base64,${userData.user_image}`}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl rounded-md w-52 space-y-2 bg-lightPink"
            >
              <li className="hover:bg-purple-200 hover:cursor-pointer rounded-md text-lg font-semibold pl-3 py-2">
                Profile
              </li>
              <li className="hover:bg-purple-200 hover:cursor-pointer rounded-md text-lg font-semibold pl-3 py-2" onClick={handleLogout}>
                Logout
              </li>
            </ul>
          </div>
        ) : (
          renderAuthButtons()
        )}
      </div>
    </div>
  );
};

export default Navbar;
