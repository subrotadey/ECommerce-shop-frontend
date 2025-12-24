import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { Outlet } from 'react-router';

const DashboardLayout = () => {
    return (
        <>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </>
    );
};

export default DashboardLayout;



























// import React, { useContext } from "react";
// import { Link, Outlet } from "react-router-dom";
// import { AuthContext } from "../contexts/AuthProvider";
// import useRole from "../components/Hooks/useRole";
// import DashboardBar from "../components/Pages/Dashboard/DashboardBar/DashboardBar";

// const DashboardLayout = () => {
//   const { user } = useContext(AuthContext);
//   const [role, isLoading] = useRole(user?.email);

//   if (isLoading) return <div className="text-center mt-10">Loading...</div>;

//   const isAdmin = role === "admin";
//   const isInstructor = role === "instructor";

//   return (
//     <div>
//       <DashboardBar />
//       <div className="drawer drawer-mobile ">
//         <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
//         <div className="drawer-content">
//           <Outlet />
//         </div>
//         <div className="drawer-side">
//           <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
//           <ul className="menu p-4 w-80 ">
//             <h2 className="text-3xl">DASHBOARD</h2>
//             <div className="divider"></div>

//             {/* Regular User */}
//             {role === "user" && (
//               <>
//                 <li><Link to="/dashboard">My Profile</Link></li>
//                 <li><Link to="/dashboard/my-booking">My Courses</Link></li>
//                 <li><Link to="/dashboard/becomeinstructor">Become an Instructor</Link></li>
//               </>
//             )}

//             {/* Instructor */}
//             {isInstructor && (
//               <>
//                 <li><Link to="/dashboard">My Profile</Link></li>
//                 <li><Link to="/dashboard/addcourse">Add Course</Link></li>
//                 <li><Link to="/dashboard/teacher-course">My Publish Course</Link></li>
//               </>
//             )}

//             {/* Admin */}
//             {isAdmin && (
//               <>
//                 <li><Link to="/dashboard">My Profile</Link></li>
//                 <li><Link to="/dashboard/enroll-stats">Course Stat</Link></li>
//                 <li><Link to="/dashboard/my-booking">My Courses</Link></li>
//                 <li><Link to="/dashboard/allusers">All Users</Link></li>
//                 <li><Link to="/dashboard/instructor-requests">Instructor Request</Link></li>
//                 <li><Link to="/dashboard/managecourses">Manage Courses</Link></li>
//                 <li><Link to="/dashboard/addcourse">Add Course</Link></li>
//                 <li><Link to="/dashboard/manageteachers">Manage Teachers</Link></li>
//                 <li><Link to="/dashboard/addteacher">Add a Teacher</Link></li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
