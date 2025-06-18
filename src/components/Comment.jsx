import { useAuth, useUser } from "@clerk/clerk-react";
import Image from "./Image";
import { format } from "timeago.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const Comment = ({ comment, postId }) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  const queryClient = useQueryClient(); //refresh comments after adding a new comment

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error adding comment");
    },
  });

  const handleDelete = () => {
    //confirm delete
    if (window.confirm("Are you sure you want to delete this comment?")) {
      return mutation.mutate();
    }
  };
  return (
    <div className="p-4 bg-slate-50 rounded-xl mb-8">
      <div className="flex items-center gap-4">
        <Image
          src={comment.user.img}
          className="w-10 h-10 rounded-full object-cover"
          w="40"
        />
        <span className="font-medium">{comment.user.username}</span>
        <span className="text-sm text-gray-500">
          {format(comment.createdAt)}
        </span>
        {user &&
          (comment.user.username === user.username || role === "admin") && (
            <span
              className="text-red-300 hover:text-red-500 text-xs ml-auto cursor-pointer"
              onClick={handleDelete}
            >
              Delete
              {mutation.isPending && (
                <span className="text-xs text-gray-500 ml-2">Deleting...</span>
              )}
            </span>
          )}
      </div>
      <div className="mt-4">
        <p className="text-gray-600">{comment.desc}</p>
      </div>
    </div>
  );
};

export default Comment;
