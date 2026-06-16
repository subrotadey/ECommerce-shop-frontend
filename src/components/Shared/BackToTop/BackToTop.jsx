//src/components/Shared/BackToTop/BackToTop.jsx
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:border-gray-400 transition-all text-charcoal"
    >
      <ChevronUp size={20} />
    </button>
  );
}