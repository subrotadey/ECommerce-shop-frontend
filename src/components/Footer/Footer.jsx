import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight,
  Heart
} from 'lucide-react';
import logo from '../../assets/images/logo.png';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubscribing(true);
    // Add your newsletter subscription logic here
    setTimeout(() => {
      setIsSubscribing(false);
      setEmail('');
      alert('Thank you for subscribing!');
    }, 1000);
  };

  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Our Story', path: '/story' },
    { name: 'Careers', path: '/careers' },
    { name: 'Press', path: '/press' },
    { name: 'Blog', path: '/blog' }
  ];

  const shopLinks = [
    { name: 'Abaya Collection', path: '/abaya' },
    { name: 'Hijab Collection', path: '/hijab' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Best Sellers', path: '/best-sellers' },
    { name: 'Sale', path: '/sale' }
  ];

  const supportLinks = [
    { name: 'Help Center', path: '/help' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'Returns & Exchange', path: '/returns' },
    { name: 'Shipping Info', path: '/shipping' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' }
  ];

  return (
    <footer className="bg-linear-to-b from-gray-50 to-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section - Takes 4 columns on large screens */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-4">
              <img 
                src={logo} 
                alt="Anis Abaiya" 
                className="h-10 w-auto hover:opacity-80 transition-opacity" 
              />
            </Link>
            

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-600">
              <a 
                href="tel:01757777765" 
                className="flex items-center gap-2 hover:text-amber-600 transition-colors group"
              >
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>01757777765</span>
              </a>
              <a 
                href="mailto:info@anisabaiya.com" 
                className="flex items-center gap-2 hover:text-amber-600 transition-colors group"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>info@anisabaiya.com</span>
              </a>
              <div className="flex items-center gap-2 hover:text-amber-600 transition-colors group">
                <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Dubai</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-amber-500 flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-amber-600 text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Links - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-amber-600 text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-amber-600 text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Get exclusive offers, new arrivals, and style inspiration.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm transition-all"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                By subscribing, you agree to our Privacy Policy.
              </p>
            </form>
          </div>
        </div>
        

        {/* Payment & Trust Badges */}
        
        <div className='mt-12'>
            <p className="text-gray-600 text-sm leading-relaxed text-center">
              Your destination for premium quality abayas and hijabs. 
              Combining tradition with contemporary elegance.
            </p>
            <div className=" border-t mt-4 border-gray-200">
            
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">We Accept:</span>
              <div className="flex items-center gap-2">
                {['Visa', 'Mastercard', 'bKash', 'Nagad'].map((payment) => (
                  <span 
                    key={payment}
                    className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 font-medium"
                  >
                    {payment}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Secure Checkout</span>
              </div>
              <span>•</span>
              <span>100% Original Products</span>
              <span>•</span>
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
        </div>
      </div>
      

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-gray-600 flex items-center gap-1">
              © {new Date().getFullYear()} Anis Abaiya. Made with 
              <Heart className="w-4 h-4 text-red-500 fill-red-500 inline-block mx-0.5" />
              by <a href="https://github.com/subrotadey" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 font-medium">Subrota Dey</a>
            </p>

            <div className="flex items-center gap-6">
              <Link 
                to="/privacy-policy" 
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms-conditions" 
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link 
                to="/sitemap" 
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;