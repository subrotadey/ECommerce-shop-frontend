// src/pages/Home/VideoBanner/VideoBanner.jsx
// Optimized background video banner for production.
// - Lazy loads video near viewport
// - Pauses video when outside viewport
// - Muted autoplay with inline playback
// - Cloudinary H.264 optimization
// - Lightweight poster image
// - No play/pause controls

import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import FadeIn from "../../../components/Animations/FadeIn";

const isCloudinaryVideo = (url) =>
  typeof url === "string" && url.includes("/video/upload/");

// Cloudinary video optimization
const optimizedSrc = (url, width) => {
  if (!isCloudinaryVideo(url)) return url;

  return url
    .replace(
      "/video/upload/",
      `/video/upload/c_limit,w_${width},q_auto,vc_h264,ac_none/`
    )
    .replace(/\.[a-z0-9]+$/i, ".mp4");
};

// Generate lightweight poster from first video frame
const posterSrc = (url) => {
  if (!isCloudinaryVideo(url)) return undefined;

  return url
    .replace(
      "/video/upload/",
      "/video/upload/so_0,c_limit,w_1280,q_auto,f_jpg/"
    )
    .replace(/\.[a-z0-9]+$/i, ".jpg");
};

const VideoBanner = ({ src, title, subtitle, ctaLabel, to }) => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [failed, setFailed] = useState(false);

  // Select video width based on screen size
  const [width] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches
      ? 720
      : 1080
  );

  // Force muted inline playback
  const setVideoRef = useCallback((el) => {
    videoRef.current = el;

    if (el) {
      el.muted = true;
      el.defaultMuted = true;
      el.setAttribute("muted", "");
      el.setAttribute("playsinline", "");
      el.setAttribute("webkit-playsinline", "");
    }
  }, []);

  // Observe section visibility
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);

        if (entry.isIntersecting) {
          setNear(true);
        }
      },
      {
        rootMargin: "200px 0px",
        threshold: 0,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [src]);

  // Play and pause video based on visibility
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !near || failed) return;

    let active = true;

    const tryPlay = () => {
      if (!active || !video.isConnected || !inView) return;

      video.muted = true;

      const playPromise = video.play();

      if (playPromise?.catch) {
        playPromise.catch(() => {
          // Autoplay may be restricted by browser policy.
        });
      }
    };

    if (inView) {
      tryPlay();
    } else {
      video.pause();
    }

    video.addEventListener("canplay", tryPlay);

    return () => {
      active = false;
      video.removeEventListener("canplay", tryPlay);

      if (!inView) {
        video.pause();
      }
    };
  }, [near, inView, failed]);

  // Retry autoplay after user interaction
  useEffect(() => {
    if (!near || failed || !inView) return;

    const retryPlay = () => {
      const video = videoRef.current;

      if (video?.paused) {
        video.muted = true;
        video.play().catch(() => {});
      }
    };

    window.addEventListener("touchstart", retryPlay, {
      once: true,
      passive: true,
    });

    window.addEventListener("click", retryPlay, {
      once: true,
    });

    return () => {
      window.removeEventListener("touchstart", retryPlay);
      window.removeEventListener("click", retryPlay);
    };
  }, [near, inView, failed]);

  if (!src) return null;

  const poster = posterSrc(src);
  const showVideo = near && !failed;

  return (
    <section
      ref={sectionRef}
      aria-label={title}
      className="relative isolate flex min-h-[60vh] items-end overflow-hidden bg-charcoal lg:min-h-[70vh]"
    >
      {/* Poster image */}
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      )}

      {/* Background video */}
      {showVideo && (
        <video
          ref={setVideoRef}
          src={optimizedSrc(src, width)}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setFailed(true)}
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-24 sm:px-6 sm:pb-14 lg:px-8">
        <FadeIn>
          <h2 className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
              {subtitle}
            </p>
          )}

          {ctaLabel && to && (
            <Link
              to={to}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-semibold text-charcoal transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {ctaLabel}
              <ArrowRight size={18} />
            </Link>
          )}
        </FadeIn>
      </div>
    </section>
  );
};

export default VideoBanner;