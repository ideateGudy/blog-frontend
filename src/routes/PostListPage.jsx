import { useState } from "react";
import PostList from "../components/PostList";
import SideMenu from "../components/SideMenu";
import { useSearchParams } from "react-router";

const PostListPage = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  const [searchParams, setSearchParams] = useSearchParams();
  let category;

  if (searchParams.size !== 0 && searchParams.has("cat")) {
    category = searchParams.get("cat").replace(/^\w/, (c) => c.toUpperCase());
  }

  return (
    <div className="">
      <h1 className="mb-8 text-2xl">
        {category ? `${category} Blog Posts` : "All Blog Posts"}
      </h1>
      <button
        onClick={toggleMenu}
        className="bg-blue-800 text-white text-sm px-4 py-2 rounded-2xl mb-4 md:hidden cursor-pointer"
      >
        {open ? "Close" : "Filter or Search"}
      </button>
      <div className="flex flex-col-reverse md:flex-row gap-8">
        <div className="w-9/12">
          <PostList />
        </div>
        <div className={`${open ? "block" : "hidden"} md:block w-3/10`}>
          <SideMenu />
        </div>
      </div>
    </div>
  );
};

export default PostListPage;
