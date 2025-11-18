import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <span className="ml-2 text-xl font-bold">ShopEase</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your one-stop destination for all your shopping needs. Quality products, best prices, and exceptional service.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                <div key={social} className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <span className="text-xs font-medium">{social[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Products', 'About Us', 'Contact', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {['Shipping Info', 'Returns', 'Size Guide', 'Care Instructions', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 ShopEase. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-xs font-medium">VISA</span>
            </div>
            <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-xs font-medium">MC</span>
            </div>
            <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-xs font-medium">PP</span>
            </div>
            <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-xs font-medium">AP</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;