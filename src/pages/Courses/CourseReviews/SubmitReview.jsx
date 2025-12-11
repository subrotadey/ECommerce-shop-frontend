import React, { useContext, useState } from "react";
import { FaStar } from "react-icons/fa";
import { AuthContext } from "../../../../contexts/AuthProvider";
import toast from "react-hot-toast";
// import { useLoaderData } from "react-router-dom";

const SubmitReview = ({ courseId, setAverage, refetchReviews }) => {

    const { user } = useContext(AuthContext);
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);


    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Rating validation
        if (rating === 0) {
            toast.error("Please select a rating before submitting.");
            setSubmitting(false);
            return;
        }


        const review = {
            courseId: courseId,
            user: user.displayName || user.email,
            rating,
            message,
            date: new Date().toISOString().split("T")[0]
        };
        // Submit review to server

        fetch("https://e-learning-server-hazel.vercel.app/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(review)
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.acknowledged) {
                    toast.success("Review submitted!");
                }

                // Reset form
                setRating(0);
                setHovered(0);
                setMessage("");

                // Show new review instantly
                refetchReviews();

                // Update average rating
                fetch(`https://e-learning-server-hazel.vercel.app/reviews/average/${courseId}`)
                    .then(res => res.json())
                    .then(avg => {
                        setAverage(avg?.averageRating || 0);
                        setSubmitting(false);
                    });
            });
    };


    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <p className="font-semibold">Leave a review</p>

            {/* Star Rating */}
            <div className="flex text-yellow-500 gap-1">
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        className={`cursor-pointer ${i < (hovered || rating) ? "" : "text-gray-300"}`}
                        onMouseEnter={() => setHovered(i + 1)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(i + 1)}
                    />
                ))}
            </div>

            <textarea
                className="textarea textarea-bordered w-full"
                rows={3}
                placeholder="Write your feedback..."
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={submitting}
            >
                {submitting ? "Submitting..." : "Submit Review"}
            </button>

        </form>
    );
};

export default SubmitReview;
