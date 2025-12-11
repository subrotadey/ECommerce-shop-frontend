import React, { useEffect, useState } from "react";

const RecentPosts = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fake API simulation
  useEffect(() => {
    setTimeout(() => {
      const fakeBlogs = [
        {
          image: "https://i.ibb.co/hF4YxY1W/download-2.png",
          category: "AI",
          title: "The Future of AI: Trends in 2025",
          description: "Explore the upcoming trends in artificial intelligence shaping the tech world.",
          author: "Alice Johnson",
          date: "July 1, 2025",
        },
        {
          image: "https://i.ibb.co/zWcT21YM/download-1.png",
          category: "Blockchain",
          title: "Blockchain Beyond Crypto",
          description: "Discover how blockchain is revolutionizing industries beyond cryptocurrencies.",
          author: "Bob Smith",
          date: "July 2, 2025",
        },
        {
          image: "https://i.ibb.co/1YfhmQBD/download.png",
          category: "Web Development",
          title: "React vs Vue in 2025",
          description: "Comparing the latest features of React and Vue frameworks.",
          author: "Charlie Lee",
          date: "July 3, 2025",
        },
        {
          image: "https://i.ibb.co/8gsNB5qQ/download-7.jpg",
          category: "Cybersecurity",
          title: "Top Security Practices for Developers",
          description: "Stay ahead with the best cybersecurity tips for web developers.",
          author: "Dana Scott",
          date: "July 4, 2025",
        },
        {
          image: "https://i.ibb.co/wrFQVbzX/download-8.jpg",
          category: "Cloud",
          title: "AWS vs Azure: Which One to Choose?",
          description: "A deep dive into two cloud computing giants in 2025.",
          author: "Eli Brown",
          date: "July 5, 2025",
        },
        {
          image: "https://i.ibb.co/N6csHLph/download-9.jpg",
          category: "DevOps",
          title: "CI/CD Pipelines Explained",
          description: "An easy guide to Continuous Integration and Deployment.",
          author: "Fiona Green",
          date: "July 6, 2025",
        },
        {
          image: "https://i.ibb.co/chkfJhRh/download-10.jpg",
          category: "IoT",
          title: "IoT Devices and Privacy Concerns",
          description: "Are smart devices invading your privacy? Let’s find out.",
          author: "George White",
          date: "July 7, 2025",
        },
        {
          image: "https://i.ibb.co/20jz1HSV/download-11.jpg",
          category: "AR/VR",
          title: "Metaverse and Mixed Reality",
          description: "How AR and VR are creating immersive experiences in 2025.",
          author: "Hannah Kim",
          date: "July 8, 2025",
        },
        {
          image: "https://i.ibb.co/sdZtmXjp/download-12.jpg",
          category: "Programming",
          title: "Top 10 Programming Languages in 2025",
          description: "What languages are developers loving this year?",
          author: "Ivan Torres",
          date: "July 9, 2025",
        },
        {
          image: "https://i.ibb.co/Y4r4pDq0/download-13.jpg",
          category: "Mobile",
          title: "Flutter vs React Native",
          description: "A battle of the two top mobile development frameworks.",
          author: "Jenna Park",
          date: "July 10, 2025",
        },
      ];
      setBlogs(fakeBlogs);
      setLoading(false);
    }, 1000); // simulating API delay
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-700 dark:text-white text-xl font-semibold">
        Loading recent posts...
      </div>
    );
  }

  return (
    <section className="bg-white w-11/12 mx-auto mt-20">
      <div className="container px-6 py-10 mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
            Recent Posts
          </h1>
          <button className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-600 transition-colors duration-300 transform dark:text-gray-400 hover:text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        <hr className="my-8 border-gray-200 dark:border-gray-700" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map((blog, index) => (
            <div key={index}>
              <img
                className="object-cover object-center w-full h-64 rounded-lg lg:h-80"
                src={blog.image}
                alt={blog.title}
              />
              <div className="mt-8">
                <span className="text-blue-500 uppercase">{blog.category}</span>
                <h1 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                  {blog.title}
                </h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400">{blog.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <a
                      href="/"
                      className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:underline hover:text-gray-500"
                    >
                      {blog.author}
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{blog.date}</p>
                  </div>
                  <a href="/" className="inline-block text-blue-500 underline hover:text-blue-400">
                    Read more
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentPosts;
