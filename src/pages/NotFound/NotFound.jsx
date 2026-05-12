import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

const NotFound = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600&family=Lato:wght@300;400&display=swap');

        .nf-root {
          min-height: 100vh;
          background: #0d0a08;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Lato', sans-serif;
        }

        /* Fabric texture overlay */
        .nf-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%230d0a08'/%3E%3Crect width='1' height='1' fill='%23ffffff08'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23ffffff05'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }

        /* Ambient glow blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.12;
          transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .blob-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #c8a96e, transparent);
          top: -100px; left: -100px;
        }

        .blob-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #8b6914, transparent);
          bottom: -80px; right: -80px;
        }

        .blob-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #d4a853, transparent);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }

        /* Decorative lines */
        .deco-line {
          position: absolute;
          background: linear-gradient(90deg, transparent, #c8a96e30, transparent);
          height: 1px;
          width: 100%;
        }

        .deco-line-1 { top: 25%; }
        .deco-line-2 { top: 75%; }

        .deco-line-v {
          position: absolute;
          background: linear-gradient(180deg, transparent, #c8a96e20, transparent);
          width: 1px;
          height: 100%;
        }

        .deco-line-v1 { left: 20%; }
        .deco-line-v2 { right: 20%; }

        /* Main card */
        .nf-card {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 680px;
          width: 100%;
          padding: 3rem 2rem;
          opacity: 0;
          transform: translateY(30px);
          animation: fadeUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards;
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Ornamental divider SVG */
        .ornament {
          display: block;
          margin: 0 auto;
          animation: fadeUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.4s both;
        }

        /* 404 number */
        .nf-number {
          font-family: 'Cinzel', serif;
          font-size: clamp(5rem, 18vw, 10rem);
          font-weight: 600;
          color: transparent;
          background: linear-gradient(135deg, #c8a96e 0%, #f0d4a0 40%, #c8a96e 60%, #8b6914 100%);
          -webkit-background-clip: text;
          background-clip: text;
          line-height: 1;
          letter-spacing: 0.1em;
          margin: 0.5rem 0;
          position: relative;
          display: inline-block;
          opacity: 0;
          animation: fadeUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.3s forwards;
        }

        /* Shimmer on 404 */
        .nf-number::after {
          content: '404';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 200% 100%;
          animation: shimmer 3s infinite 2s;
        }

        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }

        /* Label above 404 */
        .nf-eyebrow {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem;
          letter-spacing: 0.35em;
          color: #c8a96e;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          opacity: 0;
          animation: fadeUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.5s forwards;
        }

        .nf-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.5rem, 4vw, 2.2rem);
          font-weight: 300;
          color: #f5efe6;
          font-style: italic;
          letter-spacing: 0.02em;
          margin: 0.8rem 0 0.5rem;
          opacity: 0;
          animation: fadeUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.55s forwards;
        }

        .nf-desc {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 0.92rem;
          color: #9a8a7a;
          line-height: 1.8;
          max-width: 420px;
          margin: 0 auto 2.5rem;
          letter-spacing: 0.02em;
          opacity: 0;
          animation: fadeUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.65s forwards;
        }

        /* Buttons */
        .nf-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          opacity: 0;
          animation: fadeUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.75s forwards;
        }

        .btn-primary-nf {
          font-family: 'Cinzel', serif;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.85rem 2.2rem;
          background: linear-gradient(135deg, #c8a96e, #a8891e);
          color: #0d0a08;
          border: none;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .btn-primary-nf::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #f0d4a0, #c8a96e);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .btn-primary-nf:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(200, 169, 110, 0.4);
        }

        .btn-primary-nf:hover::before { opacity: 1; }

        .btn-primary-nf span { position: relative; z-index: 1; }

        .btn-secondary-nf {
          font-family: 'Cinzel', serif;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.85rem 2.2rem;
          background: transparent;
          color: #c8a96e;
          border: 1px solid #c8a96e40;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .btn-secondary-nf:hover {
          border-color: #c8a96e;
          background: rgba(200, 169, 110, 0.08);
          transform: translateY(-2px);
        }

        /* Quick links */
        .nf-links-label {
          font-family: 'Lato', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: #5a5048;
          text-transform: uppercase;
          margin: 2.5rem 0 1rem;
          opacity: 0;
          animation: fadeUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.85s forwards;
        }

        .nf-quick-links {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
          opacity: 0;
          animation: fadeUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.9s forwards;
        }

        .nf-quick-link {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.95rem;
          color: #7a6a5a;
          text-decoration: none;
          position: relative;
          transition: color 0.3s ease;
          letter-spacing: 0.05em;
        }

        .nf-quick-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #c8a96e;
          transition: width 0.3s ease;
        }

        .nf-quick-link:hover { color: #c8a96e; }
        .nf-quick-link:hover::after { width: 100%; }

        /* Floating fabric particles */
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #c8a96e;
          border-radius: 50%;
          opacity: 0;
        }

        @keyframes float-up {
          0% { opacity: 0; transform: translateY(0) scale(0); }
          20% { opacity: 0.6; transform: translateY(-20px) scale(1); }
          100% { opacity: 0; transform: translateY(-120px) scale(0.5); }
        }

        .particle:nth-child(1) { left: 15%; top: 60%; animation: float-up 4s ease-in-out 0.5s infinite; }
        .particle:nth-child(2) { left: 30%; top: 70%; animation: float-up 5s ease-in-out 1.2s infinite; width: 3px; height: 3px; }
        .particle:nth-child(3) { left: 50%; top: 65%; animation: float-up 3.5s ease-in-out 0.8s infinite; }
        .particle:nth-child(4) { left: 70%; top: 72%; animation: float-up 4.5s ease-in-out 2s infinite; }
        .particle:nth-child(5) { left: 85%; top: 60%; animation: float-up 4s ease-in-out 1.5s infinite; width: 3px; height: 3px; }
        .particle:nth-child(6) { left: 22%; top: 55%; animation: float-up 5.5s ease-in-out 0.3s infinite; }
        .particle:nth-child(7) { left: 60%; top: 58%; animation: float-up 4.2s ease-in-out 2.5s infinite; }
        .particle:nth-child(8) { left: 78%; top: 68%; animation: float-up 3.8s ease-in-out 1s infinite; width: 1px; height: 1px; opacity: 0; }

        /* Corner ornaments */
        .corner {
          position: absolute;
          width: 60px;
          height: 60px;
          opacity: 0.2;
        }

        .corner-tl { top: 1.5rem; left: 1.5rem; border-top: 1px solid #c8a96e; border-left: 1px solid #c8a96e; }
        .corner-tr { top: 1.5rem; right: 1.5rem; border-top: 1px solid #c8a96e; border-right: 1px solid #c8a96e; }
        .corner-bl { bottom: 1.5rem; left: 1.5rem; border-bottom: 1px solid #c8a96e; border-left: 1px solid #c8a96e; }
        .corner-br { bottom: 1.5rem; right: 1.5rem; border-bottom: 1px solid #c8a96e; border-right: 1px solid #c8a96e; }
      `}</style>

      <div className="nf-root" ref={containerRef}>
        {/* Blobs */}
        <div
          className="blob blob-1"
          style={{ transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)` }}
        />
        <div
          className="blob blob-2"
          style={{ transform: `translate(${-mousePos.x * 0.2}px, ${-mousePos.y * 0.2}px)` }}
        />
        <div className="blob blob-3" />

        {/* Decorative lines */}
        <div className="deco-line deco-line-1" />
        <div className="deco-line deco-line-2" />
        <div className="deco-line-v deco-line-v1" />
        <div className="deco-line-v deco-line-v2" />

        {/* Corner ornaments */}
        <div className="corner corner-tl" />
        <div className="corner corner-tr" />
        <div className="corner corner-bl" />
        <div className="corner corner-br" />

        {/* Particles */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="particle" />
        ))}

        {/* Main content */}
        <div className="nf-card">
          {/* Ornamental top */}
          <svg className="ornament" width="200" height="20" viewBox="0 0 200 20">
            <line x1="0" y1="10" x2="80" y2="10" stroke="#c8a96e" strokeWidth="0.5" opacity="0.4" />
            <circle cx="85" cy="10" r="1.5" fill="#c8a96e" opacity="0.6" />
            <circle cx="92" cy="10" r="1" fill="#c8a96e" opacity="0.4" />
            <circle cx="100" cy="10" r="3" fill="none" stroke="#c8a96e" strokeWidth="0.8" opacity="0.8" />
            <circle cx="100" cy="10" r="1" fill="#c8a96e" opacity="0.8" />
            <circle cx="108" cy="10" r="1" fill="#c8a96e" opacity="0.4" />
            <circle cx="115" cy="10" r="1.5" fill="#c8a96e" opacity="0.6" />
            <line x1="120" y1="10" x2="200" y2="10" stroke="#c8a96e" strokeWidth="0.5" opacity="0.4" />
          </svg>

          <p className="nf-eyebrow">Anis Abaya — Page not found</p>

          <div className="nf-number">404</div>

          <h1 className="nf-title">The path you seek is veiled</h1>

          <p className="nf-desc">
            This page has drifted like silk in the wind — it may have moved, been removed,
            or never existed. Allow us to guide you back to our collection.
          </p>

          <div className="nf-actions">
            <Link to="/" className="btn-primary-nf">
              <span>↩ Return Home</span>
            </Link>
            <Link to="/abaya" className="btn-secondary-nf">
              <span>Browse Collection</span>
            </Link>
          </div>

          <p className="nf-links-label">Quick navigation</p>

          <div className="nf-quick-links">
            <Link to="/abaya" className="nf-quick-link">Abaya</Link>
            <Link to="/hijab" className="nf-quick-link">Hijab</Link>
            <Link to="/cart" className="nf-quick-link">Cart</Link>
            <Link to="/wishlist" className="nf-quick-link">Wishlist</Link>
            <Link to="/contact" className="nf-quick-link">Contact</Link>
          </div>

          {/* Ornamental bottom */}
          <svg
            style={{ display: "block", margin: "2rem auto 0", opacity: 0, animation: "fadeUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.95s forwards" }}
            width="120" height="12" viewBox="0 0 120 12"
          >
            <line x1="0" y1="6" x2="48" y2="6" stroke="#c8a96e" strokeWidth="0.5" opacity="0.3" />
            <polygon points="54,6 57,3 60,6 57,9" fill="none" stroke="#c8a96e" strokeWidth="0.6" opacity="0.5" />
            <line x1="66" y1="6" x2="120" y2="6" stroke="#c8a96e" strokeWidth="0.5" opacity="0.3" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default NotFound;