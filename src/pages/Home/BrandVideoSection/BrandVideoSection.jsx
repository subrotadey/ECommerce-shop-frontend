// src/pages/Home/BrandVideoSection/BrandVideoSection.jsx
import useSiteVideos from "../../../hooks/useSiteVideos";
import VideoBanner from "../VideoBanner/VideoBanner";

const BrandVideoSection = () => {
  const { getVideo } = useSiteVideos();

  return (
    <VideoBanner
      src={getVideo("brandVideo")}
      title="Crafted in the UAE for Your Boutique"
      subtitle="Premium wholesale abayas, direct from our manufacturer."
      ctaLabel="Explore Abayas"
      to="/abaya"
    />
  );
};

export default BrandVideoSection;