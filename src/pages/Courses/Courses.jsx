import React, { useEffect, useState } from "react";
import Loading from "../Shared/Loading/Loading";
import Course from "./Course";
import { BsSearch } from "react-icons/bs";

const Courses = () => {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [loading, setLoading] = useState(false);

  // Load courses from backend
  useEffect(() => {
    const url = `https://e-learning-server-hazel.vercel.app/courses?page=${page}&size=${size}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCount(data.count);
        setCourses(data.courses);
      });
  }, [page, size]);

  // Show loading initially
  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const pages = Math.ceil(count / size);

  // Filtered Course List
  const filteredCourses = courses
    .filter((course) =>
      course.heading.toLowerCase().includes(query.toLowerCase())
    )
    .filter((course) => course.price >= minPrice && course.price <= maxPrice)


  const resetFilters = () => {
    setQuery("");
    setMinPrice(0);
    setMaxPrice(Infinity);
  };

  return (
    <div className="flex items-center justify-center pt-20 w-11/12 mx-auto">
      {loading ? (
        <Loading />
      ) : (
        <div className="my-12">
          <div className="text-center text-2xl uppercase italic lg:text-3xl">
            <p>Our Most Valuable Courses</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 my-6 px-4">
            {/* Search Box */}
            <div className="w-full lg:w-auto">
              <div className="relative w-full">
                <BsSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="search"
                  name="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name"
                  className="input w-full pl-10 pr-4 py-2 bg-white font-semibold border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition duration-200"
                />
              </div>
            </div>

            {/* Price Filter */}
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <input
                type="number"
                placeholder="Min Price"
                className="input input-bordered w-32 bg-white"
                onChange={(e) => setMinPrice(Number(e.target.value))}
              />
              <input
                type="number"
                placeholder="Max Price"
                className="input input-bordered w-32 bg-white"
                onChange={(e) =>
                  setMaxPrice(e.target.value ? Number(e.target.value) : Infinity)
                }
              />
            </div>

            {/* Reset Filters Button */}
            <div className="text-center">
              <button
                onClick={resetFilters}
                className="btn btn-outline btn-error btn-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>
          
          <div className="divider"></div>

          {/* Courses */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <Course key={course._id} course={course} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No courses found with selected filters.
              </p>
            )}
          </div>

          {/* Pagination */}
          <div className="pagination flex text-center justify-center items-center mt-6 flex-wrap gap-2">
            {[...Array(pages).keys()].map((number) => (
              <button
                key={number}
                className={`btn-sm btn bg-white ${page === number ? "text-primary bg-gray-400" : ""
                  }`}
                onClick={() => setPage(number)}
              >
                {number + 1}
              </button>
            ))}
          </div>

          {/* Page Size Dropdown */}
          <div className="mt-4 flex justify-center ">
            <select
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="ml-4 border p-1 rounded bg-white"
              defaultValue={10}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
