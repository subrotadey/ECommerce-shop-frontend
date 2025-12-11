import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

const UpdateCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const url = `https://onlineeulogy.onrender.com/courses/${id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setCourse(data));
  }, [id]);

  const handleUpdateCourse = (data, e) => {
    e.preventDefault();
    const updateTeacher = {
      heading: data.courseName,
      price: data.price,
      weeks: data.weeks,
      level: data.level,
      lesson: data.lesson,
      quiz: data.quiz,
      student: data.student,
    };

    //send data to the server
    const url = `https://onlineeulogy.onrender.com/courses/${id}`;
    fetch(url, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updateTeacher),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          console.log(data);
          toast.success("Successfully Updated Course Information");
          e.target.reset();
        } else {
          toast.error(data.message);
        }
      });
  };

  return (
    <div>
      <h2 className="text-3xl">Updating {course.heading}</h2>
      <div className="w-96 p-7 ">
        <form onSubmit={handleSubmit(handleUpdateCourse)}>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              {" "}
              <span className="label-text">Course Name or Heading</span>
            </label>
            <input
              type="text"
              {...register("courseName", {
                required: "This Field is Required",
              })}
              className="input-bordered input w-full max-w-xs"
            />
            {errors.courseName && (
              <p className="text-red-500">{errors.courseName.message}</p>
            )}
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              {" "}
              <span className="label-text">Price</span>
            </label>
            <input
              type="number"
              {...register("price", {
                required: "This Field is Required",
              })}
              className="input-bordered input w-full max-w-xs"
            />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              {" "}
              <span className="label-text">Weeks</span>
            </label>
            <input
              type="number"
              {...register("weeks", {
                required: "This Field is Required",
              })}
              className="input-bordered input w-full max-w-xs"
            />
            {errors.weeks && (
              <p className="text-red-500">{errors.weeks.message}</p>
            )}
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              {" "}
              <span className="label-text">Level</span>
            </label>
            <input
              type="text"
              {...register("level", {
                required: "This Field is Required",
              })}
              className="input-bordered input w-full max-w-xs"
            />
            {errors.level && (
              <p className="text-red-500">{errors.level.message}</p>
            )}
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              {" "}
              <span className="label-text">Lesson</span>
            </label>
            <input
              type="number"
              {...register("lesson", {
                required: "This Field is Required",
              })}
              className="input-bordered input w-full max-w-xs"
            />
            {errors.lesson && (
              <p className="text-red-500">{errors.lesson.message}</p>
            )}
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              {" "}
              <span className="label-text">Quiz Number</span>
            </label>
            <input
              type="number"
              {...register("quiz", {
                required: "This Field is Required",
              })}
              className="input-bordered input w-full max-w-xs"
            />
            {errors.quiz && (
              <p className="text-red-500">{errors.quiz.message}</p>
            )}
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              {" "}
              <span className="label-text">Total Student</span>
            </label>
            <input
              type="number"
              {...register("student", {
                required: "This Field is Required",
              })}
              className="input-bordered input w-full max-w-xs"
            />
            {errors.student && (
              <p className="text-red-500">{errors.student.message}</p>
            )}
          </div>
          <input
            className="btn-accent btn mt-4 w-full"
            value="Update Course"
            type="submit"
          />
        </form>
      </div>
    </div>
  );
};

export default UpdateCourse;
