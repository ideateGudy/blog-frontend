import axios from "axios";
import Image from "./Image";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { format } from "timeago.js";

const fetchPost = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts/?featured=true&limit=4&sort=newest`
  );
  return response.data;
};
const FeaturedPosts = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: () => fetchPost(),
  });
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (error) {
    return toast.error(error.message || "Error fetching post data");
  }
  const posts = data?.posts || [];
  if (!posts || posts.length === 0) {
    return;
  }

  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-8">
      {/* First Post  */}
      {posts[0] && (
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {/* Image  */}
          {posts[0].coverImg && (
            <Image
              src={posts[0].coverImg}
              className="rounded-3xl object-cover"
              w="895"
            />
          )}
          {/* Details  */}
          <div className="flex items-center gap-4">
            <h1 className="font-semibold lg:text-lg">01.</h1>
            <Link className="text-blue-800 lg:text-lg">
              {posts[0].category}
            </Link>
            <span className="text-gray-500 ">{format(posts[0].createdAt)}</span>
          </div>
          {/* Title  */}
          <Link
            to={`/${posts[0].slug}`}
            className="text-xl lg:text-3xl font-semibold lg:font-bold"
          >
            {posts[0].title}
          </Link>
        </div>
      )}
      {/* Others  */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {/* Second */}
        {posts[1] && (
          <div className="lg:h-1/3 flex justify-between gap-4">
            {posts[1].coverImg && (
              <div className="w-1/2 aspect-video">
                <Image
                  src={posts[1].coverImg}
                  className="rounded-3xl object-cover aspect-video w-full h-full"
                  w="298"
                />
              </div>
            )}
            {/* Details and Title  */}
            <div className="w-2/3">
              {/* Details  */}
              <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                <h1 className="font-semibold">02</h1>
                <Link className="text-blue-800">{posts[1].category}</Link>
                <span className="text-gray-500 text-sm">
                  {format(posts[1].createdAt)}
                </span>
              </div>
              {/* Title  */}
              <Link
                to={`/${posts[1].slug}`}
                className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-semibold "
              >
                {posts[1].title}
              </Link>
            </div>
          </div>
        )}
        {/* Third */}
        {posts[2] && (
          <div className="lg:h-1/3 flex justify-between gap-4">
            {posts[2].coverImg && (
              <div className="w-1/2 aspect-video">
                <Image
                  src={posts[2].coverImg}
                  className="rounded-3xl object-cover aspect-video w-full h-full"
                  w="298"
                />
              </div>
            )}
            {/* Details and Title  */}
            <div className="w-2/3">
              {/* Details  */}
              <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                <h1 className="font-semibold">03</h1>
                <Link className="text-blue-800">{posts[2].category}</Link>
                <span className="text-gray-500 text-sm">
                  {format(posts[2].createdAt)}
                </span>
              </div>
              {/* Title  */}
              <Link
                to={`/${posts[2].slug}`}
                className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-semibold "
              >
                {posts[2].title}
              </Link>
            </div>
          </div>
        )}
        {/* Fourth */}
        {posts[3] && (
          <div className="lg:h-1/3 flex justify-between gap-4">
            {posts[3].coverImg && (
              <div className="w-1/2 aspect-video">
                <Image
                  src={posts[3].coverImg}
                  className="rounded-3xl object-cover  aspect-video w-full h-full"
                  w="298"
                />
              </div>
            )}
            {/* Details and Title  */}
            <div className="w-2/3">
              {/* Details  */}
              <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                <h1 className="font-semibold">04</h1>
                <Link className="text-blue-800">{posts[3].category}</Link>
                <span className="text-gray-500 text-sm">
                  {format(posts[3].createdAt)}
                </span>
              </div>
              {/* Title  */}
              <Link
                to={`/${posts[3].slug}`}
                className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-semibold "
              >
                {posts[3].title}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedPosts;
