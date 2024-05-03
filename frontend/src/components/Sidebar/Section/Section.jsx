import React from "react";
import HomeIcon from "./Icons/HomeIcon";
import BrowseIcon from "./Icons/BrowseIcon";
import CourseIcon from "./Icons/CourseIcon";
import { useNavigate } from "react-router-dom";
import LogOutIcon from "./Icons/LogOut";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/user/userSlice";

export default function Section({ name, path, pathname }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let component;

  const isMatching = path ? path == pathname : false;

  const handleLogOut = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  switch (name) {
    case "Home":
      component = (
        <>
          <div
            className={`lg:hidden border border-gray-50 rounded-[4px] py-1 flex justify-center ${
              isMatching && "bg-purple-700"
            }`}
            onClick={() => navigate(`${path}`)}
          >
            <HomeIcon className={` ${isMatching && "text-white"}`}></HomeIcon>
          </div>
          <button
            className={`lg:flex gap-4 items-center hover:bg-purple-700 py-1 px-3 border border-gray-50 rounded-[4px] group hidden ${
              isMatching && "bg-purple-700"
            }`}
            onClick={() => navigate(`${path}`)}
          >
            <HomeIcon
              className={`group-hover:text-white ${isMatching && "text-white"}`}
            ></HomeIcon>
            <span
              className={`font-semibold group-hover:text-white ${
                isMatching && "text-white"
              }`}
            >
              {name}
            </span>
          </button>
        </>
      );
      break;
    case "My Courses":
      component = (
        <>
          <div
            className={`lg:hidden border border-gray-50 rounded-[4px] py-1 flex justify-center ${
              isMatching && "bg-purple-700"
            }`}
            onClick={() => navigate(`${path}`)}
          >
            <CourseIcon
              className={` ${isMatching && "text-white"}`}
            ></CourseIcon>
          </div>
          <button
            className={`lg:flex gap-4 items-center hover:bg-purple-700 py-1 px-3 border border-gray-50 rounded-[4px] group hidden ${
              isMatching && "bg-purple-700"
            }`}
            onClick={() => navigate(`${path}`)}
          >
            <CourseIcon
              className={`group-hover:text-white ${isMatching && "text-white"}`}
            ></CourseIcon>
            <span
              className={`font-semibold group-hover:text-white ${
                isMatching && "text-white"
              }`}
            >
              {name}
            </span>
          </button>
        </>
      );
      break;
    case "Browse Categories":
      component = (
        <>
          <div
            className={`lg:hidden border border-gray-50 rounded-[4px] py-1 flex justify-center ${
              isMatching && "bg-purple-700"
            }`}
            onClick={() => navigate(`${path}`)}
          >
            <BrowseIcon
              className={` ${isMatching && "text-white"}`}
            ></BrowseIcon>
          </div>
          <button
            className={`lg:flex gap-4 items-center hover:bg-purple-700 py-1 px-3 border border-gray-50 rounded-[4px] group hidden ${
              isMatching && "bg-purple-700"
            }`}
            onClick={() => navigate(`${path}`)}
          >
            <BrowseIcon
              className={`group-hover:text-white ${isMatching && "text-white"}`}
            ></BrowseIcon>
            <span
              className={`font-semibold group-hover:text-white ${
                isMatching && "text-white"
              }`}
            >
              {name}
            </span>
          </button>
        </>
      );
      break;
    case "LogOut":
      component = (
        <>
          <div
            className={`lg:hidden border border-gray-50 rounded-[4px] py-1 flex justify-center ${
              isMatching && "bg-purple-700"
            }`}
            onClick={handleLogOut}
          >
            <LogOutIcon
              className={` ${isMatching && "text-white"}`}
            ></LogOutIcon>
          </div>
          <button
            className={`lg:flex gap-4 items-center hover:bg-purple-700 py-1 px-3 border border-gray-50 rounded-[4px] group hidden ${
              isMatching && "bg-purple-700"
            }`}
            onClick={handleLogOut}
          >
            <LogOutIcon
              className={`group-hover:text-white ${isMatching && "text-white"}`}
            ></LogOutIcon>
            <span
              className={`font-semibold group-hover:text-white ${
                isMatching && "text-white"
              }`}
            >
              {name}
            </span>
          </button>
        </>
      );
      break;
  }
  return component;
}