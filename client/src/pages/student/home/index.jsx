import { Button } from "@/components/ui/button";
import { courseCategories } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { px } from "framer-motion";

const StudentHomePage = () => {
  const navigate = useNavigate();
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const handleNavigateToCoursesPage = (courseCategoryId) => {
    console.log(courseCategoryId);
    sessionStorage.removeItem("filters");
    const currentFilters = {
      category: [courseCategoryId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilters));
    navigate("/courses");
  };

  const handleCourseNavigate = async (currentCourseId) => {
    console.log(currentCourseId);

    const response = await checkCoursePurchaseInfoService(
      currentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.boughtOrNot) {
        navigate(`/course-progress/${currentCourseId}`);
      } else {
        navigate(`/course/details/${currentCourseId}`);
      }
    }
  };

  useEffect(() => {
    const fetchAllCoursesOfStudent = async () => {
      try {
        const response = await fetchStudentViewCourseListService();
        if (response?.success) {
          setStudentViewCoursesList(response?.courseList);
        }
      } catch (error) {
        console.log("Error fetching courses of the student", error);
      }
    };

    fetchAllCoursesOfStudent();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4">
            Learning that gives you wisdom
          </h1>
          <p className="text-xl">Get started with Us</p>
        </div>
        <div className="lg:w-full mb-8 lg:mb-0 ">
          <LazyLoadImage
            src="https://raw.githubusercontent.com/sangammukherjee/MERN-LMS-2024/refs/heads/master/client/public/banner-img.png"
            alt=""
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </section>
      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start"
              variant="outline"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                key={courseItem?._id}
                onClick={() => {
                  handleCourseNavigate(courseItem?._id);
                }}
                className="border rounded-lg overflow-hidden shadow cursor-pointer"
              >
                <LazyLoadImage
                  src={courseItem.image}
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover"
                  effect="blur"
                  threshold={100} // Loads 300px before appearing
                />

                <div className="p-4">
                  <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {courseItem?.instructorName}
                  </p>
                  <p className="font-bold text-[16px]">
                    Rs {courseItem?.pricing}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h1>No Courses Found</h1>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentHomePage;
