
import {
  Factory,
  Package,
  Ruler,
  Globe,
  MessageCircle,
} from "lucide-react";

const trustPoints = [
  {
    icon: Factory,
    title: "UAE Manufacturer",
    description: "Direct from our UAE business",
  },
  {
    icon: Package,
    title: "Wholesale Only",
    description: "For boutiques and retailers",
  },
  {
    icon: Ruler,
    title: "Flexible Size Mixing",
    description: "Mix sizes within the same color",
  },
  {
    icon: Globe,
    title: "Worldwide Supply",
    description: "International wholesale orders",
  },
  {
    icon: MessageCircle,
    title: "Direct Assistance",
    description: "WhatsApp wholesale support",
  },
];

const TrustBar = () => {
  return (
    <section
      aria-label="Anis Abaya UAE wholesale benefits"
      className="border-y border-emerald/10 bg-ivory/70"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 divide-y divide-emerald/10 sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-5">

          {trustPoints.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-3 px-3 py-6 text-center sm:px-4 lg:flex-row lg:text-left"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
                <Icon
                  size={20}
                  className="text-emerald"
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h3 className="text-sm font-bold text-charcoal">
                  {title}
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  {description}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default TrustBar;
