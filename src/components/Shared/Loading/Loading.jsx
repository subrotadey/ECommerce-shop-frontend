// src/components/Shared/Loading/Loading.jsx
import useSiteImages from "../../../hooks/useSiteImages";

// ─── Branded page loader ──────────────────────────────────────────────────
const PageLoading = ({ fullScreen = false }) => {
  const { getImage } = useSiteImages();
  const logo = getImage("logo", 200);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-6 px-4 ${
        fullScreen
          ? "fixed inset-0 z-[9999] bg-[#F7F5EF]"
          : "min-h-[60vh]"
      }`}
    >
      <div className="relative flex h-28 w-28 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/20" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#D4AF37] motion-reduce:animate-none" />
        {logo && (
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            className="h-14 w-auto animate-pulse object-contain motion-reduce:animate-none"
          />
        )}
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#123C32]/70">
        Loading
      </p>
      <span className="sr-only">Loading…</span>
    </div>
  );
};

// ─── Product grid skeleton (matches ProductsGrid cards) ───────────────────
const Bar = ({ className = "" }) => (
  <div className={`animate-pulse rounded bg-gray-100 motion-reduce:animate-none ${className}`} />
);

const CardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
    <div className="aspect-[4/5] animate-pulse bg-gray-100 motion-reduce:animate-none" />
    <div className="space-y-3 p-4">
      <Bar className="h-2.5 w-24" />
      <Bar className="h-4 w-4/5" />
      <div className="flex gap-1.5">
        <Bar className="h-5 w-12" />
        <Bar className="h-5 w-12" />
        <Bar className="h-5 w-12" />
      </div>
      <Bar className="h-6 w-28" />
      <Bar className="h-11 w-full rounded-xl" />
    </div>
  </div>
);

const GridLoading = () => (
  <div role="status" aria-live="polite" className="bg-white">
    <span className="sr-only">Loading products…</span>

    {/* Hero strip */}
    <div className="h-40 animate-pulse bg-[#123C32]/10 motion-reduce:animate-none sm:h-56" />

    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-8">
        {/* Filter sidebar (desktop) */}
        <div className="hidden w-72 shrink-0 space-y-4 lg:block">
          <Bar className="h-5 w-24" />
          <Bar className="h-10 w-full rounded-xl" />
          <Bar className="h-2 w-full" />
          <Bar className="h-4 w-32" />
          <Bar className="h-4 w-28" />
          <Bar className="h-4 w-36" />
        </div>

        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <Bar className="mb-6 h-14 w-full rounded-2xl" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Only the product cards (for use inside the product grid area)
export const ProductGridSkeleton = ({ count = 6, className = "" }) => (
  <div role="status" aria-live="polite" className={className}>
    <span className="sr-only">Loading products…</span>
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

// Admin table rows skeleton (use inside <tbody>)
export const TableRowsSkeleton = ({ rows = 6 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={`sk-${i}`} aria-hidden="true">
        <td><Bar className="h-4 w-4" /></td>
        <td>
          <div className="flex items-center gap-3">
            <Bar className="h-12 w-12 shrink-0 rounded-lg" />
            <div className="space-y-2">
              <Bar className="h-3.5 w-32" />
              <Bar className="h-2.5 w-20" />
            </div>
          </div>
        </td>
        <td><Bar className="h-3 w-20" /></td>
        <td><Bar className="h-5 w-16 rounded-full" /></td>
        <td><Bar className="h-4 w-14" /></td>
        <td><Bar className="h-4 w-8" /></td>
        <td><Bar className="h-5 w-16 rounded-full" /></td>
        <td>
          <div className="flex gap-2">
            <Bar className="h-6 w-6" />
            <Bar className="h-6 w-6" />
            <Bar className="h-6 w-6" />
          </div>
        </td>
      </tr>
    ))}
  </>
);

// Admin orders table rows skeleton (9 columns)
export const OrderRowsSkeleton = ({ rows = 8 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={`osk-${i}`} aria-hidden="true">
        <td><Bar className="h-4 w-4" /></td>
        <td><Bar className="h-3.5 w-36" /></td>
        <td>
          <div className="space-y-2">
            <Bar className="h-3.5 w-28" />
            <Bar className="h-2.5 w-36" />
          </div>
        </td>
        <td><Bar className="h-3.5 w-12" /></td>
        <td><Bar className="h-4 w-16" /></td>
        <td><Bar className="h-5 w-20 rounded-full" /></td>
        <td>
          <div className="space-y-2">
            <Bar className="h-5 w-16 rounded-full" />
            <Bar className="h-2.5 w-20" />
          </div>
        </td>
        <td><Bar className="h-3.5 w-24" /></td>
        <td>
          <div className="flex gap-1">
            <Bar className="h-6 w-6" />
            <Bar className="h-6 w-6" />
            <Bar className="h-6 w-6" />
          </div>
        </td>
      </tr>
    ))}
  </>
);

const Loading = ({ variant = "page", fullScreen = false }) =>
  variant === "grid" ? <GridLoading /> : <PageLoading fullScreen={fullScreen} />;

export default Loading;