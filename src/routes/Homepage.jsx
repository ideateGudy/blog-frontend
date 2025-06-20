import { Link } from "react-router";
import MainCategories from "../components/MainCategories";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";

const Homepage = () => {
  return (
    <div className="mt-4 flex flex-col gap-4 ">
      {/* BREADCRUMB */}
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <span>{">"}</span>
        <span className="text-blue-800">Blog and Articles</span>
      </div>
      {/* INTRODUCTION */}
      <div className="flex items-center justify-between">
        {/* Titles  */}
        <div className="">
          <h1 className="text-grey-800 text-2xl md:text-5xl lg:text-6xl  font-bold">
            Lorem ipsum dolor sit amet consectetur elit. Laboriosam?
          </h1>
          <p className="mt-8 text-md md:text-xl">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto
            nobis corporis incidunt?
          </p>
        </div>
        {/* Animated button  */}
        <Link to="/write" className="hidden md:block relative">
          {/* //circle svg */}
          <svg
            viewBox="0 0 200 200"
            width="200"
            height="200"
            className="text-lg tracking-widest animate-spin animatedButton"
          >
            <path
              id="circlePath"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
              // fill="#4A90E2"
              fill="none"
              // stroke="#4A90E2"
              // strokeWidth="10"
            />
            <text>
              <textPath href="#circlePath" startOffset="0%">
                Write your story ▫
              </textPath>
              <textPath href="#circlePath" startOffset="50%">
                Share your idea ▫
              </textPath>
            </text>
          </svg>
          <button className="absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center ">
            {/* white stroke svg  */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-edit-2 text-white"
            >
              <line x1="6" y1="18" x2="18" y2="6"></line>
              <polyline points="9 6 18 6 18 15"></polyline>
            </svg>
          </button>
        </Link>
      </div>
      {/* CATEGORIES */}
      <MainCategories />
      {/* FEATURED POSTS */}
      <FeaturedPosts />
      {/* POSTS LIST */}
      <div className="">
        <div className="my-8 text-2xl text-gray-600">Recent Posts</div>
        <PostList />
      </div>
    </div>
  );
};

export default Homepage;
