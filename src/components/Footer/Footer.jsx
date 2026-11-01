
import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Music2,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
  MessageCircle,
  Globe,
} from 'lucide-react';

import logo from '../../assets/images/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Our Story', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const shopLinks = [
    { name: 'Shop All', path: '/shop' },
    { name: 'Abaya Collection', path: '/abaya' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Best Sellers', path: '/best-sellers' },
  ];

  const supportLinks = [
    { name: 'Wholesale Information', path: '/wholesale' },
    { name: 'Track My Order', path: '/track-order' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms-conditions' },
  ];

  const socialLinks = [
    {
      icon: MessageCircle,
      href: 'https://wa.me/971551896390',
      label: 'WhatsApp',
    },
    {
      icon: Mail,
      href: 'mailto:anisabaya290@gmail.com',
      label: 'Email',
    },
    {
      icon: Phone,
      href: 'tel:+971551896390',
      label: 'Phone',
    },
    {
      icon: Music2,
      href: 'https://www.tiktok.com/@anis_abaya_uae',
      label: 'TikTok',
    },
    {
      icon: Facebook,
      href: 'https://www.facebook.com/AnisAbayauae',
      label: 'Facebook',
    },
    {
      icon: Instagram,
      href: 'https://www.instagram.com/anis_abaya_uae',
      label: 'Instagram',
    },
  ];

  return (
    <footer className="bg-[#F7F5EF] border-t border-[#D4AF37]/25">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-5">
              <img
                src={logo}
                alt="Anis Abaya UAE"
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="text-sm text-[#1A1A1A]/70 leading-7 max-w-sm mb-6">
              Anis Abaya UAE is a premium abaya manufacturer and
              wholesale supplier based in the UAE. We provide
              quality abayas for boutiques, retailers and fashion
              businesses worldwide.
            </p>

            <div className="space-y-3 text-sm">
              <a
                href="https://wa.me/971551896390"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#1A1A1A]/70 hover:text-[#123C32] transition-colors"
              >
                <MessageCircle size={17} className="text-[#D4AF37]" />
                <span>+971 55 189 6390</span>
              </a>

              <a
                href="mailto:anisabaya290@gmail.com"
                className="flex items-center gap-3 text-[#1A1A1A]/70 hover:text-[#123C32] transition-colors"
              >
                <Mail size={17} className="text-[#D4AF37]" />
                <span>anisabaya290@gmail.com</span>
              </a>

              <div className="flex items-center gap-3 text-[#1A1A1A]/70">
                <MapPin size={17} className="text-[#D4AF37]" />
                <span>United Arab Emirates</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-3 mt-7">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={
                      social.label === 'Email' || social.label === 'Phone'
                        ? undefined
                        : '_blank'
                    }
                    rel={
                      social.label === 'Email' || social.label === 'Phone'
                        ? undefined
                        : 'noopener noreferrer'
                    }
                    aria-label={social.label}
                    title={social.label}
                    className="w-10 h-10 rounded-full border border-[#123C32]/15 bg-white flex items-center justify-center text-[#123C32] hover:bg-[#123C32] hover:text-[#D4AF37] hover:border-[#123C32] transition-all duration-300"
                  >
                    <Icon size={17} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#123C32] mb-5">
              Company
            </h3>

            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-[#1A1A1A]/65 hover:text-[#123C32] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span>{link.name}</span>
                    <ArrowRight
                      size={13}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#123C32] mb-5">
              Shop
            </h3>

            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-[#1A1A1A]/65 hover:text-[#123C32] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span>{link.name}</span>
                    <ArrowRight
                      size={13}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#123C32] mb-5">
              Support
            </h3>

            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-[#1A1A1A]/65 hover:text-[#123C32] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span>{link.name}</span>
                    <ArrowRight
                      size={13}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Wholesale CTA */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#123C32] mb-5">
              Wholesale Enquiries
            </h3>

            <p className="text-sm text-[#1A1A1A]/65 leading-6 mb-5">
              Looking for premium abayas for your boutique or
              retail business? Contact our team for wholesale
              enquiries and product information.
            </p>

            <a
              href="https://wa.me/971551896390"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#123C32] text-white text-sm font-semibold rounded-lg hover:bg-[#1A1A1A] transition-colors"
            >
              Contact Us
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Wholesale Information */}
        <div className="mt-12 pt-7 border-t border-[#123C32]/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">

            <div className="flex items-center gap-3">
              <Globe size={20} className="text-[#D4AF37]" />

              <div>
                <p className="text-sm font-semibold text-[#123C32]">
                  Worldwide Wholesale Supply
                </p>
                <p className="text-xs text-[#1A1A1A]/60 mt-1">
                  Direct from UAE Manufacturer
                </p>
              </div>
            </div>

            <p className="text-xs text-[#1A1A1A]/60 text-center md:text-right max-w-lg leading-6">
              Delivery charges are not included. Shipping costs
              are payable by the customer. Shipping arrangements
              are confirmed separately through WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#123C32]/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-xs text-[#1A1A1A]/60 flex items-center gap-1.5 text-center">
              © {currentYear} Anis Abaya UAE. All rights reserved.
              <span className="inline-flex items-center gap-1 ml-1">
                Made with
                <Heart
                  size={13}
                  className="text-red-500 fill-red-500"
                />
                by
                <a
                  href="http://wa.me/+8801609102858"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#123C32] hover:text-[#D4AF37] transition-colors"
                >
                  Subrota Dey
                </a>
              </span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5 text-xs">
              <Link
                to="/privacy-policy"
                className="text-[#1A1A1A]/60 hover:text-[#123C32] transition-colors"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms-conditions"
                className="text-[#1A1A1A]/60 hover:text-[#123C32] transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
