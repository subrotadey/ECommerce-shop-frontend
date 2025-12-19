// components/product/SizeSelector.jsx
export default function SizeSelector({ sizes, selectedSize, onSelect, className = "" }) {
    if (!sizes || sizes.length === 0) return null;

    return (
        <div className={className}>
            <label className="block font-medium mb-2">Size</label>
            <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                    <button
                        key={size}
                        onClick={() => onSelect(size)}
                        className={`px-3 py-2 border rounded transition-colors ${
                            selectedSize === size
                                ? "border-black bg-black text-white"
                                : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                        {size}
                    </button>
                ))}
            </div>
        </div>
    );
}