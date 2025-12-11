import { useState } from 'react';
import useProducts from '../../hooks/useProducts';
import { Heart } from 'lucide-react';

const HijabAll = () => {
    const { data: hijabProducts, isLoading: hijabLoading, isError: hijabError } = useProducts("hijab");
    console.log(useProducts.length);
    const [wish, setWish] = useState(false);

    const renderHijabCard = (product) => (
        <div key={product._id} className="group relative">
            <div className="relative flex justify-end overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
                <button
                    onClick={() => setWish(!wish)}
                    className={`m-2 absolute flex items-center justify-center gap-2 text-sm  uppercase
                        px-2 py-2 rounded-full shadow transition-all duration-200
                        ${wish ? "" : "bg-gray-200 text-black hover:bg-gray-300"}
                      `}
                >
                    <Heart
                        size={18}
                        className={`transition-all duration-200 w-8 h-8 ${wish ? "fill-red-700 text-white" : "text-black"
                            }`}
                    />
                    {wish ? "" : ""}
                </button>

                <img
                    alt={product.productName}
                    src={product.images[0]}
                    className="aspect-square w-full rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-80"
                />

            </div>
            <small className="mt-1 text-sm text-gray-500">
                {product.categories[0]} - {product.categories[1]}
            </small>

            <div className="mt-4 flex justify-between">
                <h3 className="text-sm text-gray-700">{product.productName}</h3>
            </div>

            <div>
                <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-500 line-through">
                        $ {product.oldPrice}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                        $ {product.newPrice}
                    </p>
                </div>
                <div>
                    {wish && (
                        <Link
                            to="/wishlist"
                            className="inline-block text-sm font-medium underline text-red-700 "
                        >
                            Visit Wishlist
                        </Link>
                    )}

                </div>
            </div>
            <button className="my-4 w-full uppercase btn btn-outline border-none shadow text-black bg-gray-200 hover:bg-gray-300">add to bag</button>
        </div>
    );

    return (
        <>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-16 lg:max-w-10/12 lg:px-8">
                    <div className="sm:flex sm:items-baseline sm:justify-between">
                        <h2 className=" tracking-tight text-gray-900">
                            Discover our elegant abaya collection with modern designs, premium fabrics, and timeless styles. Perfect for every occasion. Shop now for modest fashion trends!
                        </h2>
                    </div>

                    <div className="">
                        <div className="w-11/12 mx-auto mt-8">
                            <section className="mb-12">
                                <h2 className="text-2xl font-bold mb-4">Hijab Collection</h2>
                                {hijabLoading ? (
                                    <p>Loading Hijab products...</p>
                                ) : hijabError ? (
                                    <p>Error loading Hijab products.</p>
                                ) : hijabProducts.length === 0 ? (
                                    <p>No Hijab products found.</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {hijabProducts.map(renderHijabCard)}
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HijabAll;