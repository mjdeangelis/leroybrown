import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

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
    setIsLoading(true);
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}confirmation`,
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

        <Button
          type='submit'
          disabled={isLoading || !stripe || !elements}
          onClick={submitPayment}
        >
          {isLoading ? (
            <>
              <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
              <span>Processing payment</span>
            </>
          ) : (
            <span>Submit Payment</span>
          )}
        </Button>
      </div>
    </>
  );
}
