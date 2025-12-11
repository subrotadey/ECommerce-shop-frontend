// src/pages/ProductDetails/ProductDetails.jsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import useSingleProduct from "../../hooks/useSingleProduct";
// import { useCart } from "../../contexts/CartContext";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useCart from "../../hooks/useCart";

const ProductDetails = () => {
  const { productId } = useParams();
  const { data: product, isLoading, isError } = useSingleProduct(productId);
  const { addToCart, goToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  if (isLoading) return <div className="p-6">Loading product...</div>;
  if (isError) return <div className="p-6">Failed to load product.</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  const sizes = product.sizes ?? [];
  const colors = product.colors ?? [];

  const validate = () => {
    setError("");

    if (sizes.length > 0 && !selectedSize) {
      setError("Please select a size.");
      return false;
    }
    if (colors.length > 0 && !selectedColor) {
      setError("Please select a color.");
      return false;
    }
    if (qty < 1) {
      setError("Quantity must be at least 1.");
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!validate()) return;

    addToCart(product, {
      size: selectedSize,
      color: selectedColor,
      qty: Number(qty),
    });
    toast.success('Successfully toasted!')

    // SweetAlert
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Product added to cart",
      showConfirmButton: false,
      timer: 1000
    });
  };

  const handleBuyNow = () => {
    if (!validate()) return;

    addToCart(product, {
      size: selectedSize,
      color: selectedColor,
      qty: Number(qty),
    });

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Product added to cart",
      showConfirmButton: false,
      timer: 1500
    });
    // toast.success('Successfully toasted!')

    goToCart(); // Redirect to cart page instantly
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image Section */}
      <div>
        <img
          src={product.images?.[0] ?? ""}
          alt={product.productName}
          className="w-full h-[480px] object-cover rounded"
        />

        <div className="mt-4 flex gap-2">
          {product.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${product.productName}-${i}`}
              className="w-20 h-20 object-cover rounded border"
            />
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div>
        <h1 className="text-2xl font-semibold">{product.productName}</h1>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-xl font-bold text-red-600">
            {product.newPrice} ৳
          </span>
          {product.oldPrice && (
            <span className="line-through text-gray-400">
              {product.oldPrice} ৳
            </span>
          )}
        </div>

        {/* Description */}
        <div
          className="mt-4"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml ?? "" }}
        />

        {/* Size Selector */}
        {sizes.length > 0 && (
          <div className="mt-6">
            <label className="block font-medium mb-2">Size</label>
            <div className="flex gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-3 py-2 border rounded ${selectedSize === s
                    ? "border-black bg-black text-white"
                    : "border-gray-300"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selector */}
        {colors.length > 0 && (
          <div className="mt-6">
            <label className="block font-medium mb-2">Color</label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-3 py-2 border rounded ${selectedColor === c
                    ? "border-black bg-black text-white"
                    : "border-gray-300"
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center border rounded">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-2"
            >
              -
            </button>
            <input
              value={qty}
              onChange={(e) =>
                setQty(Math.max(1, Number(e.target.value || 1)))
              }
              className="w-16 text-center px-2 py-1"
              type="number"
              min={1}
            />
            <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2">
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-6 py-2 rounded font-medium"
            >
            Add to Cart
          </button>
          


          <button
            onClick={handleBuyNow}
            className="bg-red-600 text-white px-6 py-2 rounded font-medium"
          >
            Buy Now
          </button>
        </div>

        {error && <p className="text-red-600 mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default ProductDetails;






































// import { useState, useEffect } from "react";

// import abaya_data from '../../assets/json/abayaData.json';

// const ProductDetails = ({ product }) => {
//   const [selectedImage, setSelectedImage] = useState(product.images[0]);

//   // Variant-based price update
//   const [selectedColor, setSelectedColor] = useState(product.colors[0]);
//   const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
//   const [activePrice, setActivePrice] = useState(product.newPrice);

//   // Wishlist
//   const [wish, setWish] = useState(false);

//   // Zoom state
//   const [zoom, setZoom] = useState(false);
//   const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

//   // Countdown (48 hours delivery)
//   const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

//   useEffect(() => {
//     const targetTime = Date.now() + 48 * 60 * 60 * 1000;

//     const timer = setInterval(() => {
//       const now = Date.now();
//       const diff = targetTime - now;

//       if (diff <= 0) return clearInterval(timer);

//       setTimeLeft({
//         h: Math.floor(diff / (1000 * 60 * 60)),
//         m: Math.floor((diff / (1000 * 60)) % 60),
//         s: Math.floor((diff / 1000) % 60),
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   // Variant price logic
//   useEffect(() => {
//     if (product.variantPrices) {
//       const priceKey = `${selectedColor.name}-${selectedSize}`;
//       if (product.variantPrices[priceKey]) {
//         setActivePrice(product.variantPrices[priceKey]);
//       } else {
//         setActivePrice(product.newPrice);
//       }
//     }
//   }, [selectedColor, selectedSize, product.variantPrices, product.newPrice]);

//   // Zoom effect
//   const handleMouseMove = (e) => {
//     const rect = e.target.getBoundingClientRect();
//     const x = ((e.clientX - rect.left) / rect.width) * 100;
//     const y = ((e.clientY - rect.top) / rect.height) * 100;
//     setZoomPosition({ x, y });
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10">

//       {/* Breadcrumb */}
//       <div className="text-sm text-gray-500 mb-4 flex gap-2">
//         <span>Home</span> › <span>Women</span> › <span>Abaya</span> ›
//         <span className="text-black">{product.productName}</span>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

//         {/* LEFT SECTION — STICKY */}
//         <div className="lg:sticky lg:top-5 h-fit">

//           {/* Main Image with Advanced Zoom */}
//           <div
//             className="w-full h-[550px] bg-gray-100 rounded-lg overflow-hidden shadow-sm relative"
//             onMouseEnter={() => setZoom(true)}
//             onMouseLeave={() => setZoom(false)}
//             onMouseMove={handleMouseMove}
//           >
//             <img
//               src={selectedImage}
//               alt="Product"
//               className={`w-full h-full object-cover transition-all duration-300
//                 ${zoom ? "scale-150" : "scale-100"}`}
//               style={{
//                 transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
//               }}
//             />
//           </div>

//           {/* Thumbnail Slider */}
//           <div className="flex gap-3 mt-5 overflow-x-auto">
//             {product.images.map((img, i) => (
//               <img
//                 key={i}
//                 src={img}
//                 onClick={() => setSelectedImage(img)}
//                 className={`h-20 w-20 rounded-md cursor-pointer border transition
//                   ${selectedImage === img ? "border-black" : "border-transparent"}`}
//               />
//             ))}
//           </div>

//         </div>

//         {/* RIGHT SECTION */}
//         <div>
//           <h2 className="text-sm text-gray-500">
//             {product.brand || "Abaya Shop Premium Collection"}
//           </h2>

//           <h1 className="text-3xl font-bold mt-1">{product.productName}</h1>

//           {/* Stock Availability */}
//           <p
//             className={`mt-2 font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-600"
//               }`}
//           >
//             {product.stock > 0
//               ? `In stock — ${product.stock} pieces`
//               : "Out of stock"}
//           </p>

//           {/* Price + Sold + Rating */}
//           <div className="flex items-center gap-4 mt-3">
//             <p className="text-gray-500 line-through text-lg">৳ {product.oldPrice}</p>
//             <p className="text-black font-bold text-2xl">৳ {activePrice}</p>
//             <p className="text-sm text-gray-600">{product.sold || "1,238 Sold"}</p>
//             <p className="text-sm font-semibold flex items-center gap-1">
//               ⭐ {product.rating || "4.5"}
//             </p>
//           </div>

//           {/* Wishlist */}
//           <button
//             className="mt-3 text-sm underline"
//             onClick={() => setWish(!wish)}
//           >
//             {wish ? "✓ Added to wishlist" : "Add to Wishlist"}
//           </button>

//           <hr className="my-6" />

//           {/* Delivery Countdown */}
//           <div className="bg-gray-100 p-4 rounded mb-6">
//             <p className="text-sm font-semibold">Order within:</p>
//             <p className="text-xl font-bold text-red-600">
//               {timeLeft.h}h : {timeLeft.m}m : {timeLeft.s}s
//             </p>
//             <p className="text-xs text-gray-500">Fast delivery available</p>
//           </div>

//           {/* Description */}
//           <div>
//             <h3 className="text-lg font-bold mb-2">Description</h3>
//             <div
//               className="text-gray-700 leading-6"
//               dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
//             ></div>
//           </div>

//           <hr className="my-6" />

//           {/* Colors */}
//           <div>
//             <h3 className="text-lg font-bold mb-2">
//               Color: <span className="font-normal">{selectedColor.name}</span>
//             </h3>

//             <div className="flex gap-3 mt-3">
//               {product.colors.map((color, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setSelectedColor(color)}
//                   className={`h-10 w-14 rounded border ${selectedColor.hex === color.hex
//                     ? "border-black"
//                     : "border-gray-300"
//                     }`}
//                   style={{ backgroundColor: color.hex }}
//                 ></button>
//               ))}
//             </div>
//           </div>

//           <hr className="my-6" />

//           {/* Sizes */}
//           <div>
//             <h3 className="text-lg font-bold mb-2">
//               Size: <span className="font-normal">{selectedSize}</span>
//             </h3>

//             <div className="flex flex-wrap gap-3 mt-3">
//               {product.sizes.map((size, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setSelectedSize(size)}
//                   className={`px-5 py-2 rounded border text-sm ${selectedSize === size
//                     ? "bg-black text-white border-black"
//                     : "bg-white text-gray-700 border-gray-300"
//                     }`}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="mt-8 flex gap-4">
//             <button className="bg-black text-white px-10 py-3 rounded font-semibold hover:bg-gray-800">
//               Add To Cart
//             </button>

//             <button className="border border-black text-black px-10 py-3 rounded font-semibold hover:bg-black hover:text-white">
//               Checkout Now
//             </button>
//           </div>

//           <p className="text-sm mt-4 underline cursor-pointer">
//             Delivery T&C
//           </p>
//         </div>
//       </div>

//       {/* RELATED PRODUCTS */}
//       <div className="mt-20">
//         <h2 className="text-2xl font-bold mb-6">Related Products</h2>

//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//           {product.relatedProducts.map((item, i) => (
//             <div key={i} className="border p-3 rounded-lg bg-white shadow-sm">
//               <img
//                 src={item.images[0]}
//                 className="h-52 w-full object-cover rounded"
//               />
//               <p className="text-sm mt-2 text-gray-600">{item.productName}</p>
//               <p className="font-bold">৳ {item.newPrice}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;
