import Loading from "../../components/Shared/Loading/Loading";
import ProductsGrid from "../../components/Shared/ProductsGrid/ProductsGrid";
import useProducts from "../../hooks/useProducts";

const AbayaAll = () => {
  const { data: abayaProducts = [], isLoading: abayaLoading, isError: abayaError } = useProducts("abaya");

  if (abayaLoading) {
    return <Loading />;
  }

  return (
    <ProductsGrid
      products={abayaProducts}
      isLoading={abayaLoading}
      isError={abayaError}
      category="Abaya"
      breadcrumbs={[
        { label: 'HOME', link: '/' },
        { label: 'BORKA', link: '/borka' },
        { label: 'ABAYA' }
      ]}
    />
  );
};

export default AbayaAll;