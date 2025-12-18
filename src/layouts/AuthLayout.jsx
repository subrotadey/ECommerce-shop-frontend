import { Outlet } from 'react-router';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import loginSVG from '../assets/icons/login.svg';

const AuthLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                <div class="w-1/2 flex flex-col md:items-start md:text-left items-center text-center">
                    <Outlet></Outlet>
                </div>
                <div class="lg:max-w-lg lg:w-full w-1/2 mb-10 md:mb-0">
                    <img class="object-cover object-center rounded" alt="hero" src={loginSVG} />
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default AuthLayout;