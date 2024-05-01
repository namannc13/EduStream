import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function MyCourses() {
  const [userData, setUserData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showAddCourse, setShowAddCourse] = useState();
  const [render, setRender] = useState(null);

  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [tags, setTags] = useState("");
  const [tagList, setTagList] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const res = await axios.get(
          `http://localhost:3000/user/get_user/${currentUser._id}`,
          {
            method: "GET",
            headers: headers,
          }
        );
        const data = res.data;
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, [render]);

  const completedCourses = userData.completed_courses;
  const ownedCourses = userData.owned_courses;
  const enrolledCourses = userData.enrolled_courses;
  const pendingCoursesEnduser = enrolledCourses
    ? enrolledCourses.filter((enrolledCourse) => {
        return !userData.completed_courses.some(
          (completedCourse) => completedCourse._id === enrolledCourse._id
        );
      })
    : [];
  const pendingCoursesInstructor = ownedCourses
    ? ownedCourses.filter((ownedCourse) => {
        return !userData.completed_courses.some(
          (completedCourse) => completedCourse._id === ownedCourse._id
        );
      })
    : [];

  const handleCourseClick = (courseId) => {
    navigate(`/${courseId}`);
  };

  const handleTagChange = (e) => {
    setTags(e.target.value);
  };

  const handleTagAdd = () => {
    if (tags.trim() !== "") {
      setTagList([...tagList, tags.trim()]);
      setTags("");
    }
  };

  const handleTagRemove = (tagIndex) => {
    setTagList(tagList.filter((tag, index) => index !== tagIndex));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: courseName,
      description: courseDescription,
      instructor: currentUser._id,
      tags: tagList,
    };
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      await axios.post("http://localhost:3000/course/create_course", data, {
        method: "POST",
        headers: headers,
      });
      setRender(!render);
    } catch (error) {
      console.log(error);
    }
    setCourseName("");
    setCourseDescription("");
    setTags("");
    setTagList([]);
  };
  console.log(courseName);
  console.log(courseDescription);
  console.log(tags);
  console.log(tagList);
  return (
    <div className="m-4 flex flex-col gap-4">
      <button
        onClick={() => setShowAddCourse(!showAddCourse)}
        className="border px-2 py-2 hover:bg-gray-300 rounded-md"
      >
        Add a Course
      </button>
      {showAddCourse && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="courseName">Course Name:</label>
            <input
              type="text"
              id="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
              className="bg-slate-300 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="courseDescription">Course Description:</label>
            <textarea
              id="courseDescription"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              required
              className="bg-slate-300 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="tags">Tags:</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={handleTagChange}
              placeholder="Enter tags separated by comma"
              className="bg-slate-300 border rounded-md"
            />
            <button type="button" onClick={handleTagAdd}>
              Add Tag
            </button>
          </div>
          {tagList.length > 0 && (
            <div>
              <p>Selected Tags:</p>
              <ul>
                {tagList.map((tag, index) => (
                  <li key={index}>
                    {tag}{" "}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button type="submit">Submit</button>
        </form>
      )}
      <h2 className="text-3xl font-semibold mx-4">Completed Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 items-start">
        {completedCourses &&
          completedCourses.map((course) => (
            <button
              key={course._id}
              onClick={() => handleCourseClick(course._id)}
              className="cursor-pointer flex flex-col m-4 gap-2 "
            >
              <img
                src="/cutepfp.jpg"
                alt="course-display"
                className="object-cover rounded-md hover:opacity-90 h-full w-full"
              />

              <div className="flex flex-col gap-2">
                <div className="">
                  <h3 className="font-semibold text-lg text-left">
                    {course.title}
                  </h3>
                  <p className="line-clamp-3 text-sm text-left">
                    {course.description}
                  </p>
                </div>
                <h3 className="text-sm text-left">{currentUser.name}</h3>
              </div>
            </button>
          ))}
      </div>

      <h2 className="text-3xl font-semibold mx-4">Pending Courses</h2>
      {currentUser.role === "instructor" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 items-start">
          {pendingCoursesInstructor.map((course) => (
            <button
              key={course._id}
              onClick={() => handleCourseClick(course._id)}
              className="cursor-pointer flex flex-col m-4 gap-2 "
            >
              <img
                src="/cutepfp.jpg"
                alt="course-display"
                className="object-cover rounded-md hover:opacity-90 h-full w-full"
              />

              <div className="flex flex-col gap-2">
                <div className="">
                  <h3 className="font-semibold text-lg text-left">
                    {course.title}
                  </h3>
                  <p className="line-clamp-3 text-sm text-left">
                    {course.description}
                  </p>
                </div>
                <h3 className="text-sm text-left">{currentUser.name}</h3>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 items-start">
          {pendingCoursesEnduser.map((course) => (
            <button
              key={course._id}
              onClick={() => handleCourseClick(course._id)}
              className="cursor-pointer flex flex-col m-4 gap-2 "
            >
              <img
                src="/cutepfp.jpg"
                alt="course-display"
                className="object-cover rounded-md hover:opacity-90 h-full w-full"
              />

              <div className="flex flex-col gap-2">
                <div className="">
                  <h3 className="font-semibold text-lg text-left">
                    {course.title}
                  </h3>
                  <p className="line-clamp-3 text-sm text-left">{course.description}</p>
                </div>
                <h3 className="text-sm text-left">{currentUser.name}</h3>
              </div>
            </button>
          ))}
        </div>
      )}

      {currentUser.role === "instructor" ? (
        <>
          <h2 className="text-3xl font-semibold mx-4">Owned Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 items-start">
            {ownedCourses &&
              ownedCourses.map((course) => (
                <button
                  key={course._id}
                  onClick={() => handleCourseClick(course._id)}
                  className="cursor-pointer flex flex-col m-4 gap-2 "
                >
                  <img
                    src="/cutepfp.jpg"
                    alt="course-display"
                    className="object-cover rounded-md hover:opacity-90 h-full w-full"
                  />

                  <div className="flex flex-col gap-2">
                    <div className="">
                      <h3 className="font-semibold text-lg text-left">
                        {course.title}
                      </h3>
                      <p className="line-clamp-3 text-sm text-left">
                        {course.description}
                      </p>
                    </div>
                    <h3 className="text-sm text-left">{currentUser.name}</h3>
                  </div>
                </button>
              ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-semibold mx-4">Enrolled Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 items-start">
            {enrolledCourses.map((course) => (
              <button
                key={course._id}
                onClick={() => handleCourseClick(course._id)}
                className="cursor-pointer flex flex-col m-4 gap-2 "
              >
                <img
                  src="/cutepfp.jpg"
                  alt="course-display"
                  className="object-cover rounded-md hover:opacity-90 h-full w-full"
                />

                <div className="flex flex-col gap-2">
                  <div className="">
                    <h3 className="font-semibold text-lg text-left">
                      {course.title}
                    </h3>
                    <p className="line-clamp-3 text-sm text-left">{course.description}</p>
                  </div>
                  <h3 className="text-sm text-left">{currentUser.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
