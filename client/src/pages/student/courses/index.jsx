import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

//This function and its useeffect shows how to chnage the URL according to key-value pairs of an object
const createSearchParamsHelper = (filterParams) => {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key} = ${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
};

const StudentViewCoursesPage = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState("price-lowtohigh");

  const [filters, setFilters] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();

  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const handleCourseNavigate = async (currentCourseId) => {
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

  //belwo one is mainly to update the url for  a better UX
  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null) {
      const fetchAllCoursesOfStudent = async () => {
        try {
          console.log("Current filters", filters);
          console.log("Current sort", sort);

          const query = new URLSearchParams({
            ...filters,
            sortBy: sort,
          });
          setLoadingState(true);
          const response = await fetchStudentViewCourseListService(query);
          if (response?.success) {
            setStudentViewCoursesList(response?.courseList);
          }
        } catch (error) {
          console.log("Error fetching courses of the student", error);
        } finally {
          setLoadingState(false);
        }
      };

      fetchAllCoursesOfStudent();
    }
  }, [filters, sort]);

  useEffect(() => {
    sessionStorage.removeItem("filters");
  }, []);

  //Below fucntion and "checked" and "onCheckedChange" tells how to control and synchronize marking and unmarking check-boxes
  const handleFilterOnChange = (getSectionId, getCurrentOption) => {
    let copyFilters = { ...filters };
    const indexOfCurrentSection =
      Object.keys(copyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      copyFilters = {
        ...copyFilters,
        [getSectionId]: [getCurrentOption.id],
      };
    } else {
      const indexOfCurrentOption = copyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1) {
        copyFilters[getSectionId].push(getCurrentOption.id);
      } else {
        copyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }
    setFilters(copyFilters);
    sessionStorage.setItem("filters", JSON.stringify(copyFilters));
  };

  console.log("filters", filters);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Courses </h1>
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-64 space-y-4">
          <div className="p-4 space-y-4">
            {Object.keys(filterOptions).map((keyItem) => (
              <div className="p-4 space-y-4">
                <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                <div className="grid gap-2 mt-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label className="flex font-medium items-center gap-3">
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[keyItem] &&
                          filters[keyItem].indexOf(option.id) > -1
                        }
                        onCheckedChange={() =>
                          handleFilterOnChange(keyItem, option)
                        }
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
        <main className="flex-1">
          <div className="flex justify-end items-center mb-4 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-3 p-5"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-[16px] font-medium">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-black font-bold">
              {studentViewCoursesList.length} Results
            </span>
          </div>
          <div className="space-y-4">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card
                  // onClick={() => console.log(courseItem)}
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  key={courseItem?._id}
                  className="cursor-pointer"
                >
                  <CardContent className="flex gap-4 p-4">
                    <div className="w-48 h-32 flex-shrink-0">
                      <LazyLoadImage
                        src={courseItem?.image}
                        className="w-full h-full object-cover"
                        effect="blur"
                        threshold={100} // Loads 300px before appearing
                        width={192}
                        height={128}
                      />
                      {/* <img
                        src={courseItem?.image}
                        className="w-full h-full object-cover"
                      /> */}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {courseItem?.title}
                      </CardTitle>
                      <p className="text-medium text-gray-600 mb-1">
                        By{" "}
                        <span className="font-bold">
                          {courseItem?.instructorName}
                        </span>
                      </p>
                      <p className="text-[15px] text-gray-600 mt-3 mb-2">
                        {`${courseItem?.curriculum?.length} ${
                          courseItem?.curriculum?.length > 1
                            ? `Lectures`
                            : `Lecture`
                        }`}
                      </p>
                      <p className="text-[18px] text-black mb-2">
                        {`${courseItem?.level.toUpperCase()}  `}
                      </p>
                      <p className="font-bold text-lg ">
                        Rs {courseItem?.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : loadingState ? (
              <Skeleton />
            ) : (
              <h1>No results</h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentViewCoursesPage;
