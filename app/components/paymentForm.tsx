import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";

const paymentElementOptions = {
  layout: "tabs",
};

export interface PaymentFormProps {
  onNavigateBack: any;
}

export default function PaymentForm(props: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const submitPayment = async () => {
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000/confirmation",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      if (error.message) {
        setMessage(error.message);
      }
    } else {
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <>
      <div className='mt-6 flex items-center justify-start'>
        {/* options={paymentElementOptions */}
        <PaymentElement id='payment-element' className='w-full' />
        {/* <button disabled={isLoading || !stripe || !elements} id='submit'>
            <span id='button-text'>
              {isLoading ? (
                <div className='spinner' id='spinner'></div>
              ) : (
                "Pay now"
              )}
            </span>
          </button> */}
        {/* Show any error or success messages */}
        {message && <div id='payment-message'>{message}</div>}
      </div>
      <div className='mt-6 flex items-center justify-end gap-x-6'>
        <button
          type='button'
          onClick={props.onNavigateBack}
          className='text-sm font-semibold leading-6 text-gray-900'
        >
          Back to edit team
        </button>
        <button
          type='submit'
          disabled={isLoading || !stripe || !elements}
          onClick={submitPayment}
          className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          Submit registration
        </button>
      </div>
    </>
  );
}