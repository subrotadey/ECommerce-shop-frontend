// ============================================
// components/admin/EmptyState.jsx
// ============================================
export const EmptyState = ({
    icon: Icon,
    title,
    description,
    action
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            {Icon && (
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-gray-400" />
                </div>
            )}
            {title && <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>}
            {description && <p className="text-gray-600 mb-4">{description}</p>}
            {action}
        </div>
    );
};