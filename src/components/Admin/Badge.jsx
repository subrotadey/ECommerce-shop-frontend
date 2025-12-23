// ============================================
// components/admin/Badge.jsx
// ============================================
export const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    className = ''
}) => {
    const variants = {
        default: 'badge-ghost',
        primary: 'badge-primary',
        secondary: 'badge-secondary',
        success: 'badge-success',
        error: 'badge-error',
        warning: 'badge-warning',
        info: 'badge-info'
    };

    const sizes = {
        xs: 'badge-xs',
        sm: 'badge-sm',
        md: '',
        lg: 'badge-lg'
    };

    return (
        <span className={`badge ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
};