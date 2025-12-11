// import React, { useContext } from "react";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../../../../contexts/AuthProvider";
// import logo from "./../../../assets/images/logo.png";
// import { AiOutlineLogin } from "react-icons/ai";
// import avatar from "../../../assets/images/profile.svg"

// const Navbar = () => {
//   const { user, logOut } = useContext(AuthContext);
//   // console.log(user);
//   const handleLogOut = () => {
//     logOut()
//       .then(() => { })
//       .catch(err => console.log(err));
//   }
//   const menuItems = (
//     <>
//       <li>
//         <Link className="mx-1" to="/">
//           Home
//         </Link>
//       </li>
//       <li>
//         <Link className="mx-1" to="/courses">
//           Courses
//         </Link>
//       </li>
//       <li>
//         <Link className="mx-1" to="/teachers">
//           Teachers
//         </Link>
//       </li>
//       <li>
//         <Link className="mx-1" to="/blogs">
//           Blogs
//         </Link>
//       </li>
//       <li>
//         <Link className="mx-1" to="/about">
//           About
//         </Link>
//       </li>
//       <li>
//         <Link className="mx-1" to="/contact">
//           Contact
//         </Link>
//       </li>
//       <li>
//         <Link to="/books">Books</Link>
//       </li>
//     </>
//   );
//   return (
//     <div className=" text-gray navbar fixed z-50 w-full bg-base-100 bg-opacity-20  text-white backdrop-blur-lg backdrop-filter">
//       <div className="navbar-start">
//         <div className="dropdown">
//           <label tabIndex="0" className="btn-ghost btn lg:hidden">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
//           </label>
//           <ul tabIndex="0" className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 text-lg text-white shadow	">
//             {menuItems}
//           </ul>
//         </div>
//         {/* <Link className="btn btn-ghost normal-case"><img className="lg:w-28 w-28" src={logo} alt="" /></Link> */}
//         <Link to="/" className="">
//           <img className="w-36 lg:w-36" src={logo} alt="" />
//         </Link>
//       </div>
//       <div className="navbar-center ml-auto hidden lg:flex ">
//         <ul className="text-light menu menu-horizontal px-1 text-lg">
//           {menuItems}
//         </ul>
//       </div>
//       {/* Logged in user – Show avatar with dropdown */}
//       {user?.uid ? (
//         <div className="dropdown dropdown-end mx-auto">
//           <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
//             <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
//               <img src={user?.photoURL || avatar} alt="profile" />
//             </div>
//           </label>
//           <ul
//             tabIndex={0}
//             className="dropdown-content menu shadow bg-base-100 rounded-box w-52 mt-3"
//           >
//             <li className="text-center font-bold my-3">{user.displayName}</li>
//             <div className="divider my-1"></div>
//             <li>
//               <Link to="/dashboard">Dashboard</Link>
//             </li>
//             <li>
//               <button onClick={handleLogOut}>Sign Out</button>
//             </li>
//           </ul>
//         </div>
//       ) : (
//         // Logged out user – Just a login button
//         <div className="mx-auto">
//           <Link to="/login" className="btn btn-ghost btn-circle">
//             <AiOutlineLogin className="text-3xl" />
//           </Link>
//         </div>
//       )}
      
//       {user?.uid && (
//         <label htmlFor="dashboard-drawer" tabIndex="2" className="btn-ghost btn lg:hidden">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
//         </label>
//       )}
//     </div>
//   );
// };

// export default Navbar;




// // import React, { useState, useEffect } from "react";
// // import { Link } from "react-router-dom";

// // const Navbar = () => {
// //   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// //   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

// //   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
// //   const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

// //   useEffect(() => {
// //     // Add padding to body to prevent content from going under the navbar
// //     document.body.style.paddingTop = "64px"; // Adjust this value if needed
// //     return () => {
// //       document.body.style.paddingTop = "0";
// //     };
// //   }, []);

// //   return (
// //     <nav className="fixed top-0 left-0 right-0 z-50 w-full shadow-md bg-[#326414] p-3 text-white h-16 flex items-center">
// //       <div className="container mx-auto flex items-center justify-between" style={{ maxWidth: "1400px" }}>
// //         {/* Left - Logo & Slogan */}
// //         <div className="flex items-center">
// //           <h1 className="text-xl font-bold">ZeroBiteWaste</h1>
// //           <p className="ml-2 text-[#F9E74B] text-sm">Every bite counts!</p>
// //         </div>

// //         {/* Center - Desktop Navigation */}
// //         <div className="hidden md:flex space-x-8 flex-grow justify-center">
// //           <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
// //           <Link to="/donate" className="hover:text-yellow-300 transition">Donate</Link>
// //           <Link to="/volunteer" className="hover:text-yellow-300 transition">Volunteer</Link>
// //           <Link to="/about" className="hover:text-yellow-300 transition">About</Link>
// //           <Link to="/contact" className="hover:text-yellow-300 transition">Contact</Link>
// //         </div>

// //         {/* Right - Dropdown & Hamburger Menu */}
// //         <div className="flex items-center space-x-6">
// //           {/* Desktop Dropdown Button */}
// //           <div className="hidden md:block relative">
// //             <button onClick={toggleDropdown} className="text-2xl hover:text-yellow-300 transition">
// //               ☰
// //             </button>
// //             {isDropdownOpen && (
// //               <div className="absolute right-0 mt-2 w-52 bg-white text-green-900 rounded-md shadow-lg z-50">
// //                 <ul className="py-2 text-sm">
// //                   <li><Link to="/top-contributor" className="block px-4 py-2 hover:bg-yellow-300">Top Contributors</Link></li>
// //                   <li><Link to="/volunteer-family" className="block px-4 py-2 hover:bg-yellow-300">Volunteer Family</Link></li>
// //                   <li><Link to="/charity-activities" className="block px-4 py-2 hover:bg-yellow-300">Charity Activities</Link></li>
// //                 </ul>
// //               </div>
// //             )}
// //           </div>

// //           {/* Mobile Hamburger Menu */}
// //           <div className="md:hidden">
// //             <button onClick={toggleMobileMenu} className="text-3xl focus:outline-none">
// //               {isMobileMenuOpen ? "✖" : "☰"}
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Mobile Dropdown Menu */}
// //       <div className={`md:hidden bg-[#326414] text-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-screen py-4 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
// //         <div className="flex flex-col space-y-4 text-center">
// //           <Link to="/" className="hover:text-yellow-300" onClick={toggleMobileMenu}>Home</Link>
// //           <Link to="/donate" className="hover:text-yellow-300" onClick={toggleMobileMenu}>Donate</Link>
// //           <Link to="/volunteer" className="hover:text-yellow-300" onClick={toggleMobileMenu}>Volunteer</Link>
// //           <Link to="/contact" className="hover:text-yellow-300" onClick={toggleMobileMenu}>Contact</Link>
// //           <Link to="/signin" className="hover:text-yellow-300" onClick={toggleMobileMenu}>Sign In</Link>
// //           <Link to="/top-contributor" className="hover:text-yellow-300" onClick={toggleMobileMenu}>Top Contributor</Link>
// //           <Link to="/volunteer-family" className="hover:text-yellow-300" onClick={toggleMobileMenu}>Volunteer Family</Link>
// //           <Link to="/charity-activities" className="hover:text-yellow-300" onClick={toggleMobileMenu}>Charity Activities</Link>
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;
