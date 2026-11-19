import { useMemo } from "react";
import { Link } from "react-router";
import ProductsGrid from "../../components/Shared/ProductsGrid/ProductsGrid";
import { useAllProducts } from "../../hooks/useProducts";

const BestSellers = () => {
  const { data: products = [], isLoading, isError } = useAllProducts();

  const best = useMemo(
    () => products.filter((p) => p.tags?.includes("Best Seller")),
    [products]
  );

  if (!isLoading && !isError && best.length === 0) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-2 text-2xl font-bold text-charcoal">Best Sellers</h1>
        <p className="mb-6 text-sm text-charcoal/70">
          Our best sellers list is being updated. Browse the full collection in the meantime.
        </p>
        <Link
          to="/shop"
          className="rounded-xl bg-charcoal px-6 py-3 text-sm font-semibold text-white"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <ProductsGrid
      products={best}
      isLoading={isLoading}
      isError={isError}
      category="Best Sellers"
      breadcrumbs={[{ label: "BEST SELLERS" }]}
    />
  );
};

export default BestSellers;