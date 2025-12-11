// import React from 'react';
// // import Marquee from 'react-fast-marquee';
// // import review1 from "../../../assets/images/reviwer/review1.jpg";
// // import review2 from "../../../assets/images/reviwer/review2.jpg";
// // import review3 from "../../../assets/images/reviwer/review3.jpg";
// // import review4 from "../../../assets/images/reviwer/review4.jpg";
// // import review5 from "../../../assets/images/reviwer/review5.jpg";
// // import review6 from "../../../assets/images/reviwer/review6.jpg";
// // import review7 from "../../../assets/images/reviwer/review7.jpg";
// // import review8 from "../../../assets/images/reviwer/review8.jpg";
// import Testimonial from './Testimonial';
// import Marquee from 'react-fast-marquee';

// const Testimonials = () => {
//     const reviewInfo = [
//         {
//           _id:1,
//           // img: review1,
//           name: "Lawrence Petrie",
//           date: "10/12/2022",
//           review_mark: "",
//           description: "very effective course",
//         },
//         {
//           _id:2,
//           // img: review2,
//           name: "Lucas Aquilani",
//           date: "10/12/2022",
//           review_mark: "",
//           description: "very effective course",
//         },
//         {
//           _id:3,
//           // img: review3,
//           name: "Ruth Aquilani",
//           date: "10/12/2022",
//           review_mark: "",
//           description: "very effective course",
//         },
//         {
//           _id:4,
//           // img: review4,
//           name: "Jane Ansems",
//           date: "10/12/2022",
//           review_mark: "",
//           description: "very effective course",
//         },
//         {
//           _id:5,
//           // img: review5,
//           name: "Jack Peters",
//           date: "10/12/2022",
//           review_mark: "",
//           description: "very effective course",
//         },
//         {
//           _id:6,
//           // img: review6,
//           name: "Lora Portilla",
//           date: "10/12/2022",
//           review_mark: "",
//           description: "very effective course",
//         },
//         {
//           _id:7,
//           // img: review7,
//           name: "Anna Phillips",
//           date: "10/12/2022",
//           review_mark: "",
//           description: "very effective course",
//         },
//         {
//           _id:8,
//           // img: review8,
//           name: "Roland Walker",
//           date: "10/12/2022",
//           review_mark: "*****",
//           description: "very effective course",
//         },
//       ];
//     return (
//         <section className='w-11/12 mx-auto'>
//             <div className='border-l-8 border-l-indigo-600 my-6 p-6 '>
//                 <h1 className='text-5xl lg:text-6xl font-bold italic uppercase'>
//                     <span  className='text-2xl font-bold text-indigo-500'>happy<br /></span>
//                     students</h1>
//                 <h5 className='text-lg font-sans'>Phasellus non dolor nibh. Nullam elementum tellus pretium feugiat. Cras dictum tellus dui, vitae sollicitudin ipsum tincidunt in. Sed tincidunt tristique enim sed sollcitudin. Cras dictum tellus dui, vitae sollicitudin ipsum tincidunt adipiscing atgfnte tibulum sapien sed mattis.Cras dictum tellus dui. Sed mollis vestibulum sapien rthsed mattis.</h5>
//             </div>
//             <div className=''>
//                   <Marquee speed={80}>
//                   {reviewInfo.map((review) => (
//                     <Testimonial 
//                     key={review._id} 
//                     review={review}
//                     ></Testimonial>
//                   ))}
//                 </Marquee>
//             </div>
//         </section>
//     );
// };

// export default Testimonials;