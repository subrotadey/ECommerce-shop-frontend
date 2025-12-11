import borka1 from "../../../assets/images/BorkaSectionTwo/borka1.jpg"
import borka2 from "../../../assets/images/BorkaSectionTwo/borka2.jpg"
import borka3 from "../../../assets/images/BorkaSectionTwo/borka3.jpg"

const BorkaSectionTwo = () => {
  return (
    <div className="w-11/12 mt-10 mx-auto">
      <div className="flex flex-col md:flex-row gap-5">

        {/* FIRST IMAGE */}
        <div className="relative h-[420px] md:h-[500px] overflow-hidden rounded-lg">
          <img
            src={borka1}
            className="w-full h-full object-cover transition duration-700 ease-in-out hover:scale-110"
            alt="Party Borka"
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-lg px-5 py-2 rounded-md shadow-md">
            <h2 className="text-xl font-bold text-gray-900 tracking-wide">
              PRINTED BORKA
            </h2>
            <p className="mt-3 text-yellow-400 tracking-[0.6rem] text-sm md:text-lg">
              COLLECTION
            </p>
          </div>
        </div>

        {/* MIDDLE IMAGE */}
        <div className="relative h-[420px] md:h-[500px] overflow-hidden rounded-lg">
          <img
            src={borka2}
            className="w-full h-full object-cover transition duration-700 ease-in-out hover:scale-110"
            alt="Abaya"
          />

          <div className="absolute top-8 left-6 text-white">
            <p className="tracking-[0.4rem] text-xs">GROWN</p>
            <h2 className="text-4xl font-extrabold">BORKA</h2>
            <p className="mt-3 text-yellow-400 tracking-[0.6rem] text-sm md:text-lg">
              COLLECTION
            </p>
          </div>
        </div>

        {/* RIGHT BIG IMAGE */}
        <div className="relative h-[420px] md:h-[500px] overflow-hidden rounded-lg">
          <img
            src={borka3}
            className="w-full h-full object-cover transition duration-700 ease-in-out hover:scale-110"
            alt="Borka"
          />
        
          {/* TEXT OVERLAY */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-3 pointer-events-none">
            <h1 className="text-4xl md:text-6xl  tracking-wide">
              BLACK
            </h1>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide">
              BORKA
            </h1>
            <p className="mt-3 text-yellow-400 tracking-[0.6rem] text-sm md:text-lg">
              COLLECTION
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BorkaSectionTwo;
