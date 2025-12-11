// import React, { useState } from "react";
// import CountUp from "react-countup";
// import { BsEmojiSmile } from "react-icons/bs";
// import ScrollTrigger from "react-scroll-trigger";

// const Counter = () => {
//   const [counterOn, setCounterOn] = useState(false);
//   return (
//     <ScrollTrigger
//       onEnter={() => setCounterOn(true)}
//       onExit={() => () => setCounterOn(false)}
//     >
//       <div className="grid px-8 md:grid-cols-2 lg:grid-cols-5 text-white text-center bg-indigo-500 py-12 w-11/12 mx-auto">
//         <div className="m-5 uppercase flex items-center">
//           <BsEmojiSmile className="mx-3 text-5xl" />
//           <div>
//             <h1 className="text-2xl font-medium">
//               {counterOn && (
//                 <CountUp start={0} end={24500} duration={2} delay={0} />
//               )}
//               +
//             </h1>
//             <h3 className="">Happy students</h3>
//           </div>
//         </div>
//         <div className="m-5 uppercase flex items-center">
//           <BsEmojiSmile className="mx-3 text-5xl" />
//           <div>
//             <h1 className="text-2xl font-medium">
//               {counterOn && (
//                 <CountUp start={0} end={4500} duration={2} delay={0} />
//               )}
//               +
//             </h1>
//             <h5>Total Courses</h5>
//           </div>
//         </div>
//         <div className="m-5 uppercase flex items-center">
//           <BsEmojiSmile className="mx-3 text-5xl" />
//           <div>
//             <h1 className="text-2xl font-medium">
//               {counterOn && (
//                 <CountUp start={0} end={2200} duration={2} delay={0} />
//               )}
//               +
//             </h1>
//             <h5>Video Courses</h5>
//           </div>
//         </div>
//         <div className="m-5 uppercase flex items-center">
//           <BsEmojiSmile className="mx-3 text-5xl" />
//           <div>
//             <h1 className="text-2xl font-medium">
//               {counterOn && (
//                 <CountUp start={0} end={1450} duration={2} delay={0} />
//               )}
//               +
//             </h1>
//             <h5>Total Teachers</h5>
//           </div>
//         </div>
//         <div className="m-5 uppercase flex items-center">
//           <BsEmojiSmile className="mx-3 text-5xl" />
//           <div>
//             <h1 className="text-2xl font-medium">
//               {counterOn && (
//                 <CountUp start={0} end={550} duration={2} delay={0} />
//               )}
//               +
//             </h1>
//             <h5>Certification</h5>
//           </div>
//         </div>
//       </div>
//     </ScrollTrigger>
//   );
// };

// export default Counter;
