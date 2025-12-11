import view1 from "../../../assets/images/banner/1.webp";
import view2 from "../../../assets/images/banner/2.webp";
import view3 from "../../../assets/images/banner/3.webp";
import view4 from "../../../assets/images/banner/4.webp";
import view5 from "../../../assets/images/banner/5.webp";

const BannerSection = () => {
    const viewInfo = [
        {
          _id:1,
          img: view1,
        },
        {
          _id:2,
          img: view2,
        },
        {
          _id:3,
          img: view3,
        },
        {
          _id:4,
          img: view4,
        },
        {
          _id:5,
          img: view5,
        }
      ];
    return (
        <section className='w-11/12 mx-auto'>
            <div className="carousel carousel-center rounded-box">
                {viewInfo.map((view) => (
                    <div key={view._id} className="carousel-item w-1/5 ">
                        <img src={view.img} alt={`View ${view._id}`} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BannerSection;