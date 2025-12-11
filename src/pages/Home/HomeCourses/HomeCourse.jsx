import React from "react";
import { Link } from "react-router";

const HomeCourse = (props) => {
  const { _id, img, price, heading } = props.course;

  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

  // Adjust the threshold value to control the tilt effect
  const threshold = 12;

  const handleMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setTilt({ x: y * -threshold, y: x * threshold });
  };


  return (
    <>
      <div className="rounded-xl shadow-xl overflow-hidden transition-transform duration-200 ease-out cursor-pointer max-w-80 bg-white"
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        <img src={img}
          alt="City skyline" className="w-full h-52 object-cover"
        />
        <h3 className="mt-3 px-4 pt-3 mb-1 text-lg font-semibold text-gray-800">
          {heading}
        </h3>
        <div className="flex items-end justify-between mt-3 p-5">
          <p className="md:text-xl text-base font-medium text-indigo-500">
            ${price}
            <span className="text-gray-500/60 md:text-sm text-xs line-through">${price}</span>
          </p>
          <div className="text-indigo-500">
            <button className="p-2 bg-indigo-100 border border-indigo-300  rounded text-indigo-600 font-medium btn-sm" >
              <Link to={`/course/${_id}`}>View Details</Link>
            </button>
          </div>
        </div>
      </div>


    </>
  );
};

export default HomeCourse;
