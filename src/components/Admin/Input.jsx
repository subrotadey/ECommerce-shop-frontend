// ============================================
// components/admin/Input.jsx
// ============================================
export const Input = ({ 
    label, 
    error, 
    icon: Icon,
    className = '',
    ...props 
}) => {
    return (
        <div className="form-control">
            {label && (
                <label className="label">
                    <span className="label-text font-medium">{label}</span>
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        size={20} 
                    />
                )}
                <input
                    className={`input input-bordered w-full ${Icon ? 'pl-10' : ''} ${
                        error ? 'input-error' : ''
                    } ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
};


export default Input;