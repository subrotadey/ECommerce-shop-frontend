import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../Shared/ConfirmationModal/ConfirmationModal";

const AllUsers = () => {
  const [deletingUser, setDeletingUser] = useState(null);
  const closeModal = () => {
    setDeletingUser(null);
  };
  const { data: users = [], refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(
        "https://e-learning-server-hazel.vercel.app/users"
      );
      const data = await res.json();
      return data;
    },
  });

  const handleMakeAdmin = (id) => {
    fetch(`https://e-learning-server-hazel.vercel.app/users/admin/${id}`, {
      method: "PUT",
      headers: {
        authorization: `bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          toast.success("Make Admin successful");
          refetch();
        }
      });
  };

  const handleDeleteUser = (user) => {
    fetch(`https://e-learning-server-hazel.vercel.app/users/${user._id}`, {
      method: "DELETE",
      headers: {
        authorization: `bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.deletedCount > 0) {
          toast.success(`${user?.name} Successfully Deleted!`);
          refetch();
        } else {
          toast.error(result.message);
        }
      });
  };

  return (
    <div>
      <h3 className="mb-5 text-3xl">All Users</h3>
      <div className="overflow-x-auto">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th className="bg-white">Serial No</th>
              <th className="bg-white">Name</th>
              <th className="bg-white">Users Email</th>
              <th className="bg-white">Admin</th>
              <th className="bg-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user._id} >
                <th className="bg-white">{i + 1}</th>
                <td className="bg-white">{user.name}</td>
                <td className="bg-white">{user.email}</td>
                <td className="bg-white">
                  {user?.role !== "admin" && (
                    <button
                      onClick={() => handleMakeAdmin(user._id)}
                      className="btn-primary btn-xs btn"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
                <td className="bg-white">
                  <label
                    onClick={() => setDeletingUser(user)}
                    htmlFor="confirmation-modal"
                    className="btn-xs btn bg-red-800"
                  >
                    Delete
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deletingUser && (
        <ConfirmationModal
          title={`Are you sure want to delete this course?`}
          message={`If You delete ${deletingUser.name}. It cannot be undone`}
          successAction={handleDeleteUser}
          successButtonName="Delete"
          modalData={deletingUser}
          closeModal={closeModal}
        ></ConfirmationModal>
      )}
    </div>
  );
};

export default AllUsers;
