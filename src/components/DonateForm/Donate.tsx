import React, { FC, SyntheticEvent, useState } from "react";
type Props = {
  orgData: any;
  address: string | undefined;
  nextStep: Function;
  donationAmount: string;
  setDonationAmount: Function;
};

const Donate: FC<Props> = ({
  orgData,
  nextStep,
  donationAmount,
  setDonationAmount,
  address
}) => {
  function nextPage(e: SyntheticEvent) {
    e.preventDefault();
    nextStep();
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold text-[#2B1E70]">Send Donation</h2>
      <p className="text-[#3A3D9C]">
        Donate your shielded ETH to the non-profit smart contract
      </p>
      <div className="text-left self-start">
        <hr className="my-5" />
        <p className="text-[#404EEC] mb-2">Non-Profit destination</p>
        <p className="text-[#2B1E70] font-bold">{orgData.charityName}</p>
        <p className="text-gray-400">
          {orgData.mailingAddress.streetAddress1}, {orgData.mailingAddress.city}
          , {orgData.mailingAddress.stateOrProvince}{" "}
          {orgData.mailingAddress.postalCode}
        </p>
      </div>
      <hr className="my-5" />
      <div className="self-center">
        <div className="relative w-[200px]">
          <label className="text-[#404EEC]">Amount (ETH):</label>
          <select
            className="block appearance-none w-full border border-[#404EEC] rounded-lg text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mt-2"
            onChange={(e) => setDonationAmount(e.target.value)}
            value={donationAmount}
          >
            <option>0.01</option>
            <option>0.1</option>
            <option>0.5</option>
            <option>1</option>
            <option>5</option>
          </select>
          <div className="pointer-events-none absolute inset-y-[50px] right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        <p className="my-2 text-[#3A3D9C]">Balance: </p>
      </div>
      <label className="text-gray-400 mt-3">
        <input
          type="checkbox"
          className="border border-gray-400 accent-[#404EEC]"
        />{" "}
        Please send me a tax receipt
      </label>
      <hr className="my-5" />
      <button
        onClick={nextPage}
        className="py-2 rounded-full bg-purple-500 text-md px-3 w-[250px] bg-[#404EEC] text-white self-center"
      >
        Send donation
      </button>
    </div>
  );
};

export default Donate;
