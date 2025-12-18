import Breadcrumb from "../../components/Shared/Breadcrumb/Breadcrumb";

const AboutUs = () => {
  return (
    <>
      <Breadcrumb />
      <section className="w-11/12 mx-auto py-10">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold  mb-4">
              About Us
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              Empowering learners through accessible, affordable, and high-quality online education.
            </p>
          </div>

          {/* Section 1: Who We Are */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold  mb-2">
              Who We Are
            </h3>
            <p className="">
              We are a passionate team of educators, developers, and dreamers who believe that education should be for everyone. Our mission is to bridge the gap between traditional learning and modern technology through an intuitive, interactive, and inclusive platform.
            </p>
          </div>

          {/* Section 2: What We Offer */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold  mb-2">
              What We Offer
            </h3>
            <ul className="list-disc pl-6  space-y-2">
              <li>Interactive video courses taught by experts</li>
              <li>Assessments and quizzes to track progress</li>
              <li>Certificates on course completion</li>
              <li>Student-friendly dashboard for personalized learning</li>
              <li>Affordable, accessible courses for all levels</li>
            </ul>
          </div>

          {/* Section 3: Our Vision */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold  mb-2">
              Our Vision
            </h3>
            <p className="">
              To create a global community where anyone, regardless of their background, can learn the skills they need to succeed. We dream of a world where education is no longer a privilege — but a right.
            </p>
          </div>

          {/* Section 4: Why Choose Us */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold  mb-2">
              Why Choose Us?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="list-disc pl-6  space-y-2">
                <li>Expert Instructors from diverse fields</li>
                <li>User-friendly and modern design</li>
                <li>Regularly updated course content</li>
              </ul>
              <ul className="list-disc pl-6  space-y-2">
                <li>Flexible learning at your own pace</li>
                <li>Affordable pricing for students</li>
                <li>Community support and feedback</li>
              </ul>
            </div>
          </div>

          {/* Section 5: Call to Action */}
          <div className="text-center mt-16">
            <h4 className="text-xl font-semibold  mb-4">
              Join thousands of learners and start your journey today!
            </h4>
            <a
              href="/signup"
              className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition"
            >
              Get Started Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;