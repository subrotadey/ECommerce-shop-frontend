import { useContext, useEffect, useState } from "react";
import {
  Link,
  isRouteErrorResponse,
  useLocation,
  useNavigate,
  useRouteError,
} from "react-router";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";

const SITE_NAME = "Anis Abaya UAE";

/** Error theke user-friendly info banay (raw error user ke dekhay na) */
const getErrorInfo = (error) => {
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 401:
      case 403:
        return {
          code: error.status,
          title: "Access denied",
          message:
            "You don't have permission to view this page. Try signing in with a different account.",
        };
      case 404:
        return {
          code: 404,
          title: "Page not found",
          message:
            "The page you're looking for doesn't exist or may have been moved.",
        };
      default:
        if (error.status >= 500) {
          return {
            code: error.status,
            title: "Server error",
            message:
              "Our server ran into a problem. Please try again in a moment.",
          };
        }
        return {
          code: error.status,
          title: error.statusText || "Something went wrong",
          message: "We couldn't complete your request. Please try again.",
        };
    }
  }
  return {
    code: null,
    title: "Something went wrong",
    message:
      "An unexpected error occurred. Refreshing the page usually fixes it.",
  };
};

/** SPA te HTTP status code pathano jay na, tai error page e noindex + title set kori */
const useErrorPageSeo = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | ${SITE_NAME}`;

    let meta = document.querySelector('meta[name="robots"]');
    const created = !meta;
    const prevContent = meta?.getAttribute("content");
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");

    return () => {
      document.title = prevTitle;
      if (created) meta.remove();
      else if (prevContent !== null) meta.setAttribute("content", prevContent);
    };
  }, [title]);
};

// DaisyUI theme (dark/light) er upor nirbhor na kore, fixed Tailwind colour use kora hoyeche
const BTN_BASE =
  "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2";
const BTN_PRIMARY = `${BTN_BASE} bg-stone-900 text-white hover:bg-stone-700`;
const BTN_SECONDARY = `${BTN_BASE} border border-stone-300 bg-white text-stone-800 hover:bg-stone-100`;

/**
 * fullScreen = true  -> layout (navbar/footer) er baire, root level error
 * fullScreen = false -> layout er bhitore (Outlet er jaygay) dekhay
 */
const DisplayError = ({ fullScreen = false }) => {
  const { currentUser, logOut } = useContext(AuthContext) || {};
  const error = useRouteError();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAdminArea = pathname.startsWith("/admin");
  const homePath = isAdminArea ? "/admin" : "/";
  const homeLabel = isAdminArea ? "Back to dashboard" : "Go to homepage";
  const [signingOut, setSigningOut] = useState(false);
  const [signOutFailed, setSignOutFailed] = useState(false);

  const { code, title, message } = getErrorInfo(error);
  const codeLabel = code ? `Error ${code}` : "Unexpected error";
  useErrorPageSeo(title);

  // Monitoring tool (Sentry etc.) thakle ekhane report korun
  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleLogOut = async () => {
    if (typeof logOut !== "function") return;
    try {
      setSigningOut(true);
      setSignOutFailed(false);
      await logOut();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      setSignOutFailed(true);
    } finally {
      setSigningOut(false);
    }
  };

  const devDetails =
    import.meta.env?.DEV && (error?.statusText || error?.message || error?.data);

  return (
    <main
      className={`flex items-center justify-center px-4 py-12 ${
        fullScreen ? "min-h-screen bg-stone-50" : "min-h-[60vh]"
      }`}
    >
      <section
        role="alert"
        aria-live="assertive"
        className="w-full max-w-md rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10"
      >
        <div
          aria-hidden="true"
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            />
          </svg>
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
          {codeLabel}
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-stone-900 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
          {message}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={BTN_PRIMARY}
          >
            Refresh page
          </button>
          <Link to={homePath} replace className={BTN_SECONDARY}>
            {homeLabel}
          </Link>
        </div>

        {currentUser && typeof logOut === "function" && (
          <div className="mt-8 border-t border-stone-200 pt-6">
            <p className="text-sm text-stone-500">
              Still seeing this error? Sign out and log back in.
            </p>
            <button
              type="button"
              onClick={handleLogOut}
              disabled={signingOut}
              className="mt-2 text-sm font-medium text-stone-700 underline underline-offset-4 transition hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
            {signOutFailed && (
              <p className="mt-2 text-sm text-rose-600">
                Couldn't sign you out. Please try again.
              </p>
            )}
          </div>
        )}

        {devDetails && (
          <details className="mt-6 text-left text-xs text-stone-500">
            <summary className="cursor-pointer">Error details (dev only)</summary>
            <pre className="mt-2 overflow-auto rounded-lg bg-stone-100 p-3 text-stone-700">
              {typeof devDetails === "string"
                ? devDetails
                : JSON.stringify(devDetails, null, 2)}
            </pre>
          </details>
        )}
      </section>
    </main>
  );
};

export default DisplayError;