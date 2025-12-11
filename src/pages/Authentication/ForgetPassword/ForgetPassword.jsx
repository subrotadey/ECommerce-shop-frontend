import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link } from "react-router";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";

const ForgetPassword = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { resetPassword } = useContext(AuthContext) || {};
  const [userEmail, setUserEmail] = useState("");

  const handleLogin = (data, e) => {
    e.preventDefault();
  };

  const handleEmailBlur = (event) => {
    const email = event.target.value;
    setUserEmail(email);
    // console.log(email);
  };

  const handleForgotPassword = () => {
    resetPassword(userEmail)
      .then(() => {
        toast("Password Reset Email Sent Successfully");
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <>
      <div className="mx-auto pt-20 flex items-center justify-center w-11/12 my-6">
        <div className="w-full max-w-md md:w-5/12 rounded-lg shadow-lg p-6 space-y-4 md:space-y-6 sm:p-8">
          {/* <div className="w-96 border-accent p-7"> */}
          <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
            Reset Password
          </h1>

          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="form-control w-full mb-4">
              <label className="label block mb-2 text-sm font-medium text-black">
                <span className="label-text ">Enter Your Email</span>
              </label>
              <input
                type="email"
                placeholder="example@company.com"
                onBlur={handleEmailBlur}
                className="input input-bordered input-neutral  bg-white border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
                {...register("email", {
                  required: "Email Address is required",
                })}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-red-600">{errors.email?.message}</p>
              )}
            </div>
            <input
              type="submit"
              value="Send Email"
              onClick={handleForgotPassword}
              className="btn btn-active w-full mt-4"
            />
          </form>
          <p className="mt-4 text-sm text-center text-black">
            New to Shop?{" "}
            <Link className="text-blue-600 underline hover:text-black" to="/signup">
              Create new Account
            </Link>
          </p>
        </div>
        {/* </div> */}
      </div>
    </>
  );
};

export default ForgetPassword;
