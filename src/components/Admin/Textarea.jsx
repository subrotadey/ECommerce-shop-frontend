// ============================================
// components/admin/Textarea.jsx
// ============================================
export const Textarea = ({ 
    label, 
    error,
    className = '',
    rows = 3,
    ...props 
}) => {
    return (
        <div className="form-control bg-white">
            {label && (
                <label className="label">
                    <span className="label-text font-medium">{label}</span>
                </label>
            )}
            <textarea
                className={`textarea textarea-bordered ${error ? 'textarea-error' : ''} ${className}`}
                rows={rows}
                {...props}
            />
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
};
