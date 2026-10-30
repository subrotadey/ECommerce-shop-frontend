// src/components/ProductCard/ProductCard.jsx
import { Link } from "react-router-dom";

const getFirstImage = (product) => {
  const list = product.media?.images?.some((i) => i?.url) ? product.media.images : product.images;
  const first = Array.isArray(list)
    ? (list.find((i) => i?.isMain && i?.url) || list[0])
    : null;
  return (typeof first === "string" ? first : first?.url) || "https://placehold.co/300x400?text=Image";
};

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded p-3">
      <img src={getFirstImage(product)} alt={product.productName} className="w-full h-56 object-cover rounded" />
      <h3 className="mt-2 font-medium">{product.productName}</h3>
      <p className="text-red-600 font-bold">{product.newPrice} $</p>
      <Link to={`/product/${product._id}`} className="mt-3 inline-block text-sm text-blue-600 underline">
        View details
      </Link>
    </div>
  );
};

export default ProductCard;
