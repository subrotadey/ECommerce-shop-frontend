// ============================================
// components/admin/StatCard.jsx
// ============================================
export const StatCard = ({
    label,
    value,
    change,
    icon: Icon,
    color = 'blue',
    trend = 'up'
}) => {
    const colors = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
        green: { bg: 'bg-green-100', text: 'text-green-600' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
        red: { bg: 'bg-red-100', text: 'text-red-600' }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 font-medium">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {change && (
                        <div className="flex items-center mt-2">
                            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {change}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">from last month</span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={`w-12 h-12 ${colors[color].bg} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${colors[color].text}`} />
                    </div>
                )}
            </div>
        </div>
    );
};