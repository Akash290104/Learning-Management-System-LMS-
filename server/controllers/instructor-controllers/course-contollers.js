const Course = require("../../modals/course");

const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const newCourse = new Course(courseData);
    const savedCourse = await newCourse.save();

    if (!savedCourse) {
      console.log("Error creating new course");

      return res.status(404).json({
        success: false,
        message: "Error creating new course",
      });
    }

    console.log("New Course created successfully");

    return res.status(200).json({
      success: true,
      message: "New Course created successfully",
      savedCourse,
    });
  } catch (error) {
    console.log("Error creating new course", error);

    return res.status(500).json({
      success: false,
      message: "Error creating new course",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const { instructorId } = req.params;

    console.log("instructorId", instructorId);

    const courseList = await Course.find({ instructorId });

    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      courseList,
    });
  } catch (error) {
    console.log("Error fetching all courses", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching all courses",
    });
  }
};

const getCourseDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      console.log("Error fetching course details");
      return res.status(404).json({
        success: false,
        message: "Error fetching course details",
      });
    }

    console.log("Course details fetched successfully");
    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      courseDetails,
    });
  } catch (error) {
    console.log("Error fetching course details", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching course details",
    });
  }
};

const updateCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updatedCourse) {
      console.log("Error updating course");
      return res.status(404).json({
        success: false,
        message: "Error updating course",
      });
    }

    console.log("Course updated successfully");
    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      updatedCourse,
    });
  } catch (error) {
    console.log("Error updating course", error);
    return res.status(500).json({
      success: false,
      message: "Error updating course",
    });
  }
};

module.exports = {
  addNewCourse,
  getAllCourses,
  getCourseDetailsById,
  updateCourseById,
};
