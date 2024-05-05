import PendingIcon from "../../../utils/icons/PendingIcon";
import TickIcon from "../../../utils/icons/TickIcon";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CourseCard({ userData, course }) {
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  const handleCourseClick = (courseId) => {
    navigate(`/${courseId}`);
  };
  return (
    <div
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
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{course.title}</h3>
            {currentUser.role === "enduser" &&
              userData?.completed_courses
                ?.map((course) => course._id)
                .includes(course._id) && (
                <div className=" group relative">
                  <TickIcon className="text-green-700" />
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-700 text-white text-xs px-2 py-1 rounded mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Watched
                  </div>
                </div>
              )}
            {currentUser.role === "enduser" &&
              userData?.enrolled_courses
                ?.map((course) => course._id)
                .includes(course._id) && (
                <div className=" group relative">
                  <PendingIcon className="text-yellow-700" />
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-700 text-white text-xs px-2 py-1 rounded mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Pending
                  </div>
                </div>
              )}
          </div>
          <p className="line-clamp-3 text-sm">{course.description}</p>
        </div>
        <h3
          className={`text-sm ${
            course.instructor.name === currentUser.name
              ? "text-green-700"
              : "text-purple-700"
          }`}
        >
          {course.instructor.name === currentUser.name
            ? "me"
            : course.instructor.name}
        </h3>
        <div className="flex flex-wrap gap-2">
          {course.tags.map((tag) => (
            <button
              key={tag._id}
              className="inline-flex items-center rounded-[4px] border px-2.5 py-0.5 text-xs font-semibold bg-purple-700 text-white"
            >
              {tag.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
