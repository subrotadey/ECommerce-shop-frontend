// ============================================
// pages/admin/Reviews.jsx
// ============================================
import { useState } from 'react';
import { Search, Star, Check, X, Eye, Trash2, MessageSquare } from 'lucide-react';

const Reviews = () => {
    const [reviews, setReviews] = useState([
        {
            id: 1,
            customer: 'Sarah Johnson',
            product: 'Premium Abaya - Black',
            rating: 5,
            comment: 'Absolutely love this abaya! The quality is excellent and fits perfectly. Highly recommend!',
            date: '2024-01-15',
            status: 'approved',
            helpful: 24
        },
        {
            id: 2,
            customer: 'Michael Chen',
            product: 'Embroidered Hijab Set',
            rating: 4,
            comment: 'Good quality hijab set. The embroidery is beautiful. Only issue is the color was slightly different from the photo.',
            date: '2024-01-14',
            status: 'pending',
            helpful: 0
        },
        {
            id: 3,
            customer: 'Emma Wilson',
            product: 'Modest Dress - Navy',
            rating: 5,
            comment: 'Perfect dress for everyday wear. Comfortable fabric and modest design. Will buy again!',
            date: '2024-01-13',
            status: 'approved',
            helpful: 18
        },
        {
            id: 4,
            customer: 'James Brown',
            product: 'Prayer Mat Deluxe',
            rating: 3,
            comment: 'The mat is okay but expected better quality for the price. Thickness could be improved.',
            date: '2024-01-12',
            status: 'approved',
            helpful: 7
        },
        {
            id: 5,
            customer: 'Lisa Anderson',
            product: 'Silk Scarf - Burgundy',
            rating: 1,
            comment: 'Very disappointed. Material feels cheap and color faded after first wash.',
            date: '2024-01-11',
            status: 'pending',
            helpful: 0
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [selectedReview, setSelectedReview] = useState(null);

    const statuses = ['all', 'pending', 'approved', 'rejected'];
    const ratings = ['all', '5', '4', '3', '2', '1'];

    const filteredReviews = reviews.filter(review => {
        const matchesSearch = review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            review.comment.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
        const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
        return matchesSearch && matchesStatus && matchesRating;
    });

    const updateReviewStatus = (id, newStatus) => {
        setReviews(reviews.map(review =>
            review.id === id ? { ...review, status: newStatus } : review
        ));
    };

    const deleteReview = (id) => {
        if (confirm('Are you sure you want to delete this review?')) {
            setReviews(reviews.filter(review => review.id !== id));
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            approved: 'badge-success',
            pending: 'badge-warning',
            rejected: 'badge-error',
        };
        return colors[status];
    };

    const StarRating = ({ rating }) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                ))}
            </div>
        );
    };

    const ReviewDetailsModal = ({ review, onClose }) => {
        if (!review) return null;

        return (
            <div className="modal modal-open">
                <div className="modal-box max-w-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-xl">Review Details</h3>
                        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Customer & Product Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Customer</p>
                                    <p className="font-medium text-gray-900">{review.customer}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Product</p>
                                    <p className="font-medium text-gray-900">{review.product}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Date</p>
                                    <p className="font-medium text-gray-900">{review.date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Status</p>
                                    <span className={`badge ${getStatusColor(review.status)}`}>
                                        {review.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Rating */}
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Rating</p>
                            <div className="flex items-center gap-3">
                                <StarRating rating={review.rating} />
                                <span className="text-2xl font-bold text-gray-900">{review.rating}.0</span>
                            </div>
                        </div>

                        {/* Comment */}
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Review Comment</p>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <p className="text-gray-900">{review.comment}</p>
                            </div>
                        </div>

                        {/* Helpful Count */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                            <span className="text-sm text-gray-600">Marked as helpful</span>
                            <span className="font-semibold text-gray-900">{review.helpful} times</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            {review.status !== 'approved' && (
                                <button
                                    onClick={() => {
                                        updateReviewStatus(review.id, 'approved');
                                        onClose();
                                    }}
                                    className="btn btn-success flex-1 gap-2"
                                >
                                    <Check size={16} />
                                    Approve
                                </button>
                            )}
                            {review.status !== 'rejected' && (
                                <button
                                    onClick={() => {
                                        updateReviewStatus(review.id, 'rejected');
                                        onClose();
                                    }}
                                    className="btn btn-error flex-1 gap-2"
                                >
                                    <X size={16} />
                                    Reject
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    deleteReview(review.id);
                                    onClose();
                                }}
                                className="btn btn-ghost gap-2"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="modal-action">
                        <button onClick={onClose} className="btn">Close</button>
                    </div>
                </div>
            </div>
        );
    };

    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
                    <p className="text-gray-600 mt-1">Moderate customer reviews and ratings</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Reviews</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{reviews.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-2xl font-bold text-gray-900">{avgRating}</p>
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                        {reviews.filter(r => r.status === 'pending').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {reviews.filter(r => r.status === 'approved').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                        {reviews.filter(r => r.status === 'rejected').length}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search reviews..."
                                className="input input-bordered w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <select
                        className="select select-bordered"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        {statuses.map(status => (
                            <option key={status} value={status}>
                                {status === 'all' ? 'All Status' : status}
                            </option>
                        ))}
                    </select>
                    <select
                        className="select select-bordered"
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                    >
                        {ratings.map(rating => (
                            <option key={rating} value={rating}>
                                {rating === 'all' ? 'All Ratings' : `${rating} Stars`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {review.customer[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-semibold text-gray-900">{review.customer}</h4>
                                        <span className={`badge ${getStatusColor(review.status)} badge-sm`}>
                                            {review.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{review.product}</p>
                                    <div className="flex items-center gap-4 mb-3">
                                        <StarRating rating={review.rating} />
                                        <span className="text-sm text-gray-500">{review.date}</span>
                                    </div>
                                    <p className="text-gray-900">{review.comment}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <MessageSquare size={14} className="text-gray-400" />
                                        <span className="text-sm text-gray-600">{review.helpful} found this helpful</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 ml-4">
                                <button
                                    onClick={() => setSelectedReview(review)}
                                    className="btn btn-ghost btn-sm gap-1"
                                >
                                    <Eye size={16} />
                                    View
                                </button>
                                {review.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => updateReviewStatus(review.id, 'approved')}
                                            className="btn btn-success btn-sm gap-1"
                                        >
                                            <Check size={16} />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => updateReviewStatus(review.id, 'rejected')}
                                            className="btn btn-error btn-sm gap-1"
                                        >
                                            <X size={16} />
                                            Reject
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Review Details Modal */}
            {selectedReview && (
                <ReviewDetailsModal
                    review={selectedReview}
                    onClose={() => setSelectedReview(null)}
                />
            )}
        </div>
    );
};

export default Reviews;