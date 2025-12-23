// ============================================
// components/admin/Table.jsx
// ============================================
export const Table = ({
    columns = [],
    data = [],
    onRowClick,
    className = ''
}) => {
    return (
        <div className="overflow-x-auto">
            <table className={`table w-full ${className}`}>
                <thead>
                    <tr>
                        {columns.map((column, idx) => (
                            <th key={idx}>{column.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIdx) => (
                        <tr
                            key={rowIdx}
                            className={onRowClick ? 'hover cursor-pointer' : 'hover'}
                            onClick={() => onRowClick && onRowClick(row)}
                        >
                            {columns.map((column, colIdx) => (
                                <td key={colIdx}>
                                    {column.render
                                        ? column.render(row[column.key], row)
                                        : row[column.key]
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};