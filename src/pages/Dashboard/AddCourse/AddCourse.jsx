import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const imageHostKey = process.env.REACT_APP_imgbb_key;
  const navigate = useNavigate();

  const handleAddCourse = (data) => {
    const image = data.image[0];
    const formData = new FormData();
    formData.append("image", image);
    const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imgData) => {
        if (imgData.success) {
          const course = {
            heading: data.heading,
            img: imgData.data.url,
            price: data.price,
            weeks: data.weeks,
            level: data.level,
            lesson: data.lesson,
            quiz: data.quiz,
            student: data.student,
          };

          fetch("https://e-learning-server-hazel.vercel.app/courses", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify(course),
          })
            .then((res) => res.json())
            .then((result) => {
              if (result.acknowledged) {
                toast.success(`${data.heading} is successfully added`);
                navigate("/dashboard/managecourses");
              } else {
                toast.error(result.message);
              }
            });
        }
      });
  };

  return (
    <div className="px-4 md:px-10 py-8 max-w-7xl mx-auto bg-white">
      <h2 className="text-3xl font-semibold mb-8 text-center">📚 Add A New Course</h2>
      <form
        onSubmit={handleSubmit(handleAddCourse)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white"
      >
        {/* Course Name */}
        <div>
          <label className="label-text font-medium text-black">Course Name</label>
          <input
            type="text"
            {...register("heading", { required: "This Field is Required" })}
            className="input input-bordered w-full  bg-white"
            placeholder="React for Beginners"
          />
          {errors.heading && <p className="text-red-500 text-sm">{errors.heading.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="label-text font-medium text-black">Price (৳)</label>
          <input
            type="number"
            {...register("price", { required: "This Field is Required" })}
            className="input input-bordered w-full  bg-white"
            placeholder="e.g. 999"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        {/* Weeks */}
        <div>
          <label className="label-text font-medium text-black">Duration (Weeks)</label>
          <input
            type="number"
            {...register("weeks", { required: "This Field is Required" })}
            className="input input-bordered w-full  bg-white"
            placeholder="e.g. 6"
          />
          {errors.weeks && <p className="text-red-500 text-sm">{errors.weeks.message}</p>}
        </div>

        {/* Level */}
        <div>
          <label className="label-text font-medium text-black">Level</label>
          <input
            type="text"
            {...register("level", { required: "This Field is Required" })}
            className="input input-bordered w-full  bg-white"
            placeholder="Beginner / Intermediate / Advanced"
          />
          {errors.level && <p className="text-red-500 text-sm">{errors.level.message}</p>}
        </div>

        {/* Lessons */}
        <div>
          <label className="label-text font-medium text-black">Total Lessons</label>
          <input
            type="number"
            {...register("lesson", { required: "This Field is Required" })}
            className="input input-bordered w-full  bg-white"
            placeholder="e.g. 40"
          />
          {errors.lesson && <p className="text-red-500 text-sm">{errors.lesson.message}</p>}
        </div>

        {/* Quizzes */}
        <div>
          <label className="label-text font-medium text-black">Total Quizzes</label>
          <input
            type="number"
            {...register("quiz", { required: "This Field is Required" })}
            className="input input-bordered w-full  bg-white"
            placeholder="e.g. 6"
          />
          {errors.quiz && <p className="text-red-500 text-sm">{errors.quiz.message}</p>}
        </div>

        {/* Students */}
        <div>
          <label className="label-text font-medium text-black">Total Students</label>
          <input
            type="number"
            {...register("student", { required: "This Field is Required" })}
            className="input input-bordered w-full  bg-white"
            placeholder="e.g. 1200"
          />
          {errors.student && <p className="text-red-500 text-sm">{errors.student.message}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="label-text font-medium text-black">Course Image</label>
          <input
            type="file"
            {...register("image", { required: "Photo is Required" })}
            className="file-input file-input-bordered file-input-accent w-full  bg-white"
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
        </div>

        {/* Submit Button - full width on both columns */}
        <div className="md:col-span-2">
          <input
            type="submit"
            value="Add Course"
            className="btn btn-accent w-full"
          />
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
