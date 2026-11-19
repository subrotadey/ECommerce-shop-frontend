import { useMemo } from "react";
import ProductsGrid from "../../components/Shared/ProductsGrid/ProductsGrid";
import { useAllProducts } from "../../hooks/useProducts";
import { stamp } from "../../utils/homeProducts";

const NEW_ARRIVALS_LIMIT = 24;

const NewArrivals = () => {
  const { data: products = [], isLoading, isError } = useAllProducts();

  const latest = useMemo(
    () => [...products].sort((a, b) => stamp(b) - stamp(a)).slice(0, NEW_ARRIVALS_LIMIT),
    [products]
  );

  return (
    <ProductsGrid
      products={latest}
      isLoading={isLoading}
      isError={isError}
      category="New Arrivals"
      breadcrumbs={[{ label: "NEW ARRIVALS" }]}
    />
  );
};

export default NewArrivals;