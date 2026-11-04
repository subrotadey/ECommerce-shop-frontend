// src/components/ProductForm/inventoryUtils.js
// Official Size Chart (Backend-এর SIZE_CHART-এর সঙ্গে হুবহু এক)
export const SIZE_CHART = [
    { size: 'S', length: 52 },
    { size: 'M', length: 54 },
    { size: 'L', length: 56 },
    { size: 'XL', length: 58 },
    { size: 'XXL', length: 60 },
    { size: '3XL', length: 62 },
];

export const MAX_STOCK = 1000000;

export const createInventoryRow = (color) => ({
    color,
    sizes: SIZE_CHART.map(({ size }) => ({ size, stock: 0 })),
});

export const toNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};

export const getColorTotal = (row) =>
    (row?.sizes || []).reduce((sum, s) => sum + toNumber(s.stock), 0);

// Product-এর মোট stock: সব color ও size-এর যোগফল
export const calculateTotalStock = (inventory = []) =>
    inventory.reduce((sum, row) => sum + getColorTotal(row), 0);

// Edit mode-এ পুরোনো/অসম্পূর্ণ data থাকলেও ৬টি size সবসময় থাকে
export const normalizeInventoryForForm = (inventory) =>
    (Array.isArray(inventory) ? inventory : []).map((row) => ({
        color: row.color,
        sizes: SIZE_CHART.map(({ size }) => {
            const found = (row.sizes || []).find((s) => s.size === size);
            return { size, stock: found ? toNumber(found.stock) : 0 };
        }),
    }));