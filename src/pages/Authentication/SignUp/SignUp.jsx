import { GoogleAuthProvider } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import SectionDivider from "../../../components/SectionDivider/SectionDivider";
import useToken from "../../../hooks/useToken";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import SocialLogin from "../SocialLogin/SocialLogin";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, updateUser, providerLogin, verifyEmail } = useAuth();



  const [signUpError, setSignUpError] = useState("");
  const googleProvider = new GoogleAuthProvider();
  const location = useLocation();
  const [userCreatedEmail, setUserCreatedEmail] = useState("");
  const [token] = useToken(userCreatedEmail);
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";

  if (token) {
    navigate(from, { replace: true });
  }

  const [showPassword, setShowPassword] = useState(false);
  const [setPassword] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignUp = (data) => {
    console.log(data);
    console.log(createUser);

    setSignUpError("");
    createUser(data.email, data.password)
      .then((result) => {
        const user = result.user;
        toast("User Created Successfully");
        verifyEmail(user);
        const userInfo = {
          displayName: data.name,
        };
        updateUser(userInfo)
          .then(() => {
            saveUser(data.name, data.email);
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        setSignUpError(error.message);
      });
  };

  // const saveUser = (name, email) => {
  //   const user = { name, email };
  //   fetch("https://e-learning-server-hazel.vercel.app/users", {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify(user),
  //   })
  //     .then((res) => res.json())
  //     .then(() => {
  //       setUserCreatedEmail(email);
  //     });
  // };

  return (
    <div className="mx-auto pt-20 flex items-center justify-center w-11/12 my-6">
      {/* Sign Up Form */}
      <div className="w-full max-w-md md:w-5/12 rounded-lg shadow-lg p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
          Create an account
        </h1>
        <form onSubmit={handleSubmit(handleSignUp)}>
          {/* Name */}
          <div className="form-control w-full mb-4">
            <label className="label block mb-2 text-sm font-medium text-black">
              <span className="label-text text-black">Name</span>
            </label>

            <input
              type="text"
              placeholder="John Doe"
              className="input input-bordered input-neutral  bg-white border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
              {...register("name", { required: "Name is Required" })}

            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="form-control w-full mb-4">
            <label className="label block mb-2 text-sm font-medium text-black">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="example@company.com"
              className="input input-bordered input-neutral  bg-white border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
              {...register("email", { required: true })}
            />
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="form-control w-full mb-4">
            <label className="label block mb-2 text-sm font-medium text-black">
              <span className="label-text">Password</span>
            </label>

            <div className="relative">
              <input
                className="input input-bordered bg-white border border-gray-300 text-black text-sm rounded-lg w-full p-2.5 pr-12"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                placeholder="******"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be 6 characters long",
                  },
                  pattern: {
                    value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/,
                    message:
                      "Password must have uppercase, number and special characters",
                  },
                })}
              />

              {/* Eye Icon */}
              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-gray-600 hover:text-black"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input id="terms" aria-describedby="terms" type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-white focus:ring-3 focus:ring-blue-300"
                required />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-light text-black">
                I accept the <a className="font-medium text-blue-600 hover:underline" href="#">Terms and Conditions</a>
              </label>
            </div>
          </div>


          {/* Submit */}
          <input
            className="btn btn-active w-full mt-4"
            value="Sign Up"
            type="submit"
          />
          {signUpError && <p className="text-red-600 mt-2">{signUpError}</p>}
        </form>

        <p className="mt-4 text-sm text-center text-black">
          Already have an account?{" "}
          <Link className="text-blue-600 underline hover:text-black " to="/login">
            Login here
          </Link>
        </p>

        <SectionDivider label="OR"></SectionDivider>
        <SocialLogin />
      </div>
    </div>
  );
};

export default SignUp;
