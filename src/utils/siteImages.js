import logo from "../assets/images/logo.png";

export const SITE_IMAGE_DEFAULTS = {
  logo,
  hero1: "https://i.ibb.co.com/xK1GfQh2/1.webp",
  hero2: "https://i.ibb.co.com/k2GVTwvx/6.webp",
  hero3: "https://i.ibb.co.com/q3J6rLsR/3.webp",
  cat1: "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=700&q=85",
  cat2: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=85",
  cat3: "https://images.unsplash.com/photo-1617897903246-719242758050?w=700&q=85",
  cat4: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=700&q=85",
  cat5: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&q=85",
  cat6: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=700&q=85",
  feat1: "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=700&q=85",
  feat2: "https://images.unsplash.com/photo-1617897903246-719242758050?w=700&q=85",
  feat3: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=700&q=85",
  feat4: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=85",
};

// Admin পেজের জন্য গ্রুপ ও লেবেল
export const SITE_IMAGE_GROUPS = [
  {
    title: "Website Logo",
    hint: "Navbar ও Footer-এ দেখায়। স্বচ্ছ ব্যাকগ্রাউন্ডের PNG/WebP, চওড়া আকার (যেমন 600×200)।",
    logo: true,
    slots: [{ key: "logo", label: "Logo" }],
  },
  {
    title: "Hero Section",
    hint: "হোমের উপরের ছবি। বড়টি লম্বা (portrait, যেমন 900×1200), ছোট দুটি প্রায় চতুর্ভুজ।",
    slots: [
      { key: "hero1", label: "Main (left, tall)" },
      { key: "hero2", label: "Top right" },
      { key: "hero3", label: "Bottom right" },
    ],
  },
  {
    title: "Explore Our Collections",
    hint: "Portrait 3:4 বা 4:5 (যেমন 900×1200)।",
    slots: [
      { key: "cat1", label: "Premium Abayas" },
      { key: "cat2", label: "Luxury Borkas" },
      { key: "cat3", label: "Khimars" },
      { key: "cat4", label: "Hijab Sets" },
      { key: "cat5", label: "New Arrivals" },
      { key: "cat6", label: "Exclusive Collection" },
    ],
  },
  {
    title: "Featured Styles",
    hint: "Portrait 3:4 (যেমন 900×1200)।",
    slots: [
      { key: "feat1", label: "Premium Crepe Abaya" },
      { key: "feat2", label: "Embroidered Khimar Set" },
      { key: "feat3", label: "Luxury Hijab" },
      { key: "feat4", label: "Designer Borka" },
    ],
  },
];