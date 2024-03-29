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
        <h1 className='mt-6 text-3xl sm:text-5xl font-extrabold text-center text-slate-900 tracking-[-0.04em]'>
          Leroy Brown Invitational
        </h1>
        <div className='mt-6 text-center'>
          <p className='text-lg font-semibold'>Bensalem Country Club</p>
          <p className='text-md'>August 3rd, 2024</p>
        </div>
      </div>

      {/* {clientSecret && (
        <Elements options={options} stripe={stripePromise}> */}
      <RegistrationForm />
      {/* </Elements>
      )} */}
    </div>
  );
}
