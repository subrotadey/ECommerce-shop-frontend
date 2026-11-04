// src/components/ProductForm/InventoryMatrix.jsx
import { useState } from 'react';
import notify from '../../utils/notification';

import {
    SIZE_CHART,
    MAX_STOCK,
    createInventoryRow,
    toNumber,
    getColorTotal,
    calculateTotalStock,
} from './inventoryUtils';

// Props:
//   value    -> inventory array
//   onChange -> (inventory) => void
//   error    -> validation message (string)
//   disabled -> submit চলাকালীন
const InventoryMatrix = ({ value = [], onChange, error, disabled = false }) => {
    const [colorInput, setColorInput] = useState('');

    const totalStock = calculateTotalStock(value);

    const handleAddColor = () => {
        const color = colorInput.trim().replace(/\s+/g, ' ');

        if (!color) return;

        if (color.length > 50) {
            notify.warning('Color name is too long', 'Maximum 50 characters.', 2000);
            return;
        }

        if (value.some((row) => row.color.toLowerCase() === color.toLowerCase())) {
            notify.warning('Color already exists', '', 1500);
            return;
        }

        onChange([...value, createInventoryRow(color)]);
        setColorInput('');
    };

    const handleRemoveColor = async (index) => {
        const row = value[index];
        if (!row) return;

        // Stock থাকলে ভুলে মোছা আটকাতে confirm
        if (getColorTotal(row) > 0) {
            const confirmed = await notify.confirm(
                `Remove ${row.color}?`,
                `This color has ${getColorTotal(row)} pieces in stock. Its inventory will be removed from this form.`,
                'Yes, remove',
                'Cancel'
            );
            if (!confirmed) return;
        }

        onChange(value.filter((_, i) => i !== index));
    };

    const handleStockChange = (colorIndex, size, rawValue) => {
        // শুধু অঙ্ক: negative, decimal, e-notation আটকায়
        const digits = String(rawValue).replace(/\D/g, '').slice(0, 7);
        const stock = digits === '' ? '' : Math.min(Number(digits), MAX_STOCK);

        onChange(
            value.map((row, i) =>
                i !== colorIndex
                    ? row
                    : {
                          ...row,
                          sizes: row.sizes.map((s) =>
                              s.size === size ? { ...s, stock } : s
                          ),
                      }
            )
        );
    };

    // ফাঁকা ঘর ফোকাস হারালে 0 হয়ে যায়
    const handleStockBlur = (colorIndex, size, current) => {
        if (current === '') handleStockChange(colorIndex, size, '0');
    };

    const columnTotal = (size) =>
        value.reduce(
            (sum, row) =>
                sum + toNumber(row.sizes.find((s) => s.size === size)?.stock),
            0
        );

    return (
        <div className="space-y-4">
            {/* Add color */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Color <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={colorInput}
                        disabled={disabled}
                        onChange={(e) => setColorInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddColor();
                            }
                        }}
                        placeholder="e.g., Black, Navy Blue"
                        className="flex-1 h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123C32]"
                    />
                    <button
                        type="button"
                        onClick={handleAddColor}
                        disabled={disabled || !colorInput.trim()}
                        className="h-10 px-4 bg-[#123C32] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        Add Color
                    </button>
                </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Matrix */}
            {value.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-[#F7F5EF] p-6 text-center text-sm text-gray-500">
                    No colors yet. Add a color to enter stock for each size.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="bg-[#F7F5EF] text-gray-700">
                            <tr>
                                <th className="px-3 py-2 text-left font-semibold min-w-[140px]">
                                    Color
                                </th>
                                {SIZE_CHART.map(({ size, length }) => (
                                    <th
                                        key={size}
                                        className="px-2 py-2 text-center font-semibold min-w-[80px]"
                                    >
                                        <div>{size}</div>
                                        <div className="text-xs font-normal text-gray-500">
                                            {length}
                                        </div>
                                    </th>
                                ))}
                                <th className="px-3 py-2 text-center font-semibold min-w-[70px]">
                                    Total
                                </th>
                                <th className="px-2 py-2" />
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {value.map((row, colorIndex) => (
                                <tr key={row.color}>
                                    <td className="px-3 py-2 font-medium text-gray-900">
                                        {row.color}
                                    </td>

                                    {row.sizes.map(({ size, stock }) => (
                                        <td key={size} className="px-1 py-2">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                aria-label={`${row.color} size ${size} stock`}
                                                value={stock}
                                                disabled={disabled}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) =>
                                                    handleStockChange(colorIndex, size, e.target.value)
                                                }
                                                onBlur={() => handleStockBlur(colorIndex, size, stock)}
                                                className="w-full h-9 px-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123C32]"
                                            />
                                        </td>
                                    ))}

                                    <td className="px-3 py-2 text-center font-semibold text-[#123C32]">
                                        {getColorTotal(row)}
                                    </td>

                                    <td className="px-2 py-2 text-center">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveColor(colorIndex)}
                                            disabled={disabled}
                                            aria-label={`Remove ${row.color}`}
                                            className="text-gray-400 hover:text-red-600 disabled:opacity-50 text-lg leading-none"
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot className="bg-[#F7F5EF] font-semibold text-gray-700">
                            <tr>
                                <td className="px-3 py-2">Size total</td>
                                {SIZE_CHART.map(({ size }) => (
                                    <td key={size} className="px-2 py-2 text-center">
                                        {columnTotal(size)}
                                    </td>
                                ))}
                                <td className="px-3 py-2 text-center text-[#123C32]">
                                    {totalStock}
                                </td>
                                <td />
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            {/* Total stock (স্বয়ংক্রিয়) */}
            <div className="flex items-center justify-between rounded-lg bg-[#F7F5EF] px-4 py-3">
                <span className="text-sm text-gray-600">
                    Total stock (calculated automatically)
                </span>
                <span className="text-lg font-bold text-[#123C32]">
                    {totalStock} pcs
                </span>
            </div>
        </div>
    );
};

export default InventoryMatrix;