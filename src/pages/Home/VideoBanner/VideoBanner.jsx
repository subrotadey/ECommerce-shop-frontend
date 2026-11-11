// src/pages/Home/VideoBanner/VideoBanner.jsx
// ব্যাকগ্রাউন্ড ভিডিও সেকশন। src না থাকলে কিছুই দেখায় না।
// - পর্দার কাছে এলে তবেই ভিডিও লোড হয়, পর্দা থেকে সরলে থেমে যায়
// - reduce-motion / data-saver হলে শুধু poster ছবি
// - ব্যবহারকারী Pause/Play করতে পারে

import { ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import FadeIn from "../../../components/Animations/FadeIn";

const isCloudinaryVideo = (url) =>
  typeof url === "string" && url.includes("/video/upload/");

// ছোট ও দ্রুত ভার্সন (.mp4 সব ব্রাউজারে চলে)
const optimizedSrc = (url, width) =>
  isCloudinaryVideo(url)
    ? url
        .replace("/video/upload/", `/video/upload/c_limit,w_${width},q_auto/`)
        .replace(/\.[a-z0-9]+$/i, ".mp4")
    : url;

// ভিডিওর প্রথম ফ্রেম থেকে poster ছবি
const posterSrc = (url) =>
  isCloudinaryVideo(url)
    ? url
        .replace("/video/upload/", "/video/upload/so_0,w_1280,q_auto/")
        .replace(/\.[a-z0-9]+$/i, ".jpg")
    : undefined;

const VideoBanner = ({ src, title, subtitle, ctaLabel, to }) => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const [near, setNear] = useState(false);       // পর্দার কাছে এসেছে? (এরপর ভিডিও লোড)
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [failed, setFailed] = useState(false);

  const [calm] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        navigator.connection?.saveData === true)
  );
  const [width] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
      ? 800
      : 1440
  );

  // পর্দার কাছে এলে লোড, ভেতরে থাকলে চালু
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

  // play / pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !near || calm || failed) return;

    video.muted = true; // autoplay-র জন্য নিশ্চিত করা
    if (inView && !userPaused) {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [inView, near, userPaused, calm, failed]);

  if (!src) return null;

  const poster = posterSrc(src);
  const showVideo = near && !calm && !failed;

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
          ref={videoRef}
          src={optimizedSrc(src, width)}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setFailed(true)}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      )}

      {/* লেখা পড়ার জন্য অন্ধকার স্তর */}
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

      {showVideo && (
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-label={playing ? "Pause background video" : "Play background video"}
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
      )}
    </section>
  );
};

export default VideoBanner;