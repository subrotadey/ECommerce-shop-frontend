import React, { useEffect, useState, useContext, useCallback } from "react";
import { FaStar } from "react-icons/fa";
import SubmitReview from "./SubmitReview";
import { AuthContext } from "../../../../contexts/AuthProvider";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmationModal from "../../Shared/ConfirmationModal/ConfirmationModal";

const CourseReviews = () => {
    const { courseId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [average, setAverage] = useState(0);
    const { user } = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [deleteReview, setDeleteReview] = useState(null);
    const closeModal = () => {
        setDeleteReview(null);
    };
    // Fetch reviews and average rating
    // Using useCallback to memoize the function
    const fetchReviews = useCallback(async () => {
        const [resReviews, resAverage] = await Promise.all([
            fetch(`https://e-learning-server-hazel.vercel.app/reviews/${courseId}`),
            fetch(`https://e-learning-server-hazel.vercel.app/reviews/average/${courseId}`)
        ])
        const [reviewsData, averageData] = await Promise.all([
            resReviews.json(), resAverage.json()
        ]);
        setReviews(reviewsData);
        setAverage(averageData?.averageRating || 0);
    }, [courseId]);

    useEffect(() => {
        // Fetch reviews and average rating when courseId changes
        fetchReviews();
    }, [fetchReviews]);

    useEffect(() => {
    if (user?.email) {
        fetch(`https://e-learning-server-hazel.vercel.app/users/role/${user.email}`)
            .then(res => res.json())
            .then(data => {
                console.log("User Role:", data);
                setIsAdmin(data.role === "admin");
            })
            .catch(err => console.error("Error fetching role:", err));
    }
}, [user]);



    const handleDelete = (review) => {
        fetch(`https://e-learning-server-hazel.vercel.app/reviews/${review._id}`, {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.deletedCount > 0) {
                    toast.success('Review deleted successfully');
                    closeModal();
                    fetchReviews();
                }
            });
    };

    return (
        <div className="my-10 space-y-6">
            <h2 className="text-xl font-bold">Student Reviews</h2>
            {/* Average Rating */}
            <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.round(average) ? "" : "text-gray-300"} />
                    ))}
                </div>
                <p className="text-gray-600">Average: {average.toFixed(1)} / 5</p>
            </div>

            {/* Review List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <p className="text-sm text-gray-500">No reviews yet for this course.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="p-4  rounded-lg">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold">{review.user}</h4>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, j) => (
                                        <FaStar key={j} className={j < review.rating ? "" : "text-gray-300"} />
                                    ))}
                                </div>
                                {
                                    isAdmin && (
                                        <label
                                            onClick={() => setDeleteReview(review)}
                                            htmlFor="confirmation-modal"
                                            className="text-xs text-red-500 hover:underline btn btn-sm"
                                        >
                                            Delete
                                        </label>
                                    )
                                }
                            </div>
                            <p className="italic text-sm mt-2">"{review.message}"</p>
                            <p className="text-xs text-right text-gray-400">{review.date}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Submit Review (If logged in) */}
            {user?.email ? (
                <SubmitReview courseId={courseId} setAverage={setAverage} refetchReviews={fetchReviews} />
            ) : (
                <p className="text-sm text-gray-500">Please login to write a review.</p>
            )}

            {deleteReview && (
                <ConfirmationModal
                    title={`Confirm Delete Review`}
                    message={`Are you sure you want to delete this review?`}
                    successAction={handleDelete}
                    successButtonName="Delete"
                    modalData={deleteReview}
                    closeModal={closeModal}
                ></ConfirmationModal>
            )}

        </div>
    );
};

export default CourseReviews;