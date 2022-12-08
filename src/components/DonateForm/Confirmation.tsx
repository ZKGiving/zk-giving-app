import React, { FC, SyntheticEvent, useState } from "react";
type Props = {
  orgData: any;
  donationAmount: string;
};

const Confirmation: FC<Props> = ({ orgData, donationAmount }) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold text-[#2B1E70]">
        Transaction Successful!
      </h2>
      <p className="text-[#3A3D9C]">
        The ETH has been donated to the non-profit smart contract
      </p>
      <hr className="my-5" />
      <p className="text-[#3A3D9C]">
        You just donated {donationAmount} ETH to {orgData.charityName}.
      </p>
      <p className="text-[#3A3D9C]">
        Thank you for your support!
      </p>
      <hr className="my-5" />
      <button className="py-2 rounded-full bg-purple-500 text-md px-3 w-[250px] bg-[#404EEC] text-white self-center">
        Close
      </button>
    </div>
  );
};

export default Confirmation;
