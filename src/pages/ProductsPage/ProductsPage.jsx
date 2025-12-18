import React from "react";
import useProducts from "../../hooks/useProducts";
import Loading from "../../components/Shared/Loading/Loading";

const ProductsPage = () => {
  const { data: abayaProducts, isLoading: abayaLoading, isError: abayaError } = useProducts("abaya");
  const { data: hijabProducts, isLoading: hijabLoading, isError: hijabError } = useProducts("hijab");

  const renderProductCard = (product) => (
    <div key={product._id} className="border rounded-md p-4 shadow hover:shadow-lg transition">
      <img
        src={product.images[0]}
        alt={product.productName}
        className="w-full h-64 object-cover mb-2 rounded"
      />
      <h3 className="font-semibold">{product.productName}</h3>
      <p className="text-gray-600 line-through">{product.oldPrice} ৳</p>
      <p className="text-red-600 font-bold">{product.newPrice} ৳</p>
    </div>
  );

  return (
    <div className="w-11/12 mx-auto mt-8">
      {/* Abaya Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Abaya Collection</h2>
        {abayaLoading ? (
          // <p>Loading Abaya products...</p>
          <Loading />
        ) : abayaError ? (
          <p>Error loading Abaya products.</p>
        ) : abayaProducts.length === 0 ? (
          <p>No Abaya products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {abayaProducts.map(renderProductCard)}
          </div>
        )}
      </section>

      {/* Hijab Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Hijab Collection</h2>
        {hijabLoading ? (
          <Loading />
        ) : hijabError ? (
          <p>Error loading Hijab products.</p>
        ) : hijabProducts.length === 0 ? (
          <p>No Hijab products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {hijabProducts.map(renderProductCard)}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductsPage;
