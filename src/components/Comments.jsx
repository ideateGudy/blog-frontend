import axios from "axios";
import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

const fetchComments = async (postId) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/comments/${postId}`
  );
  return response.data;
};

const Comments = ({ postId }) => {
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user, isSignedIn } = useUser();

  const { isPending, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const queryClient = useQueryClient(); //refresh comments after adding a new comment

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${postId}`,
        newComment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment added successfully!");
    },
    onError: (error) => {
      navigate("/login");
      toast.error(error.response?.data?.message || "Error adding comment");
    },
  });

  if (error) {
    return toast.error(error.message || "Error fetching post comments");
  }

  // if (!data) {
  //   return toast.error("No post comments found");
  // }

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newComment = {
      postId,
      content: formData.get("content"),
    };
    mutation.mutate(newComment);
  };

  return (
    <div className="flex flex-col gap-8 lg:w-3/5">
      <h1 className="text-xl text-gray-500 underline font-semibold">
        Comments ({data?.length || 0})
      </h1>
      {isSignedIn && (
        <form
          onSubmit={handleCommentSubmit}
          className="flex items-center justify-between gap-8 w-full"
        >
          <textarea
            name="content"
            placeholder="Write a comment..."
            className="w-full bg-white p-4 rounded-xl"
          />
          <button className="bg-blue-800 text-white px-4 py-3 font-medium rounded-xl">
            Send
          </button>
        </form>
      )}
      {isPending ? (
        "Loading comments..."
      ) : error ? (
        "Error loading comments"
      ) : (
        <>
          {mutation.isPending && (
            <Comment
              comment={{
                desc: `${mutation.variables.content}(Sending...)`,
                createdAt: new Date(),
                user: {
                  username: user.username,
                  img: user.imageUrl,
                },
              }}
            />
          )}

          {data.map((comment) => (
            <Comment key={comment._id} comment={comment} postId={postId} />
          ))}
        </>
      )}
      {data?.length === 0 && (
        <div className="text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
};

export default Comments;
