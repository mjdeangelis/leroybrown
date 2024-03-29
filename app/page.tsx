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
        <h1 className='mt-6 text-3xl sm:text-5xl font-extrabold text-center text-slate-900 tracking-[-0.04em]'>
          Leroy Brown Invitational
        </h1>
        <div className='mt-6'>
          <p className='text-lg font-semibold'>Bensalem Country Club</p>
          <p className='text-md'>August 3rd, 2024</p>
        </div>

        <div className='mt-4 text-base leading-7 text-slate-600'>
          <p>For the pups.</p>
          <p>Full website coming soon.</p>
        </div>
      </div>
    </main>
  );
}
