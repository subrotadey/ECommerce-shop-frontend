// src/pages/Home/CollectionVideoSection/CollectionVideoSection.jsx
import useSiteVideos from "../../../hooks/useSiteVideos";
import VideoBanner from "../VideoBanner/VideoBanner";

const CollectionVideoSection = () => {
  const { getVideo } = useSiteVideos();

  return (
    <VideoBanner
      src={getVideo("collectionVideo")}
      title="Choose Your Colours & Sizes"
      subtitle="Order from 12 pieces per colour and mix sizes freely."
      ctaLabel="Shop Wholesale"
      to="/abaya"
    />
  );
};

export default CollectionVideoSection;