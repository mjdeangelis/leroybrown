import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Separator } from "../ui/separator";

export const TicketSummary = ({
  registeringTeammate,
}: {
  registeringTeammate: boolean;
}) => {
  return (
    <div className='mt-6'>
      <Table>
        <TableCaption>
          All tickets include golf, 2 drinks, and complimentary hat.
        </TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Quantity</TableHead> */}
            <TableHead>Ticket Type</TableHead>
            <TableHead className='text-right'>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {/* <TableCell>1</TableCell> */}
            <TableCell>
              {registeringTeammate
                ? "Invitation Pre-Sale Team"
                : "Invitation Pre-Sale Individual"}

              {registeringTeammate ? " (2 total players)" : " (1 player)"}
            </TableCell>
            {/* <TableCell className='font-medium'>
              {registeringTeammate ? "2" : "1"}
            </TableCell> */}

            {/* <TableCell>Credit Card</TableCell> */}
            <TableCell className='text-right'>
              {registeringTeammate ? "$320.00" : "$160.00"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Separator className='my-2' />
      <div className='p-2 flex items-center justify-between'>
        <p>
          <strong>TOTAL</strong>
        </p>
        <p>
          <strong>{registeringTeammate ? "$320.00" : "$160.00"}</strong>
        </p>
      </div>
    </div>
  );
};
