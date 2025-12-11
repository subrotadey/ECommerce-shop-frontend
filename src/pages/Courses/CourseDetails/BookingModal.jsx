import { format } from "date-fns";
import React, { useContext } from "react";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../../../contexts/AuthProvider";

const BookingModal = ({ selectedDate, heading, price }) => {
  const date = format(selectedDate, "PP");
  const { user } = useContext(AuthContext);

  const handleBooking = (event) => {
    event.preventDefault();
    const form = event.target;
    const heading = form.heading.value;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const price = form.price.value;

    const booking = {
      EnrollDate: date,
      courseName: heading,
      userName: name,
      email,
      price: parseInt(price),
      phone,
    };

    fetch("https://e-learning-server-hazel.vercel.app/bookings", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(booking),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          toast.success("Booking Confirmed");
        } else {
          toast.error(data.message);
        }
      });
  };
  return (
    <>
      <input type="checkbox" id="booking-modal" className="modal-toggle bg-white" />
      <div className="modal">
        <div className="modal-box relative bg-white">
          <label
            htmlFor="booking-modal"
            className="btn-sm btn-circle btn absolute right-2 top-2"
          >
            ✕
          </label>
          <h2 className="text-xl font-bold mb-4 text-center">Booking Form</h2>
          <form
            onSubmit={handleBooking}
            action=""
            className="text-white p-6 rounded-lg shadow-md w-full max-w-xl mx-auto"
          >
            <input
              name="heading"
              type="text"
              className="input input-bordered  mt-4 w-full"
              value={heading}
              disabled
            />
            <input
              name="date"
              type="text"
              className="input input-bordered  mt-4 w-full"
              value={date}
              disabled
            />
            <input
              name="name"
              type="text"
              defaultValue={user?.displayName}
              disabled
              placeholder="Your Name"
              className="input input-bordered  mt-4 w-full"
            />
            <input
              name="email"
              type="email"
              defaultValue={user?.email}
              disabled
              placeholder="Your Email"
              className="input input-bordered  mt-4 w-full"
            />
            <input
              name="price"
              type="number"
              defaultValue={price}
              disabled
              placeholder="Price"
              className="input input-bordered  mt-4 w-full"
            />
            <input
              name="phone"
              type="text"
              placeholder="Your Phone Number"
              className="input input-bordered  mt-4 w-full"
            />
            <input
              type="submit"
              value="Submit"
              className="btn btn-info mt-6 w-full"
            />
          </form>

        </div>
      </div>
    </>
  );
};

export default BookingModal;
