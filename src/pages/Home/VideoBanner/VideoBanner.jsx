// src/pages/Home/VideoBanner/VideoBanner.jsx
// Background video section. Renders nothing when src is missing.
// - Loads only when near the viewport, pauses when scrolled away
// - Always muted + inline so it autoplays on mobile and desktop
// - No play/pause button

import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import FadeIn from "../../../components/Animations/FadeIn";

const isCloudinaryVideo = (url) =>
  typeof url === "string" && url.includes("/video/upload/");

// Small, mobile-safe version: H.264 mp4, no audio track
const optimizedSrc = (url, width) =>
  isCloudinaryVideo(url)
    ? url
        .replace(
          "/video/upload/",
          `/video/upload/c_limit,w_${width},q_auto,vc_h264,ac_none/`
        )
        .replace(/\.[a-z0-9]+$/i, ".mp4")
    : url;

// Poster image from the first frame
const posterSrc = (url) =>
  isCloudinaryVideo(url)
    ? url
        .replace("/video/upload/", "/video/upload/so_0,w_1280,q_auto/")
        .replace(/\.[a-z0-9]+$/i, ".jpg")
    : undefined;

const VideoBanner = ({ src, title, subtitle, ctaLabel, to }) => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [failed, setFailed] = useState(false);

  const [width] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
      ? 800
      : 1440
  );

  // Force the attributes mobile browsers need for autoplay
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

  // Load when near the screen, play only while visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  // Play / pause, with a first-touch fallback if autoplay is blocked
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !near || failed) return;

    const tryPlay = () => {
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    };

    if (!inView) {
      video.pause();
      return;
    }

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    const onGesture = () => {
      if (video.paused) tryPlay();
    };
    window.addEventListener("touchend", onGesture, { once: true, passive: true });
    window.addEventListener("click", onGesture, { once: true });

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      window.removeEventListener("touchend", onGesture);
      window.removeEventListener("click", onGesture);
    };
  }, [inView, near, failed]);

  if (!src) return null;

  const poster = posterSrc(src);
  const showVideo = near && !failed;

  return (
    <section
      ref={sectionRef}
      aria-label={title}
      className="relative isolate flex min-h-[60vh] items-end overflow-hidden bg-charcoal lg:min-h-[70vh]"
    >
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      )}

      {showVideo && (
        <video
          ref={setVideoRef}
          src={optimizedSrc(src, width)}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setFailed(true)}
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
        />
      )}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />

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