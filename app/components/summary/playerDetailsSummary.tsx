import { PlayerDetails } from "@/app/types/playerDetails";

export const PlayerDetailsSummary = ({
  playerDetails,
  playerNumber,
}: {
  playerDetails: PlayerDetails;
  playerNumber: string;
}) => {
  return (
    <div className='grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6'>
      <div className='sm:col-span-full'>
        <p className='mt-3 text-sm font-semibold leading-6 text-gray-400'>
          Player {playerNumber}
        </p>
      </div>
      <div className='sm:col-span-3'>
        {" "}
        <p className='text-sm text-gray-400'>
          <strong>Name:</strong> {playerDetails.name}
        </p>
      </div>
      <div className='sm:col-span-3'>
        {" "}
        <p className='text-sm text-gray-400'>
          <strong>Phone:</strong> {playerDetails.phone}
        </p>
      </div>
      <div className='sm:col-span-3'>
        {" "}
        <p className='text-sm text-gray-400'>
          <strong>Average score:</strong> {playerDetails.averageScore}
        </p>
      </div>
      <div className='sm:col-span-3'>
        {" "}
        <p className='text-sm text-gray-400'>
          <strong>Shirt size:</strong> {playerDetails.shirtSize}
        </p>
      </div>
    </div>
  );
};
