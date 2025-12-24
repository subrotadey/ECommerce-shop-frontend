// components/Cart/Cart.jsx - PRODUCTION READY
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, Minus, Plus } from "lucide-react";
import useCart from "../../hooks/useCart";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/Shared/Breadcrumb/Breadcrumb";
import Loading from "../../components/Shared/Loading/Loading";

const Cart = () => {
  const { 
    items, 
    updateQty, 
    removeItem, 
    clearCart,
    isLoading,
    isError,
    isUpdating,
    isRemoving,
    isClearing
  } = useCart();
  
  const navigate = useNavigate();

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Handle quantity change
  const handleQtyChange = (key, newQty, itemName) => {
    if (newQty < 1) {
      handleRemoveItem(key, itemName);
      return;
    }
    updateQty(key, newQty);
  };

  // Handle item removal with confirmation
  const handleRemoveItem = (key, itemName) => {
    Swal.fire({
      title: 'Remove from cart?',
      text: `Remove "${itemName}" from your cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        removeItem(key);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `"${itemName}" removed from cart`,
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          background: "#d4edda",
          color: "#155724",
        });
      }
    });
  };

  // Handle clear cart with confirmation
  const handleClearCart = () => {
    Swal.fire({
      title: 'Clear entire cart?',
      text: `Remove all ${items.length} items from your cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, clear cart',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Cart cleared successfully",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          background: "#d4edda",
          color: "#155724",
        });
      }
    });
  };

  // Handle checkout
  const handleCheckout = () => {
    if (items.length === 0) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Cart is empty",
        text: "Add items to cart before checkout",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
      });
      return;
    }
    navigate("/checkout");
  };

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  // Error state
  if (isError) {
    return (
      <>
        <Breadcrumb />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-xl mb-4">Error loading cart</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  // Empty cart state
  if (!items || items.length === 0) {
    return (
      <>
        <Breadcrumb />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start adding products you love!</p>
            <Link 
              to="/abaya" 
              className="inline-block bg-gray-900 text-white hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Cart with items
  return (
    <>
      <Breadcrumb />
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
            >
              {isClearing ? 'Clearing...' : 'Clear cart'}
            </button>
          </div>

          {/* Cart Items */}
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div 
                key={item.key} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <Link to={`/product/${item.productId}`} className="shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full sm:w-32 h-32 object-cover rounded-lg" 
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex flex-col h-full">
                      {/* Name */}
                      <Link to={`/product/${item.productId}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-gray-600 mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>

                      {/* Size & Color */}
                      <div className="text-sm text-gray-600 mb-2">
                        {item.size && item.size !== "NOSIZE" && (
                          <span className="mr-3">Size: <span className="font-medium">{item.size}</span></span>
                        )}
                        {item.color && item.color !== "NOCOLOR" && (
                          <span>Color: <span className="font-medium">{item.color}</span></span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        {item.oldPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ৳{item.oldPrice}
                          </span>
                        )}
                        <span className="text-xl font-bold text-gray-900">
                          ৳{item.price}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3 mt-auto">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 border rounded-lg">
                          <button
                            onClick={() => handleQtyChange(item.key, item.qty - 1, item.name)}
                            disabled={isUpdating || item.qty <= 1}
                            className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          
                          <input
                            value={item.qty}
                            onChange={(e) => {
                              const val = Math.max(1, Number(e.target.value || 1));
                              handleQtyChange(item.key, val, item.name);
                            }}
                            className="w-12 text-center border-x px-2 py-2 focus:outline-none"
                            type="number"
                            min={1}
                            disabled={isUpdating}
                          />
                          
                          <button
                            onClick={() => handleQtyChange(item.key, item.qty + 1, item.name)}
                            disabled={isUpdating}
                            className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            title="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="flex-1 text-right sm:text-left">
                          <p className="text-sm text-gray-600">Subtotal:</p>
                          <p className="font-bold text-gray-900 text-lg">
                            ৳{(item.price * item.qty).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button 
                          onClick={() => handleRemoveItem(item.key, item.name)} 
                          disabled={isRemoving}
                          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-600 text-red-600 rounded-lg font-medium text-sm hover:bg-red-50 transition-colors disabled:opacity-50 ml-auto"
                          title="Remove from cart"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg text-gray-600">Subtotal:</p>
              <p className="text-2xl font-bold text-gray-900">৳{subtotal.toFixed(2)}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/abaya"
                className="flex-1 text-center bg-white border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
              
              <button
                onClick={handleCheckout}
                className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;