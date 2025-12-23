// ============================================
// components/admin/Modal.jsx
// ============================================
export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    actions
}) => {
    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl'
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className={`modal-box ${sizes[size]}`}>
                {title && (
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">{title}</h3>
                        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                            ✕
                        </button>
                    </div>
                )}
                <div>{children}</div>
                {actions && <div className="modal-action">{actions}</div>}
            </div>
        </div>
    );
};