// src/components/ProductCard/ProductCard.jsx
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded p-3">
      <img src={product.images?.[0]} alt={product.productName} className="w-full h-56 object-cover rounded" />
      <h3 className="mt-2 font-medium">{product.productName}</h3>
      <p className="text-red-600 font-bold">{product.newPrice} $</p>
      <Link to={`/product/${product._id}`} className="mt-3 inline-block text-sm text-blue-600 underline">
        View details
      </Link>
    </div>
  );
};

export default ProductCard;
