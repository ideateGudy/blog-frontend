import { useState } from "react";
import Image from "./Image";
import { Link } from "react-router";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
// import { useEffect } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  // const { getToken } = useAuth();

  // useEffect(() => {
  //   getToken()
  //     .then((token) => {
  //       if (token) {
  //         console.log("User is authenticated, token:", token);
  //       } else {
  //         console.log("User is not authenticated");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching token:", error);
  //     });
  // }, [getToken]);

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between overflow-hidden">
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
        <Image src="/logo.png" alt="Logo" w={32} h={32} />
        <span>lamalog</span>
      </Link>
      {/* MOBILE MENU  */}
      <div className="md:hidden">
        {/* MOBILE BUTTON  */}
        <div
          className="cursor-pointer text-4xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "X" : "⩸"}
        </div>
        {/* MOBILE LINK LIST  */}
        <div
          className={`w-full h-screen flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 bg-[#e6e6ff] z-20 transition-all ease-in-out duration-300 ${
            open ? "-right-0" : "-right-full"
          }`}
        >
          <Link to="/" className="">
            Home
          </Link>
          <Link to="/" className="">
            About
          </Link>
          <Link to="/posts?sort=popular" className="">
            Most Popular
          </Link>
          <Link to="/posts?sort=trending" className="">
            Trending
          </Link>
          <Link to="/login" className="">
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white cursor-pointer">
              Login 👋
            </button>
          </Link>
        </div>
      </div>
      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
        <Link to="/" className="">
          Home
        </Link>
        <Link to="/" className="">
          About
        </Link>
        <Link to="/posts?sort=popular" className="">
          Most Popular
        </Link>
        <Link to="/posts?sort=trending" className="">
          Trending
        </Link>
        <SignedOut>
          <Link to="/login" className="">
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white cursor-pointer">
              Login 👋
            </button>
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
