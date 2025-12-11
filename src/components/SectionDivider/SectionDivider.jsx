const SectionDivider = ({ label }) => {
    return (
        <div className="relative flex items-center my-10 w-11/12 mx-auto uppercase">
            {/* Line */}
            <div className="grow border-t border-gray-600"></div>

            {/* Center Box */}
            <span className="mx-4 px-4 py-1 bg-white border border-gray-600 text-purple-900 font-semibold tracking-wider">
                {label}
            </span>

            {/* Line */}
            <div className="grow border-t border-gray-600"></div>
        </div>
    );
};

export default SectionDivider;