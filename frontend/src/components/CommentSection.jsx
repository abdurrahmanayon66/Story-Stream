import React, { useState, useEffect, useRef } from "react";
import { FiMessageSquare } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosWarning } from "react-icons/io";
import { getUserIdFromToken, isTokenValid } from "../assets/tokenUtils";
import { IoSend } from "react-icons/io5";

const CommentSection = ({ blogId }) => {
  const [comment, setComment] = useState("");
  const [fetchedComment, setFetchedComment] = useState();
  const userId = getUserIdFromToken();
  const [comments, setComments] = useState([]);
  const [reply, setReply] = useState();
  const [parentCommentId, setParentCommentId] = useState();
  const modalRef = useRef(null);
  const [commentId, setCommentId] = useState();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to fetch comments
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/getComments/${blogId}`
      );
      setComments(response.data.data);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  useEffect(() => {
    if (isTokenValid()) {
      // Fetch comments only if the user ID and blog ID are available
      if (userId && blogId) {
        fetchComments();
      }
    } else {
      console.error("No token found");
    }
  }, [userId, blogId]); // Add userId and blogId as dependencies

  const postComment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (isTokenValid()) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/postComment",
          {
            user_id: userId,
            content: comment,
            blog_id: blogId,
          }
        );
        toast.success("Your comment has been posted.");
        setComment("");
        fetchComments();
        setIsProcessing(false);
      } catch (error) {
        console.error("Error posting comment", error);
        toast.error("Error posting comment");
        setIsProcessing(false);
      }
    } else {
      navigate("/login");
    }
  };

  const postReply = async (e) => {
    e.preventDefault();
    setIsProcessing(true); // Start processing
  
    if (isTokenValid()) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/postComment",
          {
            user_id: userId,
            content: reply,
            blog_id: blogId,
            parent_comment_id: parentCommentId,
          }
        );
        toast.success("Your reply has been posted.");
        setReply("");
        modalRef.current.close();
        fetchComments();
      } catch (error) {
        console.error("Error posting comment", error);
        toast.error("Error posting comment");
      } finally {
        setIsProcessing(false); // Ensure to set isProcessing to false after operation completes
      }
    } else {
      console.error("No token found");
      setIsProcessing(false); // Set isProcessing to false if token is not valid
      navigate("/login");
    }
  };
  

  // Calculate the count of comments with null parent_comment_id
  const parentCommentsCount = comments.filter(
    (comment) => comment.parent_comment_id === null
  ).length;

  const formatDate = (timestamp) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(timestamp);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // 12-hour format
    const formattedTime = `${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}${ampm}`;

    return `${day} ${months[monthIndex]}, ${year} ${formattedTime}`;
  };

  const openDeleteModal = (commentId) => {
    setCommentId(commentId);
    document.getElementById("deleteCommentModal").showModal();
  };

  const openEditModal = async (comment) => {
    setFetchedComment(comment.content);
    setCommentId(comment.comment_id);
    document.getElementById("editCommentModal").showModal();
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    if (isTokenValid()) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/api/deleteComment/${commentId}`
        );
        document.getElementById("deleteCommentModal").close();
        toast.success("Comment deleted successfully");
        setTimeout(() => {
          setIsProcessing(false);
          fetchComments();
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

  const handleEdit = async () => {
    setIsProcessing(true);
    if (isTokenValid()) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/updateComment",
          {
            comment_id: commentId,
            content: fetchedComment,
          }
        );
        if (response.status === 200) {
          setIsProcessing(false);
          document.getElementById("editCommentModal").close();
          toast.success("Comment updated successfully");
          setFetchedComment("");
          setCommentId(null);
          fetchComments();
        } else {
          toast.error("Failed to update comment");
        }
      } catch (error) {
        toast.error("Failed to update comment"); // Ensure error message is displayed
        console.error(error); // Log the error for debugging
      } finally {
        setIsProcessing(false);
      }
    } else {
      navigate("/login");
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <form onSubmit={postComment}>
        <textarea
          className="textarea w-full bg-white h-[150px] border-2 text-lg text-black placeholder:text-customGray border-purple-400"
          placeholder="Leave your comment here..."
          value={comment}
          required
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-4">
          <button
            className="bg-purple-400 p-2 rounded-lg text-white font-semibold text-xl flex items-center justify-center gap-x-3 px-5"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <span className="loading loading-spinner mr-2"></span>
                Posting...
              </span>
            ) : (
              <>
                Post
                <IoSend className="mt-1" />
              </>
            )}
          </button>
        </div>
      </form>
      <div className="comments-section mt-4 mb-16">
        <p className="text-black font-semibold text-xl mb-6">
          All Comments ({comments.length})
        </p>
        {comments
          .filter((comment) => comment.parent_comment_id === null)
          .map((comment) => (
            <div
              className="comment mb-8 rounded-md bg-gray-100"
              key={comment.comment_id}
            >
              {/* Render parent comment */}
              <div className="flex py-4 px-6">
                {/* Avatar */}
                <div className="mr-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img
                        src={`data:image/jpeg;base64,${comment.image}`}
                        alt="Blog"
                      />
                    </div>
                  </div>
                </div>
                {/* Comment details */}
                <div className="flex flex-col">
                  <p className="text-black font-semibold text-sm">
                    {comment.name}
                  </p>
                  <p className="text-slate-400 text-[10px] mt-1 font-semibold mb-3">
                    {formatDate(comment.created_at)}
                  </p>
                  <p className="text-black pr-4">{comment.content}</p>
                  {/* Actions */}
                  <div className="flex gap-x-16 my-4">
                    {/* Render Edit and Delete buttons only if userId matches comment's user_id */}
                    {userId == comment.user_id && (
                      <>
                        <button
                          className="flex items-center text-slate-500 font-semibold"
                          onClick={() => openEditModal(comment)}
                        >
                          <MdEdit className="text-lg mr-1 mt-1" /> Edit
                        </button>

                        <button
                          className="flex items-center text-slate-500 font-semibold"
                          onClick={() => openDeleteModal(comment.comment_id)}
                        >
                          <FaRegTrashCan className="text-lg mr-1" /> Delete
                        </button>
                      </>
                    )}
                    <button
                      className="flex items-center text-slate-500 font-semibold"
                      onClick={() => {
                        setParentCommentId(comment.comment_id);
                        document.getElementById("my_modal_2").showModal();
                      }}
                    >
                      <FiMessageSquare className="text-lg mr-1 mt-1" /> Reply
                    </button>
                  </div>
                </div>
              </div>
              {/* Render replies */}
              {comments
                .filter(
                  (reply) => reply.parent_comment_id === comment.comment_id
                )
                .map((reply) => (
                  <div className="reply flex py-1 pl-20" key={reply.id}>
                    {/* Avatar */}
                    <div className="mr-3">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={`data:image/jpeg;base64,${reply.image}`}
                            alt="Blog"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Reply details */}
                    <div className="flex flex-col mb-5">
                      <p className="text-black font-semibold text-sm">
                        {reply.name}
                      </p>
                      <p className="text-slate-400 text-[10px] mt-1 font-semibold mb-3">
                        {formatDate(reply.created_at)}
                      </p>
                      <p className="text-black pr-4">{reply.content}</p>
                      {/* Actions (replies may have their own actions) */}
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>

      <div>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <dialog id="my_modal_2" className="modal" ref={modalRef}>
          <div className="modal-box w-11/12 max-w-5xl bg-white">
            <form onSubmit={postReply}>
              <textarea
                className="textarea w-full bg-white h-[150px] border-2 text-lg text-black placeholder:text-customGray border-purple-400"
                placeholder="Leave your reply to this comment here..."
                value={reply}
                required
                onChange={(e) => setReply(e.target.value)}
              ></textarea>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-purple-400 p-2 rounded-lg text-white font-semibold text-xl flex items-center justify-center gap-x-3 px-5"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center">
                      <span className="loading loading-spinner mr-2"></span>
                      Posting...
                    </span>
                  ) : (
                    <>
                      Post
                      <IoSend className="mt-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
      <dialog id="deleteCommentModal" className="modal">
        <div
          className="modal-box bg-white"
          style={{ width: "700px", maxWidth: "none" }}
        >
          <p className="text-black font-semibold text-3xl flex items-center justify-center mb-4">
            {" "}
            <IoIosWarning className="mr-2 text-red-600 text-3xl" /> Warning!
          </p>
          <h3 className="font-bold text-2xl text-black">
            Are you sure you want to delete this comment?
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
              onClick={() =>
                document.getElementById("deleteCommentModal").close()
              }
              className="bg-neutral-600 text-white hover:bg-neutral-600 border-none font-semibold text-lg p-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
        <dialog id="editCommentModal" className="modal">
          <div
            className="modal-box bg-white"
            style={{ width: "700px", maxWidth: "none" }}
          >
            <textarea
              className="textarea w-full bg-white h-[150px] border-1 text-lg mb-5 text-black placeholder:text-slate-500 border-2 border-lightPurple"
              value={fetchedComment}
              required
              onChange={(e) => setFetchedComment(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleEdit}
                className="bg-purple-400 w-[150px] text-white hover:bg-purple-400 border-none font-semibold text-lg rounded-lg p-3"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="loading loading-spinner text-white"></span>
                ) : (
                  "Update"
                )}
              </button>

              <button
                onClick={() =>
                  document.getElementById("editCommentModal").close()
                }
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

export default CommentSection;
