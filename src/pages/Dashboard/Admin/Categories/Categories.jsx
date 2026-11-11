// src/pages/Dashboard/Admin/Categories/Categories.jsx
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Layers, Loader2, Package, RefreshCw, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCategoryOverview } from '../../../../services/categoryService';
import { formatMoney } from '../../../../utils/currency';

const MAIN_LABEL = { abaya: 'Abaya', hijab: 'Hijab' };
const SITE_PATH = { abaya: '/abaya', hijab: '/hijab' };

const money = (n) => formatMoney(n);

const priceRange = (c) => {
  if (c.minPrice == null) return '—';
  return c.minPrice === c.maxPrice ? money(c.minPrice) : `${money(c.minPrice)} – ${money(c.maxPrice)}`;
};

const Categories = () => {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: getCategoryOverview,
    staleTime: 1000 * 30,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <p className="mb-4 text-sm text-red-700">{error.message || 'Failed to load categories.'}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Try again
        </button>
      </div>
    );
  }

  const mains = data?.mainCategories || [];
  const labels = data?.labels || [];
  const totals = data?.totals || {};

  const statCards = [
    { label: 'Total Products', value: totals.products, color: 'text-gray-900' },
    { label: 'Active (on website)', value: totals.active, color: 'text-green-600' },
    { label: 'Draft / Archived', value: totals.inactive, color: 'text-yellow-600' },
    { label: 'Pieces in stock (active)', value: totals.stock, color: 'text-blue-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-gray-600">Live overview of your products by category</p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-100 disabled:opacity-60"
        >
          <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statCards.map((c) => (
          <div key={c.label} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">{c.label}</p>
            <p className={`mt-1 text-2xl font-bold ${c.color}`}>
              {Number(c.value || 0).toLocaleString('en-US')}
            </p>
          </div>
        ))}
      </div>

      {/* Main categories */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {mains.map((c) => (
          <div key={c.key} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <Layers size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{MAIN_LABEL[c.key] || c.key}</h2>
                  <p className="text-xs text-gray-500">Main category</p>
                </div>
              </div>
              <Link
                to={SITE_PATH[c.key] || '/'}
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
              >
                <ExternalLink size={13} /> View on site
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-2xl font-bold text-gray-900">{c.total}</p>
                <p className="text-xs text-gray-500">Products</p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-2xl font-bold text-green-700">{c.active}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-3">
                <p className="text-2xl font-bold text-yellow-700">{c.draft + c.archived}</p>
                <p className="text-xs text-gray-500">Draft / Archived</p>
              </div>
            </div>

            <dl className="mt-4 space-y-1.5 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Stock (active)</dt>
                <dd className="font-semibold text-gray-900">
                  {Number(c.stock).toLocaleString('en-US')} pcs
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Wholesale price range</dt>
                <dd className="font-semibold text-gray-900">{priceRange(c)}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-4">
          <Tag size={18} className="text-gray-500" />
          <h2 className="font-bold text-gray-900">Category labels used on products</h2>
        </div>

        {labels.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No category labels yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Add labels in the “Categories” field when creating or editing a product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="text-black">
                  <th>Label</th>
                  <th>Products</th>
                  <th>Active</th>
                  <th>Main category</th>
                </tr>
              </thead>
              <tbody>
                {labels.map((l) => (
                  <tr key={l.name.toLowerCase()} className="hover">
                    <td className="font-medium text-gray-900">{l.name}</td>
                    <td className="text-gray-700">{l.total}</td>
                    <td className="text-gray-700">{l.active}</td>
                    <td>
                      <div className="flex flex-wrap gap-1.5">
                        {l.mainCategories.map((m) => (
                          <span
                            key={m}
                            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700"
                          >
                            {MAIN_LABEL[m] || m}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
          Categories are set on each product (Main category + Categories field). To add or rename
          a label, edit the products that use it.
        </p>
      </div>
    </div>
  );
};

export default Categories;