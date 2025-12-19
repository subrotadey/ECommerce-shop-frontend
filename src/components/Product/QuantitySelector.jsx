// components/product/QuantitySelector.jsx
export default function QuantitySelector({ qty, onQtyChange, className = "", max }) {
    const handleIncrement = () => {
        if (max && qty >= max) return;
        onQtyChange(qty + 1);
    };

    const handleDecrement = () => {
        if (qty <= 1) return;
        onQtyChange(qty - 1);
    };

    const handleInputChange = (e) => {
        const value = Math.max(1, Number(e.target.value || 1));
        if (max && value > max) {
            onQtyChange(max);
        } else {
            onQtyChange(value);
        }
    };

    return (
        <div className={className}>
            <label className="block font-medium mb-2">Quantity</label>
            <div className="flex items-center border rounded w-fit">
                <button
                    onClick={handleDecrement}
                    disabled={qty <= 1}
                    className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    -
                </button>
                <input
                    value={qty}
                    onChange={handleInputChange}
                    className="w-16 text-center px-2 py-1 border-x focus:outline-none"
                    type="number"
                    min={1}
                    max={max}
                />
                <button
                    onClick={handleIncrement}
                    disabled={max && qty >= max}
                    className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    +
                </button>
            </div>
            {max && (
                <p className="text-xs text-gray-500 mt-1">Maximum: {max}</p>
            )}
        </div>
    );
}