import { Link } from "react-router";
import SizeSelector from "../../product/SizeSelector";
import ColorSelector from "../../product/ColorSelector";
import QuantitySelector from "../../product/QuantitySelector";
import ProductPrice from "../../product/ProductPrice";
import StockBadge from "../../product/StockBadge";
import ProductInfo from "../../product/ProductInfo";
import useAddToCart from "../../../hooks/useAddToCart";

export default function QuickViewModal({ product, modalId = "quick_view_modal" }) {
    if (!product) return null;

    const { selectedSize, setSelectedSize, selectedColor, setSelectedColor, qty, setQty, error, handleAddToCart, sizes, colors} = useAddToCart(product);

    return (
        <>
            <input type="checkbox" id={modalId} className="modal-toggle" />
            <div className="modal" role="dialog">
                <div className="modal-box bg-white max-w-5xl p-0 ">
                    <label htmlFor={modalId} className="btn btn-sm btn-circle absolute right-2 top-2 z-10">
                        ✕
                    </label>

                    <section className="text-gray-600 body-font">
                        <div className="flex flex-col lg:flex-row">
                            {/* Image Section */}
                            <div className="lg:w-1/2 w-full bg-gray-200">
                                <img
                                    alt={product.productName}
                                    className="w-full h-[400px] lg:h-full object-cover"
                                    src={product.images?.[0]}
                                />
                            </div>

                            {/* Content Section */}
                            <div className="lg:w-1/2 w-full p-6 lg:p-10 flex flex-col">
                                {/* Category & Stock */}
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm title-font text-gray-500 tracking-widest uppercase">
                                        {product.mainCategory}
                                    </span>
                                    <StockBadge stock={product.stock} />
                                </div>

                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                    {product.productName}
                                </h1>

                                {/* Price */}
                                <ProductPrice
                                    newPrice={product.newPrice}
                                    oldPrice={product.oldPrice}
                                    className="mb-4"
                                />

                                {/* Product Info */}
                                <ProductInfo
                                    additionalInfo={product.additionalInfo}
                                    className="mb-6"
                                />

                                {/* Size Selector */}
                                <SizeSelector
                                    sizes={sizes}
                                    selectedSize={selectedSize}
                                    onSelect={setSelectedSize}
                                    className="mt-6"
                                />

                                {/* Color Selector */}
                                <ColorSelector
                                    colors={colors}
                                    selectedColor={selectedColor}
                                    onSelect={setSelectedColor}
                                    className="mt-6"
                                />

                                {/* Quantity Selector */}
                                <QuantitySelector
                                    qty={qty}
                                    onQtyChange={setQty}
                                    max={product.stock}
                                    className="mt-6"
                                />

                                {/* Error Message */}
                                {error && (
                                    <div className="alert alert-error mt-4">
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* CTA Buttons */}
                                <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-6">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0}
                                        className="btn btn-neutral flex-1 disabled:opacity-50"
                                    >
                                        Add to Bag
                                    </button>
                                    <Link
                                        to={`/product/${product._id || product.sku}`}
                                        className="btn btn-outline flex-1"
                                    >
                                        View Full Details
                                    </Link>
                                </div>

                                <p className="text-xs text-gray-400 mt-4 text-center">
                                    SKU: {product.sku}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <label htmlFor={modalId} className="modal-backdrop bg-black/50">
                    Close
                </label>
            </div>
        </>
    );
}