"use client";
import { useEffect, useState } from "react";
import RegistrationForm from "@/app/components/registrationForm";
import Logo from "/public/logo-min.png";
import Image from "next/image";

export default function Registration() {
  return (
    <div>
      <div className='flex flex-col justify-center items-center'>
        <div className='my-2 mx-auto'>
          <Image
            src={Logo}
            alt='Leroy Brown Invitational'
            className='max-w-40 w-full'
          />
        </div>
        <h1 className='text-2xl text-center font-bold'>
          Leroy Brown Invitational Registration
        </h1>
        <p className='mt-3'>Bensalem Country Club</p>
        <p>
          <em>August 3rd, 2024</em>
        </p>
      </div>

      {/* {clientSecret && (
        <Elements options={options} stripe={stripePromise}> */}
      <RegistrationForm />
      {/* </Elements>
      )} */}
    </div>
  );
}
