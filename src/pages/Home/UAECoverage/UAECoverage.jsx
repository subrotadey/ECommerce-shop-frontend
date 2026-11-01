
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Globe2,
  PackageCheck,
  MessageCircle,
} from "lucide-react";
import FadeIn from "../../../components/Animations/FadeIn";

const EMERALD = "#123C32";
const GOLD = "#D4AF37";
const CHARCOAL = "#1A1A1A";
const IVORY = "#F7F5EF";

const UAECoverage = () => {
  const [hover, setHover] = useState(null);

  const UAE_CITIES = [
    { name: "Abu Dhabi", x: "28%", y: "72%" },
    { name: "Dubai", x: "62%", y: "68%" },
    { name: "Sharjah", x: "67%", y: "56%" },
    { name: "Ajman", x: "70%", y: "48%" },
    { name: "Ras Al Khaimah", x: "72%", y: "28%" },
    { name: "Fujairah", x: "88%", y: "55%" },
  ];

  return (
    <section
      className="py-20 sm:py-24"
      style={{ backgroundColor: IVORY }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <FadeIn>
            <div>
              <div
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 mb-5 rounded-full"
                style={{
                  color: EMERALD,
                  backgroundColor: `${EMERALD}10`,
                }}
              >
                <MapPin size={14} />
                UAE Wholesale Coverage
              </div>

              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5"
                style={{ color: CHARCOAL }}
              >
                Wholesale Abaya Supply Across the UAE
              </h2>

              <p className="text-gray-600 leading-relaxed mb-8">
                Anis Abaya UAE welcomes wholesale enquiries from businesses
                across all seven Emirates. Whether you run a boutique,
                fashion store, or clothing business, our team is ready to
                discuss your bulk order and shipping arrangements.
              </p>

              {/* Emirates */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {UAE_CITIES.map((city) => (
                  <div
                    key={city.name}
                    className="flex items-center gap-3 p-4 rounded-xl border transition-all duration-300"
                    style={{
                      borderColor:
                        hover === city.name ? GOLD : "#E5E7EB",
                      backgroundColor:
                        hover === city.name ? "#FFFFFF" : "#FFFFFF",
                    }}
                    onMouseEnter={() => setHover(city.name)}
                    onMouseLeave={() => setHover(null)}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          hover === city.name ? GOLD : EMERALD,
                      }}
                    />

                    <span
                      className="font-semibold text-sm"
                      style={{ color: CHARCOAL }}
                    >
                      {city.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Note */}
              <div
                className="flex items-start gap-3 p-4 rounded-xl mb-8"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <PackageCheck
                  size={21}
                  className="shrink-0 mt-0.5"
                  style={{ color: EMERALD }}
                />

                <p className="text-sm text-gray-600 leading-relaxed">
                  Delivery charges are not included. Shipping costs are
                  payable by the customer.
                </p>
              </div>

              
            </div>
          </FadeIn>

          {/* Right Map Illustration */}
          <FadeIn delay={200}>
            <div
              className="relative rounded-3xl border overflow-hidden shadow-sm"
              style={{
                minHeight: 420,
                backgroundColor: "#FFFFFF",
                borderColor: "#E8E5DC",
              }}
            >
              {/* Decorative Background */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 45%, #D4AF3712, transparent 65%)",
                }}
              />

              {/* Decorative UAE Illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 400 280"
                  className="w-full h-full opacity-[0.08]"
                  style={{ fill: EMERALD }}
                  aria-hidden="true"
                >
                  <path d="M340,20 L380,60 L390,100 L370,140 L340,160 L300,200 L260,220 L200,240 L160,230 L120,210 L80,180 L40,150 L20,120 L30,90 L60,70 L100,50 L150,30 L200,20 L250,15 L300,18 Z" />
                </svg>

                {/* City Markers */}
                {UAE_CITIES.map((city) => (
                  <div
                    key={city.name}
                    className="absolute"
                    style={{
                      left: city.x,
                      top: city.y,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="relative">
                      <div
                        className="w-4 h-4 rounded-full border-[3px] border-white shadow-md transition-transform duration-300"
                        style={{
                          backgroundColor:
                            hover === city.name ? GOLD : EMERALD,
                          transform:
                            hover === city.name ? "scale(1.3)" : "scale(1)",
                        }}
                      />

                      {hover === city.name && (
                        <div
                          className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shadow-lg z-20"
                          style={{
                            color: "#FFFFFF",
                            backgroundColor: EMERALD,
                          }}
                        >
                          {city.name}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Overlay Information */}
              <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-8 pb-10">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: `${GOLD}20`,
                    color: EMERALD,
                  }}
                >
                  <Globe2 size={28} />
                </div>

                <h3
                  className="text-xl sm:text-2xl font-bold mb-2"
                  style={{ color: CHARCOAL }}
                >
                  Serving Wholesale Businesses
                </h3>

                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                  Connect with Anis Abaya UAE for bulk order enquiries
                  and shipping arrangements across the Emirates.
                </p>

                <div
                  className="w-16 h-1 rounded-full mt-6"
                  style={{ backgroundColor: GOLD }}
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default UAECoverage;
