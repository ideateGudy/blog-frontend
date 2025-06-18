import { Link } from "react-router";
import Image from "./Image";
import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  return (
    <div className="flex flex-col xl:flex-row gap-8 mb-12">
      {/* Image  */}
      {post.coverImg && (
        <div className=" md:hidden xl:block xl:w-1/3 ">
          <Image
            src={post.coverImg}
            className="rounded-2xl object-cover"
            w="735"
          />
        </div>
      )}
      {/* Details  */}
      <div className="flex flex-col gap-4 xl:w-2/3">
        <Link to={`/${post.slug}`} className="text-4xl font-semibold">
          {post.title}
        </Link>
        <div className="flex items-center text-gray-400 text-sm gap-2 ">
          <span>Written by </span>
          <Link
            to={`/posts?author=${post.user?.username}`}
            className="text-blue-800 "
          >
            {post.user?.username}
          </Link>
          <span>on</span>
          <Link to="/test" className="text-blue-800 ">
            {post.category}
          </Link>
          <span>{format(post.createdAt)}</span>
        </div>
        <p>{post.desc}</p>
        <Link to={`/${post.slug}`} className="text-blue-800 underline text-sm">
          Read more...
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;
