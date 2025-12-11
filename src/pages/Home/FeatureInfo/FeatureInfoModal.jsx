const FeatureInfoModal = () => {
    return (
        <div 
        className="background h-72 w-full opacity-80 rounded-lg  shadow-lg shadow-cyan-500/50"
        style={{ backgroundImage: "url('https://i.ibb.co/x2PSxxR/banner.jpg')", backgroundSize: "cover"}}
        >
          {/* The button to open modal */}
          <label htmlFor="my-modal-3" className="btn flex">Click for more information</label>


          {/* Put this part before </body> tag */}
          <input type="checkbox" id="my-modal-3" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box relative">
              <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
              <h3 className="text-lg font-bold">Thanks For Watching Videos</h3>
              <iframe width="460" height="260" src="https://www.youtube-nocookie.com/embed/w_VbxEOHl9I?controls=0&amp;start=7" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
          </div>
        </div>
    );
};

export default FeatureInfoModal;