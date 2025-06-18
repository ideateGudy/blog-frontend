import { useAuth, useUser } from "@clerk/clerk-react";

import { useEffect, useRef, useState } from "react";
import Editor from "../components/QuillEditor";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Upload from "../components/Upload";

const Write = () => {
  const [progress, setProgress] = useState(0);
  const [cover, setCover] = useState(null);
  const [video, setVideo] = useState(null);
  const [content, setContent] = useState("");
  const [img, setImg] = useState(null);
  const quillRef = useRef();

  useEffect(() => {
    if (img && quillRef.current) {
      const quill = quillRef.current?.getEditor?.() || quillRef.current;
      if (!quill || !img) return;

      const range = quill.getSelection(true); // true to normalize range
      const index = range ? range.index : quill.getLength(); // Insert at cursor or end

      quill.insertEmbed(index, "image", img);
      quill.setSelection(index + 1); // Move cursor after image
    }
  }, [img]);

  useEffect(() => {
    if (video && quillRef.current) {
      const quill = quillRef.current?.getEditor?.() || quillRef.current;
      if (!quill || !video) return;

      const range = quill.getSelection(true); // true to normalize range
      const index = range ? range.index : quill.getLength(); // Insert at cursor or end

      quill.insertEmbed(index, "video", video);
      quill.setSelection(index + 1); // Move cursor after video
    }
  }, [video]);

  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      toast.success("Post created successfully!");
      navigate(`/${res.data.slug}`);
    },
  });
  if (!isLoaded) {
    return <div className="">Loading...</div>;
  }
  if (isLoaded && !isSignedIn) {
    return <div className="">Please sign in to write a post.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      coverImg: cover || "https://ik.imagekit.io/ideategudy/no-image.jpg",
      title: formData.get("title"),
      desc: formData.get("desc"),
      category: formData.get("category"),
      content,
    };

    mutation.mutate(data);
  };

  return (
    <div className="md:h-[calc(100vh-80px)] h-[calc(100vh-64px)] flex flex-col gap-6">
      <h1 className="text-xl font-light">Create a New Post</h1>
      <form
        onSubmit={handleSubmit}
        action=""
        className="flex flex-col gap-6 flex-1 mb-6"
      >
        {progress > 0 && (
          <div
            className={`w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 ${
              progress === 100 && "hidden"
            } `}
          >
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        <Upload setProgress={setProgress} type="image" setData={setCover}>
          <button
            onClick={(e) => {
              e.preventDefault();
            }}
            disabled={progress > 0 && progress < 100}
            className="w-max p-2 shadow-md rounded-2xl text-sm bg-white cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add a cover image
          </button>
        </Upload>
        {cover && (
          <p className="w-full">
            <img
              src={cover}
              alt="Cover"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </p>
        )}
        <input
          type="text"
          placeholder="My Awesome Story"
          name="title"
          className="text-4xl bg-transparent outline-none font-semibold "
        />
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm">
            Choose a category:
          </label>
          <select
            name="category"
            id=""
            className="bg-white rounded-2xl p-2 shadow-md"
          >
            <option value="general">General</option>
            <option value="web-design">Web Design</option>
            <option value="development">Development</option>
            <option value="databases">Databases</option>
            <option value="seo">Search Engines</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
        <textarea
          name="desc"
          placeholder="A Short Description"
          className="bg-white rounded-2xl p-4 shadow-md"
        ></textarea>
        <div className="flex">
          <div className="flex flex-col gap-2 mr-2 mt-4">
            <Upload setProgress={setProgress} type="image" setData={setImg}>
              <span className="cursor-pointer">🖼</span>
            </Upload>
            <Upload setProgress={setProgress} type="video" setData={setVideo}>
              <span className="cursor-pointer">▶</span>
            </Upload>
          </div>
          <Editor
            ref={quillRef}
            readOnly={progress > 0 && progress < 100}
            onTextChange={() => {
              const html = quillRef.current.root.innerHTML;
              setContent(html);
            }}
          />
        </div>
        <button
          disabled={mutation.isPending || (progress > 0 && progress < 100)}
          className="w-36 p-2 mb-3 shadow-md rounded-2xl text-sm bg-blue-800 text-white font-medium cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Loading..." : "Send"}
        </button>
        {mutation.isError && <span>{mutation.error.message}</span>}
      </form>
    </div>
  );
};

export default Write;
