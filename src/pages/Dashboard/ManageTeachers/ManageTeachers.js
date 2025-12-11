import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../Shared/ConfirmationModal/ConfirmationModal";
import Loading from "../../Shared/Loading/Loading";
import ManageTeacher from "./ManageTeacher";

const ManageTeachers = () => {
  const [deletingTeacher, setDeletingTeacher] = useState(null);
  const closeModal = () => {
    setDeletingTeacher(null);
  };
  const {
    data: teachers,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      try {
        const res = await fetch(
          "https://e-learning-server-hazel.vercel.app/teachers",
          {
            headers: {
              authorization: `bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await res.json();
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleDeleteTeacher = (teacher) => {
    fetch(
      `https://e-learning-server-hazel.vercel.app/teachers/${teacher._id}`,
      {
        method: "DELETE",
        headers: {
          authorization: `bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.deletedCount > 0) {
          toast.success(`${teacher.first_name} Successfully Deleted!`);
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
      <h2 className="text-3xl">Available Teachers: {teachers?.length}</h2>
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
              {teachers?.map((teacher, i) => (
                <ManageTeacher
                  key={teacher._id}
                  i={i}
                  teacher={teacher}
                  setDeletingTeacher={setDeletingTeacher}
                ></ManageTeacher>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {deletingTeacher && (
        <ConfirmationModal
          title={`Are you sure want to delete this teacher?`}
          message={`If You delete ${deletingTeacher.first_name}. It cannot be undone`}
          successAction={handleDeleteTeacher}
          successButtonName="Delete"
          modalData={deletingTeacher}
          closeModal={closeModal}
        ></ConfirmationModal>
      )}
    </section>
  );
};

export default ManageTeachers;
