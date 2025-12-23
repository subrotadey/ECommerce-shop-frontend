// ============================================
// components/admin/Card.jsx
// ============================================
export const Card = ({ title, children, action, className = '' }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
            {title && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    {action}
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
};