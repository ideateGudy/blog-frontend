import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const PostMenuActions = ({ post }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const {
    isPending,
    error,
    data: savedPosts,
  } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      const token = await getToken();
      return axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  });

  const isAdmin = user?.publicMetadata?.role || false;
  const isSaved =
    savedPosts?.data?.some((savedPostId) => savedPostId === post._id) || false;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onSuccess: () => {
      toast.success("Post deleted successfully!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error deleting post");
    },
  });

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/save`,
        {
          postId: post._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success(isSaved ? "Post unsaved" : "Post saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error saving post");
    },
  });
  const isFeatured = post.isFeatured || false;

  const featureMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return await axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/feature`,
        {
          postId: post._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },

    onSuccess: () => {
      toast.success(
        isFeatured ? "Post unfeatured" : "Post featured successfully!"
      );
      queryClient.invalidateQueries({ queryKey: ["post", post.slug] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error saving post");
    },
  });

  const handleDeletePost = () => {
    if (!user) {
      return navigate("/login");
    }
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate();
    }
  };
  const handleSavePost = () => {
    if (!user) {
      return navigate("/login");
    }
    saveMutation.mutate();
  };
  const handleFeaturePost = () => {
    if (!user) {
      return navigate("/login");
    }
    featureMutation.mutate();
  };

  return (
    <div className="">
      <h1 className="mt-8 mb-4 text-sm font-medium">Actions</h1>
      {isPending ? (
        "Loading..."
      ) : error ? (
        "Saved posts fetch failed"
      ) : (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={handleSavePost}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={
              saveMutation.isPending
                ? isSaved
                  ? "none"
                  : "black"
                : isSaved
                ? "black"
                : "none"
            }
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            />
          </svg>

          <span>Save this post</span>
          {saveMutation.isPending && (
            <span className="text-gray-500 text-xs"> (Saving...)</span>
          )}
        </div>
      )}
      {isAdmin && (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={handleFeaturePost}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={
              featureMutation.isPending
                ? isFeatured
                  ? "none"
                  : "black"
                : isFeatured
                ? "black"
                : "none"
            }
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>

          <span className="">Feature</span>
          {featureMutation.isPending && (
            <span className="text-gray-500 text-xs"> (Updating...)</span>
          )}
        </div>
      )}
      {user && (post.user.username === user.username || isAdmin) && (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={handleDeletePost}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="red"
            className="size-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>

          <span>Delete this post</span>
          {deleteMutation.isPending && (
            <span className="text-gray-500 text-xs"> (Deleting...)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default PostMenuActions;
