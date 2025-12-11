import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const BecomeInstructor = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const imageHostKey = process.env.REACT_APP_imgbb_key;

    const handleInstructorSubmit = (data) => {
        console.log("Instructor Data:", data);
        const image = data.img_link[0];
        const formData = new FormData();
        formData.append("image", image);
        const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
        fetch(url, {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((imgData) => {
                if (imgData.success) {
                    const instructor = {
                        first_name: data.first_name,
                        last_name: data.last_name,
                        img_link: imgData.data.url,
                        email: data.email,
                        designation: data.designation,
                        description: data.description,
                    };

                    // Save instructor information to the server
                    fetch("https://e-learning-server-hazel.vercel.app/instructor-requests", {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                            authorization: `bearer ${localStorage.getItem("accessToken")}`,
                        },
                        body: JSON.stringify(instructor),
                    })
                        .then((res) => res.json())
                        .then((result) => {
                            if (result.acknowledged) {
                                toast.success(`${data.first_name} is successfully added as an instructor`);
                                // clear the form
                            } else {
                                toast.error(result.message);
                            }
                        });
                }
            });


    };

    return (
        <div className="font-mono flex items-center justify-center px-4 py-10">
            
                {/* Form Section */}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-3xl font-semibold text-center mb-6">Become an Instructor</h2>

                    <form onSubmit={handleSubmit(handleInstructorSubmit)} className="space-y-4">
                        {/* First Name */}
                        <div>
                            <label className="block mb-1 text-left">First Name</label>
                            <input
                                type="text"
                                placeholder="First Name"
                                {...register("first_name", { required: "First name is required" })}
                                className="input input-bordered w-full bg-white"
                            />
                            {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block mb-1 text-left">Last Name</label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                {...register("last_name", { required: "Last name is required" })}
                                className="input input-bordered w-full bg-white"
                            />
                            {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}
                        </div>
                        {/* Email */}
                        <div>
                            <label className="block mb-1 text-left">Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                {...register("email", { required: "Email is required" })}
                                className="input input-bordered w-full bg-white"
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>

                        {/* Designation */}
                        <div>
                            <label className="block mb-1 text-left">Designation</label>
                            <input
                                type="text"
                                placeholder="e.g., Senior Web Developer"
                                {...register("designation", { required: "Designation is required" })}
                                className="input input-bordered w-full bg-white"
                            />
                            {errors.designation && <p className="text-red-500">{errors.designation.message}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block mb-1 text-left">Short Description</label>
                            <textarea
                                rows="4"
                                placeholder="Tell us about your experience..."
                                {...register("description", { required: "Description is required" })}
                                className="textarea textarea-bordered w-full bg-white"
                            />
                            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                        </div>
                        <div>
                            <label className="block mb-1 text-left">
                                Photo
                            </label>
                            <input
                                type="file"
                                {...register("img_link", { required: "Photo is Required" })}
                                className="file-input-bordered file-input-accent file-input w-full bg-white"
                            />
                            {errors.img_link && (
                                <p className="text-red-500">{errors.img_link.message}</p>
                            )}
                        </div>

                        <input type="submit" value="Submit Application" className="btn btn-accent w-full mt-2" />
                    </form>

                    <p className="mt-6 text-sm text-center">
                        Changed your mind?{" "}
                        <Link to="/" className="text-secondary underline">
                            Go back home
                        </Link>
                    </p>
                </div>
            
        </div>
    );
};

export default BecomeInstructor;
