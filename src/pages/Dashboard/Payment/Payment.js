import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import CheckOutForm from "./CheckOutForm";
import Loading from "../../Shared/Loading/Loading";

const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PK}`);

// console.log(stripePromise);

const Payment = () => {
  const booking = useLoaderData();
  const navigation = useNavigation();
  const { courseName, price, EnrollDate } = booking;
  if(navigation.state === "loading"){
    return <Loading></Loading>
  }

  return (
    <div>
      <h2 className="text-3xl">
        Payment for <span className="text-primary">{courseName}</span>
      </h2>
      <p className="text-xl">
        Please pay <strong className="text-primary">{price}</strong> for your
        course on {EnrollDate}.
      </p>
      <div className="flex justify-center">
        <div className="my-12 w-96">
          <div>
            <Elements stripe={stripePromise}>
              <CheckOutForm booking={booking} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
