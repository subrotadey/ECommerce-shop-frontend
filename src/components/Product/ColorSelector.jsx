// components/product/ColorSelector.jsx
export default function ColorSelector({ colors, selectedColor, onSelect, className = "" }) {
    if (!colors || colors.length === 0) return null;

    return (
        <div className={className}>
            <label className="block font-medium mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                    <button
                        key={color}
                        onClick={() => onSelect(color)}
                        className={`px-3 py-2 border rounded transition-colors ${
                            selectedColor === color
                                ? "border-black bg-black text-white"
                                : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                        {color}
                    </button>
                ))}
            </div>
        </div>
    );
}