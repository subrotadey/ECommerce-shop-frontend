import { Outlet } from 'react-router';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import loginSVG from '../assets/icons/login.svg';

const AuthLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto flex flex-col items-center px-5 py-12 md:flex-row md:py-24">
        <div className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
          <Outlet />
        </div>
        <div className="mt-10 hidden w-full md:mt-0 block md:w-1/2 lg:max-w-lg">
          <img className="rounded object-cover object-center" alt="hero" src={loginSVG} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthLayout;