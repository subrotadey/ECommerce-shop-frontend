// src/pages/AbayaAll/AbayaAll.jsx
import ProductsGrid from "../../components/Shared/ProductsGrid/ProductsGrid";
import useProducts from "../../hooks/useProducts";

const AbayaAll = () => {
  const { data: abayaProducts = [], isLoading, isError } = useProducts("abaya");

  return (
    <ProductsGrid
      products={abayaProducts}
      isLoading={isLoading}
      isError={isError}
      category="Abaya"
      breadcrumbs={[{ label: "ABAYA" }]}
    />
  );
};

export default AbayaAll;