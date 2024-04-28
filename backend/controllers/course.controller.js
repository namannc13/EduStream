import { courseModel } from "../models/course.model.js";
import { tagModel } from "../models/tag.model.js";
import { userModel } from "../models/user.model.js";

const getAllCourses = async (req, res, next) => {
  try {
    const allCourses = await courseModel.find({}).populate('course_content');
    if (allCourses.length === 0) {
      return res.status(200).json({ message: "There are no courses" });
    }
    res.status(200).json(allCourses);
  } catch (error) {
    next(error);
  }
};

const getMyCourses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).populate('owned_courses').populate('enrolled_courses');

    const ownedCourses = user.owned_courses;
    const enrolledCourses = user.enrolled_courses;
    
    if(user.role === 'instructor') res.status(200).json(ownedCourses)
    if(user.role === 'enduser') res.status(200).json(enrolledCourses)
  } catch (error) {
    next(error);
  }
};



const getCourse = async (req, res, next) => {
  try {
    const id = req.params.id;
    const course = await courseModel.findById(id);
    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    let tagModels = [];
    
    if (req.body.tags && req.body.tags.length > 0) {
      for (const tag of req.body.tags) {
        const existingTag = await tagModel.findOne({ title: tag });
        
        if (existingTag) {
          tagModels.push(existingTag._id);
        } else {
          const newTag = await tagModel.create({ title: tag });
          tagModels.push(newTag._id);
        }
      }
    }

    const newCourse = await courseModel.create({
      title: req.body.title,
      description: req.body.description,
      instructor: req.user.id,
      enrolled_users: [],
      course_content: [],
      tags: tagModels || [],
      completion: false  
    });

    const userId = req.user.id;
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: { owned_courses: newCourse._id },
      },
      { new: true }
    );

    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
      user: user,
      tagModels: tagModels
    });
  } catch (error) {
    next(error);
  }
};

const enrollCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    await userModel.findByIdAndUpdate(userId, {
      $addToSet: { enrolled_courses: courseId },
    });

    await courseModel.findByIdAndUpdate(courseId, {
      $addToSet: { enrolled_users: userId },
    });

    res.status(200).json({
      message: "Course enrolled successfully",
      user: userId,
      course: courseId,
    });
  } catch (error) {
    next(error);
  }
};

const completeCourse = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    if(req.user.role === 'instructor'){
      const user = await userModel.findByIdAndUpdate(
        userId,
        {
          $addToSet: { completed_courses: courseId },
        },
        { new: true }
      );

      const course = await courseModel.findByIdAndUpdate(
        courseId,
        {
          completion: true,
        },
        { new: true }
      );

      res.status(200).json({
        message: "Course marked as completed successfully",
        user: user,
        course: course,
      });
    }else{
      const user = await userModel.findByIdAndUpdate(
        userId,
        {
          $pull: { enrolled_courses: courseId },
          $addToSet: { completed_courses: courseId },
        },
        { new: true }
      );
  
      const course = await courseModel.findByIdAndUpdate(
        courseId,
        {
          $pull: { enrolled_users: userId },
        },
        { new: true }
      );
  
      res.status(200).json({
        message: "Course marked as completed successfully",
        user: user,
        course: course,
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    const usersToUpdate = await userModel.find({
      $or: [
        { enrolled_courses: courseId },
        { completed_courses: courseId },
        { owned_courses: courseId },
      ],
    });

    await Promise.all(
      usersToUpdate.map(async (user) => {
        user.enrolled_courses = user.enrolled_courses.filter(
          (course) => String(course.course) !== courseId
        );
        user.completed_courses = user.completed_courses.filter(
          (course) => String(course) !== courseId
        );
        user.owned_courses = user.owned_courses.filter(
          (course) => String(course) !== courseId
        );
        await user.save();
      })
    );

    const usersToUpdateIds = usersToUpdate.map((user) => user._id);
    const course = await courseModel.findByIdAndDelete(courseId);
    res.status(200).json({
      message: "Course deleted successfully",
      course,
      users: usersToUpdateIds,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createCourse,
  getAllCourses,
  getMyCourses,
  getCourse,
  enrollCourse,
  completeCourse,
  deleteCourse,
};