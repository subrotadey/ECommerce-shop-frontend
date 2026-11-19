import ProductsGrid from "../../components/Shared/ProductsGrid/ProductsGrid";
import { useAllProducts } from "../../hooks/useProducts";

const ShopAll = () => {
  const { data: products = [], isLoading, isError } = useAllProducts();

  return (
    <ProductsGrid
      products={products}
      isLoading={isLoading}
      isError={isError}
      category="Shop"
      breadcrumbs={[{ label: "SHOP" }]}
    />
  );
};

export default ShopAll;