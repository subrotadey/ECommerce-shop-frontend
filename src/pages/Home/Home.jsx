import ConnectedSection from "./ConnectedSection/ConnectedSection";
import BannerSection from "./BannerSection/BannerSection";
import BorkaSection from "./BorkaSection/BorkaSection";
import BorkaSectionTwo from "./BorkaSectionTwo/BorkaSectionTwo";
import Slider from "./Slider/Slider";
import Product from "../Product/Product";
import SectionDivider from "../../components/SectionDivider/SectionDivider";

const Home = () => {
  return (
    <div className="">
      <Slider></Slider>
      <BannerSection></BannerSection>
      <SectionDivider label="NEW ARRIVALS"></SectionDivider>
      <Product></Product>
      <SectionDivider label="Featured Products"></SectionDivider>
      <SectionDivider label="Best sellers"></SectionDivider>
      <BorkaSection></BorkaSection>
      <SectionDivider label="Abaya"></SectionDivider>
      <BorkaSectionTwo></BorkaSectionTwo>
      <SectionDivider label="Hijab"></SectionDivider>
      <ConnectedSection />
      {/* <Banner></Banner> */}
      {/* <Info></Info> */}
      {/* <Characteristics></Characteristics> */}
      {/* <FeatureInfo></FeatureInfo> */}
      {/* <HomeCourses></HomeCourses> */}
      {/* <Counter></Counter> */}
      {/* <Testimonials></Testimonials> */}
    </div>
  );
};

export default Home;
