// import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../Shared/ConfirmationModal/ConfirmationModal";
import Loading from "../../Shared/Loading/Loading";
import ManageCourse from "./ManageCourse";
// import useCourses from "../../../Hooks/useCourses";
import { useLoaderData } from "react-router-dom";
// import UpdateCourseModal from "./UpdateCourseModal";

const ManageCourses = () => {
  const [deletingCourse, setDeletingCourse] = useState(null);
  // const [updateCourse, setUpdateCourse] = useState(null);
  const [setUpdateCourse] = useState(null);
  const closeModal = () => {
    setDeletingCourse(null);
  };
  // const [{courses, refetch, isLoading}] = useCourses();
  const { courses, refetch, isLoading } = useLoaderData();

  const handleDeleteCourse = (course) => {
    fetch(`https://e-learning-server-hazel.vercel.app/courses/${course._id}`, {
      method: "DELETE",
      headers: {
        authorization: `bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.deletedCount > 0) {
          toast.success(`${course.first_name} Successfully Deleted!`);
          refetch();
        } else {
          toast.error(result.message);
        }
      });
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <section>
      <h2 className="text-3xl">Available courses: {courses?.length}</h2>
      <div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th className="bg-white">Serial No</th>
                <th className="bg-white">Avatar</th>
                <th className="bg-white">Course Name</th>
                <th className="bg-white">Delete Course</th>
                <th className="bg-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((course, i) => (
                <ManageCourse
                  key={course._id}
                  i={i}
                  course={course}
                  setDeletingCourse={setDeletingCourse}
                  setUpdateCourse={setUpdateCourse}
                ></ManageCourse>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {deletingCourse && (
        <ConfirmationModal
          title={`Are you sure want to delete this course?`}
          message={`If You delete ${deletingCourse.first_name}. It cannot be undone`}
          successAction={handleDeleteCourse}
          successButtonName="Delete"
          modalData={deletingCourse}
          closeModal={closeModal}
        ></ConfirmationModal>
      )}
      {/* {updateCourse && (
        <UpdateCourseModal
          updateCourse={updateCourse}
          setUpdateCourse={setUpdateCourse}
        ></UpdateCourseModal>
      )} */}
    </section>
  );
};

export default ManageCourses;
