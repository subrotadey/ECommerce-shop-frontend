import { Heart, MapPin, Phone, RefreshCw, Share2, Shield, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

// Import reusable components
import Swal from "sweetalert2";
import ColorSelector from "../../components/product/ColorSelector";
import ProductInfo from "../../components/product/ProductInfo";
import ProductPrice from "../../components/product/ProductPrice";
import QuantitySelector from "../../components/product/QuantitySelector";
import SizeSelector from "../../components/product/SizeSelector";
import StockBadge from "../../components/product/StockBadge";
import Loading from "../../components/Shared/Loading/Loading";
import ShareModal from "../../components/ShareModal/ShareModal";
import useAddToCart from "../../hooks/useAddToCart";
import { useAllProducts } from "../../hooks/useProducts";
import useWishlist from "../../hooks/useWishlist";

export default function ProductDetails() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const { isInWishlist, toggleWishlist, isToggling, userId } = useWishlist();
  const [activeTab, setActiveTab] = useState("description");
  const [showShareModal, setShowShareModal] = useState(false);

  // All products
  const { data: allProducts = [], isLoading } = useAllProducts();

  const product = allProducts.find(p => p._id === id || p.sku === id);

  const {
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    qty,
    setQty,
    error,
    handleAddToCart,
    sizes,
    colors
  } = useAddToCart(product);

  //  Wishlist toggle handler
  const handleToggleWishlist = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (userId === 'guest') {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Please log in to manage your wishlist",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#f8d7da",
        color: "#721c24",
      });
      return;
    }

    toggleWishlist(productId, {
      onSuccess: (data) => {
        if (data.inWishlist) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Added to wishlist!",
            showConfirmButton: false,
            timer: 1000,
            toast: true,
            background: "#d4edda",
            color: "#155724",
          });
        } else {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Removed from wishlist!",
            showConfirmButton: false,
            timer: 1000,
            toast: true,
            background: "#d4edda",
            color: "#155724",
          });
        }
      },
      onError: () => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Failed to update wishlist",
          showConfirmButton: false,
          timer: 1000,
          toast: true,
          background: "#f8d7da",
          color: "#721c24",
        });
      }
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link to="/abaya" className="text-blue-600 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discount = product?.oldPrice
    ? Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link to="/abaya" className="hover:text-black capitalize">{product.mainCategory}</Link>
            <span>/</span>
            <span className="text-black font-medium truncate">{product.productName}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-10 justify-around">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg aspect-3/4">
              <img
                src={product.images[selectedImage]}
                alt={product.productName}
                className="w-full h-full object-cover"
              />
              {product.tags?.includes("Best Seller") && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Best Seller
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 w-1/3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-1 aspect-square rounded-lg overflow-hidden border-3 transition-all ${selectedImage === idx ? "border-black shadow-md" : "border-gray-200"
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Stock */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {product.mainCategory}
                </span>
                <StockBadge stock={product.stock} />
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.productName}
              </h1>

              {/* Price */}
              <ProductPrice
                newPrice={product.newPrice}
                oldPrice={product.oldPrice}
                className="mb-4"
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {product.tags?.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <ProductInfo
              additionalInfo={product.additionalInfo}
              className="bg-gray-50 rounded-xl p-5 border border-gray-200"
            />

            {/* Size Selector */}
            <SizeSelector
              sizes={sizes}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />

            {/* Color Selector */}
            <ColorSelector
              colors={colors}
              selectedColor={selectedColor}
              onSelect={setSelectedColor}
            />

            {/* Quantity Selector */}
            <QuantitySelector
              qty={qty}
              onQtyChange={setQty}
              max={product.stock}
            />

            {/* Error Message */}
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={(e) => handleToggleWishlist(product._id, e)}
                  // disabled={isToggling}
                  className="py-3 border-2 border-gray-300 rounded-xl font-semibold hover:border-black transition-colors flex items-center justify-center gap-2">
                  <Heart
                    size={20}
                    className={`transition-all ${isInWishlist(product._id || product.sku)
                      ? 'fill-red-600 text-red-600'
                      : 'text-gray-600 group-hover/wishlist:text-red-600'
                      }`}
                  />
                  Wishlist
                </button>
                {/* Share Button */}
                <button
                  onClick={() => setShowShareModal(true)}
                  className="py-3 border-2 border-gray-300 rounded-xl font-semibold hover:border-black transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 size={18} />
                  Share
                </button>

                {/* Share Modal */}
                <ShareModal
                  isOpen={showShareModal}
                  onClose={() => setShowShareModal(false)}
                  product={product}
                />
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck size={20} className="text-gray-600" />
                <span className="text-gray-700">Free delivery on orders over $2000</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield size={20} className="text-gray-600" />
                <span className="text-gray-700">100% Original Products</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCw size={20} className="text-gray-600" />
                <span className="text-gray-700">Easy 7 days return & exchange</span>
              </div>
            </div>

            {/* SKU */}
            <p className="text-sm text-gray-500">SKU: <span className="font-mono">{product.sku}</span></p>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b">
            <div className="flex">
              {["description", "details", "contact"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 text-center font-semibold capitalize transition-colors ${activeTab === tab
                    ? "text-black border-b-3 border-black"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="p-8">
            {activeTab === "description" && (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}

            {activeTab === "details" && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-4">Product Specifications</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Fabric</p>
                    <p className="font-semibold">{product.additionalInfo.fabric}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Work Type</p>
                    <p className="font-semibold">{product.additionalInfo.workType}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Wash Care</p>
                    <p className="font-semibold">{product.additionalInfo.washCare}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Country of Origin</p>
                    <p className="font-semibold">{product.additionalInfo.countryOfOrigin}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((cat) => (
                      <span key={cat} className="px-3 py-1 bg-black text-white rounded-full text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-4">Visit Our Outlets</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 border-2 border-gray-200 rounded-xl">
                    <div className="flex items-start gap-3 mb-3">
                      <MapPin className="text-black mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Mohammadpur, Dhaka</h4>
                        <p className="text-gray-600">Tokyo Square, Shop No. 563 (5th Floor)</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-2 border-gray-200 rounded-xl">
                    <div className="flex items-start gap-3 mb-3">
                      <MapPin className="text-black mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Magura</h4>
                        <p className="text-gray-600">Noorjahan Plaza (2nd Floor)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-black text-white rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80 mb-1">24/7 Customer Support</p>
                    <p className="text-2xl font-bold">01757777765</p>
                  </div>
                  <Phone size={32} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}