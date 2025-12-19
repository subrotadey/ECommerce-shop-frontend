import { useState } from "react";
import { Link } from "react-router";
import abaya_data from "../../assets/json/abayaData.json";

const Product = () => {
  const [wish, setWish] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      <div className="w-10/12 mx-auto">
        <div className="mx-auto px-4 py-16 sm:px-6 sm:py-24  lg:px-8">
          <div className="sm:flex sm:items-baseline sm:justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Customers also purchased
            </h2>
            <Link>
              {
                abaya_data.length > 8 ? (
                  <p className="mt-2 text-sm text-gray-500 hover:underline">
                    See all products &rarr;
                  </p>
                ) : null
              }
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {abaya_data.slice(0, 8).map((product, id) => (
              <div key={id} className="group relative">
                <div className="relative">
                  <img
                    alt={product.productName}
                    src={product.images[0]}
                    className="aspect-square w-full rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-80"
                  />

                  {/* Quick View Button */}
                  <label
                    htmlFor="my_modal_7"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded opacity-0 uppercase
                                    group-hover:opacity-100 group-hover:translate-y-2.5
                                    transition-all duration-300 ease-in-out cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Quick View
                  </label>

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
                    <button
                      className="mt-3 text-sm w-full uppercase btn btn-outline border-none shadow text-black bg-gray-200 hover:bg-gray-300"
                      onClick={() => setWish(!wish)}
                    >
                      {wish ? "✓ Added to wishlist" : "Add to Wishlist"}
                    </button>
                  </div>
                </div>
                <button className="my-4 w-full uppercase btn btn-outline border-none shadow text-black bg-gray-200 hover:bg-gray-300">add to bag</button>

                <input type="checkbox" id="my_modal_7" className="modal-toggle" />
                <div className="modal " role="dialog">
                  <div className="modal-box bg-gray-100 max-w-5xl">
                    <section className="text-gray-600 body-font overflow-hidden bg-gray-100">
                      <div className=" px-5  mx-auto">
                        <div className="mx-auto flex flex-wrap">
                          <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src={product.images[0]} />
                          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                            <h2 className="text-sm title-font text-gray-500 tracking-widest">BRAND NAME</h2>
                            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{product.productName}</h1>
                            <div className="flex mb-4">
                              <span className="flex items-center">
                                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                </svg>
                                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                </svg>
                                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                </svg>
                                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                </svg>
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                </svg>
                                <span className="text-gray-600 ml-3">4 Reviews</span>
                              </span>
                              <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
                                <a className="text-gray-500">
                                  <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                  </svg>
                                </a>
                                <a className="text-gray-500">
                                  <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                  </svg>
                                </a>
                                <a className="text-gray-500">
                                  <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                  </svg>
                                </a>
                              </span>
                            </div>
                            {/* <p className="leading-relaxed">{product.descriptionHtml}</p> */}
                            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                              <div className="flex">
                                <span className="mr-3">Color</span>
                                <button className="border-2 border-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>
                                <button className="border-2 border-gray-300 ml-1 bg-gray-700 rounded-full w-6 h-6 focus:outline-none"></button>
                                <button className="border-2 border-gray-300 ml-1 bg-indigo-500 rounded-full w-6 h-6 focus:outline-none"></button>
                              </div>
                              <div className="flex ml-6 items-center">
                                <span className="mr-3">Size</span>
                                <div className="relative">
                                  <select className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10">
                                    <option>SM</option>
                                    <option>M</option>
                                    <option>L</option>
                                    <option>XL</option>
                                  </select>
                                  <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
                                      <path d="M6 9l6 6 6-6"></path>
                                    </svg>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex">
                              <span className="title-font font-medium text-2xl text-gray-900">$58.00</span>
                              <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
                              <button className="my-4 uppercase btn btn-outline border-none shadow text-black bg-gray-200 hover:bg-gray-300">add to bag</button>
                              <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                                </svg>

                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                  <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
