import { useState, useMemo } from 'react';
import { Heart, X, SlidersHorizontal, Search } from 'lucide-react';
import useWishlist from '../../../hooks/useWishlist';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import QuickViewModal from '../QuickViewModal/QuickViewModal';
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import Loading from '../Loading/Loading';

// Reusable ProductsGrid Component
export default function ProductsGrid({
  products = [],
  isLoading = false,
  isError = false,
  category = "Products",
  breadcrumbs = []
}) {
  const [showFilters, setShowFilters] = useState(false);
  const { isInWishlist, toggleWishlist, isToggling, userId } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('default');
  const [selectedTags, setSelectedTags] = useState([]);

  // Extract unique values from products
  const allCategories = useMemo(() =>
    [...new Set(products.flatMap(p => p.categories || []))],
    [products]
  );

  const allTags = useMemo(() =>
    [...new Set(products.flatMap(p => p.tags || []))],
    [products]
  );

  const allColors = useMemo(() =>
    [...new Set(products.flatMap(p => p.colors || []))],
    [products]
  );

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 10000;
    const max = Math.max(...products.map(p => p.newPrice));
    return Math.ceil(max / 1000) * 1000; // Round up to nearest 1000
  }, [products]);

  // Initialize price range when products load
  useMemo(() => {
    if (products.length > 0 && priceRange[1] === 10000) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice, products.length]);

  //  Wishlist toggle handler
  const handleToggleWishlist = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (userId === 'guest') {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Please log in to manage your wishlist",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#f8d7da",
        color: "#721c24",
      });
      return;
    }

    toggleWishlist(productId, {
      onSuccess: (data) => {
        if (data.inWishlist) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Added to wishlist!",
            showConfirmButton: false,
            timer: 1000,
            toast: true,
            background: "#d4edda",
            color: "#155724",
          });
        } else {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Removed from wishlist!",
            showConfirmButton: false,
            timer: 1000,
            toast: true,
            background: "#d4edda",
            color: "#155724",
          });
        }
      },
      onError: () => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Failed to update wishlist",
          showConfirmButton: false,
          timer: 1000,
          toast: true,
          background: "#f8d7da",
          color: "#721c24",
        });
      }
    });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 ||
        selectedCategories.some(cat => product.categories?.includes(cat));
      const matchesColor = selectedColors.length === 0 ||
        selectedColors.some(color => product.colors?.includes(color));
      const matchesPrice = product.newPrice >= priceRange[0] && product.newPrice <= priceRange[1];
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => product.tags?.includes(tag));

      return matchesSearch && matchesCategory && matchesColor && matchesPrice && matchesTags;
    });

    switch (sortBy) {
      case 'popularity':
        return filtered.sort((a, b) => (b.tags?.includes('Best Seller') ? 1 : 0) - (a.tags?.includes('Best Seller') ? 1 : 0));
      case 'latest':
        return [...filtered].reverse();
      case 'price-low':
        return filtered.sort((a, b) => a.newPrice - b.newPrice);
      case 'price-high':
        return filtered.sort((a, b) => b.newPrice - a.newPrice);
      case 'discount':
        return filtered.sort((a, b) => {
          const discountA = a.oldPrice ? ((a.oldPrice - a.newPrice) / a.oldPrice) * 100 : 0;
          const discountB = b.oldPrice ? ((b.oldPrice - b.newPrice) / b.oldPrice) * 100 : 0;
          return discountB - discountA;
        });
      default:
        return filtered;
    }
  }, [products, searchQuery, selectedCategories, selectedColors, priceRange, sortBy, selectedTags]);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedColors([]);
    setPriceRange([0, maxPrice]);
    setSelectedTags([]);
    setSortBy('default');
  };

  const activeFiltersCount = selectedCategories.length + selectedTags.length + selectedColors.length +
    (searchQuery ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== maxPrice ? 1 : 0);

  // Loading State
  if (isLoading) {
    return (
      <Loading />
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-4">Error loading products</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Breadcrumb />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {category} Collection
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Discover our elegant collection with modern designs, premium fabrics, and timeless styles.
            Perfect for every occasion. Shop now for the latest trends!
          </p>
        </div>

        {/* Filters & Products Section */}
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`
            fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 lg:w-64 xl:w-72 
            bg-white shadow-lg lg:shadow-none z-50 lg:z-auto
            transform transition-transform duration-300 ease-in-out
            ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto
          `}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Search Products</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Price Range</label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">৳{priceRange[0]}</span>
                    <span className="font-semibold text-gray-900">৳{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              {allCategories.length > 0 && (
                <div className="mb-6 pb-6 border-b">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allCategories.map(cat => (
                      <label key={cat} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {allColors.length > 0 && (
                <div className="mb-6 pb-6 border-b">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map(color => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedColors.includes(color) ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {allTags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedTags.includes(tag) ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 rounded-lg transition-colors"
                >
                  Clear All Filters ({activeFiltersCount})
                </button>
              )}
            </div>
          </aside>

          {/* Overlay */}
          {showFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setShowFilters(false)} />
          )}

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <SlidersHorizontal size={18} />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="bg-white text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{filteredProducts.length}</span> of{' '}
                    <span className="font-semibold">{products.length}</span> results
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  >
                    <option value="default">Default sorting</option>
                    <option value="popularity">Sort by popularity</option>
                    <option value="latest">Sort by latest</option>
                    <option value="price-low">Sort by price: low to high</option>
                    <option value="price-high">Sort by price: high to low</option>
                    <option value="discount">Sort by discount</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600 text-lg mb-4">No products found matching your filters</p>
                <button onClick={clearFilters} className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div key={product._id || product.sku} className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <button
                        onClick={(e) => handleToggleWishlist(product._id || product.sku, e)}
                        disabled={isToggling}
                        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all group/wishlist"
                        title={isInWishlist(product._id || product.sku) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart
                          size={20}
                          className={`transition-all ${isInWishlist(product._id || product.sku)
                            ? 'fill-red-600 text-red-600'
                            : 'text-gray-600 group-hover/wishlist:text-red-600'
                            }`}
                        />
                      </button>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                        {product.tags?.includes('Best Seller') && (
                          <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">BEST SELLER</span>
                        )}
                        {product.tags?.includes('Exclusive Collection') && (
                          <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">EXCLUSIVE</span>
                        )}
                        {product.oldPrice > product.newPrice && (
                          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">SALE</span>
                        )}
                      </div>

                      {/* Product Image */}
                      <div>

                        <Link to={`/product/${product._id || product.sku}`}>
                          <img
                            src={product.images?.[0] || 'https://via.placeholder.com/300'}
                            alt={product.productName}
                            className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                        <label
                          htmlFor="quick_view_modal"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2
                                   bg-black text-white px-4 py-1 rounded opacity-0 uppercase
                                   group-hover:opacity-100 group-hover:-translate-y-2
                                   transition-all duration-300 cursor-pointer"
                          onClick={() => setSelectedProduct(product)}
                        >
                          Quick View
                        </label>
                      </div>

                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                        {product.tags?.includes('Best Seller') && (
                          <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">BEST SELLER</span>
                        )}
                        {product.tags?.includes('Exclusive Collection') && (
                          <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">EXCLUSIVE</span>
                        )}
                        {product.oldPrice > product.newPrice && (
                          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">SALE</span>
                        )}
                      </div>


                    </div>

                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-2">{product.categories?.slice(0, 2).join(' • ')}</p>

                      <Link to={`/product/${product._id || product.sku}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-gray-600 transition-colors">
                          {product.productName}
                        </h3>
                      </Link>

                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-xs text-gray-500">Colors:</span>
                          <div className="flex gap-1">
                            {product.colors.slice(0, 4).map(color => (
                              <span key={color} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{color}</span>
                            ))}
                            {product.colors.length > 4 && <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        {product.oldPrice && product.oldPrice > product.newPrice && (
                          <span className="text-sm text-gray-400 line-through">৳{product.oldPrice}</span>
                        )}
                        <span className="text-lg font-bold text-gray-900">৳{product.newPrice}</span>
                        {product.oldPrice && product.oldPrice > product.newPrice && (
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                            {Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>

                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{tag}</span>
                          ))}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Link
                          to={`/product/${product._id || product.sku}`}
                          className="block w-full py-2.5 text-center border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                    <QuickViewModal product={selectedProduct} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}