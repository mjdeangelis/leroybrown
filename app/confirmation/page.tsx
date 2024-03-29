import Image from "next/image";
import Logo from "/public/logo-min.png";

export default function Confirmation() {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='my-2 mx-auto'>
        <Image
          src={Logo}
          alt='Leroy Brown Invitational'
          className='w-auto h-48'
        />
      </div>
      <div className='text-center'>
        <h1 className='mt-6 text-2xl text-center font-bold'>
          Thanks for registering!
        </h1>
        <p className='mt-3'>
          Better get practicing. And remember, it&apos;s for the pups!
        </p>
      </div>
    </div>
  );
}
