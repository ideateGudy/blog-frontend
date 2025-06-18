import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import PostListItem from "./PostListItem";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router";

const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: {
      page: pageParam,
      limit: 10,
      ...searchParamsObj,
    },
  });
  return response.data;
};

const PostList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  if (status === "pending") return "Loading...";

  if (status === "error") return "An error has occurred: " + error.message;
  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <>
      {allPosts.length > 0 ? (
        hasNextPage ? (
          <InfiniteScroll
            dataLength={allPosts.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={
              isFetching ? (
                <h4>Loading more posts...</h4>
              ) : (
                <p className="text-center">
                  <b>All posts loaded!</b>
                </p>
              )
            }
            endMessage={
              <p>
                <b>All posts loaded!</b>
              </p>
            }
          >
            {allPosts.map((post) => (
              <PostListItem key={post._id} post={post} />
            ))}
          </InfiniteScroll>
        ) : (
          <>
            {allPosts.map((post) => (
              <PostListItem key={post._id} post={post} />
            ))}
            <p className="text-center my-4">
              <b>All posts loaded!</b>
            </p>
          </>
        )
      ) : (
        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold">No posts found</h2>
          <p className="text-gray-500">Try changing your search criteria.</p>
        </div>
      )}
    </>
  );
};

export default PostList;
