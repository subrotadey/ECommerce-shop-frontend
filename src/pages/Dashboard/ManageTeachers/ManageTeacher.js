import React, { useState } from "react";
import UpdateTeacherModal from "./UpdateTeacherModal";


const ManageTeacher = ({ teacher, i, setDeletingTeacher }) => {
  const [updateTeacher, setUpdateTeacher] = useState(null);
  const closeModal = () => {
    setUpdateTeacher(null);
  };
  return (
    <>
      <tr>
        <th className="bg-white">{i + 1}</th>
        <th className="bg-white">
          <div className="avatar">
            <div className="w-12 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
              <img src={teacher.img_link} alt="" />
            </div>
          </div>
        </th>
        <td className="bg-white">
          {teacher.first_name} {teacher.last_name}
        </td>
        <td className="bg-white">
          {teacher?.role !== "admin" && (
            <label
              onClick={() => setDeletingTeacher(teacher)}
              htmlFor="confirmation-modal"
              className="btn-error btn-sm btn"
            >
              Delete
            </label>
          )}
        </td>
        <td className="bg-white">
          {
            <label
              onClick={() => setUpdateTeacher(teacher)}
              htmlFor="update-teacher-modal"
              className="btn-success btn-sm btn"
            >
              Update
            </label>
          }
        </td>
      </tr>
      {updateTeacher && (
        <UpdateTeacherModal
        closeModal={closeModal}
          updateTeacher={updateTeacher}
          setUpdateTeacher={setUpdateTeacher}
        ></UpdateTeacherModal>
      )}

      
    </>
  );
};

export default ManageTeacher;
