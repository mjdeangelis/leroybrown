"use client";
import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./paymentForm";

const initialPlayerState = {
  name: "",
  phone: "",
  averageScore: "DEFAULT",
  shirtSize: "DEFAULT",
};

type StripeTheme = "stripe" | "night" | "flat" | undefined;

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  "pk_test_51OxJkVJaaeySy4MytTgxAEexLCHKTErULchhoa4U9py33GKYCZ7pdCSCWadW0LH0rkq6QYTZN3xCIz8oyrxEYtks00rLeRmcMN"
);

export default function RegistrationForm() {
  // const stripe = useStripe();
  const [isCheckoutPage, setIsCheckoutPage] = useState(false);
  const [registeringTeammate, setRegisteringTeammate] = useState(false);
  const [playerOne, setPlayerOne] = useState(initialPlayerState);
  const [playerTwo, setPlayerTwo] = useState(initialPlayerState);
  const [teammateName, setTeammateName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [teamId, setTeamId] = useState(null);
  // const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    if (isCheckoutPage && !clientSecret) {
      const purchaseId = registeringTeammate
        ? "lbi-presale-team"
        : "lbi-presale-individual";

      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}registration/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: playerOne,
            id: purchaseId,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [isCheckoutPage]);

  const appearance: { theme: StripeTheme } = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  const handleSubmit = async (e: any) => {
    // todo: loading state
    setIsLoading(true);
    e.preventDefault();

    const endpoint = teamId ? `update-team/${teamId}` : "register-team";
    const requestBody = {
      players: [{ ...playerOne }],
      teammateName,
      registeringTeammate,
    };
    if (registeringTeammate) {
      requestBody.players.push({ ...playerTwo });
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}registration/${endpoint}`,
      requestOptions
    );
    const data = await response.json();
    console.log("Data", data);
    if (data) {
      console.log("checkout page...");
      setIsCheckoutPage(true);
      setTeamId(data.teamId);
    }

    // todo: loading state
    setIsLoading(false);
  };

  const handleRegisteringTeammateChange = (id: string) => {
    if (id === "additional-player-yes") {
      setRegisteringTeammate(true);
    } else {
      setRegisteringTeammate(false);
      setPlayerTwo(initialPlayerState);
    }
  };

  const handleInputChange = (e: any, player: string) => {
    const { name, value } = e.target;
    if (player === "player1") {
      setPlayerOne((prev) => ({ ...prev, [name]: value }));
    } else {
      setPlayerTwo((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (!isCheckoutPage) {
    return (
      <form onSubmit={handleSubmit}>
        <div className='space-y-12'>
          <div className='mt-10 border-t border-b border-gray-900/10 py-12'>
            <h2 className='text-xl font-semibold leading-7 text-gray-900'>
              Team Information
            </h2>

            {/* Player 1 Details */}
            <div className='mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-full'>
                <p className='mt-6 text-md font-semibold leading-6 text-gray-900'>
                  Player 1
                </p>
              </div>
              {/* Player 1 Name */}
              <div className='sm:col-span-3'>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Name
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    required
                    autoComplete='name'
                    onChange={(e) => handleInputChange(e, "player1")}
                    value={playerOne.name}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
              {/* Player 1 Phone Number */}
              <div className='sm:col-span-3'>
                <label
                  htmlFor='phone'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Phone Number
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='phone'
                    id='phone'
                    required
                    onChange={(e) => handleInputChange(e, "player1")}
                    value={playerOne.phone}
                    autoComplete='tel'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
              {/* Player 1 Average Score */}
              <div className='sm:col-span-3'>
                <label
                  htmlFor='averageScore'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Average Score
                </label>
                <div className='mt-2'>
                  <select
                    id='averageScore'
                    required
                    onChange={(e) => handleInputChange(e, "player1")}
                    name='averageScore'
                    // defaultValue={"DEFAULT"}
                    value={playerOne.averageScore}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6'
                  >
                    <option disabled value='DEFAULT'>
                      Select a score
                    </option>
                    <option>70-80</option>
                    <option>75-85</option>
                    <option>80-90</option>
                    <option>85-95</option>
                    <option>90-100</option>
                    <option>95-105</option>
                    <option>105+</option>
                  </select>
                </div>
              </div>
              {/* Player 1 Shirt Size */}
              <div className='sm:col-span-3'>
                <label
                  htmlFor='shirtSize'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Shirt Size
                </label>
                <div className='mt-2'>
                  <select
                    id='shirtSize'
                    name='shirtSize'
                    required
                    // defaultValue={"DEFAULT"}
                    value={playerOne.shirtSize}
                    onChange={(e) => handleInputChange(e, "player1")}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6'
                  >
                    <option disabled value='DEFAULT'>
                      Select a size
                    </option>
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                    <option>X-Large</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Player Question */}
            <div className='mt-10 space-y-10'>
              <fieldset>
                <legend className='text-sm font-semibold leading-6 text-gray-900'>
                  Are you registering your teammate?
                </legend>
                {/* <p className='mt-1 text-sm leading-6 text-gray-600'>
                These are delivered via SMS to your mobile phone.
              </p> */}
                <div className='mt-3 space-y-3'>
                  <div className='flex items-center gap-x-3'>
                    <input
                      id='additional-player-yes'
                      name='additional-player'
                      required
                      type='radio'
                      onChange={(e) =>
                        handleRegisteringTeammateChange(e.target.id)
                      }
                      checked={registeringTeammate}
                      className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                    />
                    <label
                      htmlFor='additional-player-yes'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Yes
                    </label>
                  </div>
                  <div className='flex items-center gap-x-3'>
                    <input
                      id='additional-player-no'
                      name='additional-player'
                      type='radio'
                      onChange={(e) =>
                        handleRegisteringTeammateChange(e.target.id)
                      }
                      checked={!registeringTeammate}
                      className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                    />
                    <label
                      htmlFor='additional-player-no'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      No
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>

            {registeringTeammate === false && (
              <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                <div className='sm:col-span-full'>
                  <label
                    htmlFor='teammateName'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Name of teammate
                  </label>
                  <div className='mt-2'>
                    <input
                      id='teammateName'
                      name='teammateName'
                      type='text'
                      value={teammateName}
                      required={!registeringTeammate}
                      onChange={(e) => setTeammateName(e.target.value)}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Player 2 Details */}
            {registeringTeammate && (
              <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                <div className='sm:col-span-full'>
                  <p className='mt-6 text-md font-semibold leading-6 text-gray-900'>
                    Player 2
                  </p>
                </div>
                {/* Player 2 Name */}
                <div className='sm:col-span-3'>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Name
                  </label>
                  <div className='mt-2'>
                    <input
                      type='text'
                      name='name'
                      id='name'
                      value={playerTwo.name}
                      required={registeringTeammate}
                      onChange={(e) => handleInputChange(e, "player2")}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>
                {/* Player 2 Phone Number */}
                <div className='sm:col-span-3'>
                  <label
                    htmlFor='phone'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Phone Number
                  </label>
                  <div className='mt-2'>
                    <input
                      type='text'
                      name='phone'
                      id='phone'
                      value={playerTwo.phone}
                      required={registeringTeammate}
                      autoComplete='tel'
                      onChange={(e) => handleInputChange(e, "player2")}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>
                {/* Player 2 Average Score */}
                <div className='sm:col-span-3'>
                  <label
                    htmlFor='averageScore'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Average Score
                  </label>
                  <div className='mt-2'>
                    <select
                      id='averageScore'
                      name='averageScore'
                      value={playerTwo.averageScore}
                      required={registeringTeammate}
                      onChange={(e) => handleInputChange(e, "player2")}
                      defaultValue={"DEFAULT"}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6'
                    >
                      <option disabled value='DEFAULT'>
                        Select a score
                      </option>
                      <option>70-80</option>
                      <option>75-85</option>
                      <option>80-90</option>
                      <option>85-95</option>
                      <option>90-100</option>
                      <option>95-105</option>
                      <option>105+</option>
                    </select>
                  </div>
                </div>
                {/* Player 2 Shirt Size */}
                <div className='sm:col-span-3'>
                  <label
                    htmlFor='shirtSize'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Shirt Size
                  </label>
                  <div className='mt-2'>
                    <select
                      id='shirtSize'
                      name='shirtSize'
                      value={playerTwo.shirtSize}
                      required={registeringTeammate}
                      onChange={(e) => handleInputChange(e, "player2")}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6'
                    >
                      <option disabled value='DEFAULT'>
                        Select a size
                      </option>
                      <option>Small</option>
                      <option>Medium</option>
                      <option>Large</option>
                      <option>X-Large</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='mt-6 flex items-center justify-end gap-x-6'>
          {/* <button
            type='button'
            className='text-sm font-semibold leading-6 text-gray-900'
          >
            Cancel
          </button> */}
          <button
            type='submit'
            className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Continue to payment
          </button>
        </div>
      </form>
    );
  } else {
    return (
      <div className='mt-10 border-t border-b border-gray-900/10 py-12'>
        <h2 className='text-xl font-semibold leading-7 text-gray-900'>
          Ticket Options
        </h2>
        <div className='mt-6 flex flex-wrap gap-4'>
          {/* Invitation Pre-Sale Individual */}
          {!registeringTeammate && (
            <>
              <label className='block border p-4 rounded cursor-pointer'>
                <div className='flex items-center'>
                  <input
                    type='radio'
                    name='pricing'
                    value='preSaleIndividual'
                    checked={!registeringTeammate}
                    onChange={() => setSelectedOption("preSaleIndividual")}
                    className='mr-2'
                  />
                  <span>Invitation Pre-Sale Individual</span>
                </div>
                <div className='text-gray-600'>$160</div>
              </label>
              {/* Public On-Sale Individual - Unavailable */}
              <label className='block border p-4 rounded cursor-pointer opacity-50'>
                <div className='flex items-center'>
                  <input
                    type='radio'
                    name='pricing'
                    value='publicSaleIndividual'
                    disabled
                    className='mr-2'
                  />
                  <span>Public On-Sale Individual</span>
                </div>
                <div className='text-gray-600 line-through'>$160</div>
                <div className='text-xs text-red-500'>Available Soon</div>
              </label>
            </>
          )}

          {/* Invitation Pre-Sale Team */}
          {registeringTeammate && (
            <>
              <label className='block border p-4 rounded cursor-pointer'>
                <div className='flex items-center'>
                  <input
                    type='radio'
                    name='pricing'
                    value='preSaleTeam'
                    checked={registeringTeammate}
                    onChange={() => setSelectedOption("preSaleTeam")}
                    className='mr-2'
                  />
                  <span>Invitation Pre-Sale Team</span>
                </div>
                <div className='text-gray-600'>$160</div>
              </label>
              {/* Public On-Sale Team - Unavailable */}
              <label className='block border p-4 rounded cursor-pointer opacity-50'>
                <div className='flex items-center'>
                  <input
                    type='radio'
                    name='pricing'
                    value='publicSaleTeam'
                    disabled
                    className='mr-2'
                  />
                  <span>Public On-Sale Team</span>
                </div>
                <div className='text-gray-600 line-through'>$160</div>
                <div className='text-xs text-red-500'>Available Soon</div>
              </label>
            </>
          )}
        </div>

        <h2 className='mt-12 text-xl font-semibold leading-7 text-gray-900'>
          Payment Information
        </h2>

        {/* Invitation Pre-Sale individual 
        Invitation pre-sale team 

        Public on-sale individual 
        Public on sale team */}

        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <PaymentForm onNavigateBack={() => setIsCheckoutPage(false)} />
          </Elements>
        )}

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
        {/* {message && <div id='payment-message'>{message}</div>}
        </div>
        <div className='mt-6 flex items-center justify-end gap-x-6'>
          <button
            type='button'
            onClick={() => setIsCheckoutPage(false)}
            className='text-sm font-semibold leading-6 text-gray-900'
          >
            Back to edit team
          </button>
          <button
            type='submit'
            disabled={isLoading || !stripe || !elements}
            className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Submit registration
          </button>
        </div> */}
      </div>
    );
  }
}
