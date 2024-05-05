import React from "react";
import CourseCard from "./CourseCard/CouseCard";

export default function ManageCourses({
  courseData,
  render,
  setRender,
}) {
  return (
    <div className="m-4 flex flex-col ">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 items-start">
        {courseData.length > 0 &&
          courseData.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              render={render}
              setRender={setRender}
            />
          ))}
      </div>
    </div>
  );
}