import React from 'react';
import { MessageCircle } from "lucide-react";

const FloatingWhatsApp = () => {
    return (
        <a
        href="https://wa.me/00971551896390"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-105 group"
        aria-label="WhatsApp">
        <MessageCircle size={22} />
        <span className="text-sm font-semibold max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300 whitespace-nowrap">
          Chat with us
        </span>
        </a>
    );
};

export default FloatingWhatsApp;