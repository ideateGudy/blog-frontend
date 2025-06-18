import { Link, useSearchParams } from "react-router";
import Search from "./Search";

const SideMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const handleFilterChange = (event) => {
    if (searchParams.get("sort") !== event.target.id) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        sort: event.target.id,
      });
    }
  };

  const handleCategoryChange = (category) => () => {
    if (searchParams.get("cat") !== category) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        cat: category,
      });
    }
  };

  return (
    <div className="px-4 h-max sticky top-8">
      <h1 className="mb-4 font-medium text-small">Search</h1>
      <Search />
      <h1 className="mt-8 mb-4 font-medium text-small">Filter</h1>
      <div className="flex flex-col text-sm gap-2">
        <label
          htmlFor="newest"
          className="flex item-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            id="newest"
            className="appearance-none border-blue-800 border-[1.5px] w-4 h-4 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Newest
        </label>
        <label
          htmlFor="popular"
          className="flex item-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            id="popular"
            className="appearance-none border-blue-800 border-[1.5px] w-4 h-4 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Most Popular
        </label>
        <label
          htmlFor="trending"
          className="flex item-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            id="trending"
            className="appearance-none border-blue-800 border-[1.5px] w-4 h-4 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Trending
        </label>
        <label
          htmlFor="oldest"
          className="flex item-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            id="oldest"
            className="appearance-none border-blue-800 border-[1.5px] w-4 h-4 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Oldest
        </label>
      </div>
      <h1 className="mt-8 mb-4 font-medium text-small">Categories</h1>
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
    </div>
  );
};

export default SideMenu;
