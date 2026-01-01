// ============================================
// 6. components/UserDashboard/WishlistWidget.jsx
// ============================================
import { Heart, ChevronRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import useWishlist from '../../hooks/useWishlist';

const WishlistWidget = () => {
  const { wishlist, wishlistCount, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Heart className="text-pink-500" size={20} />
          My Wishlist
        </h3>
        <Link
          to="/wishlist"
          className="text-pink-600 hover:text-pink-700 font-semibold text-sm flex items-center gap-1"
        >
          View All
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold text-gray-900">{wishlistCount}</p>
        <p className="text-sm text-gray-600">Items in wishlist</p>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {wishlist.slice(0, 3).map((item) => (
            <div key={item._id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                alt={item.product?.productName}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">Your wishlist is empty</p>
      )}
    </div>
  );
};

export default WishlistWidget;