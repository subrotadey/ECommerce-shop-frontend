// components/product/ProductInfo.jsx
export default function ProductInfo({ additionalInfo, className = "" }) {
    if (!additionalInfo) return null;

    const infoItems = [
        { label: "Fabric", value: additionalInfo.fabric },
        { label: "Work", value: additionalInfo.workType },
        { label: "Hijab", value: additionalInfo.hijabIncluded ? "Included" : "Not Included" },
        { label: "Origin", value: additionalInfo.countryOfOrigin }
    ].filter(item => item.value);

    if (infoItems.length === 0) return null;

    return (
        <div className={`grid grid-cols-2 gap-2 text-sm border-y py-3 border-gray-100 ${className}`}>
            {infoItems.map((item, index) => (
                <p key={index}>
                    <strong>{item.label}:</strong> {item.value}
                </p>
            ))}
        </div>
    );
}