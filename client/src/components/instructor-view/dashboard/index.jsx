import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

const InstructorDashboard = ({ listOfCourses }) => {
  const calculateTotalStudentsAndRevenue = () => {
    const { totalStudents, totalRevenue, studentList } = listOfCourses.reduce(
      (acc, course) => {
        const studentCount = course.students.length;
        acc.totalStudents += studentCount;
        acc.totalRevenue += course.pricing * studentCount;

        course.students.forEach((student) => {
          acc.studentList.push({
            courseTitle: course.title,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
          });
        });
        return acc;
      },
      {
        totalStudents: 0,
        totalRevenue: 0,
        studentList: [],
      }
    );
    return {
      totalStudents,
      totalRevenue,
      studentList,
    };
  };

  const [config, setConfig] = useState([
    {
      icon: Users,
      label: "Total Students",
      value: 10,
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: 100,
    },
  ]);

  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    const result = calculateTotalStudentsAndRevenue();
    console.log(result);

    setConfig([
      {
        icon: Users,
        label: "Total Students",
        value: result.totalStudents,
      },
      {
        icon: DollarSign,
        label: "Total Revenue",
        value: result.totalRevenue,
      },
    ]);

    setStudentList(result.studentList);
    // console.log(config);
  }, [listOfCourses]);

  console.log(config);

  if (listOfCourses.length === 0) {
    return <Skeleton />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {config.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentList.map((studentItem, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {studentItem?.courseTitle}
                    </TableCell>
                    <TableCell>{studentItem?.studentName}</TableCell>
                    <TableCell>{studentItem?.studentEmail}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorDashboard;