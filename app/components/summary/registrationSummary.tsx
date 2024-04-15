import { PlayerDetails } from "../../types/playerDetails";
import { CircleCheckmark } from "../ui/icons/circle-checkmark";
import { PlayerDetailsSummary } from "./playerDetailsSummary";

import { Separator } from "@/app/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

export interface PlayerSummaryProps {
  playerDetails: PlayerDetails[];
  registeringTeammate: boolean;
  teammateName: string;
}

export const RegistrationSummary = ({
  playerDetails,
  registeringTeammate,
  teammateName,
}: PlayerSummaryProps) => {
  return (
    <>
      <Accordion type='single' collapsible>
        <AccordionItem value='item-1'>
          <AccordionTrigger>
            <div className='flex justify-start items-center mb-2'>
              <CircleCheckmark color={"#d1d5db"} size={"35"} />
              <h2 className='ml-2 scroll-m-20 text-2xl text-gray-400 font-semibold tracking-tight transition-colors first:mt-0'>
                Team Details
              </h2>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <PlayerDetailsSummary
              playerNumber='1'
              playerDetails={playerDetails[0]}
            />
            <div className='mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6 justify-center items-center'>
              <div className='sm:col-span-3'>
                <p className='text-sm font-semibold text-gray-400'>
                  Are you registering your teammate?
                </p>
              </div>
              <div className='sm:col-span-3'>
                {" "}
                <p className='text-sm text-gray-400'>
                  {registeringTeammate ? "Yes" : "No"}
                </p>
              </div>
            </div>
            {registeringTeammate ? (
              <PlayerDetailsSummary
                playerNumber='2'
                playerDetails={playerDetails[1]}
              />
            ) : (
              <div className='mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6 justify-center items-center'>
                <div className='sm:col-span-3'>
                  <p className='text-sm font-semibold text-gray-400'>
                    Teammate name
                  </p>
                </div>
                <div className='sm:col-span-3'>
                  {" "}
                  <p className='text-sm text-gray-400'>{teammateName}</p>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />
    </>
  );
};
