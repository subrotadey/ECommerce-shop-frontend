// ============================================
// components/admin/Select.jsx
// ============================================
export const Select = ({ 
    label, 
    options = [], 
    error,
    className = '',
    ...props 
}) => {
    return (
        <div className="form-control bg-white">
            {label && (
                <label className="label">
                    <span className="label-text font-medium">{label}</span>
                </label>
            )}
            <select
                className={`select select-bordered w-full ${error ? 'select-error' : ''} ${className}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
};