// components/product/ProductPrice.jsx
export default function ProductPrice({ newPrice, oldPrice, className = "" }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <span className="text-2xl font-bold text-primary">
                ${newPrice?.toLocaleString()}
            </span>
            {oldPrice && oldPrice > newPrice && (
                <>
                    <span className="line-through text-gray-400 text-lg">
                        ${oldPrice?.toLocaleString()}
                    </span>
                    <span className="badge badge-error text-white">
                        {Math.round(((oldPrice - newPrice) / oldPrice) * 100)}% OFF
                    </span>
                </>
            )}
        </div>
    );
}