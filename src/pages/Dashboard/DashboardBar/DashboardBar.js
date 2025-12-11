import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../../contexts/AuthProvider";
import useRole from "../../../Hooks/useRole";

const DashboardBar = () => {


    const ref = useRef(null)

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(ref.current.scrollTop > 10);
        };
        ref.current.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const { user } = useContext(AuthContext);
    const [role, isLoading] = useRole(user?.email);

    if (isLoading) return <div className="text-center mt-10">Loading...</div>;

    const isAdmin = role === "admin";
    const isInstructor = role === "instructor";

    const userNavLinks = [
        { name: 'My Profile', path: '/dashboard' },
        { name: 'My Courses', path: '/dashboard/my-booking' },
        { name: 'Become an Instructor', path: '/dashboard/becomeinstructor' },
    ];


    const instructorNavLinks = [
        { name: 'My Profile', path: '/dashboard' },
        { name: 'Add Course', path: '/dashboard/addcourse' },
        { name: 'My Publish Course', path: '/dashboard/teacher-course' },
    ];
    const adminNavLinks = [
        { name: 'My Profile', path: '/dashboard' },
        { name: 'Enrollment Stats', path: '/dashboard/enroll-stats' },
        { name: 'All Users', path: '/dashboard/allusers' },
        { name: 'My Courses', path: '/dashboard/my-booking' },
        { name: 'Manage Courses', path: '/dashboard/managecourses' },
        { name: 'Manage Teachers', path: '/dashboard/manageteachers' },
        { name: 'Add Course', path: '/dashboard/addcourse' },
        { name: 'Add a Teacher', path: '/dashboard/addteacher' },
        { name: 'Instructor Request', path: '/dashboard/instructor-requests' },
    ];

    const navLinks = isAdmin ? adminNavLinks : isInstructor ? instructorNavLinks : userNavLinks;


    return (
        <div ref={ref} className="">

            <nav className={`fixed transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

                {/* Mobile Menu Button */}
                <div className="flex items-right justify-end gap-3 md:hidden ">
                    <svg onClick={() => setIsMenuOpen(!isMenuOpen)} className={`h-6 w-6 cursor-pointer ${isScrolled ? "invert" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="4" y1="12" x2="20" y2="12" />
                        <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                </div>

                {/* Mobile Menu */}
                <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center py-10 gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
                            {link.name}
                        </a>
                    ))}
                </div>
            </nav>
        </div>
    );
}

export default DashboardBar;