// components/product/StockBadge.jsx
export default function StockBadge({ stock, className = "" }) {
    if (stock > 10) {
        return (
            <div className={`badge badge-success badge-outline ${className}`}>
                In Stock ({stock})
            </div>
        );
    } else if (stock > 0) {
        return (
            <div className={`badge badge-warning badge-outline ${className}`}>
                Low Stock ({stock})
            </div>
        );
    } else {
        return (
            <div className={`badge badge-error badge-outline ${className}`}>
                Out of Stock
            </div>
        );
    }
}