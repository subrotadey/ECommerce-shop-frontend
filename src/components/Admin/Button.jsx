// ============================================
// components/admin/Button.jsx
// ============================================
export const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    icon: Icon, 
    onClick, 
    disabled = false,
    className = '',
    ...props 
}) => {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        success: 'btn-success',
        error: 'btn-error',
        warning: 'btn-warning',
        ghost: 'btn-ghost',
        outline: 'btn-outline'
    };

    const sizes = {
        xs: 'btn-xs',
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg'
    };

    return (
        <button
            className={`btn ${variants[variant]} ${sizes[size]} ${className} ${Icon ? 'gap-2' : ''}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {Icon && <Icon size={16} />}
            {children}
        </button>
    );
};