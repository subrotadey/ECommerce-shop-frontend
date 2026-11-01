
import { MessageCircle } from "lucide-react";

const FloatingWhatsApp = () => {
  return (
    <a
      href="https://wa.me/971551896390"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 rounded-full px-4 py-3 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        backgroundColor: "#123C32",
        color: "#FFFFFF",
        border: "1px solid #D4AF37",
      }}
      aria-label="Chat with Anis Abaya UAE on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle
        size={22}
        style={{ color: "#D4AF37" }}
      />

      <span className="text-sm font-semibold max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300 whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
