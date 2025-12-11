import React from 'react';
import FeatureInfoModal from './FeatureInfoModal';
import "./FeatureInfo.css"

const FeatureInfo = () => {

  return (
    <div className="mx-auto w-11/12">
      <div className="card lg:card-side shadow-xl feature_info">

        {/* Left side with image/modal */}
        <div className="lg:w-2/4 grid-cols-6 mx-auto my-auto">
          <figure>
            <div className="w-full lg:w-96 h-72 min-w-fit bg-no-repeat bg-cover">
              <FeatureInfoModal />
            </div>
          </figure>
        </div>

        {/* Right side with text */}
        <div className="lg:w-11/12 md:w-full border-8 border-l-indigo-900 p-6 m-6 text-gray-600">
          <h1 className="text-5xl lg:text-6xl font-bold italic">
            WATCH. LISTEN. PRACTICE. LEARN.
          </h1>
          <h5 className="text-lg font-sans mt-4">
            Phasellus non dolor nibh. Nullam elementum tellus pretium feugiat. Cras dictum tellus dui, vitae
            sollicitudin ipsum tincidunt in. Sed tincidunt tristique enim sed sollicitudin. Cras dictum tellus
            dui, vitae sollicitudin ipsum tincidunt adipiscing atgfnte tibulum sapien sed mattis. Cras dictum
            tellus dui. Sed mollis vestibulum sapien rthsed mattis.
          </h5>
        </div>

      </div>
    </div>

  );
};

export default FeatureInfo;