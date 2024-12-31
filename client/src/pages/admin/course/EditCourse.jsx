import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";
import { ArrowLeft } from "lucide-react";

const EditCourse = () => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">
          <Link to={`/admin/course`}>
            <Button size="icon" variant="outline" className="rounded-full mr-2">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          Add detail information regarding User
        </h1>
         
      </div>
      <CourseTab />
    </div>
  );
};

export default EditCourse;
