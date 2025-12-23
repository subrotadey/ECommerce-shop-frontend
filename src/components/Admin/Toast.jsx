// ============================================
// components/admin/Toast.jsx
// ============================================
export const Toast = ({
    message,
    type = 'success',
    isVisible,
    onClose
}) => {
    if (!isVisible) return null;

    const types = {
        success: 'alert-success',
        error: 'alert-error',
        warning: 'alert-warning',
        info: 'alert-info'
    };

    return (
        <div className="toast toast-top toast-end">
            <div className={`alert ${types[type]} shadow-lg`}>
                <span>{message}</span>
                {onClose && (
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
};