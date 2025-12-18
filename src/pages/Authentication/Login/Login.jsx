import { GoogleAuthProvider } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import SectionDivider from "../../../components/SectionDivider/SectionDivider";
import useToken from "../../../hooks/useToken";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "../../../hooks/useAuth";


function Login() {
  const {
    register, formState: { errors }, handleSubmit, setValue,
  } = useForm();

  

  const { signIn, providerLogin } = useContext(AuthContext) || {};
  const [loginError, setLoginError] = useState("");
  const [loginUserEmail, setLoginUserEmail] = useState("");
  const [token] = useToken(loginUserEmail);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (token) {
  //     navigate("/");
  //   }
  // }, [token, navigate]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (data) => {
    console.log(data);
    setLoginError("");
    signIn(data.email, data.password)
      .then(() => {
        setLoginUserEmail(data.email);
        navigate("/dashboard");
      })
      .catch((error) => {
        setLoginError(error.message);
      });
  };

  // const fillDemoAdmin = () => {
  //   setValue("email", "subrotadey540@gmail.com");
  //   setValue("password", "Admin@123");
  // };

  // const fillDemoInstructor = () => {
  //   setValue("email", "instructor@example.com");
  //   setValue("password", "Instructor@123");
  // };

  // const fillDemoUser = () => {
  //   setValue("email", "user@example.com");
  //   setValue("password", "User@123");
  // };

  return (
    <div className="mx-auto pt-20 flex items-center justify-center w-11/12 my-6">
      {/* Login Form */}
      <div className="w-full max-w-md md:w-5/12 rounded-lg shadow-lg p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
          Login to Your Account
        </h1>
        {/* <p className="mb-4 text-sm ">Click the button for role wise login</p> */}
        {/* <div className="flex justify-center gap-3 mb-6 flex-wrap">
                <button type="button" onClick={fillDemoAdmin} className="btn btn-sm btn-secondary">
                  Admin
                </button>
                <button type="button" onClick={fillDemoInstructor} className="btn btn-sm btn-accent">
                  Instructor
                </button>
                <button type="button" onClick={fillDemoUser} className="btn btn-sm btn-primary">
                  User
                </button>
              </div> */}


        <form onSubmit={handleSubmit(handleLogin)}>
          {/* Email Input */}
          <div className="form-control w-full mb-4">
            <label className="label block mb-2 text-sm font-medium text-black">
              <span className="label-text">Email</span>
            </label>
            <input
              {...register("email", {
                required: "Email Address is required",
              })}
              aria-invalid={errors.email ? "true" : "false"}
              type="email"
              className="input input-bordered input-neutral  bg-white border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
              placeholder="example@company.com" />
            {errors.email && <p className="text-red-600">{errors.email?.message}</p>}
          </div>

          {/* Password Input */}
          <div className="form-control w-full mb-4">
            <label className="label block mb-2 text-sm font-medium text-black">
              <span className="label-text">Password</span>
            </label>

            <div className="relative">

              <input
                className="input input-bordered input-neutral  bg-white border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
                type={showPassword ? "text" : "password"}
                placeholder="****** "
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password at least 6 characters"
                  },
                })} />

              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-gray-600 hover:text-black"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && <p className="text-red-600">{errors.password?.message}</p>}

            <label className="label">
              <Link to="/forgetpassword" className="text-sm underline hover:text-black  text-red-600">
                Forget Password?
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <input
            type="submit"
            value="Login"
            className="btn btn-active w-full mt-4" />
          {loginError && (
            <p className="text-red-800 mt-3 max-w-xs mx-auto text-left">{loginError}</p>
          )}
        </form>

        <p className="mt-4 text-sm text-center text-black">
          New to SHOP?{" "}
          <Link to="/signup" className="text-blue-600 underline hover:text-black ">
            Create new Account
          </Link>
        </p>

        <SectionDivider label="OR"></SectionDivider>
        <SocialLogin />
      </div>
    </div>
  );
}

export default Login;
