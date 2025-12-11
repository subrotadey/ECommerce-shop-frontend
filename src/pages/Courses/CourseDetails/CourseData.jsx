import React from "react";
import { useLoaderData } from "react-router-dom";
import { BsClock } from "react-icons/bs";
import { GiNetworkBars } from "react-icons/gi";
import { MdQuiz } from "react-icons/md";
import { FaUserGraduate } from "react-icons/fa";
import BookingModal from "./BookingModal";

const CourseData = ({ selectedDate }) => {
  const courses = useLoaderData();

  const { heading, price, level, quiz, students, weeks } = courses;

  return (
    <div>
      <div className="text-center ">
        <div className="justify-evenly px-2 lg:flex">
          <div><h2 className="text-2xl">{heading}</h2></div>
        </div>
        <div className="divider mx-auto w-1/2"></div>
        <div className="grid grid-cols-2 gap-4  lg:grid-cols-4">
          <div className="mx-auto flex  text-lg">
            <BsClock className="my-auto mr-3 "></BsClock>
            <p>Weeks: {weeks}</p>
          </div>
          <div className="mx-auto flex  text-lg">
            <GiNetworkBars className="my-auto mr-3 "> </GiNetworkBars>
            <p>Level: {level}</p>
          </div>
          <div className="mx-auto flex  text-lg">
            <MdQuiz className="my-auto mr-3 "> </MdQuiz>
            <p>Quiz: {quiz}</p>
          </div>
          <div className="mx-auto flex  text-lg">
            <FaUserGraduate className="my-auto mr-3 "> </FaUserGraduate>
            <p>Students: {students}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <label htmlFor="booking-modal" className="btn-primary btn my-3">
          Enroll Now
        </label>
        <BookingModal
          selectedDate={selectedDate}
          heading={heading}
          price={price}
        ></BookingModal>
      </div>
    </div>
  );
};

export default CourseData;
