import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import Image from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Search from "../components/Search";
import Comments from "../components/Comments";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "timeago.js";
import SanitizedHtml from "../components/SanitizedHtml";
import { useUser } from "@clerk/clerk-react";

const fetchPost = async (slug) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts/${slug}`
  );
  return response.data;
};

const SinglePostPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { slug } = useParams();
  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (error) {
    return toast.error(error.message || "Error fetching post data");
  }

  if (!data) {
    return (
      <div className="text-blue-600 text-xl font-bold">Page not found!!</div>
    );
  }

  const handleCategoryChange = (category) => () => {
    if (searchParams.get("cat") !== category) {
      navigate(`/posts?cat=${category}`);
    }
  };

  return (
    <div className="flex flex-col gap-8 mb-12">
      {/* Detail  */}
      <div className="flex">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {data.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written by </span>
            {data.user?.username && (
              <Link
                to={`/posts?author=${data.user?.username}`}
                className="text-blue-800"
              >
                {data.user.username}
              </Link>
            )}
            <span> on </span>
            <Link
              to={`/posts?category=${data.category}`}
              className="text-blue-800"
            >
              {data.category}
            </Link>
            <span className="text-gray-500"> {format(data.createdAt)}</span>
          </div>
          <p className="text-gray-500 font-medium">{data.desc}</p>
        </div>
        {data.coverImg && (
          <div className="hidden lg:block w-2/5">
            <Image
              src={data.coverImg}
              className="rounded-2xl object-cover"
              w="600"
            />
          </div>
        )}
      </div>
      {/* Content  */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* Text  */}

        <SanitizedHtml content={data.content} />

        {/* Menu  */}
        <div className="px-4 h-max sticky top-8 w-3/12 max-md:w-5/10 max-sm:w-full">
          <h1 className="mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col gap-4">
            {data.user?.img && (
              <div className="flex items-center gap-8">
                <Image
                  src={data.user.img}
                  className="w-12 h-12 rounded-full object-cover"
                  w="48"
                  h="48"
                  alt="Author"
                />
                <Link
                  to={`/posts?author=${data.user?.username}`}
                  className="text-blue-800 font-semibold text-lg block mt-2"
                >
                  {data.user.username}
                </Link>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur.
            </p>
            <div className="flex gap-2">
              <Link>
                <Image src="facebook.svg" className="w-6 h-6" alt="Facebook" />
              </Link>
              <Link>
                <Image src="instagram.svg" className="w-6 h-6" alt="Twitter" />
              </Link>
            </div>
          </div>
          {user && <PostMenuActions post={data} />}
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col text-sm gap-2 mb-3">
            <span
              className="text-gray-700 underline cursor-pointer"
              onClick={handleCategoryChange("general")}
            >
              All Posts
            </span>
            <span
              className="underline text-gray-700 cursor-pointer"
              onClick={handleCategoryChange("web-design")}
            >
              Web Design
            </span>
            <span
              className="underline text-gray-700 cursor-pointer"
              onClick={handleCategoryChange("development")}
            >
              Development
            </span>
            <span
              className="underline text-gray-700 cursor-pointer"
              onClick={handleCategoryChange("databases")}
            >
              Database
            </span>
            <span
              className="underline text-gray-700 cursor-pointer"
              onClick={handleCategoryChange("seo")}
            >
              Search Engines
            </span>
            <span
              className="underline text-gray-700 cursor-pointer"
              onClick={handleCategoryChange("marketing")}
            >
              Marketing
            </span>
          </div>
          <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
          <Search />
        </div>
      </div>
      {/* Comments  */}
      <Comments postId={data._id} />
    </div>
  );
};

export default SinglePostPage;
