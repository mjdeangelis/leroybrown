import Image from "next/image";
import Logo from "/public/logo-min.png";

export default function Home() {
  return (
    <main className='flex flex-col justify-center items-center h-screen'>
      <div className='my-2 mx-auto'>
        <Image
          src={Logo}
          alt='Leroy Brown Invitational'
          className='w-auto h-48'
        />
      </div>
      <div className='text-center'>
        <h1 className='mt-6 text-2xl text-center font-bold'>
          Leroy Brown Invitational
        </h1>
        <p className='mt-3 text-lg font-semibold'>Bensalem Country Club</p>
        <p>August 3rd, 2024</p>
        <p>For the pups.</p>
        <p className='mt-4'>Full website coming soon.</p>
      </div>
    </main>
  );
}
