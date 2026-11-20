// src/pages/HijabAll/HijabAll.jsx
import ProductsGrid from "../../components/Shared/ProductsGrid/ProductsGrid";
import useProducts from "../../hooks/useProducts";

const HijabAll = () => {
  const { data: hijabProducts = [], isLoading, isError } = useProducts("hijab");

  return (
    <ProductsGrid
      products={hijabProducts}
      isLoading={isLoading}
      isError={isError}
      category="Hijab"
      breadcrumbs={[{ label: "HIJAB" }]}
    />
  );
};

export default HijabAll;