import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { DayPicker } from "react-day-picker";

const CourseBanner = () => {
  const course = useLoaderData();
  const { img, heading } = course;
  const [selectedDate] = useState(new Date());
  return (
    <div>
      <h2 className="text-center text-3xl	font-medium">{heading}</h2>
      <div className="divider"></div>
      <div className="hero ">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src={img}
            className="max-w-sm rounded-lg shadow-2xl"
            alt="course pic"
          />
          <div className="mx-6">
            <DayPicker mode="single" selected={selectedDate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBanner;
