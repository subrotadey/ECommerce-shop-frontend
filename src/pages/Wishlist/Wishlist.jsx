import { Eye, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Shared/Breadcrumb/Breadcrumb';
import Loading from '../../components/Shared/Loading/Loading';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';

const Wishlist = () => {
    const { wishlist, isLoading, isError, removeFromWishlist, isRemoving } = useWishlist();
    const { addToCart, isAdding } = useCart();

    const handleRemove = (productId, productName) => {
        if (confirm(`Remove "${productName}" from wishlist?`)) {
            removeFromWishlist(productId, {
                onSuccess: () => {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `"${productName}" removed from wishlist\n`,
                        showConfirmButton: false,
                        timer: 1000,
                        toast: true,
                        background: "#d4edda",
                        color: "#155724",
                    });

                },
                onError: () => {
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: `Failed to remove "${productName}" from wishlist\n`,
                        showConfirmButton: false,
                        timer: 1000,
                        toast: true,
                        background: "#f8d7da",
                        color: "#721c24",
                    });
                }
            });
        }
    };

    const handleAddToCart = (product) => {
        addToCart(
            { productId: product._id, quantity: 1 },
            {
                onSuccess: () => {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `"${product.productName}" added to cart\n`,
                        showConfirmButton: false,
                        timer: 1000,
                        toast: true,
                        background: "#d4edda",
                        color: "#155724",
                    });
                },
                onError: () => {
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: `Failed to add "${product.productName}" to cart\n`,
                        showConfirmButton: false,
                        timer: 1000,
                        toast: true,
                        background: "#f8d7da",
                        color: "#721c24",
                    });
                }
            }
        );
    };

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600">Error loading wishlist</p>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <>
                <Breadcrumb />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-6">Start adding products you love!</p>
                        <Link to="/abaya" className="inline-block bg-gray-900 text-white hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
                            Browse Products
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Breadcrumb />
            <div className="bg-gray-50 min-h-screen py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Wishlist
                        </h1>
                        <p className="text-gray-600 mt-1">{wishlist.length} items</p>
                    </div>

                    <div className="space-y-4">
                        {wishlist.map(item => {
                            const product = item.product || item.productDetails;
                            const inStock = product.stock > 0;

                            return (
                                <div key={item._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                                        {/* Product Image */}
                                        <Link to={`/product/${product._id}`} className="shrink-0">
                                            <img
                                                src={product.images?.[0]}
                                                alt={product.productName}
                                                className="w-full sm:w-32 h-32 object-cover rounded-lg"
                                            />
                                        </Link>

                                        {/* Product Details */}
                                        <div className="grow">
                                            <div className="flex flex-col h-full">
                                                {/* Categories */}
                                                <p className="text-xs text-gray-500 mb-1">
                                                    {product.categories?.slice(0, 2).join(' • ')}
                                                </p>

                                                {/* Product Name */}
                                                <Link to={`/product/${product._id}`}>
                                                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-600 line-clamp-2">
                                                        {product.productName}
                                                    </h3>
                                                </Link>

                                                {/* Price */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    {product.oldPrice && (
                                                        <span className="text-sm text-gray-400 line-through">
                                                            ${product.oldPrice}
                                                        </span>
                                                    )}
                                                    <span className="text-xl font-bold text-gray-900">
                                                        ${product.newPrice}
                                                    </span>
                                                    {product.oldPrice && (
                                                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                                                            {Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100)}% OFF
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Stock Status */}
                                                <div className="mb-3">
                                                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${inStock
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                                                    </span>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap gap-2 mt-auto">
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        disabled={!inStock || isAdding}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${inStock
                                                            ? 'bg-gray-900 text-white hover:bg-gray-800'
                                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        <ShoppingBag size={16} />
                                                        {inStock ? 'Add to Cart' : 'Out of Stock'}
                                                    </button>

                                                    <Link
                                                        to={`/product/${product._id}`}
                                                        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-900 text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Eye size={16} />
                                                        View Details
                                                    </Link>

                                                    <button
                                                        onClick={() => handleRemove(product._id, product.productName)}
                                                        disabled={isRemoving}
                                                        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-600 text-red-600 rounded-lg font-medium text-sm hover:bg-red-50 transition-colors ml-auto"
                                                        title="Remove from wishlist"
                                                    >
                                                        <Trash2 size={16} />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Wishlist;