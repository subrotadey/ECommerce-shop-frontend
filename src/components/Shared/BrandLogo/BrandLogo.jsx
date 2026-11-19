// Logo icon (Site Settings → "logo") + designed wordmark: name, gold lines, UAE, flag.
import useSiteImages from "../../../hooks/useSiteImages";

const BRAND_NAME = "Anis Abaya";
const BRAND_TAGLINE = "UAE";
const BRAND_FONT = "'Cinzel', Georgia, 'Times New Roman', serif";

const INK = "#2A2018"; // dark brown, approximate (pick the exact colour from the logo)
const GOLD = "#B8922A";
const GOLD_LIGHT = "#D4AF37";

const SIZES = {
  sm: { icon: "h-9 md:h-10", name: "text-[13px] md:text-[15px]", tag: "text-[8px] md:text-[9px]", flag: "h-2 md:h-2.5" },
  md: { icon: "h-10 md:h-12", name: "text-sm md:text-lg", tag: "text-[8px] md:text-[10px]", flag: "h-2 md:h-3" },
  xs: { icon: "h-8", name: "text-[11px]", tag: "text-[7px]", flag: "h-1.5" },
  lg: { icon: "h-16", name: "text-xl", tag: "text-[10px]", flag: "h-3" },
};

// UAE flag: red band on the left, green / white / black stripes
const UaeFlag = ({ className = "" }) => (
  <svg
    viewBox="0 0 30 15"
    role="img"
    aria-label="UAE flag"
    className={`w-auto shrink-0 rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.3)] ${className}`}
  >
    <rect width="30" height="15" fill="#FFFFFF" />
    <rect width="30" height="5" fill="#00732F" />
    <rect y="10" width="30" height="5" fill="#000000" />
    <rect width="7.5" height="15" fill="#FF0000" />
  </svg>
);

const BrandLogo = ({
  size = "md",
  variant = "light", // "dark" = for dark backgrounds
  stacked = false, // true = icon on top, text below (like the original logo)
  tagline = BRAND_TAGLINE,
  hideTextOnTiny = false, // hide the text on very narrow phones
  className = "",
}) => {
  const { getImage } = useSiteImages();
  const logo = getImage("logo", 400);
  const s = SIZES[size] || SIZES.md;
  const dark = variant === "dark";

  const ink = dark ? "#FFFFFF" : INK;
  const gold = dark ? GOLD_LIGHT : GOLD;

  return (
    <span
      className={`inline-flex items-center ${
        stacked ? "flex-col gap-2" : "gap-2.5"
      } ${className}`}
    >
      {logo && (
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          className={`${s.icon} w-auto shrink-0 object-contain ${
            dark ? "rounded-full bg-white p-1" : ""
          }`}
        />
      )}

      <span
        className={`flex min-w-0 flex-col items-center leading-none ${
          hideTextOnTiny ? "max-[374px]:hidden" : ""
        }`}
      >
        <span
          className={`whitespace-nowrap font-bold uppercase tracking-[0.12em] ${s.name}`}
          style={{ fontFamily: BRAND_FONT, color: ink }}
        >
          {BRAND_NAME}
        </span>

        {tagline && (
          <span className="mt-1.5 flex w-full items-center gap-1.5">
            <span
              className="h-px flex-1"
              style={{ background: `linear-gradient(to right, transparent, ${gold})` }}
            />
            <span
              className={`font-semibold uppercase tracking-[0.25em] ${s.tag}`}
              style={{ fontFamily: BRAND_FONT, color: ink }}
            >
              {tagline}
            </span>
            <UaeFlag className={s.flag} />
            <span
              className="h-px flex-1"
              style={{ background: `linear-gradient(to left, transparent, ${gold})` }}
            />
          </span>
        )}
      </span>
    </span>
  );
};

export default BrandLogo;