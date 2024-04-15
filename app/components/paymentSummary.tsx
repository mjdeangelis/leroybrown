import React from "react";

export const PaymentSummary = ({ ticketType, details, total }: any) => {
  return (
    <div className='flex justify-center items-center'>
      <div className='flex flex-col p-4 border border-gray-200 rounded-lg shadow-md max-w-sm'>
        {/* Row 1: Quantity and Ticket Type */}
        <div className='flex justify-between mb-2'>
          <div className='font-bold'>2x</div>
          <div>{ticketType}</div>
        </div>

        {/* Row 2: Blank and Ticket Details */}
        <div className='flex justify-between mb-2'>
          <div></div>
          <div>
            <ul className='list-disc pl-4'>
              {details?.map((detail: any, index: number) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Row 3: Total and Amount */}
        <div className='flex justify-between'>
          <div className='font-bold'>Total</div>
          <div>{total}</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
