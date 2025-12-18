import Loading from "../../components/Shared/Loading/Loading";
import ProductsGrid from "../../components/Shared/ProductsGrid/ProductsGrid";
import useProducts from "../../hooks/useProducts";

const HijabAll = () => {
    const { data: hijabProducts = [], isLoading, isError } = useProducts("hijab");

    if (isLoading) {
        return <Loading />;
    }

    return (
        <ProductsGrid
            products={hijabProducts}
            isLoading={isLoading}
            isError={isError}
            category="Hijab"
            breadcrumbs={[
                { label: 'HOME', link: '/' },
                { label: 'HIJAB' }
            ]}
        />
    );
};

export default HijabAll;