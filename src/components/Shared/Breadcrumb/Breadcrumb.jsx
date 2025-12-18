import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Advanced Breadcrumb Component
 * 
 * @param {Array} customBreadcrumbs - Optional custom breadcrumbs to override auto-generated ones
 * @param {boolean} showHome - Show home link (default: true)
 * @param {Object} dynamicLabels - Dynamic labels for IDs (e.g., product names)
 * 
 * Usage Examples:
 * 
 * 1. Auto-generated breadcrumbs:
 * <Breadcrumb />
 * 
 * 2. Custom breadcrumbs:
 * <Breadcrumb customBreadcrumbs={[
 *   { label: 'Home', path: '/' },
 *   { label: 'Products', path: '/products' },
 *   { label: 'T-Shirt' }
 * ]} />
 * 
 * 3. With dynamic labels (for product names, etc.):
 * <Breadcrumb dynamicLabels={{ 
 *   productId: product.productName,
 *   categoryId: category.name 
 * }} />
 */
const Breadcrumb = ({ 
  customBreadcrumbs = null, 
  showHome = true,
  dynamicLabels = {} 
}) => {
  const location = useLocation();

  // Route labels mapping
  const routeLabels = {
    '': 'Home',
    'products': 'Products',
    'product': 'Product Details',
    'cart': 'Shopping Cart',
    'checkout': 'Checkout',
    'wishlist': 'Wishlist',
    'profile': 'My Profile',
    'orders': 'My Orders',
    'order': 'Order Details',
    'categories': 'Categories',
    'category': 'Category',
    'search': 'Search Results',
    'about': 'About Us',
    'contact': 'Contact Us',
    'privacy-policy': 'Privacy Policy',
    'terms-conditions': 'Terms & Conditions',
    'shipping-policy': 'Shipping Policy',
    'return-policy': 'Return Policy',
    'faq': 'FAQ',
    'blog': 'Blog',
    'account': 'My Account',
    'settings': 'Settings',
    'addresses': 'My Addresses',
    'reviews': 'My Reviews',
  };

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    if (pathSegments.length === 0) {
      return [];
    }

    const breadcrumbs = [];
    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Check if it's a dynamic ID
      const isDynamicId = /^[0-9a-fA-F]{24}$/.test(segment) || // MongoDB ObjectId
                          /^\d+$/.test(segment); // Numeric ID

      let label = routeLabels[segment] || segment;
      
      // Use dynamic label if provided
      if (isDynamicId && dynamicLabels[segment]) {
        label = dynamicLabels[segment];
      } 
      // Format label for non-mapped routes
      else if (!routeLabels[segment] && !isDynamicId) {
        label = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      // Handle dynamic IDs
      else if (isDynamicId) {
        const parentSegment = pathSegments[index - 1];
        if (parentSegment === 'product') {
          label = dynamicLabels[segment] || 'Product Details';
        } else if (parentSegment === 'order') {
          label = dynamicLabels[segment] || `Order #${segment.slice(-6)}`;
        } else if (parentSegment === 'category') {
          label = dynamicLabels[segment] || 'Category';
        } else {
          label = 'Details';
        }
      }

      breadcrumbs.push({
        label,
        path: currentPath,
        isLast: index === pathSegments.length - 1,
        isDynamicId
      });
    });

    return breadcrumbs;
  };

  // Use custom breadcrumbs if provided, otherwise generate
  const breadcrumbs = customBreadcrumbs || generateBreadcrumbs();

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
          {/* Home Link */}
          {showHome && (
            <>
              <Link 
                to="/" 
                className="flex items-center gap-1 hover:text-gray-900 transition-colors"
              >
                <Home size={16} />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <ChevronRight size={16} className="text-gray-400" />
            </>
          )}

          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {crumb.isLast || !crumb.path ? (
                <span className="text-gray-900 font-medium line-clamp-1">
                  {crumb.label}
                </span>
              ) : (
                <Link 
                  to={crumb.path}
                  className="hover:text-gray-900 transition-colors line-clamp-1"
                >
                  {crumb.label}
                </Link>
              )}
              
              {index < breadcrumbs.length - 1 && (
                <ChevronRight size={16} className="text-gray-400 shrink-0" />
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;

/**
 * Usage in Product Details Page:
 * 
 * import Breadcrumb from './Breadcrumb';
 * 
 * const ProductDetails = () => {
 *   const { product } = useProduct();
 *   
 *   return (
 *     <>
 *       <Breadcrumb 
 *         dynamicLabels={{ 
 *           [product._id]: product.productName 
 *         }} 
 *       />
 *       // ... rest of component
 *     </>
 *   );
 * };
 */