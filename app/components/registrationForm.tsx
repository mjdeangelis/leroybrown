"use client";
import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import {
  Appearance,
  StripeElementsOptions,
  loadStripe,
} from "@stripe/stripe-js";
import PaymentForm from "./paymentForm";
import PaymentSummary from "./paymentSummary";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { RegistrationSummary } from "./summary/registrationSummary";
import { TicketSummary } from "./summary/ticketSummary";

const initialPlayerState = {
  name: "",
  phone: "",
  averageScore: "",
  shirtSize: "",
};

type StripeTheme = "stripe" | "night" | "flat" | undefined;

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  "pk_test_51OxJkVJaaeySy4MytTgxAEexLCHKTErULchhoa4U9py33GKYCZ7pdCSCWadW0LH0rkq6QYTZN3xCIz8oyrxEYtks00rLeRmcMN"
);
const GENERIC_ERROR_MESSAGE =
  "There was a problem submitting your registration. Please try again.";

export default function RegistrationForm() {
  const [isCheckoutPage, setIsCheckoutPage] = useState(false);
  const [registeringTeammate, setRegisteringTeammate] = useState(false);
  const [email, setEmail] = useState("");
  const [playerOne, setPlayerOne] = useState(initialPlayerState);
  const [playerTwo, setPlayerTwo] = useState(initialPlayerState);
  const [teammateName, setTeammateName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [teamId, setTeamId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    if (isCheckoutPage && !clientSecret) {
      const purchaseId = registeringTeammate
        ? "lbi-presale-team"
        : "lbi-presale-individual";

      try {
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
          .then((data) => {
            setClientSecret(data.clientSecret);
            setCustomerId(data.customerId);
          });
      } catch (error) {
        setErrors([GENERIC_ERROR_MESSAGE]);
      }
    }
  }, [isCheckoutPage]);

  const appearance: Appearance = {
    theme: "stripe",
    variables: {
      // colorPrimary: "#0570de",
      // colorBackground: "#ffffff",
      // colorText: "#30313d",
      // colorDanger: "#df1b41",
      fontSizeBase: "14px",
      // fontFamily: "Inter, system-ui, sans-serif",
      // spacingUnit: "2px",
      // borderRadius: "4px",
      // See all possible variables below
    },
    rules: {
      ".Label": {
        fontSize: "14px",
        fontWeight: "500",
      },
    },
  };
  const stripeOptions: StripeElementsOptions = {
    clientSecret,
    // mode: "payment",
    // amount: 16000,
    // currency: "usd",
    appearance,
  };

  const validateForm = () => {
    let errors = [];
    console.log("player one", playerOne);
    if (playerOne.name === "" || playerOne.name === null) {
      errors.push("Player one name");
    }
    if (playerOne.phone === "" || playerOne.phone === null) {
      errors.push("Player one phone");
    }
    if (playerOne.averageScore === "" || playerOne.averageScore === null) {
      errors.push("Player one average score");
    }
    if (playerOne.shirtSize === "" || playerOne.shirtSize === null) {
      errors.push("Player one shirt size");
    }

    if (registeringTeammate) {
      if (playerTwo.name === "" || playerTwo.name === null) {
        errors.push("Player two name");
      }
      if (playerTwo.phone === "" || playerTwo.phone === null) {
        errors.push("Player two phone");
      }
      if (playerTwo.averageScore === "" || playerTwo.averageScore === null) {
        errors.push("Player two average score");
      }
      if (playerTwo.shirtSize === "" || playerTwo.shirtSize === null) {
        errors.push("Player two shirt size");
      }
    } else {
      if (teammateName === "" || teammateName === null) {
        errors.push("Teammate name");
      }
    }

    setErrors(errors);
    if (errors.length) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (e: any) => {
    // todo: loading state
    setIsLoading(true);
    e.preventDefault();

    if (validateForm()) {
      const endpoint = teamId ? `update-team/${teamId}` : "register-team";
      const requestBody = {
        players: [{ ...playerOne }],
        teammateName,
        registeringTeammate,
        email,
      };
      if (registeringTeammate) {
        requestBody.players.push({ ...playerTwo });
        // stripeOptions.amount = 32000;
      } else {
        // stripeOptions.amount = 16000;
      }
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      };

      try {
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
      } catch (error) {
        setErrors([GENERIC_ERROR_MESSAGE]);
      }
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
    const target = e.target || e;
    console.log("Event", target);
    const { name, value } = target;
    if (player === "player1") {
      setPlayerOne((prev) => ({ ...prev, [name]: value }));
    } else {
      setPlayerTwo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const submitPayment = () => {};

  if (!isCheckoutPage) {
    return (
      <form onSubmit={handleSubmit}>
        <div className='space-y-12'>
          <div className='mt-10 border-b border-gray-900/10 py-6'>
            {errors.length > 0 && (
              <div
                className='mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'
                role='alert'
              >
                <p className='font-bold'>Please fix the following errors:</p>
                <ul className='list-disc pl-5'>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <h2 className='mb-2 scroll-m-20 text-2xl text-gray-900 font-semibold tracking-tight transition-colors first:mt-0'>
              1. Team Details
            </h2>
            <Separator />

            {/* Player 1 Details */}
            <div className='mt-5 grid grid-cols-1 gap-x-6 gap-4 sm:grid-cols-6'>
              <div className='sm:col-span-full'>
                <p className='text-md font-semibold leading-6 text-gray-900'>
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
                  <Input
                    name='name'
                    id='name'
                    required
                    autoComplete='name'
                    onChange={(e) => handleInputChange(e, "player1")}
                    value={playerOne.name}
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
                  <Input
                    name='phone'
                    id='phone'
                    placeholder='(xxx) xxx-xxxx'
                    required
                    autoComplete='tel'
                    onChange={(e) => handleInputChange(e, "player1")}
                    value={playerOne.phone}
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
                  <Select
                    required
                    name='averageScore'
                    value={playerOne.averageScore}
                    onValueChange={(value: string) =>
                      handleInputChange(
                        { name: "averageScore", value },
                        "player1"
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a score' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='70-80'>70-80</SelectItem>
                      <SelectItem value='75-85'>75-85</SelectItem>
                      <SelectItem value='80-90'>80-90</SelectItem>
                      <SelectItem value='85-95'>85-95</SelectItem>
                      <SelectItem value='90-100'>90-100</SelectItem>
                      <SelectItem value='95-105'>95-105</SelectItem>
                      <SelectItem value='105+'>105+</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select
                    required
                    name='shirtSize'
                    value={playerOne.shirtSize}
                    onValueChange={(value) =>
                      handleInputChange({ name: "shirtSize", value }, "player1")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a size' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='small'>Small</SelectItem>
                      <SelectItem value='medium'>Medium</SelectItem>
                      <SelectItem value='large'>Large</SelectItem>
                      <SelectItem value='x-large'>X-Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Player Question */}
            <div className='mt-5 space-y-10'>
              <fieldset>
                <legend className='text-sm font-semibold leading-6 text-gray-900'>
                  Are you registering your teammate?
                </legend>
                <RadioGroup
                  value={
                    registeringTeammate
                      ? "additional-player-yes"
                      : "additional-player-no"
                  }
                  onValueChange={(value) =>
                    handleRegisteringTeammateChange(value)
                  }
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem
                      value='additional-player-no'
                      id='additional-player-no'
                    />
                    <Label htmlFor='additional-player-no'>No</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem
                      value='additional-player-yes'
                      id='additional-player-yes'
                    />
                    <Label htmlFor='additional-player-yes'>Yes</Label>
                  </div>
                </RadioGroup>
              </fieldset>
            </div>

            {registeringTeammate === false && (
              <div className='mt-5 grid grid-cols-1 gap-x-6 gap-4 sm:grid-cols-6'>
                <div className='sm:col-span-full'>
                  <label
                    htmlFor='teammateName'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Name of teammate
                  </label>
                  <div className='mt-2'>
                    <Input
                      name='teammateName'
                      id='teammateName'
                      required
                      onChange={(e) => setTeammateName(e.target.value)}
                      value={teammateName}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Player 2 Details */}
            {registeringTeammate && (
              <div className='mt-5 grid grid-cols-1 gap-x-6 gap-4 sm:grid-cols-6'>
                <div className='sm:col-span-full'>
                  <p className='text-md font-semibold leading-6 text-gray-900'>
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
                    <Input
                      name='name'
                      id='name'
                      required={registeringTeammate}
                      onChange={(e) => handleInputChange(e, "player2")}
                      value={playerTwo.name}
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
                    <Input
                      name='phone'
                      id='phone'
                      placeholder='(xxx) xxx-xxxx'
                      autoComplete='tel'
                      required={registeringTeammate}
                      onChange={(e) => handleInputChange(e, "player2")}
                      value={playerTwo.phone}
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
                    <Select
                      required={registeringTeammate}
                      name='averageScore'
                      value={playerTwo.averageScore}
                      onValueChange={(value: string) =>
                        handleInputChange(
                          { name: "averageScore", value },
                          "player2"
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select a score' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='70-80'>70-80</SelectItem>
                        <SelectItem value='75-85'>75-85</SelectItem>
                        <SelectItem value='80-90'>80-90</SelectItem>
                        <SelectItem value='85-95'>85-95</SelectItem>
                        <SelectItem value='90-100'>90-100</SelectItem>
                        <SelectItem value='95-105'>95-105</SelectItem>
                        <SelectItem value='105+'>105+</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select
                      required={registeringTeammate}
                      name='shirtSize'
                      value={playerTwo.shirtSize}
                      onValueChange={(value: string) =>
                        handleInputChange(
                          { name: "shirtSize", value },
                          "player2"
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select a size' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='small'>Small</SelectItem>
                        <SelectItem value='medium'>Medium</SelectItem>
                        <SelectItem value='large'>Large</SelectItem>
                        <SelectItem value='x-large'>X-Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='mt-6 flex items-center justify-end gap-x-6'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? (
              <>
                <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
                <span>Please wait</span>
              </>
            ) : (
              <span>Continue to payment</span>
            )}
          </Button>
        </div>
      </form>
    );
  } else {
    return (
      <div className='mt-5 border-t border-b border-gray-900/10 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-6 gap-4'>
          <div className='order-2 md:order-1 md:col-span-4'>
            <RegistrationSummary
              playerDetails={[playerOne, playerTwo]}
              registeringTeammate={registeringTeammate}
              teammateName={teammateName}
            />

            <h2 className='mt-8 mb-2 text-2xl font-semibold leading-7 text-gray-900 tracking-[-0.02em]'>
              2. Payment Information
            </h2>
            <Separator />

            <div className='mt-6 grid w-full max-w-sm items-center gap-1.5'>
              <Label htmlFor='email'>Email address</Label>
              <Input
                name='email'
                id='email'
                autoComplete='email'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <p className='text-sm text-muted-foreground'>
                If you enter your email, we will send you a receipt. This is
                optional.
              </p>
            </div>

            {clientSecret && (
              <Elements options={stripeOptions} stripe={stripePromise}>
                <PaymentForm
                  customerId={customerId}
                  email={email}
                  onNavigateBack={() => setIsCheckoutPage(false)}
                />
              </Elements>
            )}
          </div>
          <div className='order-1 md:order-2 md:col-span-2 p-4'>
            {/* <div className='bg-gray-100 p-4 rounded mb-6'>

            </div> */}
            <div className='bg-gray-100 rounded p-4'>
              <h2 className='text-xl font-semibold leading-7 text-gray-900 tracking-[-0.02em] p-4'>
                Order Summary
              </h2>
              <Separator />

              <TicketSummary registeringTeammate={registeringTeammate} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
