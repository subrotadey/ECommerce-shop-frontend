import React from "react";
// import { useEffect } from "react";
// import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";

const UpdateTeacherModal = ({
  updateTeacher,
  setUpdateTeacher,
  closeModal,
}) => {
  // const { img_link, first_name } = updateTeacher;
  const { _id, img_link, first_name } = updateTeacher;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const imageHostKey = process.env.REACT_APP_imgbb_key;
  const navigate = useNavigate();

  // useEffect(() => {
  //   const url = `https://e-learning-server-hazel.vercel.app/courses/${id}`;
  //   fetch(url)
  //     .then((res) => res.json())
  //     .then((data) => setUpdateCourse(data));
  // }, [id]);

  const handleUpdateTeacher = (data, e) => {
    e.preventDefault();
    const image = data.image[0];
    const formData = new FormData();
    formData.append("image", image);
    const imgURL = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;

    console.log(imgURL);
    fetch(imgURL, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imgData) => {
        if (imgData.success) {
          const updateTeacherInfo = {
            first_name: data.first_name,
            last_name: data.last_name,
            img_link: imgData.data.url,
            email: data.email,
            designation: data.designation,
            description: data.description,
          };

          console.log(updateTeacherInfo);

          // updated teacher information to the server
          const url = `https://e-learning-server-hazel.vercel.app/teachers/${_id}`;
          fetch(url, {
            method: "PUT",
            headers: {
              "content-type": "application/json",
              authorization: `bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify(updateTeacherInfo),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              if (data.acknowledged) {
                // toast.success(`${data.first_name} is successfully updated`);
                toast.success(`Successfully updated`);
                e.target.reset();
                navigate("/dashboard/manageteachers");
              } else {
                toast.error(data.message);
              }
            });
        }
      });

    // //send data to the server
    // const url = `https://e-learning-server-hazel.vercel.app/courses/${_id}`;
    // fetch(url, {
    //   method: "PUT",
    //   headers: {
    //     "content-type": "application/json",
    //     authorization: `bearer ${localStorage.getItem("accessToken")}`,
    //   },
    //   body: JSON.stringify(updateTeacherInfo),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data) {
    //       console.log(data);
    //       toast.success("Successfully Updated Course Information");
    //       e.target.reset();
    //     } else {
    //       toast.error(data.message);
    //     }
    //   });
  };

  return (
    <div>
      <input
        type="checkbox"
        id="update-teacher-modal"
        className="modal-toggle"
      />
      <div className="modal modal-bottom overflow-x-hidden text-center sm:modal-middle">
        <div className="modal-box bg-white">
          <h3 className="text-lg font-bold">{first_name}</h3>
          <img className="mx-auto  w-40" src={img_link} alt="" />
          <div>
            <div className="mx-auto w-96 p-7 ">
              <form onSubmit={handleSubmit(handleUpdateTeacher)}>
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    {" "}
                    <span className="label-text text-black">Teacher First Name</span>
                  </label>
                  <input
                    type="text"
                    {...register("first_name", {
                      required: "This Field is Required",
                    })}
                    className="input-bordered input w-full max-w-xs bg-white"
                  />
                  {errors.first_name && (
                    <p className="text-red-500">{errors.first_name.message}</p>
                  )}
                </div>
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    {" "}
                    <span className="label-text text-black">Teacher Last Name</span>
                  </label>
                  <input
                    type="text"
                    {...register("last_name", {
                      required: "This Field is Required",
                    })}
                    className="input-bordered input w-full max-w-xs bg-white"
                  />
                  {errors.last_name && (
                    <p className="text-red-500">{errors.last_name.message}</p>
                  )}
                </div>
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    {" "}
                    <span className="label-text text-black">Email</span>
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: true,
                    })}
                    className="input-bordered input w-full max-w-xs bg-white"
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    {" "}
                    <span className="label-text text-black">Designation</span>
                  </label>
                  <input
                    type="text"
                    {...register("designation", {
                      required: "This Field is Required",
                    })}
                    className="input-bordered input w-full max-w-xs bg-white"
                  />
                  {errors.designation && (
                    <p className="text-red-500">{errors.designation.message}</p>
                  )}
                </div>
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    {" "}
                    <span className="label-text text-black">Description</span>
                  </label>
                  <input
                    type="text"
                    {...register("description", {
                      required: "This Field is Required",
                    })}
                    className="input-bordered input w-full max-w-xs bg-white"
                  />
                  {errors.description && (
                    <p className="text-red-500">{errors.description.message}</p>
                  )}
                </div>
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    {" "}
                    <span className="label-text text-black">Photo</span>
                  </label>
                  <input
                    type="file"
                    {...register("image", { required: "Photo is Required" })}
                    className="file-input-bordered file-input-accent file-input w-full max-w-xs bg-white"
                  />
                  {/* <input type="file" {...register("image", { required: "Photo is Required", })} className="file-input-bordered file-input-accent file-input w-full max-w-xs"/> */}
                  {errors.image && (
                    <p className="text-red-500">{errors.image.message}</p>
                  )}
                </div>
                <input
                  className="btn-accent btn mt-4 w-full bg-white"
                  value="Add Teacher"
                  type="submit"
                />
                <div className="modal-action">
                  <label
                    onClick={closeModal}
                    htmlFor="update-course-modal"
                    className="btn-warning btn  w-full"
                  >
                    Cancel
                  </label>
                </div>
              </form>
            </div>
          </div>
          <p className="py-4">
            You are updating{" "}
            <span className="text-green-500">"{first_name}"</span> course
            details
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateTeacherModal;
