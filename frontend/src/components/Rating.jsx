import React, { useState } from "react";
import ratingImg from "./rating.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Rating = ({userId, blogId}) => {
  const [rating, setRating] = useState(0); // Initialize state with default value

  const postRating = async (e) => {
    e.preventDefault();
      try {
        const response = await axios.post(
          "http://localhost:8000/api/postRating",
          {
            user_id: userId,
            blog_id: blogId,
            rating: rating,
          }
        );
        toast.success("Thank You for your feedback.");
        setRating(1);
      } catch (error) {
        console.error("Error posting rating", error);
        toast.error("Error submitting rating");
      }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="shadow-xl rounded-lg w-[450px] mt-16 p-4">
        <p className="text-center text-2xl text-mediumPurple font-semibold">
          Rate this blog
        </p>
        <img src={ratingImg} alt="Rating" className="w-full h-auto" />
        <p className="mt-4 text-md text-gray-400">
          We highly value your feedback. Kindly take a moment to share your
          experience with the other readers.
        </p>
        <form onSubmit={postRating}>
          <input
            type="range"
            min={1}
            max={5}
            value={rating}
            required
            className="range  range-primary bg-purple-100 mt-6 mb-2"
            onChange={(e) => setRating(e.target.value)}
            style={{
              WebkitAppearance: "none",
              appearance: "none",
              outline: "none",
              opacity: "0.7",
              transition: "opacity .2s",
            }}
          />
          <div className="w-full flex justify-between text-md px-2 text-gray-400">
            <span>Worst</span>
            <span>Bad</span>
            <span>Average</span>
            <span>Good</span>
            <span>Best</span>
          </div>
          <div className="flex justify-center mb-3 mt-6"><button className="bg-purple-400 p-2 w-[100px] rounded-lg text-white">Submit</button></div>
        </form>
      </div>
    </div>
  );
};

export default Rating;
